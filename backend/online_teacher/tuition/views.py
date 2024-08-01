from django.shortcuts import render
from rest_framework import viewsets, filters
from .models import Review, Tuition, Course
from .serializers import (
    TuitionSerializer,
    ReviewSerializer,
    CourseSerializer,
    CancelTuitionSerializer,
    UpdateTuitionSerializer,
)
from rest_framework.permissions import IsAuthenticatedOrReadOnly, IsAuthenticated
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.response import Response
from django.contrib.auth.models import User
from home.views import send_email
from core.settings import FRONTEND_ADDRESS
from datetime import datetime

# Create your views here.


class TuitionViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticatedOrReadOnly]
    queryset = Tuition.objects.all()
    serializer_class = TuitionSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    filterset_fields = ["id", "student__user__id", "teacher__user__id"]
    search_fields = [
        "created",
        "status",
        "type",
        "id",
        "subjects__name",
        "teacher__user__username",
        "student__user__username",
    ]


class ReviewViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticatedOrReadOnly]
    queryset = Review.objects.all()
    serializer_class = ReviewSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ["id", "reviewer__user__id", "teacher__user__id"]


class CourseViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticatedOrReadOnly]
    queryset = Course.objects.all()
    serializer_class = CourseSerializer


class CancelTuitionViewSet(viewsets.generics.UpdateAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = CancelTuitionSerializer

    def post(self, request):
        serializer = self.serializer_class(data=request.data)

        if serializer.is_valid():
            id = serializer.validated_data.get("id")
            user_id = serializer.validated_data.get("user_id")

            tuition = Tuition.objects.get(id=id)
            user = User.objects.get(id=user_id)

            if tuition.status == "Pending" or user.is_superuser:
                tuition.canceled = True
                tuition.save()
                return Response({"Tuition Canceled"})
            else:
                return Response({"error": "Cancellation is not permitted!"})

        return Response(serializer.errors)


class UpdateTuitionViewSet(viewsets.generics.UpdateAPIView):
    permission_classes = [IsAuthenticated]
    queryset = Tuition.objects.all()
    serializer_class = UpdateTuitionSerializer

    def perform_update(self, serializer):
        tuition = Tuition.objects.get(id=self.kwargs.get("pk"))

        if (
            tuition.status != "Ongoing"
            and serializer.validated_data.get("status") == "Ongoing"
        ):

            subject = "Tuition notification email"
            send_email(
                email_subject=subject,
                context={
                    "student": tuition.student.user,
                    "link": FRONTEND_ADDRESS + "/profile_student.html",
                    "year": datetime.now().year,
                },
                receiver_email=tuition.student.user.email,
                template_name="tuition_notification.html",
            )

        return super().perform_update(serializer)
