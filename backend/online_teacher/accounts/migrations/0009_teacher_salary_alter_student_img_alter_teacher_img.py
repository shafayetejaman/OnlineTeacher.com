# Generated by Django 5.1 on 2024-10-28 10:06

from decimal import Decimal
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("accounts", "0008_alter_student_img_alter_teacher_img"),
    ]

    operations = [
        migrations.AddField(
            model_name="teacher",
            name="salary",
            field=models.DecimalField(
                decimal_places=2, default=Decimal("2000.00"), max_digits=10
            ),
        ),
        migrations.AlterField(
            model_name="student",
            name="img",
            field=models.ImageField(
                default="https://online-teacher-com.netlify.app/assets/img/static/default_user.png",
                upload_to="uploads/",
            ),
        ),
        migrations.AlterField(
            model_name="teacher",
            name="img",
            field=models.ImageField(
                default="https://online-teacher-com.netlify.app/assets/img/static/default_user.png",
                upload_to="uploads/",
            ),
        ),
    ]