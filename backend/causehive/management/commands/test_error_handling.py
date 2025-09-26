"""
Management command to test error handling in CauseHive backend
"""

from django.core.management.base import BaseCommand
from django.test import Client
from django.urls import reverse
import json


class Command(BaseCommand):
    help = 'Test error handling endpoints and responses'

    def add_arguments(self, parser):
        parser.add_argument(
            '--test-type',
            type=str,
            choices=['404', '500', '403', 'api'],
            default='all',
            help='Type of error to test (default: all)'
        )

    def handle(self, *args, **options):
        client = Client()
        test_type = options['test_type']

        self.stdout.write(
            self.style.SUCCESS('🧪 Testing CauseHive Error Handling System')
        )
        self.stdout.write('=' * 50)

        if test_type in ['404', 'all']:
            self.test_404_errors(client)

        if test_type in ['403', 'all']:
            self.test_403_errors(client)

        if test_type in ['api', 'all']:
            self.test_api_errors(client)

        self.stdout.write('\n' + '=' * 50)
        self.stdout.write(
            self.style.SUCCESS('✅ Error handling tests completed!')
        )

    def test_404_errors(self, client):
        """Test 404 error handling"""
        self.stdout.write('\n🔍 Testing 404 Error Handling...')
        
        # Test web 404
        response = client.get('/nonexistent-page/', HTTP_HOST='localhost')
        self.stdout.write(f'  Web 404 Status: {response.status_code}')
        if response.status_code == 404:
            self.stdout.write(self.style.SUCCESS('  ✅ Web 404 handled correctly'))
        else:
            self.stdout.write(self.style.ERROR('  ❌ Web 404 not handled correctly'))

        # Test API 404
        response = client.get('/api/nonexistent-endpoint/', HTTP_HOST='localhost')
        self.stdout.write(f'  API 404 Status: {response.status_code}')
        if response.status_code == 404:
            try:
                if response.get('Content-Type', '').startswith('application/json'):
                    data = response.json()
                    if 'error' in data and data['error'] == 'Not Found':
                        self.stdout.write(self.style.SUCCESS('  ✅ API 404 handled correctly with JSON'))
                    else:
                        self.stdout.write(self.style.WARNING('  ⚠️ API 404 response format unexpected'))
                else:
                    self.stdout.write(self.style.WARNING('  ⚠️ API 404 returned HTML instead of JSON'))
            except Exception as e:
                self.stdout.write(self.style.ERROR(f'  ❌ API 404 error: {e}'))
        else:
            self.stdout.write(self.style.ERROR('  ❌ API 404 not handled correctly'))

    def test_403_errors(self, client):
        """Test 403 error handling"""
        self.stdout.write('\n🔒 Testing 403 Error Handling...')
        self.stdout.write('  Note: 403 errors require specific endpoint configuration')

    def test_api_errors(self, client):
        """Test API-specific error handling"""
        self.stdout.write('\n🔌 Testing API Error Responses...')
        
        # Test health endpoint
        try:
            response = client.get('/api/status/', HTTP_HOST='localhost')
            self.stdout.write(f'  Health Check Status: {response.status_code}')
            if response.status_code == 200:
                data = response.json()
                self.stdout.write(f'  Health Check Response: {data}')
                self.stdout.write(self.style.SUCCESS('  ✅ Health check working'))
            else:
                self.stdout.write(self.style.ERROR('  ❌ Health check failed'))
        except Exception as e:
            self.stdout.write(self.style.ERROR(f'  ❌ Health check error: {e}'))

        # Test various API endpoints
        api_endpoints = [
            '/api/health/',
            '/api/ready/',
            '/api/causes/',
            '/api/user/',
        ]

        for endpoint in api_endpoints:
            try:
                response = client.get(endpoint, HTTP_HOST='localhost')
                self.stdout.write(f'  {endpoint}: {response.status_code}')
            except Exception as e:
                self.stdout.write(f'  {endpoint}: Error - {e}')

    def test_middleware(self, client):
        """Test custom middleware functionality"""
        self.stdout.write('\n⚙️ Testing Custom Middleware...')
        
        # This would test middleware functionality
        # In a real scenario, you'd test logging, security headers, etc.
        pass