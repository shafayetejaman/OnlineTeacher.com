# Generated by Django 5.0.2 on 2024-07-17 07:33

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ("tuition", "0001_initial"),
    ]

    operations = [
        migrations.RenameField(
            model_name="review",
            old_name="student",
            new_name="reviewer",
        ),
    ]
