#!/usr/bin/env python
"""
Deployment Testing Script for CauseHive Monolith

This script tests the deployment readiness before pushing to Railway.
Run this locally to catch issues early.
"""
import os
import sys
import django
import requests
from django.core.management import execute_from_command_line
from django.db import connections
from django.test.utils import get_runner
from django.conf import settings

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'causehive.settings')
django.setup()

def test_database_connections():
    """Test all database connections"""
    print("🔍 Testing database connections...")
    databases = ['default', 'causes_db', 'donations_db', 'admin_db']
    results = {}
    
    for db_alias in databases:
        try:
            conn = connections[db_alias]
            conn.ensure_connection()
            print(f"✅ {db_alias}: Connected")
            results[db_alias] = True
        except Exception as e:
            print(f"❌ {db_alias}: Failed - {e}")
            results[db_alias] = False
    
    return all(results.values())

def test_migrations():
    """Test migration status"""
    print("\n🔍 Testing migrations...")
    try:
        from django.core.management.commands.showmigrations import Command
        # Check if there are unapplied migrations
        execute_from_command_line(['manage.py', 'showmigrations', '--plan'])
        print("✅ Migration status checked")
        return True
    except Exception as e:
        print(f"❌ Migration check failed: {e}")
        return False

def test_static_files():
    """Test static files collection"""
    print("\n🔍 Testing static files...")
    try:
        execute_from_command_line(['manage.py', 'collectstatic', '--noinput', '--dry-run'])
        print("✅ Static files collection test passed")
        return True
    except Exception as e:
        print(f"❌ Static files test failed: {e}")
        return False

def test_environment_variables():
    """Test required environment variables"""
    print("\n🔍 Testing environment variables...")
    required_vars = [
        'SECRET_KEY',
        'USER_SERVICE_DB_NAME', 'USER_SERVICE_DB_HOST',
        'CAUSE_SERVICE_DB_NAME', 'CAUSE_SERVICE_DB_HOST',
        'DONATION_SERVICE_DB_NAME', 'DONATION_SERVICE_DB_HOST',
        'ADMIN_SERVICE_DB_NAME', 'ADMIN_SERVICE_DB_HOST',
    ]
    
    missing_vars = []
    for var in required_vars:
        if not os.environ.get(var):
            missing_vars.append(var)
    
    if missing_vars:
        print(f"❌ Missing environment variables: {', '.join(missing_vars)}")
        return False
    else:
        print("✅ All required environment variables present")
        return True

def test_app_imports():
    """Test that all apps can be imported"""
    print("\n🔍 Testing app imports...")
    apps_to_test = [
        'users_n_auth', 'causes', 'categories', 'donations', 
        'cart', 'payments', 'withdrawal_transfer', 'admin_auth',
        'dashboard', 'auditlog', 'notifications', 'management'
    ]
    
    failed_imports = []
    for app in apps_to_test:
        try:
            __import__(app)
            print(f"✅ {app}: Imported successfully")
        except ImportError as e:
            print(f"❌ {app}: Import failed - {e}")
            failed_imports.append(app)
    
    return len(failed_imports) == 0

def test_server_startup():
    """Test if Django server can start (basic check)"""
    print("\n🔍 Testing Django configuration...")
    try:
        from django.core.wsgi import get_wsgi_application
        application = get_wsgi_application()
        print("✅ Django WSGI application configured correctly")
        return True
    except Exception as e:
        print(f"❌ Django configuration error: {e}")
        return False

def run_deployment_tests():
    """Run all deployment tests"""
    print("🚀 CauseHive Deployment Readiness Test\n")
    
    tests = [
        ("Environment Variables", test_environment_variables),
        ("App Imports", test_app_imports),
        ("Database Connections", test_database_connections),
        ("Migrations", test_migrations),
        ("Static Files", test_static_files),
        ("Server Configuration", test_server_startup),
    ]
    
    results = {}
    for test_name, test_func in tests:
        print(f"\n{'='*50}")
        print(f"Running: {test_name}")
        print('='*50)
        results[test_name] = test_func()
    
    # Summary
    print(f"\n{'='*50}")
    print("DEPLOYMENT READINESS SUMMARY")
    print('='*50)
    
    passed = sum(results.values())
    total = len(results)
    
    for test_name, result in results.items():
        status = "✅ PASS" if result else "❌ FAIL"
        print(f"{test_name}: {status}")
    
    print(f"\nOverall: {passed}/{total} tests passed")
    
    if passed == total:
        print("\n🎉 All tests passed! Ready for Railway deployment.")
        return True
    else:
        print(f"\n⚠️  {total - passed} test(s) failed. Fix issues before deploying.")
        return False

if __name__ == '__main__':
    success = run_deployment_tests()
    sys.exit(0 if success else 1)
