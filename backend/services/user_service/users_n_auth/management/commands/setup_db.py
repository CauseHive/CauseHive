from django.core.management.base import BaseCommand
from django.db import connection
from django.core.management import call_command
import os


class Command(BaseCommand):
    help = 'Setup CauseHive database and initial data'

    def add_arguments(self, parser):
        parser.add_argument(
            '--reset',
            action='store_true',
            help='Reset database (delete all data)',
        )
        parser.add_argument(
            '--sample-data',
            action='store_true',
            help='Load sample data for development',
        )

    def handle(self, *args, **options):
        self.stdout.write(
            self.style.SUCCESS('🚀 Setting up CauseHive database...')
        )

        # Test database connection
        try:
            with connection.cursor() as cursor:
                cursor.execute("SELECT 1")
            self.stdout.write(
                self.style.SUCCESS('✅ Database connection successful!')
            )
        except Exception as e:
            self.stdout.write(
                self.style.ERROR(f'❌ Database connection failed: {e}')
            )
            return

        if options['reset']:
            self.stdout.write(
                self.style.WARNING('⚠️  Resetting database...')
            )
            # Remove migration files (except __init__.py)
            import glob
            from pathlib import Path
            
            migration_dirs = Path('users_n_auth/migrations')
            if migration_dirs.exists():
                for file in migration_dirs.glob('*.py'):
                    if file.name != '__init__.py':
                        file.unlink()
                        self.stdout.write(f'Removed {file}')

        # Run migrations
        self.stdout.write('📦 Running migrations...')
        call_command('makemigrations', verbosity=1)
        call_command('migrate', verbosity=1)

        # Create superuser if it doesn't exist
        from django.contrib.auth import get_user_model
        User = get_user_model()
        
        if not User.objects.filter(is_superuser=True).exists():
            self.stdout.write('👤 Creating superuser...')
            try:
                User.objects.create_superuser(
                    email='admin@causehive.com',
                    password='admin123',
                    first_name='Admin',
                    last_name='User'
                )
                self.stdout.write(
                    self.style.SUCCESS('✅ Superuser created: admin@causehive.com / admin123')
                )
            except Exception as e:
                self.stdout.write(
                    self.style.WARNING(f'⚠️  Could not create superuser: {e}')
                )

        if options['sample_data']:
            self.stdout.write('📋 Loading sample data...')
            self.load_sample_data()

        self.stdout.write(
            self.style.SUCCESS('\n🎉 Database setup complete!')
        )
        self.stdout.write(
            self.style.SUCCESS('You can now run: python manage.py runserver')
        )

    def load_sample_data(self):
        """Load sample data for development"""
        from django.contrib.auth import get_user_model
        User = get_user_model()

        # Create sample users
        sample_users = [
            {
                'email': 'donor1@example.com',
                'password': 'password123',
                'first_name': 'John',
                'last_name': 'Doe',
                'is_donor': True
            },
            {
                'email': 'organizer1@example.com',
                'password': 'password123',
                'first_name': 'Jane',
                'last_name': 'Smith',
                'is_organizer': True
            }
        ]

        for user_data in sample_users:
            if not User.objects.filter(email=user_data['email']).exists():
                user = User.objects.create_user(**user_data)
                self.stdout.write(f'Created user: {user.email}')
            else:
                self.stdout.write(f'User already exists: {user_data["email"]}')
