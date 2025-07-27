from django.apps import AppConfig


class AdminAuthConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'admin_auth'

    def ready(self):
        import admin_auth.signals