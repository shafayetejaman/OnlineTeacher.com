from django.db import models
from django.contrib.auth.models import User
from .constrains import DAY_CHOICES, QUALIFICATION
from core.settings import USER_DEFAULT_IMAGE

# Create your models here.


class WeekDay(models.Model):
    name = models.CharField(choices=DAY_CHOICES, unique=True, max_length=20)
    slug = models.SlugField()

    def __str__(self):
        return self.name


class Qualifications(models.Model):
    name = models.CharField(max_length=30, unique=True)
    slug = models.SlugField()

    def __str__(self):
        return self.name

    class Meta:
        verbose_name_plural = "Qualifications"


class Subjects(models.Model):
    name = models.CharField(max_length=30, unique=True)
    slug = models.SlugField()

    def __str__(self):
        return self.name

    class Meta:
        verbose_name_plural = "Subjects"


class Teacher(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    qualification = models.ForeignKey(Qualifications, on_delete=models.CASCADE)
    week_days_option = models.ManyToManyField(WeekDay)
    subjects = models.ManyToManyField(Subjects)
    starting_hour = models.TimeField()
    ending_hour = models.TimeField()
    total_hours = models.TimeField()
    description = models.TextField()
    phone_number = models.CharField(max_length=20)
    github = models.CharField(max_length=200, default="#")
    facebook = models.CharField(max_length=200, default="#")
    linkedin = models.CharField(max_length=200, default="#")
    twitter = models.CharField(max_length=200, default="#")
    img = models.ImageField(upload_to="uploads/", default="#")
    # img = models.CharField(max_length=200, default=USER_DEFAULT_IMAGE)
    address = models.CharField(max_length=100)

    def __str__(self):
        return self.user.username


class Student(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    current_class = models.CharField(max_length=50)
    phone_number = models.CharField(max_length=20)
    description = models.TextField()
    img = models.ImageField(upload_to="uploads/", default="#")
    # img = models.CharField(max_length=200, default=USER_DEFAULT_IMAGE)
    address = models.CharField(max_length=100)

    def __str__(self):
        return self.user.username
