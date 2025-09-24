import decimal
from datetime import timedelta

from django.conf import settings
from django.core.mail import EmailMultiAlternatives
from django.template.loader import render_to_string
from django.utils import timezone
from django.utils.html import strip_tags


def send_withdrawal_processed_email(*, to_email: str, first_name: str | None, amount: decimal.Decimal,
                                    currency: str = "₵", processed_at = None, logo_filename: str = "Causehive.png") -> int:
    now = timezone.now()
    processed_at = processed_at or  now

    context = {
        "first_name": first_name or "there",
        "amount": f"{amount:,.2f}",
        "currency": currency,
        "processed_at": processed_at,
        "processed_tz": "UTC",
        "now": now,
        "support_email": settings.SUPPORT_EMAIL,
    }

    html_body = render_to_string("email/withdrawal_processed.html", context)
    text_body = strip_tags(html_body) or f"Your withdrawal of {currency}{amount:, .2f} has been processed."

    message = EmailMultiAlternatives(
        subject="Withdrawal Processed - CauseHive",
        body=text_body,
        from_email=settings.DEFAULT_FROM_EMAIL,
        to=[to_email],
    )
    message.attach_alternative(html_body, "text/html")
    message.mixed_subtype = "related"

    return message.send(fail_silently=False)