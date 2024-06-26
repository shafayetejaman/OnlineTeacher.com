from django.db import models
from django.contrib.auth.models import User
from .constrains import DAY_CHOICES, QUALIFICATION

# Create your models here.


class WeekDay(models.Model):
    day = models.IntegerField(choices=DAY_CHOICES, unique=True)

    def __str__(self):
        return f"{self.get_day_display()}"


class Teacher(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name="TeacherAccount")
    week_days_option = models.ManyToManyField(WeekDay)
    qualification = models.IntegerField(choices=QUALIFICATION)
    starting_hour = models.TimeField()
    ending_hour = models.TimeField()
    total_hours = models.TimeField()
    description = models.TextField()
    youtube = models.CharField(max_length=50, blank=True, null=True)
    facebook = models.CharField(max_length=50, blank=True, null=True)
    linkedin = models.CharField(max_length=50, blank=True, null=True)
    twitter = models.CharField(max_length=50, blank=True, null=True)
    img = models.ImageField(upload_to="uploads/")


class Student(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name="StudentAccount")
    current_class = models.CharField(max_length=50)
    description = models.TextField()
    facebook = models.CharField(max_length=50, blank=True, null=True)
    img = models.ImageField(upload_to="uploads/")
