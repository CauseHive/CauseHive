from datetime import timedelta
from pathlib import Path
from email.mime.image import MIMEImage

from django.conf import settings
from django.core.mail import EmailMultiAlternatives
from django.template.loader import render_to_string
from django.utils import timezone
from django.utils.html import strip_tags


def send_account_verification_email(*, to_email: str, first_name: str | None, verification_url: str,
                                    expiry_minutes: int = 30, logo_filename: str = "Causehive.png") -> int:
    now = timezone.now()
    expires_at = now + timedelta(minutes=expiry_minutes)

    context = {
        "first_name": first_name or "there",
        "verification_url": verification_url,
        "expires_at": expires_at,
        "support_email": settings.SUPPORT_EMAIL,
    }

    html_body = render_to_string("email/verification_email.html", context)
    text_body = strip_tags(html_body) or f"Verify your email: {verification_url}"

    message = EmailMultiAlternatives(
        subject="Verify Your Account",
        body=text_body,
        from_email=settings.DEFAULT_FROM_EMAIL,
        to=[to_email],
    )
    message.attach_alternative(html_body, "text/html")
    message.mixed_subtype = "related"

    return message.send(fail_silently=False)


def send_password_reset_email(*, to_email: str, first_name: str | None, reset_url: str,
                              expiry_minutes: int = 30, logo_filename: str = "Causehive.png") -> int:
    now = timezone.now()
    expires_at = now + timedelta(minutes=expiry_minutes)

    context = {
        "first_name": first_name or "there",
        "reset_url": reset_url,
        "expires_at": expires_at,
        "now": now,
        "support_email": settings.SUPPORT_EMAIL,
    }

    html_body = render_to_string("email/password_reset_email.html", context)
    text_body = strip_tags(html_body) or f"Reset your password: {reset_url}"

    message = EmailMultiAlternatives(
        subject="Password Reset Request",
        body=text_body,
        from_email=settings.DEFAULT_FROM_EMAIL,
        to=[to_email],
    )

    message.attach_alternative(html_body, "text/html")
    message.mixed_subtype = "related"

    return message.send(fail_silently=False)