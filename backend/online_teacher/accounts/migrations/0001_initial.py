# Generated by Django 5.0.2 on 2024-07-15 19:10

import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name="Qualifications",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                ("name", models.CharField(max_length=30, unique=True)),
                ("slug", models.SlugField()),
            ],
            options={
                "verbose_name_plural": "Qualifications",
            },
        ),
        migrations.CreateModel(
            name="Subjects",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                ("name", models.CharField(max_length=30, unique=True)),
                ("slug", models.SlugField()),
            ],
            options={
                "verbose_name_plural": "Subjects",
            },
        ),
        migrations.CreateModel(
            name="WeekDay",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                (
                    "day",
                    models.CharField(
                        choices=[
                            ("Sunday", "Sunday"),
                            ("Monday", "Monday"),
                            ("Tuesday", "Tuesday"),
                            ("Wednesday", "Wednesday"),
                            ("Thursday", "Thursday"),
                            ("Friday", "Friday"),
                            ("Saturday", "Saturday"),
                        ],
                        max_length=20,
                        unique=True,
                    ),
                ),
            ],
        ),
        migrations.CreateModel(
            name="Student",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                ("current_class", models.CharField(max_length=50)),
                ("phone_number", models.IntegerField(unique=True)),
                ("description", models.TextField()),
                ("img", models.ImageField(upload_to="uploads/")),
                ("address", models.CharField(max_length=100)),
                (
                    "user",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="student_account",
                        to=settings.AUTH_USER_MODEL,
                    ),
                ),
            ],
        ),
        migrations.CreateModel(
            name="Teacher",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                ("starting_hour", models.TimeField()),
                ("ending_hour", models.TimeField()),
                ("total_hours", models.TimeField()),
                ("description", models.TextField()),
                ("phone_number", models.CharField(max_length=20, unique=True)),
                ("github", models.CharField(default="#", max_length=200)),
                ("facebook", models.CharField(default="#", max_length=200)),
                ("linkedin", models.CharField(default="#", max_length=200)),
                ("twitter", models.CharField(default="#", max_length=200)),
                ("img", models.ImageField(upload_to="uploads/")),
                ("address", models.CharField(max_length=100)),
                (
                    "qualification",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        to="accounts.qualifications",
                    ),
                ),
                ("subjects", models.ManyToManyField(to="accounts.subjects")),
                (
                    "user",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="teacher_account",
                        to=settings.AUTH_USER_MODEL,
                    ),
                ),
                ("week_days_option", models.ManyToManyField(to="accounts.weekday")),
            ],
        ),
    ]
