from rest_framework import serializers
from .models import Teacher, Student, Qualifications, Subjects, WeekDay
from django.contrib.auth.models import User


class TeacherSerializer(serializers.ModelSerializer):
    class Meta:
        model = Teacher
        fields = "__all__"

    def to_representation(self, instance):
        self.fields["week_days_option"] = serializers.StringRelatedField(many=True)
        self.fields["subjects"] = serializers.StringRelatedField(many=True)
        self.fields["qualification"] = serializers.StringRelatedField(many=False)
        self.fields["user"] = ShowUserSerializer(read_only=True)
        return super(TeacherSerializer, self).to_representation(instance)


class StudentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Student
        fields = "__all__"

    def to_representation(self, instance):
        self.fields["user"] = ShowUserSerializer(read_only=True)
        return super(StudentSerializer, self).to_representation(instance)


class QualificationsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Qualifications
        fields = "__all__"


class SubjectsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Subjects
        fields = "__all__"


class WeekDaySerializer(serializers.ModelSerializer):
    class Meta:
        model = WeekDay
        fields = "__all__"


class ShowUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = [
            "id",
            "username",
            "first_name",
            "last_name",
            "email",
        ]
