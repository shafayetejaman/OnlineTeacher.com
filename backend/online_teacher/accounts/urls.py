from rest_framework.routers import DefaultRouter
from django.urls import path, include
from .views import (
    StudentViewSet,
    TeacherViewSet,
    QualificationsViewSet,
    SubjectsViewSet,
    ShowUserViewSet,
    WeekDayViewSet,
    UpdateTeacherView,
    UpdateStudentView,
)

router = DefaultRouter()

router.register("student-list", StudentViewSet)
router.register("teacher-list", TeacherViewSet)
router.register("qualification-list", QualificationsViewSet)
router.register("subject-list", SubjectsViewSet)
router.register("user-list", ShowUserViewSet)
router.register("day-list", WeekDayViewSet)


urlpatterns = [
    path("", include(router.urls)),
    path("update-teacher/<int:pk>", UpdateTeacherView.as_view()),
    path("update-student/<int:pk>", UpdateStudentView.as_view()),
]
