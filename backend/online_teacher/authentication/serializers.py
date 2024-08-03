from rest_framework import serializers
from django.contrib.auth.models import User
from django.contrib.auth.password_validation import validate_password


class RegistrationUserSerializer(serializers.ModelSerializer):
    confirm_password = serializers.CharField(required=True)

    class Meta:
        model = User
        fields = [
            "username",
            "first_name",
            "last_name",
            "email",
            "password",
            "confirm_password",
        ]

    def save(self):
        username = self.validated_data.get("username")
        first_name = self.validated_data.get("first_name")
        last_name = self.validated_data.get("last_name")
        email = self.validated_data.get("email")
        password = self.validated_data.get("password")
        con_password = self.validated_data.get("confirm_password")

        if password != con_password:
            raise serializers.ValidationError({"error": "Password did not match!"})

        if User.objects.filter(username=username).exists():
            raise serializers.ValidationError({"error": "Username already taken!"})

        # if User.objects.filter(email=email).exists():
        #     raise serializers.ValidationError({"error": "Email already taken!"})

        user = User.objects.create_user(
            username=username,
            first_name=first_name,
            last_name=last_name,
            email=email,
            password=password,
        )

        try:
            validate_password(password=password, user=user)
        except:
            user.delete()
            raise serializers.ValidationError({"error": "Commonly Used Password!"})

        user.is_active = False
        user.save()
        return user


class LoginUserSerializer(serializers.Serializer):
    username = serializers.CharField(required=True)
    password = serializers.CharField(required=True)


class ChangePasswordSerializer(serializers.Serializer):
    username = serializers.CharField(required=True)
    old_password = serializers.CharField(required=True)
    new_password = serializers.CharField(required=True)
    confirm_new_password = serializers.CharField(required=True)
