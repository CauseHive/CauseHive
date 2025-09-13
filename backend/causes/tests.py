import uuid
from unittest.mock import patch, MagicMock
from decimal import Decimal
from django.test import TestCase, override_settings
from django.core.files.uploadedfile import SimpleUploadedFile
from django.urls import reverse
from rest_framework.test import APITestCase, APIClient
from rest_framework import status
from PIL import Image
import io

from .models import Causes
from .serializers import CausesSerializer
from .permissions import IsAdminService
from .utils import validate_organizer_id_with_service
from categories.models import Category


class CategoryModelTestCase(TestCase):
    """Test cases for Category model"""

    def setUp(self):
        self.category_data = {
            'name': 'Test Category',
            'description': 'Test category description'
        }
        self.category = Category.objects.create(**self.category_data)

    def test_category_creation(self):
        """Test category model creation"""
        self.assertIsInstance(self.category.id, uuid.UUID)
        self.assertEqual(self.category.name, self.category_data['name'])
        self.assertEqual(self.category.description, self.category_data['description'])
        self.assertEqual(self.category.slug, 'test-category')

    def test_category_string_representation(self):
        """Test category string representation"""
        self.assertEqual(str(self.category), self.category_data['name'])

    def test_category_slug_auto_generation(self):
        """Test category slug auto-generation"""
        category = Category.objects.create(
            name='Another Test Category',
            description='Another test description'
        )
        self.assertEqual(category.slug, 'another-test-category')

    def test_category_unique_name(self):
        """Test category name uniqueness"""
        with self.assertRaises(Exception):  # Should raise IntegrityError
            Category.objects.create(
                name=self.category_data['name'],
                description='Different description'
            )

    def test_category_unique_slug(self):
        """Test category slug uniqueness"""
        with self.assertRaises(Exception):  # Should raise IntegrityError
            Category.objects.create(
                name='Test Category',  # Same name will generate same slug
                description='Different description'
            )


class CausesModelTestCase(TestCase):
    """Test cases for Causes model"""

    def setUp(self):
        self.category = Category.objects.create(
            name='Test Category',
            description='Test category description'
        )
        self.cause_data = {
            'name': 'Test Cause',
            'category': self.category,
            'description': 'Test cause description',
            'organizer_id': uuid.uuid4(),
            'target_amount': Decimal('1000.00'),
            'current_amount': Decimal('0.00'),
            'status': 'under_review'
        }
        self.cause = Causes.objects.create(**self.cause_data)

    def test_cause_creation(self):
        """Test cause model creation"""
        self.assertIsInstance(self.cause.id, uuid.UUID)
        self.assertEqual(self.cause.name, self.cause_data['name'])
        self.assertEqual(self.cause.category, self.category)
        self.assertEqual(self.cause.description, self.cause_data['description'])
        self.assertEqual(self.cause.organizer_id, self.cause_data['organizer_id'])
        self.assertEqual(self.cause.target_amount, self.cause_data['target_amount'])
        self.assertEqual(self.cause.current_amount, self.cause_data['current_amount'])
        self.assertEqual(self.cause.status, self.cause_data['status'])
        self.assertEqual(self.cause.slug, 'test-cause')

    def test_cause_string_representation(self):
        """Test cause string representation"""
        self.assertEqual(str(self.cause), self.cause_data['name'])

    def test_cause_slug_auto_generation(self):
        """Test cause slug auto-generation"""
        cause = Causes.objects.create(
            name='Another Test Cause',
            category=self.category,
            description='Another test description',
            organizer_id=uuid.uuid4(),
            target_amount=Decimal('500.00')
        )
        self.assertEqual(cause.slug, 'another-test-cause')

    def test_cause_unique_name(self):
        """Test cause name uniqueness"""
        with self.assertRaises(Exception):  # Should raise IntegrityError
            Causes.objects.create(
                name=self.cause_data['name'],
                category=self.category,
                description='Different description',
                organizer_id=uuid.uuid4(),
                target_amount=Decimal('500.00')
            )

    def test_cause_status_choices(self):
        """Test cause status choices"""
        valid_statuses = ['under_review', 'approved', 'rejected', 'ongoing', 'completed', 'cancelled']
        for status in valid_statuses:
            cause = Causes.objects.create(
                name=f'Test Cause {status}',
                category=self.category,
                description='Test description',
                organizer_id=uuid.uuid4(),
                target_amount=Decimal('100.00'),
                status=status
            )
            self.assertEqual(cause.status, status)

    def test_cause_default_values(self):
        """Test cause default values"""
        cause = Causes.objects.create(
            name='Test Cause Defaults',
            category=self.category,
            description='Test description',
            organizer_id=uuid.uuid4(),
            target_amount=Decimal('100.00')
        )
        self.assertEqual(cause.current_amount, Decimal('0.00'))
        self.assertEqual(cause.status, 'under_review')
        self.assertIsNone(cause.rejection_reason)
        # Fix: Check if cover_image is empty instead of None
        self.assertFalse(cause.cover_image)

    def test_cause_rejection_reason(self):
        """Test cause rejection reason"""
        rejection_reason = 'This cause does not meet our guidelines'
        self.cause.status = 'rejected'
        self.cause.rejection_reason = rejection_reason
        self.cause.save()

        self.cause.refresh_from_db()
        self.assertEqual(self.cause.rejection_reason, rejection_reason)

    def test_cause_verbose_name_plural(self):
        """Test cause verbose name plural"""
        self.assertEqual(Causes._meta.verbose_name_plural, "Causes")


class CausesSerializerTestCase(TestCase):
    """Test cases for CausesSerializer"""

    def setUp(self):
        self.category = Category.objects.create(
            name='Test Category',
            description='Test category description'
        )
        self.organizer_id = uuid.uuid4()
        self.valid_data = {
            'name': 'Test Cause',
            'category': self.category.id,
            'description': 'Test cause description',
            'organizer_id': str(self.organizer_id),
            'target_amount': '1000.00',
            'current_amount': '0.00',
            'status': 'under_review'
        }

    @patch('causes.serializers.validate_organizer_id_with_service')
    def test_valid_serializer_data(self, mock_validate):
        """Test serializer with valid data"""
        mock_validate.return_value = self.organizer_id
        serializer = CausesSerializer(data=self.valid_data)
        # Debug: Print serializer errors if not valid
        if not serializer.is_valid():
            print("Serializer errors:", serializer.errors)
        self.assertTrue(serializer.is_valid())

    @patch('causes.serializers.validate_organizer_id_with_service')
    def test_serializer_create_cause(self, mock_validate):
        """Test serializer creates cause correctly"""
        mock_validate.return_value = self.organizer_id
        serializer = CausesSerializer(data=self.valid_data)
        # Debug: Print serializer errors if not valid
        if not serializer.is_valid():
            print("Serializer errors:", serializer.errors)
        self.assertTrue(serializer.is_valid())
        cause = serializer.save()

        self.assertIsInstance(cause, Causes)
        self.assertEqual(cause.name, self.valid_data['name'])
        self.assertEqual(cause.category, self.category)
        self.assertEqual(cause.description, self.valid_data['description'])
        self.assertEqual(str(cause.organizer_id), self.valid_data['organizer_id'])
        self.assertEqual(cause.target_amount, Decimal(self.valid_data['target_amount']))

    @patch('causes.serializers.validate_organizer_id_with_service')
    def test_serializer_create_with_category_data(self, mock_validate):
        """Test serializer creates cause with category data"""
        mock_validate.return_value = self.organizer_id
        data = self.valid_data.copy()
        data.pop('category')
        data['category_data'] = {
            'name': 'New Category',
            'description': 'New category description'
        }

        serializer = CausesSerializer(data=data)
        # Debug: Print serializer errors if not valid
        if not serializer.is_valid():
            print("Serializer errors:", serializer.errors)
        self.assertTrue(serializer.is_valid())
        cause = serializer.save()

        self.assertEqual(cause.category.name, 'New Category')
        self.assertEqual(cause.category.description, 'New category description')

    @patch('causes.serializers.validate_organizer_id_with_service')
    def test_serializer_invalid_organizer_id(self, mock_validate):
        """Test serializer with invalid organizer ID"""
        from rest_framework import serializers
        mock_validate.side_effect = serializers.ValidationError('Organizer not found')
        serializer = CausesSerializer(data=self.valid_data)
        self.assertFalse(serializer.is_valid())
        self.assertIn('organizer_id', serializer.errors)

    def test_serializer_missing_required_fields(self):
        """Test serializer with missing required fields"""
        data = {'name': 'Test Cause'}
        serializer = CausesSerializer(data=data)
        self.assertFalse(serializer.is_valid())
        self.assertIn('organizer_id', serializer.errors)

    def test_serializer_invalid_target_amount(self):
        """Test serializer with invalid target amount"""
        data = self.valid_data.copy()
        data['target_amount'] = 'invalid_amount'
        serializer = CausesSerializer(data=data)
        self.assertFalse(serializer.is_valid())
        self.assertIn('target_amount', serializer.errors)


class IsAdminServicePermissionTestCase(TestCase):
    """Test cases for IsAdminService permission"""

    def setUp(self):
        self.permission = IsAdminService()
        self.request = MagicMock()
        self.view = MagicMock()

    @override_settings(ADMIN_SERVICE_API_KEY='test-key-123')
    def test_permission_with_valid_key(self):
        """Test permission with valid API key"""
        self.request.headers = {'X-ADMIN-SERVICE-API-KEY': 'test-key-123'}
        self.assertTrue(self.permission.has_permission(self.request, self.view))

    @override_settings(ADMIN_SERVICE_API_KEY='test-key-123')
    def test_permission_with_invalid_key(self):
        """Test permission with invalid API key"""
        self.request.headers = {'X-ADMIN-SERVICE-API-KEY': 'wrong-key'}
        self.assertFalse(self.permission.has_permission(self.request, self.view))

    @override_settings(ADMIN_SERVICE_API_KEY='test-key-123')
    def test_permission_without_key(self):
        """Test permission without API key"""
        self.request.headers = {}
        self.assertFalse(self.permission.has_permission(self.request, self.view))

    @override_settings(ADMIN_SERVICE_API_KEY=None)
    def test_permission_without_setting(self):
        """Test permission without setting configured"""
        self.request.headers = {'X-ADMIN-SERVICE-API-KEY': 'any-key'}
        self.assertFalse(self.permission.has_permission(self.request, self.view))


class ValidateOrganizerIdTestCase(TestCase):
    """Test cases for validate_organizer_id_with_service"""

    @patch('causes.utils.requests.get')
    def test_valid_organizer_id(self, mock_get):
        """Test validation with valid organizer ID"""
        mock_response = MagicMock()
        mock_response.status_code = 200
        mock_response.json.return_value = {'is_active': True}
        mock_get.return_value = mock_response

        organizer_id = uuid.uuid4()
        result = validate_organizer_id_with_service(organizer_id)
        self.assertEqual(result, organizer_id)

    @patch('causes.utils.requests.get')
    def test_invalid_organizer_id(self, mock_get):
        """Test validation with invalid organizer ID"""
        mock_response = MagicMock()
        mock_response.status_code = 404
        mock_get.return_value = mock_response

        organizer_id = uuid.uuid4()
        with self.assertRaises(Exception):
            validate_organizer_id_with_service(organizer_id)

    @patch('causes.utils.requests.get')
    def test_inactive_user(self, mock_get):
        """Test validation with inactive user"""
        mock_response = MagicMock()
        mock_response.status_code = 200
        mock_response.json.return_value = {'is_active': False}
        mock_get.return_value = mock_response

        organizer_id = uuid.uuid4()
        with self.assertRaises(Exception):
            validate_organizer_id_with_service(organizer_id)

    @patch('causes.utils.requests.get')
    def test_service_unreachable(self, mock_get):
        """Test validation when service is unreachable"""
        mock_get.side_effect = Exception('Connection error')

        organizer_id = uuid.uuid4()
        with self.assertRaises(Exception):
            validate_organizer_id_with_service(organizer_id)


@override_settings(
    MEDIA_ROOT='/tmp/test_media/',
    ADMIN_SERVICE_API_KEY='test-admin-key',
    USER_SERVICE_URL='http://localhost:8000/user'
)
class CausesViewsTestCase(APITestCase):
    """Test cases for Causes views"""

    def setUp(self):
        self.client = APIClient()
        self.category = Category.objects.create(
            name='Test Category',
            description='Test category description'
        )
        self.organizer_id = uuid.uuid4()
        self.cause_data = {
            'name': 'Test Cause',
            'category': self.category.id,
            'description': 'Test cause description',
            'organizer_id': str(self.organizer_id),
            'target_amount': '1000.00',
            'current_amount': '0.00',
            'status': 'under_review'
        }

    @patch('causes.serializers.validate_organizer_id_with_service')
    def test_create_cause_success(self, mock_validate):
        """Test successful cause creation"""
        mock_validate.return_value = self.organizer_id
        response = self.client.post('/causes/create/', self.cause_data)

        # Debug: Print response data if it fails
        if response.status_code != status.HTTP_201_CREATED:
            print("Response status:", response.status_code)
            print("Response data:", response.data)

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertIn('id', response.data)
        self.assertEqual(response.data['name'], self.cause_data['name'])
        self.assertEqual(response.data['category'], self.category.id)

    @patch('causes.serializers.validate_organizer_id_with_service')
    def test_create_cause_invalid_data(self, mock_validate):
        """Test cause creation with invalid data"""
        mock_validate.return_value = self.organizer_id
        data = self.cause_data.copy()
        data['target_amount'] = 'invalid_amount'

        response = self.client.post('/causes/create/', data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_list_causes(self):
        """Test listing causes"""
        # Create causes with different statuses
        approved_cause = Causes.objects.create(
            name='Approved Cause',
            category=self.category,
            description='Approved cause description',
            organizer_id=uuid.uuid4(),
            target_amount=Decimal('500.00'),
            status='approved'
        )
        rejected_cause = Causes.objects.create(
            name='Rejected Cause',
            category=self.category,
            description='Rejected cause description',
            organizer_id=uuid.uuid4(),
            target_amount=Decimal('300.00'),
            status='rejected'
        )

        response = self.client.get('/causes/list/')

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)  # Only approved cause should be visible
        self.assertEqual(response.data[0]['name'], 'Approved Cause')

    def test_cause_detail(self):
        """Test getting cause details"""
        cause = Causes.objects.create(
            name='Test Cause',
            category=self.category,
            description='Test cause description',
            organizer_id=uuid.uuid4(),
            target_amount=Decimal('1000.00')
        )

        response = self.client.get(f'/causes/details/{cause.id}/')

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['name'], cause.name)
        self.assertEqual(response.data['id'], str(cause.id))

    def test_cause_detail_not_found(self):
        """Test getting non-existent cause details"""
        fake_id = uuid.uuid4()
        response = self.client.get(f'/causes/details/{fake_id}/')

        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_delete_cause(self):
        """Test deleting a cause"""
        cause = Causes.objects.create(
            name='Test Cause',
            category=self.category,
            description='Test cause description',
            organizer_id=uuid.uuid4(),
            target_amount=Decimal('1000.00')
        )

        response = self.client.delete(f'/causes/delete/{cause.id}/')

        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertFalse(Causes.objects.filter(id=cause.id).exists())

    def test_admin_list_causes_without_permission(self):
        """Test admin list causes without permission"""
        response = self.client.get('/causes/admin/causes/')

        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_admin_list_causes_with_permission(self):
        """Test admin list causes with permission"""
        self.client.credentials(HTTP_X_ADMIN_SERVICE_API_KEY='test-admin-key')
        response = self.client.get('/causes/admin/causes/')

        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_admin_update_cause_with_permission(self):
        """Test admin update cause with permission"""
        cause = Causes.objects.create(
            name='Test Cause',
            category=self.category,
            description='Test cause description',
            organizer_id=uuid.uuid4(),
            target_amount=Decimal('1000.00'),
            status='under_review'
        )

        self.client.credentials(HTTP_X_ADMIN_SERVICE_API_KEY='test-admin-key')
        update_data = {
            'status': 'approved',
            'rejection_reason': ''
        }

        response = self.client.patch(f'/causes/admin/causes/{cause.id}/update/', update_data)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        cause.refresh_from_db()
        self.assertEqual(cause.status, 'ongoing')  # Should automatically change to ongoing

    def test_admin_update_cause_rejected(self):
        """Test admin update cause to rejected status"""
        cause = Causes.objects.create(
            name='Test Cause',
            category=self.category,
            description='Test cause description',
            organizer_id=uuid.uuid4(),
            target_amount=Decimal('1000.00'),
            status='under_review'
        )

        self.client.credentials(HTTP_X_ADMIN_SERVICE_API_KEY='test-admin-key')
        update_data = {
            'status': 'rejected',
            'rejection_reason': 'Does not meet guidelines'
        }

        response = self.client.patch(f'/causes/admin/causes/{cause.id}/update/', update_data)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        cause.refresh_from_db()
        self.assertEqual(cause.status, 'rejected')
        self.assertEqual(cause.rejection_reason, 'Does not meet guidelines')

    def test_admin_approve_cause(self):
        """Test admin approve cause"""
        cause = Causes.objects.create(
            name='Test Cause',
            category=self.category,
            description='Test cause description',
            organizer_id=uuid.uuid4(),
            target_amount=Decimal('1000.00'),
            status='under_review'
        )

        self.client.credentials(HTTP_X_ADMIN_SERVICE_API_KEY='test-admin-key')
        # Fix: Use the correct URL pattern - it should be AdminCauseUpdateView, not a separate approve endpoint
        update_data = {
            'status': 'approved'
        }
        response = self.client.patch(f'/causes/admin/causes/{cause.id}/update/', update_data)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        cause.refresh_from_db()
        self.assertEqual(cause.status, 'ongoing')  # Should automatically change to ongoing

    def test_admin_approve_nonexistent_cause(self):
        """Test admin approve non-existent cause"""
        fake_id = uuid.uuid4()

        self.client.credentials(HTTP_X_ADMIN_SERVICE_API_KEY='test-admin-key')
        update_data = {
            'status': 'approved'
        }
        response = self.client.patch(f'/causes/admin/causes/{fake_id}/update/', update_data)

        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)


@override_settings(
    MEDIA_ROOT='/tmp/test_media/',
    ADMIN_SERVICE_API_KEY='test-admin-key',
    USER_SERVICE_URL='http://localhost:8000/user'
)
class IntegrationTestCase(APITestCase):
    """Integration test cases"""

    def setUp(self):
        self.client = APIClient()
        self.category = Category.objects.create(
            name='Test Category',
            description='Test category description'
        )
        self.organizer_id = uuid.uuid4()

    @patch('causes.serializers.validate_organizer_id_with_service')
    def test_full_cause_lifecycle(self, mock_validate):
        """Test complete cause lifecycle"""
        mock_validate.return_value = self.organizer_id

        # 1. Create cause
        cause_data = {
            'name': 'Integration Test Cause',
            'category': self.category.id,
            'description': 'Integration test description',
            'organizer_id': str(self.organizer_id),
            'target_amount': '2000.00',
            'current_amount': '0.00',
            'status': 'under_review'
        }

        create_response = self.client.post('/causes/create/', cause_data)
        # Debug: Print response data if it fails
        if create_response.status_code != status.HTTP_201_CREATED:
            print("Create response status:", create_response.status_code)
            print("Create response data:", create_response.data)

        self.assertEqual(create_response.status_code, status.HTTP_201_CREATED)
        cause_id = create_response.data['id']

        # 2. Get cause details
        detail_response = self.client.get(f'/causes/details/{cause_id}/')
        self.assertEqual(detail_response.status_code, status.HTTP_200_OK)
        self.assertEqual(detail_response.data['name'], 'Integration Test Cause')

        # 3. Admin approves cause
        self.client.credentials(HTTP_X_ADMIN_SERVICE_API_KEY='test-admin-key')
        update_data = {
            'status': 'approved'
        }
        approve_response = self.client.patch(f'/causes/admin/causes/{cause_id}/update/', update_data)
        self.assertEqual(approve_response.status_code, status.HTTP_200_OK)

        # 4. Verify cause is now ongoing (approved automatically changes to ongoing)
        detail_response = self.client.get(f'/causes/details/{cause_id}/')
        self.assertEqual(detail_response.data['status'], 'ongoing')

        # 5. List causes (should include ongoing cause)
        list_response = self.client.get('/causes/list/')
        self.assertEqual(list_response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(list_response.data), 1)
        self.assertEqual(list_response.data[0]['name'], 'Integration Test Cause')

    @patch('causes.serializers.validate_organizer_id_with_service')
    def test_cause_with_category_creation(self, mock_validate):
        """Test cause creation with new category"""
        mock_validate.return_value = self.organizer_id

        cause_data = {
            'name': 'Cause with New Category',
            'category_data': {
                'name': 'New Category',
                'description': 'New category description'
            },
            'description': 'Test description',
            'organizer_id': str(self.organizer_id),
            'target_amount': '1500.00',
            'current_amount': '0.00',
            'status': 'under_review'
        }

        # Fix: Use JSON format for nested data
        response = self.client.post('/causes/create/', cause_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

        # Verify category was created
        new_category = Category.objects.get(name='New Category')
        self.assertEqual(new_category.description, 'New category description')

        # Verify cause was created with new category
        cause = Causes.objects.get(name='Cause with New Category')
        self.assertEqual(cause.category, new_category)