from django.core.mail import send_mail
from django.template.loader import render_to_string
from django.utils.html import strip_tags
from django.conf import settings
from django.shortcuts import redirect


def send_email(receiver_email, template_name, context, email_subject):

    html_message = render_to_string(template_name=template_name, context=context)

    message = strip_tags(html_message)

    send_mail(
        subject=email_subject,
        message=message,
        from_email=settings.EMAIL_HOST_USER,
        recipient_list=[receiver_email],
        html_message=html_message,
    )

def index(request):
    return redirect("admin/")