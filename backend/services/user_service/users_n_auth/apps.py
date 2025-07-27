from django.apps import AppConfig


class UsersNAuthConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'users_n_auth'

    def ready(self):
        import users_n_auth.signals
