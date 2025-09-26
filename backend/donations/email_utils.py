from datetime import timedelta

from django.conf import settings
from django.core.mail import EmailMultiAlternatives
from django.template.loader import render_to_string
from django.utils import timezone
from django.utils.html import strip_tags


def send_donation_successful_email(*, to_email: str, user_name: str | None, amount: float,
                                cause_name: str, currency: str = "₵",
                                logo_filename: str = "Causehive.png") -> int:
    """Send donation success notification email"""
    now = timezone.now()

    context = {
        "user_name": user_name or "there",
        "amount": f"{amount:,.2f}",
        "currency": currency,
        "cause_name": cause_name,
        "donated_at": now,
        "donated_tz": "UTC",
        "now": now,
        "support_email": settings.SUPPORT_EMAIL,
    }

    html_body = render_to_string("email/donation_successful.html", context)
    text_body = strip_tags(html_body) or f"Thank you for your donation of {currency}{amount:,.2f} to {cause_name}."

    message = EmailMultiAlternatives(
        subject="Thank you for your donation - CauseHive",
        body=text_body,
        from_email=settings.DEFAULT_FROM_EMAIL,
        to=[to_email],
    )
    message.attach_alternative(html_body, "text/html")
    message.mixed_subtype = "related"
    return message.send(fail_silently=False)