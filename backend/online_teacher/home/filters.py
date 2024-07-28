from django_filters.rest_framework import FilterSet
from accounts.models import Teacher


class FilterTeachers(FilterSet):
    class Meta:
        model = Teacher
        fields = {
            "qualification": ["exact"],
            "subjects": ["exact"],
            "week_days_option": ["exact"],
            "starting_hour": ["gte"],
            "ending_hour": ["lte"],
            "id": ["exact"],
            "user__id": ["exact"],
        }
