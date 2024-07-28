from rest_framework.routers import DefaultRouter
from django.urls import path, include
from .views import (
    RegistrationUserView,
    activation,
    LoginUserView,
    LogoutUserView,
    changePasswordView,
)

urlpatterns = [
    path("register/", RegistrationUserView.as_view(), name="register"),
    path("activate/<uid>/<token>", activation),
    path("login/", LoginUserView.as_view(), name="login"),
    path("logout/", LogoutUserView.as_view(), name="logout"),
    path("change-password/", changePasswordView.as_view()),
]
