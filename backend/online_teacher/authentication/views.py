from django.shortcuts import render
from .serializers import (
    RegistrationUserSerializer,
    LoginUserSerializer,
    ChangePasswordSerializer,
)
from rest_framework.views import APIView
from rest_framework.response import Response
from django.contrib.auth.tokens import default_token_generator
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.utils.encoding import force_bytes
from home.views import send_email
from datetime import datetime
from django.contrib.auth.models import User
from django.shortcuts import redirect
from django.contrib.auth import authenticate, login, logout
from rest_framework.authtoken.models import Token
from core.settings import BACKEND_ADDRESS, FRONTEND_ADDRESS
from rest_framework.permissions import IsAuthenticated
from django.contrib.auth.password_validation import validate_password


# Create your views here.
class RegistrationUserView(APIView):
    serializer_class = RegistrationUserSerializer

    def post(self, request):
        serializer = self.serializer_class(data=request.data)

        if serializer.is_valid():
            user = serializer.save()
            token = default_token_generator.make_token(user)
            uid = urlsafe_base64_encode(force_bytes(user.pk))
            confirm_link = f"{BACKEND_ADDRESS}/user-account/activate/{uid}/{token}"
            subject = "Confirmation Email"
            send_email(
                email_subject=subject,
                context={
                    "link": confirm_link,
                    "user": user,
                    "year": datetime.now().year,
                },
                receiver_email=user.email,
                template_name="user_active_email.html",
            )

            return redirect("login")

        return Response(serializer.errors)


def activation(request, uid, token, is_admin):
    try:
        id = urlsafe_base64_decode(uid).decode()
        user = User._default_manager.get(pk=id)
    except User.DoesNotExist:
        user = None

    if user and user.is_active:
        return redirect(f"{FRONTEND_ADDRESS}/auth/login.html")

    if user and default_token_generator.check_token(user, token):
        user.is_active = True
        user.is_superuser = is_admin
        user.save()
        return redirect(f"{FRONTEND_ADDRESS}/auth/login.html")

    return redirect(f"{FRONTEND_ADDRESS}/auth/register.html")


class LoginUserView(APIView):
    serializer_class = LoginUserSerializer

    def post(self, request):

        if request.user.is_authenticated:
            return redirect("logout")

        serializer = self.serializer_class(data=request.data)

        if serializer.is_valid():
            password = serializer.validated_data.get("password")
            username = serializer.validated_data.get("username")

            user = authenticate(request=request, username=username, password=password)

            if user:
                token, _ = Token.objects.get_or_create(user=user)

                login(user=user, request=request)

                return Response({"token": token.key, "user_id": user.id})
            else:
                return Response({"error": "User not valid!"})

        return Response(serializer.errors)


class LogoutUserView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):

        if hasattr(request.user, "auth_token"):
            request.user.auth_token.delete()
        logout(request=request)

        return redirect("login")


class changePasswordView(APIView):
    permission_classes = [IsAuthenticated]
    serializer_class = ChangePasswordSerializer

    def post(self, request):
        serializer = self.serializer_class(data=request.data)

        if serializer.is_valid():
            username = serializer.validated_data.get("username")
            password = serializer.validated_data.get("old_password")
            new_pass = serializer.validated_data.get("new_password")
            con_new_pass = serializer.validated_data.get("confirm_new_password")

            user = authenticate(request=request, username=username, password=password)

            try:
                validate_password(password=password, user=user)
            except:
                return Response({"error": "Invalid Password!"})

            if new_pass == con_new_pass and user:
                user.set_password(new_pass)
                user.save()
                return Response({"Password Changed Successfully!"})
            else:
                return Response({"error": "password did not match or user not found!"})

        return Response(serializer.errors)
