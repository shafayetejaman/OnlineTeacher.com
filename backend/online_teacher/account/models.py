from django.db import models
from django.contrib.auth.models import User
from constrains import DAY_CHOICES

# Create your models here.


class Teacher(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name="account")
    week_days_option = models.CharField(choices=DAY_CHOICES)
