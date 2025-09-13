#!/usr/bin/env python3
"""
Test database connections for CauseHive Supabase setup using connection strings
"""
import os
import sys
import psycopg2
from urllib.parse import urlparse
from pathlib import Path

# Load environment variables
sys.path.append(str(Path(__file__).parent))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'causehive.settings')

try:
    import environ
    env = environ.Env()
    env_file = Path(__file__).parent / ".env"
    environ.Env.read_env(str(env_file))
    
    def get_env(key, default=''):
        return env(key, default=default)
except ImportError:
    print("⚠️  django-environ not installed. Using os.environ directly.")
    def get_env(key, default=''):
        return os.environ.get(key, default)

def test_connection_string(connection_string):
    """Test connection using a PostgreSQL connection string"""
    try:
        conn = psycopg2.connect(connection_string)
        conn.close()
        return True, "Connected successfully"
    except Exception as e:
        return False, str(e)

def parse_connection_string(connection_string):
    """Parse connection string to show details"""
    try:
        parsed = urlparse(connection_string)
        return {
            'host': parsed.hostname,
            'port': parsed.port or 5432,
            'database': parsed.path.lstrip('/'),
            'user': parsed.username,
            'password': '***' if parsed.password else None
        }
    except Exception:
        return None

def main():
    print("🔍 Testing Supabase Database Connection Strings")
    print("=" * 50)
    
    connection_strings = [
        {
            'name': 'User Service (default)',
            'url': get_env('USER_SERVICE_DATABASE_URL', ''),
        },
        {
            'name': 'Cause Service',
            'url': get_env('CAUSE_SERVICE_DATABASE_URL', ''),
        },
        {
            'name': 'Donation Service', 
            'url': get_env('DONATION_SERVICE_DATABASE_URL', ''),
        },
        {
            'name': 'Admin Service',
            'url': get_env('ADMIN_SERVICE_DATABASE_URL', ''),
        }
    ]
    
    all_connected = True
    
    for db_config in connection_strings:
        print(f"\n🔗 Testing {db_config['name']}...")
        
        if not db_config['url'] or 'your-password' in db_config['url']:
            print("   ❌ Connection string not configured in .env file")
            print("   💡 Update your .env with actual Supabase connection string")
            all_connected = False
            continue
        
        # Parse and display connection details
        details = parse_connection_string(db_config['url'])
        if details:
            print(f"   Host: {details['host']}")
            print(f"   Database: {details['database']}")
            print(f"   User: {details['user']}")
            print(f"   Port: {details['port']}")
        
        # Test the connection
        success, message = test_connection_string(db_config['url'])
        
        if success:
            print(f"   ✅ {message}")
        else:
            print(f"   ❌ {message}")
            all_connected = False
    
    print(f"\n{'='*50}")
    if all_connected:
        print("🎉 All database connections successful!")
        print("✅ Ready to run migrations and deploy to Railway")
    else:
        print("⚠️  Some database connections failed.")
        print("📝 Please check your .env file and Supabase connection strings")
        print("\n💡 Connection string format:")
        print("   postgresql://postgres:password@db.project-ref.supabase.co:5432/postgres")
    
    return all_connected

if __name__ == '__main__':
    try:
        success = main()
        sys.exit(0 if success else 1)
    except KeyboardInterrupt:
        print("\n\n⚠️  Test interrupted by user")
        sys.exit(1)
    except Exception as e:
        print(f"\n❌ Unexpected error: {e}")
        sys.exit(1)
