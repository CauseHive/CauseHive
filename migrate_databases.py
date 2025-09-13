# #!/usr/bin/env python
# """
# Database Migration Management Script for CauseHive Monolith
#
# This script helps manage migrations across multiple databases.
# Each service maintains its own database on Supabase.
# """
# import os
# import sys
# import django
# import time
# from django.core.management import execute_from_command_line
# from django.db import connections
# from django.core.management.base import CommandError
#
# os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'causehive.settings')
# django.setup()
#
# SCHEMAS_BY_ALIAS = {
#     'default': 'causehive_users',
#     'causes_db': 'causehive_causes',
#     'donations_db': 'causehive_donations',
#     'admin_db': 'causehive_admin',
# }
#
# def set_search_path(db_alias):
#     """Explicitly set search_path for the given alias to its schema,public."""
#     schema = SCHEMAS_BY_ALIAS.get(db_alias)
#     if not schema:
#         return
#     try:
#         with connections[db_alias].cursor() as cursor:
#             cursor.execute(f"SET search_path TO {schema}, public;")
#         print(f"   • set search_path to: {schema},public")
#     except Exception as e:
#         print(f"   • could not set search_path for {db_alias}: {e}")
#
# def ensure_schema_exists(db_alias):
#     """Ensure the target schema exists for the given database alias."""
#     schema = SCHEMAS_BY_ALIAS.get(db_alias)
#     if not schema:
#         return
#     try:
#         with connections[db_alias].cursor() as cursor:
#             # Create schema if missing; no-op if it exists
#             cursor.execute(f"CREATE SCHEMA IF NOT EXISTS {schema};")
#         print(f"   • ensured schema exists: {schema}")
#     except Exception as e:
#         print(f"   • could not ensure schema '{schema}': {e}")
#
# def _print_db_diagnostics(db_alias):
#     """Print connection diagnostics: search_path, current schema, and table count in target schema."""
#     try:
#         schema = SCHEMAS_BY_ALIAS.get(db_alias)
#         with connections[db_alias].cursor() as cursor:
#             cursor.execute("SHOW search_path;")
#             search_path = cursor.fetchone()[0]
#             cursor.execute("SELECT current_schema();")
#             current_schema = cursor.fetchone()[0]
#             table_count = None
#             if schema:
#                 cursor.execute(
#                     "SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = %s;",
#                     [schema],
#                 )
#                 table_count = cursor.fetchone()[0]
#         print(f"   • search_path={search_path}")
#         print(f"   • current_schema()={current_schema}")
#         if schema is not None:
#             print(f"   • tables in '{schema}': {table_count}")
#     except Exception as e:
#         print(f"   • (diagnostics unavailable): {e}")
#
# def check_database_connection(db_alias, max_retries=5, delay=2):
#     """Check if database is accessible with retries"""
#     for attempt in range(max_retries):
#         try:
#             conn = connections[db_alias]
#             conn.ensure_connection()
#             print(f"✅ Database {db_alias} connection successful")
#             # enforce search_path right after connection
#             set_search_path(db_alias)
#             _print_db_diagnostics(db_alias)
#             return True
#         except Exception as e:
#             print(f"⚠️  Database {db_alias} connection attempt {attempt + 1}/{max_retries} failed: {e}")
#             if attempt < max_retries - 1:
#                 time.sleep(delay)
#             else:
#                 print(f"❌ Database {db_alias} connection failed after {max_retries} attempts")
#                 return False
#     return False
#
# def migrate_database_safely(db_alias, app_labels=None):
#     """Safely migrate a database with connection checks"""
#     print(f"\n=== Migrating {db_alias} database ===")
#
#     # Check connection first
#     if not check_database_connection(db_alias):
#         return False
#
#     # Ensure target schema exists before migrating (prevents fallback to public)
#     ensure_schema_exists(db_alias)
#     # Enforce search_path before running migrations
#     set_search_path(db_alias)
#
#     try:
#         if app_labels:
#             for app_label in app_labels:
#                 print(f"Migrating {app_label} to {db_alias}...")
#                 execute_from_command_line(['manage.py', 'migrate', app_label, '--database', db_alias])
#         else:
#             execute_from_command_line(['manage.py', 'migrate', '--database', db_alias])
#
#         print(f"✅ Successfully migrated {db_alias}")
#         # Print diagnostics after migration as well
#         _print_db_diagnostics(db_alias)
#         return True
#     except CommandError as e:
#         if "No migrations to apply" in str(e):
#             print(f"ℹ️  No migrations needed for {db_alias}")
#             _print_db_diagnostics(db_alias)
#             return True
#         else:
#             print(f"❌ Migration error for {db_alias}: {e}")
#             return False
#     except Exception as e:
#         print(f"❌ Unexpected error migrating {db_alias}: {e}")
#         return False
#
# def migrate_all_databases():
#     """Run migrations on all configured databases with proper app routing"""
#     database_apps = {
#         'default': ['users_n_auth', 'admin', 'auth', 'contenttypes', 'sessions', 'sites', 'account', 'socialaccount', 'token_blacklist'],
#         'causes_db': ['causes', 'categories'],
#         'donations_db': ['donations', 'cart', 'payments', 'withdrawal_transfer'],
#         'admin_db': ['admin_auth', 'dashboard', 'auditlog', 'notifications', 'management']
#     }
#
#     success_count = 0
#     total_count = len(database_apps)
#
#     for db_alias, app_labels in database_apps.items():
#         if migrate_database_safely(db_alias, app_labels):
#             success_count += 1
#         else:
#             print(f"⚠️  Continuing despite {db_alias} migration issues...")
#
#     print(f"\n=== Migration Summary ===")
#     print(f"Successfully migrated: {success_count}/{total_count} databases")
#
#     if success_count == total_count:
#         print("🎉 All databases migrated successfully!")
#         return True
#     else:
#         print("⚠️  Some databases had migration issues")
#         return success_count > 0  # Return True if at least one database migrated
#
# def migrate_specific_app(app_label, database):
#     """Migrate a specific app to its database"""
#     print(f"\n=== Migrating {app_label} to {database} ===")
#     return migrate_database_safely(database, [app_label])
#
# if __name__ == '__main__':
#     if len(sys.argv) > 1:
#         if sys.argv[1] == 'all':
#             success = migrate_all_databases()
#             sys.exit(0 if success else 1)
#         elif sys.argv[1] == 'app' and len(sys.argv) == 4:
#             app_label = sys.argv[2]
#             database = sys.argv[3]
#             success = migrate_specific_app(app_label, database)
#             sys.exit(0 if success else 1)
#         else:
#             print("Usage:")
#             print("  python migrate_databases.py all")
#             print("  python migrate_databases.py app <app_label> <database>")
#             print("\nDatabases: default, causes_db, donations_db, admin_db")
#     else:
#         success = migrate_all_databases()
#         sys.exit(0 if success else 1)


# !/usr/bin/env python
"""
Database Migration Management Script for CauseHive Monolith

This script helps manage migrations for the single database.
"""
import os
import sys
import django
import time
from django.core.management import execute_from_command_line
from django.db import connections
from django.core.management.base import CommandError

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'causehive.settings')
django.setup()


def check_database_connection(db_alias, max_retries=5, delay=2):
    """Check if database is accessible with retries"""
    for attempt in range(max_retries):
        try:
            conn = connections[db_alias]
            conn.ensure_connection()
            print(f"✅ Database {db_alias} connection successful")
            return True
        except Exception as e:
            print(f"⚠️  Database {db_alias} connection attempt {attempt + 1}/{max_retries} failed: {e}")
            if attempt < max_retries - 1:
                time.sleep(delay)
            else:
                print(f"❌ Database {db_alias} connection failed after {max_retries} attempts")
                return False
    return False


def migrate_database_safely(db_alias):
    """Safely migrate a database with connection checks"""
    print(f"\n=== Migrating {db_alias} database ===")

    # Check connection first
    if not check_database_connection(db_alias):
        return False

    try:
        execute_from_command_line(['manage.py', 'migrate', '--database', db_alias])
        print(f"✅ Successfully migrated {db_alias}")
        return True
    except CommandError as e:
        if "No migrations to apply" in str(e):
            print(f"ℹ️  No migrations needed for {db_alias}")
            return True
        else:
            print(f"❌ Migration error for {db_alias}: {e}")
            return False
    except Exception as e:
        print(f"❌ Unexpected error migrating {db_alias}: {e}")
        return False


def migrate_all_databases():
    """Run migrations on the configured database"""
    success = migrate_database_safely('default')
    print(f"\n=== Migration Summary ===")
    print(f"Migration {'successful' if success else 'failed'}")
    return success


if __name__ == '__main__':
    if len(sys.argv) > 1:
        if sys.argv[1] == 'all':
            success = migrate_all_databases()
            sys.exit(0 if success else 1)
        else:
            print("Usage:")
            print("  python migrate_databases.py all")
    else:
        success = migrate_all_databases()
        sys.exit(0 if success else 1)