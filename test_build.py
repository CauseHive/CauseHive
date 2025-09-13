#!/usr/bin/env python
"""
Build Testing Script for CauseHive Monolith

This script tests the build process without requiring database connections.
It simulates what Railway does during the build phase.
"""
import os
import sys
import subprocess
import tempfile
from pathlib import Path

def test_docker_build():
    """Test Docker build process locally"""
    print("🐳 Testing Docker build...")
    try:
        # Build the Docker image
        result = subprocess.run([
            'docker', 'build', 
            '-t', 'causehive-test', 
            '.'
        ], capture_output=True, text=True, timeout=300)
        
        if result.returncode == 0:
            print("✅ Docker build successful")
            return True
        else:
            print(f"❌ Docker build failed:")
            print(result.stderr)
            return False
    except subprocess.TimeoutExpired:
        print("❌ Docker build timed out (>5 minutes)")
        return False
    except FileNotFoundError:
        print("⚠️  Docker not found - skipping Docker build test")
        return None

def test_python_dependencies():
    """Test if all Python dependencies can be installed"""
    print("📦 Testing Python dependencies...")
    try:
        # Create a temporary virtual environment
        with tempfile.TemporaryDirectory() as temp_dir:
            venv_path = Path(temp_dir) / "test_venv"
            
            # Create virtual environment
            subprocess.run([sys.executable, '-m', 'venv', str(venv_path)], 
                         check=True, capture_output=True)
            
            # Get pip path
            if os.name == 'nt':  # Windows
                pip_path = venv_path / "Scripts" / "pip"
            else:  # Unix/Linux
                pip_path = venv_path / "bin" / "pip"
            
            # Install dependencies
            result = subprocess.run([
                str(pip_path), 'install', '-r', 'requirements.txt'
            ], capture_output=True, text=True, timeout=180)
            
            if result.returncode == 0:
                print("✅ All dependencies installed successfully")
                return True
            else:
                print("❌ Dependency installation failed:")
                print(result.stderr)
                return False
                
    except subprocess.TimeoutExpired:
        print("❌ Dependency installation timed out")
        return False
    except Exception as e:
        print(f"❌ Dependency test failed: {e}")
        return False

def test_django_check():
    """Test Django configuration without database"""
    print("🔍 Testing Django configuration...")
    
    # Set minimal environment for Django check
    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'causehive.settings')
    os.environ.setdefault('SECRET_KEY', 'test-secret-key-for-build-check')
    os.environ.setdefault('DEBUG', 'True')
    
    # Set dummy database values to avoid connection attempts
    os.environ.setdefault('USER_SERVICE_DB_NAME', 'dummy')
    os.environ.setdefault('USER_SERVICE_DB_USER', 'dummy')
    os.environ.setdefault('USER_SERVICE_DB_PASSWORD', 'dummy')
    os.environ.setdefault('USER_SERVICE_DB_HOST', 'dummy')
    os.environ.setdefault('CAUSE_SERVICE_DB_NAME', 'dummy')
    os.environ.setdefault('CAUSE_SERVICE_DB_USER', 'dummy')
    os.environ.setdefault('CAUSE_SERVICE_DB_PASSWORD', 'dummy')
    os.environ.setdefault('CAUSE_SERVICE_DB_HOST', 'dummy')
    os.environ.setdefault('DONATION_SERVICE_DB_NAME', 'dummy')
    os.environ.setdefault('DONATION_SERVICE_DB_USER', 'dummy')
    os.environ.setdefault('DONATION_SERVICE_DB_PASSWORD', 'dummy')
    os.environ.setdefault('DONATION_SERVICE_DB_HOST', 'dummy')
    os.environ.setdefault('ADMIN_SERVICE_DB_NAME', 'dummy')
    os.environ.setdefault('ADMIN_SERVICE_DB_USER', 'dummy')
    os.environ.setdefault('ADMIN_SERVICE_DB_PASSWORD', 'dummy')
    os.environ.setdefault('ADMIN_SERVICE_DB_HOST', 'dummy')
    
    try:
        # Test Django system check (without database)
        result = subprocess.run([
            sys.executable, 'manage.py', 'check', '--deploy'
        ], capture_output=True, text=True, timeout=60)
        
        if result.returncode == 0:
            print("✅ Django configuration check passed")
            return True
        else:
            print("❌ Django check failed:")
            print(result.stderr)
            return False
            
    except subprocess.TimeoutExpired:
        print("❌ Django check timed out")
        return False
    except Exception as e:
        print(f"❌ Django check failed: {e}")
        return False

def test_static_files_collection():
    """Test static files collection"""
    print("📁 Testing static files collection...")
    
    # Set environment for static files test
    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'causehive.settings')
    os.environ.setdefault('SECRET_KEY', 'test-secret-key-for-build-check')
    
    try:
        result = subprocess.run([
            sys.executable, 'manage.py', 'collectstatic', 
            '--noinput', '--dry-run'
        ], capture_output=True, text=True, timeout=60)
        
        if result.returncode == 0:
            print("✅ Static files collection test passed")
            return True
        else:
            print("❌ Static files collection failed:")
            print(result.stderr)
            return False
            
    except subprocess.TimeoutExpired:
        print("❌ Static files test timed out")
        return False
    except Exception as e:
        print(f"❌ Static files test failed: {e}")
        return False

def test_app_imports():
    """Test that all Django apps can be imported"""
    print("📥 Testing app imports...")
    
    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'causehive.settings')
    os.environ.setdefault('SECRET_KEY', 'test-secret-key')
    
    try:
        import django
        django.setup()
        
        from django.apps import apps
        
        # Get all installed apps
        installed_apps = apps.get_app_configs()
        
        failed_imports = []
        for app_config in installed_apps:
            try:
                # Try to import the app's models
                app_config.get_models()
                print(f"✅ {app_config.name}: OK")
            except Exception as e:
                print(f"❌ {app_config.name}: {e}")
                failed_imports.append(app_config.name)
        
        if not failed_imports:
            print("✅ All apps imported successfully")
            return True
        else:
            print(f"❌ Failed to import: {', '.join(failed_imports)}")
            return False
            
    except Exception as e:
        print(f"❌ App import test failed: {e}")
        return False

def run_build_tests():
    """Run all build tests"""
    print("🏗️  CauseHive Build Test (No Database Required)")
    print("=" * 50)
    
    tests = [
        ("Python Dependencies", test_python_dependencies),
        ("App Imports", test_app_imports),
        ("Django Configuration", test_django_check),
        ("Static Files Collection", test_static_files_collection),
        ("Docker Build", test_docker_build),
    ]
    
    results = {}
    for test_name, test_func in tests:
        print(f"\n{'='*30}")
        print(f"Running: {test_name}")
        print('='*30)
        result = test_func()
        results[test_name] = result
    
    # Summary
    print(f"\n{'='*50}")
    print("BUILD TEST SUMMARY")
    print('='*50)
    
    passed = sum(1 for r in results.values() if r is True)
    skipped = sum(1 for r in results.values() if r is None)
    failed = sum(1 for r in results.values() if r is False)
    total = len(results)
    
    for test_name, result in results.items():
        if result is True:
            status = "✅ PASS"
        elif result is None:
            status = "⚠️  SKIP"
        else:
            status = "❌ FAIL"
        print(f"{test_name}: {status}")
    
    print(f"\nResults: {passed} passed, {skipped} skipped, {failed} failed")
    
    if failed == 0:
        print("\n🎉 Build tests passed! Railway build should succeed.")
        return True
    else:
        print(f"\n⚠️  {failed} test(s) failed. Fix issues before deploying.")
        return False

if __name__ == '__main__':
    success = run_build_tests()
    sys.exit(0 if success else 1)
