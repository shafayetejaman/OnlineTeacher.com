from django.db import models
from accounts.models import Student, Teacher, Subjects, WeekDay
from .constrains import STATUS, TYPE, STARS


# Create your models here.
class Tuition(models.Model):
    student = models.ForeignKey(
        Student, on_delete=models.CASCADE, related_name="tuition"
    )
    teacher = models.ForeignKey(Teacher, on_delete=models.CASCADE)
    status = models.CharField(choices=STATUS, max_length=20, default=STATUS[0][0])
    type = models.CharField(choices=TYPE, max_length=20)
    starting_hour = models.TimeField()
    ending_hour = models.TimeField()
    total_hours = models.TimeField()
    subjects = models.ManyToManyField(Subjects)
    week_days_option = models.ManyToManyField(WeekDay)
    description = models.TextField()
    canceled = models.BooleanField(default=False)
    created = models.DateTimeField(auto_now_add=True)


class Review(models.Model):
    reviewer = models.ForeignKey(
        Student,
        on_delete=models.CASCADE,
    )
    teacher = models.ForeignKey(
        Teacher,
        on_delete=models.CASCADE,
    )
    text = models.TextField()
    created = models.DateTimeField(auto_now_add=True)
    rating = models.CharField(choices=STARS, max_length=20)

    def __str__(self):
        return "Student: {self.reviewer.user.username} & Teacher: {self.teacher.user.username} Rating {self.rating}"


class Course(models.Model):
    name = models.CharField(max_length=50)
    subjects = models.ManyToManyField(Subjects)
    teachers = models.ManyToManyField(Teacher)
    fees = models.DecimalField(max_digits=10, decimal_places=2)
    description = models.TextField()

    def __str__(self):
        return self.name
