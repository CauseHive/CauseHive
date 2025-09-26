#!/usr/bin/env python
"""
Test script to verify causes API endpoint
Run this from the backend/monolithic_app directory
"""

import os
import sys
import django

# Add the project directory to Python path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.monolithic_app.causehive_monolith.settings')
django.setup()

from causes.models import Causes
from causes.serializers import CausesSerializer
from rest_framework.test import APIRequestFactory
from django.test import RequestFactory

def test_causes_endpoint():
    """Test the causes list endpoint"""
    print("🔍 Testing Causes API endpoint...")
    
    # Check if causes exist in database
    causes_count = Causes.objects.count()
    print(f"📊 Total causes in database: {causes_count}")
    
    # Check active causes
    active_causes = Causes.objects.exclude(status__in=['under_review', 'rejected'])
    active_count = active_causes.count()
    print(f"✅ Active causes: {active_count}")
    
    if active_count > 0:
        print("\n📋 Sample active causes:")
        for cause in active_causes[:3]:
            print(f"  - {cause.name} (Status: {cause.status})")
    
    # Test serialization
    try:
        factory = RequestFactory()
        request = factory.get('/api/causes/list/')
        
        # Mock context for serializer
        context = {'request': request}
        
        serializer = CausesSerializer(active_causes, many=True, context=context)
        data = serializer.data
        print(f"\n✅ Serialization successful: {len(data)} causes serialized")
        
        if data:
            print(f"📄 Sample cause data keys: {list(data[0].keys())}")
            
    except Exception as e:
        print(f"❌ Serialization error: {str(e)}")
        import traceback
        traceback.print_exc()

if __name__ == '__main__':
    test_causes_endpoint()
