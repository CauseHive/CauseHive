from datetime import timedelta

from django.conf import settings
from django.core.mail import EmailMultiAlternatives
from django.template.loader import render_to_string
from django.utils import timezone
from django.utils.html import strip_tags


def send_cause_approved_email(*, to_email: str, organizer_name: str | None, cause_name: str,
                              target_amount: float, category_name: str, currency: str = "₵",
                              cause_url: str | None = None, logo_filename: str = "Causehive.png") -> int:
    """Send cause approval notification email"""
    now = timezone.now()

    context = {
        "organizer_name": organizer_name or "there",
        "cause_name": cause_name,
        "target_amount": f"{target_amount:,.2f}",
        "currency": currency,
        "category_name": category_name,
        "cause_url": cause_url,
        "now": now,
        "support_email": settings.SUPPORT_EMAIL,
    }

    html_body = render_to_string("email/cause_approved.html", context)
    text_body = strip_tags(html_body) or f"Your cause '{cause_name}' has been approved and is now live!"

    message = EmailMultiAlternatives(
        subject="Your cause is now live - CauseHive",
        body=text_body,
        from_email=settings.DEFAULT_FROM_EMAIL,
        to=[to_email],
    )
    message.attach_alternative(html_body, "text/html")
    message.mixed_subtype = "related"

    return message.send(fail_silently=False)


def send_cause_rejected_email(*, to_email: str, organizer_name: str | None, cause_name: str,
                              target_amount: float, category_name: str, rejection_reason: str | None = None,
                              currency: str = "₵", create_new_cause_url: str | None = None,
                              logo_filename: str = "Causehive.png") -> int:
    """Send cause rejection notification email"""
    now = timezone.now()

    context = {
        "organizer_name": organizer_name or "there",
        "cause_name": cause_name,
        "target_amount": f"{target_amount:,.2f}",
        "currency": currency,
        "category_name": category_name,
        "rejection_reason": rejection_reason or "No specific reason provided. Maybe admin forgot to add one.",
        "create_new_cause_url": create_new_cause_url or f"{getattr(settings, 'FRONTEND_URL', '')}/create-cause",
        "now": now,
        "support_email": settings.SUPPORT_EMAIL,
    }

    html_body = render_to_string("email/cause_rejected.html", context)
    text_body = strip_tags(
        html_body) or f"Your cause '{cause_name}' has been rejected. Reason: {rejection_reason or 'No reason provided'}"

    message = EmailMultiAlternatives(
        subject="Your cause was rejected - CauseHive",
        body=text_body,
        from_email=settings.DEFAULT_FROM_EMAIL,
        to=[to_email],
    )
    message.attach_alternative(html_body, "text/html")
    message.mixed_subtype = "related"

    return message.send(fail_silently=False)