from django.db.backends.signals import connection_created
from django.dispatch import receiver

# Map database aliases to their intended schemas
SCHEMA_MAP = {
    'default': 'causehive_users',
    'causes_db': 'causehive_causes',
    'donations_db': 'causehive_donations',
    'admin_db': 'causehive_admin',
}

@receiver(connection_created)
def set_search_path(sender, connection, **kwargs):
    alias = getattr(connection, 'alias', None)
    schema = SCHEMA_MAP.get(alias)
    if not schema:
        return
    try:
        with connection.cursor() as cursor:
            cursor.execute(f"SET search_path TO {schema}, public;")
    except Exception:
        # Avoid crashing app startup if we cannot set search_path; migrations script will print diagnostics
        pass
