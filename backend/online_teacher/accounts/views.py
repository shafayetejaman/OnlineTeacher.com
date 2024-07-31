from django.shortcuts import render
from rest_framework import viewsets, filters
from .models import Teacher, Student, Qualifications, Subjects, WeekDay
from .serializers import (
    QualificationsSerializer,
    StudentSerializer,
    TeacherSerializer,
    SubjectsSerializer,
    ShowUserSerializer,
    WeekDaySerializer,
)
from rest_framework.permissions import (
    IsAuthenticatedOrReadOnly,
    BasePermission,
    IsAuthenticated,
)
from django_filters.rest_framework import DjangoFilterBackend
from home.filters import FilterTeachers
from django.contrib.auth.models import User
from rest_framework.response import Response
from rest_framework import status

# Create your views here.


class TeacherViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticatedOrReadOnly]
    queryset = Teacher.objects.all()
    serializer_class = TeacherSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    filterset_class = FilterTeachers
    search_fields = ["user__username", "user__first_name", "address", "user__last_name"]


class StudentViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticatedOrReadOnly]
    queryset = Student.objects.all()
    serializer_class = StudentSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ["id", "user__id"]


class QualificationsViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticatedOrReadOnly]
    queryset = Qualifications.objects.all()
    serializer_class = QualificationsSerializer


class SubjectsViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticatedOrReadOnly]
    queryset = Subjects.objects.all()
    serializer_class = SubjectsSerializer


class WeekDayViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticatedOrReadOnly]
    queryset = WeekDay.objects.all()
    serializer_class = WeekDaySerializer


class ReadOnly(BasePermission):
    def has_permission(self, request, view):
        return request.method == "GET"


class ShowUserViewSet(viewsets.ModelViewSet):
    permission_classes = [ReadOnly]
    queryset = User.objects.all()
    serializer_class = ShowUserSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ["username", "id"]


class UpdateTeacherView(viewsets.generics.UpdateAPIView):
    permission_classes = [IsAuthenticated]
    queryset = Teacher.objects.all()
    serializer_class = TeacherSerializer


class UpdateStudentView(viewsets.generics.UpdateAPIView):
    permission_classes = [IsAuthenticated]
    queryset = Student.objects.all()
    serializer_class = StudentSerializer
