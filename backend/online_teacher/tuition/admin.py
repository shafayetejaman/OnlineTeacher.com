from django.contrib import admin
from .models import Tuition, Review, Course
from home.views import send_email
from datetime import datetime
from core.settings import FRONTEND_ADDRESS

# Register your models here.


class TuitionModelAdmin(admin.ModelAdmin):
    list_display = ["teacher_name", "student_name", "status", "created", "canceled"]

    def teacher_name(self, obj):
        return obj.teacher.user.username

    def student_name(self, obj):
        return obj.student.user.username

    def save_model(self, request, obj, form, change):
        obj.save()
        form.save_m2m()

        if obj.status == "Ongoing" and not obj.canceled and obj.type == "Online":
            subject = "Tuition notification email"
            send_email(
                email_subject=subject,
                context={
                    "student": obj.student.user,
                    "link": FRONTEND_ADDRESS
                    + "/profile_student.html?user_id="
                    + obj.student.user.id,
                    "year": datetime.now().year,
                },
                receiver_email=obj.student.user.email,
                template_name="tuition_notification.html",
            )


admin.site.register(Tuition, TuitionModelAdmin)


class ReviewModelAdmin(admin.ModelAdmin):
    list_display = ["teacher_name", "student_name", "rating", "created"]

    def teacher_name(self, obj):
        return obj.teacher.user.username

    def student_name(self, obj):
        return obj.reviewer.user.username


admin.site.register(Review, ReviewModelAdmin)
admin.site.register(Course)
