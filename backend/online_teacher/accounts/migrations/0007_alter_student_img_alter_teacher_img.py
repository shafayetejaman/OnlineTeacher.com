# Generated by Django 5.0.2 on 2024-07-26 13:16

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("accounts", "0006_alter_student_user_alter_teacher_user"),
    ]

    operations = [
        migrations.AlterField(
            model_name="student",
            name="img",
            field=models.CharField(
                default="https://i.imghippo.com/files/I9WYK1721756674.png",
                max_length=200,
            ),
        ),
        migrations.AlterField(
            model_name="teacher",
            name="img",
            field=models.CharField(
                default="https://i.imghippo.com/files/I9WYK1721756674.png",
                max_length=200,
            ),
        ),
    ]
