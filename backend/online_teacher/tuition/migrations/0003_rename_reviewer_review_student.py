# Generated by Django 5.0.2 on 2024-07-17 07:34

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ("tuition", "0002_rename_student_review_reviewer"),
    ]

    operations = [
        migrations.RenameField(
            model_name="review",
            old_name="reviewer",
            new_name="student",
        ),
    ]
