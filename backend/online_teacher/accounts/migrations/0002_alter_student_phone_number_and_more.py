# Generated by Django 5.0.2 on 2024-07-18 18:26

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("accounts", "0001_initial"),
    ]

    operations = [
        migrations.AlterField(
            model_name="student",
            name="phone_number",
            field=models.CharField(max_length=20),
        ),
        migrations.AlterField(
            model_name="teacher",
            name="phone_number",
            field=models.CharField(max_length=20),
        ),
    ]
