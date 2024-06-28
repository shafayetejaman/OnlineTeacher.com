from django.db import models
from django.contrib.auth.models import User
from constrains import 
# Create your models here.


class Teacher(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name="account")
    date_available = models.CharField(choices=)
