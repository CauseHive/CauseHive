import os
from django.contrib.auth import get_user_model
from django.core.management.base import BaseCommand

User = get_user_model()

class Command(BaseCommand):
    help = "Creates a superuser if one doesn't already exist."

    def handle(self, *args, **options):
        # username = os.environ.get("DJANGO_SUPERUSER_USERNAME")
        email = os.environ.get("DJANGO_SUPERUSER_EMAIL")
        password = os.environ.get("DJANGO_SUPERUSER_PASSWORD")

        self.stdout.write(f"Checking superuser creation...")
        self.stdout.write(f"Email: {email}")
        self.stdout.write(f"Password set: {'Yes' if password else 'No'}")

        if not all([email, password]):
            self.stderr.write("Missing superuser environment variables.")
            self.stderr.write(f"Email: {email}")
            self.stderr.write(f"Password: {'Set' if password else 'Not set'}")
            return

        if not User.objects.filter(email=email).exists():
            User.objects.create_superuser(email=email, password=password)
            self.stdout.write(self.style.SUCCESS(f"Superuser with '{email}' created."))
        else:
            self.stdout.write(f"Superuser '{email}' already exists.")
