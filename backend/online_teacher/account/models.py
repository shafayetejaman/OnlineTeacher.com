from django.db import models
from django.contrib.auth.models import User
from .constrains import DAY_CHOICES, QUALIFICATION

# Create your models here.


class WeekDay(models.Model):
    day = models.IntegerField(choices=DAY_CHOICES, unique=True)
    
    def __str__(self):
        return f"{self.get_day_display()}"


class Teacher(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name="account")
    week_days_option = models.ManyToManyField(WeekDay)
    qualification = models.IntegerField(choices=QUALIFICATION)
