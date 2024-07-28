from django.shortcuts import render
from rest_framework import viewsets, filters
from .models import Review, Tuition, Course
from .serializers import (
    TuitionSerializer,
    ReviewSerializer,
    CourseSerializer,
    CancelTuitionSerializer,
)
from rest_framework.permissions import IsAuthenticatedOrReadOnly, IsAuthenticated
from django_filters.rest_framework import DjangoFilterBackend
from home.filters import FilterTeachers
from rest_framework.response import Response

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
            tuition = Tuition.objects.get(id=id)

            if tuition.status == "Pending":
                tuition.status = "Completed"
                tuition.canceled = True
                tuition.save()
                return Response({"Tuition Canceled"})
            else:
                return Response({"error": "Cancellation is not permitted!"})

        return Response(serializer.errors)
