from rest_framework.routers import DefaultRouter
from django.urls import path, include
from .views import (
    TuitionViewSet,
    ReviewViewSet,
    CourseViewSet,
    CancelTuitionViewSet,
    UpdateTuitionViewSet,
)

router = DefaultRouter()

router.register("tuition-list", TuitionViewSet)
router.register("review-list", ReviewViewSet)
router.register("course-list", CourseViewSet)

urlpatterns = [
    path("", include(router.urls)),
    path("cancel/", CancelTuitionViewSet.as_view()),
    path("update/<int:pk>", UpdateTuitionViewSet.as_view()),
]
