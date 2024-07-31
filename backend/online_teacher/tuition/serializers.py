from rest_framework import serializers
from .models import Review, Tuition, Course
from accounts.serializers import (
    StudentSerializer,
    TeacherSerializer,
    SubjectsSerializer,
    WeekDaySerializer,
)
from django.contrib.auth.models import User


class ReviewSerializer(serializers.ModelSerializer):
    class Meta:
        model = Review
        fields = "__all__"

    def to_representation(self, instance):
        self.fields["teacher"] = TeacherSerializer(read_only=True)
        self.fields["reviewer"] = StudentSerializer(read_only=True)
        return super(ReviewSerializer, self).to_representation(instance)


class TuitionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tuition
        fields = "__all__"

    def to_representation(self, instance):
        self.fields["teacher"] = TeacherSerializer(read_only=True)
        self.fields["student"] = StudentSerializer(read_only=True)
        self.fields["subjects"] = SubjectsSerializer(read_only=True, many=True)
        self.fields["week_days_option"] = WeekDaySerializer(read_only=True, many=True)
        return super(TuitionSerializer, self).to_representation(instance)


class CourseSerializer(serializers.ModelSerializer):
    teachers = serializers.StringRelatedField(many=True)
    subjects = serializers.StringRelatedField(many=True)

    class Meta:
        model = Course
        fields = "__all__"


class CancelTuitionSerializer(serializers.Serializer):
    id = serializers.IntegerField(required=True)
    user_id = serializers.IntegerField(required=True)


class UpdateTuitionSerializer(serializers.ModelSerializer):
    user_id = serializers.IntegerField(write_only=True, required=True)

    class Meta:
        model = Tuition
        fields = "__all__"

    def save(self, **kwargs):
        user_id = self.validated_data.pop("user_id")
        user = User.objects.get(id=user_id)

        if user and user.is_superuser:
            return super().save(**kwargs)
        else:
            raise serializers.ValidationError(
                "Only admins are allowed to update tuitions!"
            )
