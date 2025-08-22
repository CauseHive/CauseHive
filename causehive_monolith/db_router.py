"""
Database router for CauseHive Monolith

This router directs database operations to the appropriate database
based on the Django app and model being used.

Database mapping:
- default: User service (users_n_auth)
- causes_db: Cause service (causes, categories)
- donations_db: Donation processing service (donations, cart, payments, withdrawal_transfer)
- admin_db: Admin service (admin_auth, dashboard, auditlog, notifications, management)
"""

class DatabaseRouter:
    """
    A router to control all database operations on models
    """
    
    # Route apps to their respective databases
    route_app_labels = {
        'users_n_auth': 'default',
        'causes': 'causes',
        'categories': 'categories',
        'donations': 'donations',
        'cart': 'cart',
        'payments': 'payments',
        'withdrawal_transfer': 'withdrawal_transfer',
        'admin_auth': 'admin_auth',
        'dashboard': 'dashboard',
        'auditlog': 'auditlog',
        'notifications': 'notifications',
        'management': 'management',
    }

    def db_for_read(self, model, **hints):
        """Suggest the database to read from."""
        return self.route_app_labels.get(model._meta.app_label)

    def db_for_write(self, model, **hints):
        """Suggest the database to write to."""
        return self.route_app_labels.get(model._meta.app_label)

    def allow_relation(self, obj1, obj2, **hints):
        """Allow relations if models are in the same app."""
        db_set = {'default', 'causes_db', 'donations_db', 'admin_db'}
        if obj1._state.db in db_set and obj2._state.db in db_set:
            return True
        return None

    def allow_migrate(self, db, app_label, model_name=None, **hints):
        """Ensure that certain apps' models get created on the right database."""
        # Get the target database for this app
        target_db = self.route_app_labels.get(app_label)
        
        # Django built-in apps can go to any database, but we'll put them in default
        if app_label in [
            'admin', 'auth', 'contenttypes', 'sessions', 'messages',
            'staticfiles', 'sites', 'allauth', 'account', 'socialaccount',
            'rest_framework', 'rest_framework_simplejwt', 'django_extensions',
            'django_filters', 'dj_rest_auth'
        ]:
            return db == 'default'
            
        # If we have a target database for this app, only allow migrations on that database
        if target_db:
            return db == target_db
            
        # For apps not in our routing, allow migration on default database
        return db == 'default'
