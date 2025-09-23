from django.core.management.base import BaseCommand
from django.conf import settings
from allauth.socialaccount.models import SocialApp
from django.contrib.sites.models import Site


class Command(BaseCommand):
    help = 'Set up Google OAuth application for Django Allauth'

    def handle(self, *args, **options):
        # Get Google OAuth credentials from environment
        client_id = settings.SOCIALACCOUNT_PROVIDERS['google']['APP']['client_id']
        secret = settings.SOCIALACCOUNT_PROVIDERS['google']['APP']['secret']
        
        if not client_id or not secret:
            self.stdout.write(
                self.style.ERROR(
                    'Google OAuth credentials not found. Please set GOOGLE_OAUTH2_CLIENT_ID and GOOGLE_OAUTH2_SECRET in your .env file.'
                )
            )
            return

        # Get or create the default site
        site, created = Site.objects.get_or_create(
            id=settings.SITE_ID,
            defaults={
                'domain': 'localhost:8000',  # Update this for production
                'name': 'CauseHive'
            }
        )
        
        if created:
            self.stdout.write(f'Created site: {site.domain}')
        else:
            self.stdout.write(f'Using existing site: {site.domain}')

        # Create or update Google OAuth app
        app, created = SocialApp.objects.get_or_create(
            provider='google',
            defaults={
                'name': 'Google OAuth',
                'client_id': client_id,
                'secret': secret,
            }
        )
        
        if not created:
            app.client_id = client_id
            app.secret = secret
            app.save()
            self.stdout.write('Updated existing Google OAuth app')
        else:
            self.stdout.write('Created new Google OAuth app')

        # Add the site to the app
        app.sites.add(site)
        
        self.stdout.write(
            self.style.SUCCESS(
                f'Google OAuth setup complete! App ID: {app.id}'
            )
        )
        self.stdout.write(
            f'Google OAuth URL: http://localhost:8000/api/user/accounts/google/login/'
        )
