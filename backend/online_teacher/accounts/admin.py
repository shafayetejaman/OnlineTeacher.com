from django.contrib import admin
from .models import Teacher, Student, WeekDay, Qualifications, Subjects


# Register your models here.
class TeacherModelAdmin(admin.ModelAdmin):
    list_display = ["id", "name", "user_id", "phone_number"]

    def name(self, obj):
        return obj.user.username

    def user_id(self, obj):
        return obj.user.id


admin.site.register(Teacher, TeacherModelAdmin)


class StudentModelAdmin(admin.ModelAdmin):
    list_display = ["id", "name", "user_id", "phone_number"]

    def name(self, obj):
        return obj.user.username

    def user_id(self, obj):
        return obj.user.id


admin.site.register(Student, StudentModelAdmin)


class QualificationsModelAdmin(admin.ModelAdmin):
    prepopulated_fields = {"slug": ("name",)}


class SubjectsModelAdmin(admin.ModelAdmin):
    prepopulated_fields = {"slug": ("name",)}


class WeekDayModelAdmin(admin.ModelAdmin):
    prepopulated_fields = {"slug": ("name",)}


admin.site.register(Qualifications, QualificationsModelAdmin)
admin.site.register(Subjects, SubjectsModelAdmin)
admin.site.register(WeekDay, WeekDayModelAdmin)
