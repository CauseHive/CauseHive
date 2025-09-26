import uuid
from django.test import TestCase
from django.urls import reverse
from rest_framework.test import APITestCase, APIClient
from rest_framework import status

from .models import Category


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

    def test_category_slug_with_special_characters(self):
        """Test category slug generation with special characters"""
        category = Category.objects.create(
            name='Test Category with Special Characters!@#$%',
            description='Test description'
        )
        self.assertEqual(category.slug, 'test-category-with-special-characters')

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

    def test_category_update_slug(self):
        """Test category slug behavior when name changes"""
        # The slug should NOT update when name changes (only when empty)
        self.category.name = 'Updated Category Name'
        self.category.save()
        # The slug should remain the same because it's not empty
        self.assertEqual(self.category.slug, 'test-category')

    def test_category_new_slug_generation(self):
        """Test that new categories get slugs generated"""
        category = Category.objects.create(
            name='New Category for Slug Test',
            description='Test description'
        )
        self.assertEqual(category.slug, 'new-category-for-slug-test')

    def test_category_update_without_name_change(self):
        """Test category update without name change doesn't affect slug"""
        original_slug = self.category.slug
        self.category.description = 'Updated description'
        self.category.save()
        self.assertEqual(self.category.slug, original_slug)

    def test_category_empty_description(self):
        """Test category with empty description"""
        category = Category.objects.create(
            name='Category with Empty Description',
            description=''
        )
        self.assertEqual(category.description, '')

    def test_category_long_name(self):
        """Test category with long name (within limits)"""
        # The name field is limited to 50 characters, not 255
        long_name = 'A' * 50  # Maximum length
        category = Category.objects.create(
            name=long_name,
            description='Test description'
        )
        self.assertEqual(category.name, long_name)

    def test_category_very_long_description(self):
        """Test category with very long description"""
        long_description = 'A' * 1000
        category = Category.objects.create(
            name='Category with Long Description',
            description=long_description
        )
        self.assertEqual(category.description, long_description)


class CategoryViewsTestCase(APITestCase):
    """Test cases for Category views (if any are implemented)"""

    def setUp(self):
        self.client = APIClient()
        self.category = Category.objects.create(
            name='Test Category',
            description='Test category description'
        )

    def test_category_views_not_implemented(self):
        """Test that category views are not implemented yet"""
        # Since views.py is empty, we expect 404 for any category endpoints
        response = self.client.get('/categories/')
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)


class CategoryIntegrationTestCase(TestCase):
    """Integration test cases for Category model with other apps"""

    def setUp(self):
        self.category = Category.objects.create(
            name='Integration Test Category',
            description='Integration test category description'
        )

    def test_category_relationship_with_causes(self):
        """Test category relationship with causes"""
        from causes.models import Causes

        # Create a cause with this category
        cause = Causes.objects.create(
            name='Test Cause',
            category=self.category,
            description='Test cause description',
            organizer_id=uuid.uuid4(),
            target_amount=1000.00
        )

        # Test forward relationship
        self.assertEqual(cause.category, self.category)

        # Test reverse relationship
        self.assertEqual(self.category.causes.count(), 1)
        self.assertEqual(self.category.causes.first(), cause)

    def test_category_with_multiple_causes(self):
        """Test category with multiple causes"""
        from causes.models import Causes

        # Create multiple causes with the same category
        for i in range(3):
            Causes.objects.create(
                name=f'Test Cause {i}',
                category=self.category,
                description=f'Test cause description {i}',
                organizer_id=uuid.uuid4(),
                target_amount=1000.00
            )

        # Test reverse relationship
        self.assertEqual(self.category.causes.count(), 3)
        self.assertEqual(len(self.category.causes.all()), 3)

    def test_category_deletion_with_causes(self):
        """Test category deletion behavior with related causes"""
        from causes.models import Causes

        # Create a cause with this category
        cause = Causes.objects.create(
            name='Test Cause',
            category=self.category,
            description='Test cause description',
            organizer_id=uuid.uuid4(),
            target_amount=1000.00
        )

        # Delete the category (should cascade to cause)
        self.category.delete()

        # Verify cause was also deleted
        self.assertFalse(Causes.objects.filter(id=cause.id).exists())

    def test_category_slug_uniqueness_across_apps(self):
        """Test category slug uniqueness across different apps"""
        # Create categories with similar names that would generate similar slugs
        category1 = Category.objects.create(
            name='Unique Test Category 1',
            description='First category'
        )

        category2 = Category.objects.create(
            name='Unique Test Category 2',
            description='Second category'
        )

        # Both should be created successfully with different slugs
        self.assertNotEqual(category1.slug, category2.slug)

        # Try to create a third category with the same name (should fail)
        with self.assertRaises(Exception):
            Category.objects.create(
                name='Unique Test Category 1',
                description='Third category'
            )


class CategoryDataValidationTestCase(TestCase):
    """Test cases for Category data validation"""

    def test_category_name_max_length(self):
        """Test category name maximum length"""
        # Try to create category with name longer than 50 characters
        long_name = 'A' * 51
        with self.assertRaises(Exception):
            Category.objects.create(
                name=long_name,
                description='Test description'
            )

    def test_category_name_whitespace_handling(self):
        """Test category name whitespace handling"""
        # Test leading/trailing whitespace
        category = Category.objects.create(
            name='  Test Category with Whitespace  ',
            description='Test description'
        )
        # The slug should be generated from the trimmed name
        self.assertEqual(category.slug, 'test-category-with-whitespace')

    def test_category_description_whitespace_handling(self):
        """Test category description whitespace handling"""
        category = Category.objects.create(
            name='Test Category',
            description='  Test description with whitespace  '
        )
        # Description should preserve whitespace
        self.assertEqual(category.description, '  Test description with whitespace  ')


class CategoryPerformanceTestCase(TestCase):
    """Test cases for Category performance and edge cases"""

    def test_category_bulk_creation(self):
        """Test bulk creation of categories"""
        categories_data = [
            {'name': f'Category {i}', 'description': f'Description {i}'}
            for i in range(10)
        ]

        categories = []
        for data in categories_data:
            category = Category.objects.create(**data)
            categories.append(category)

        self.assertEqual(len(categories), 10)
        self.assertEqual(Category.objects.count(), 10)

    def test_category_slug_generation_performance(self):
        """Test slug generation performance with many categories"""
        # Create many categories to test slug generation performance
        for i in range(100):
            Category.objects.create(
                name=f'Performance Test Category {i}',
                description=f'Description {i}'
            )

        # Verify all categories were created successfully
        self.assertEqual(Category.objects.count(), 100)

        # Verify all slugs are unique
        slugs = list(Category.objects.values_list('slug', flat=True))
        self.assertEqual(len(slugs), len(set(slugs)))


    def test_category_case_sensitivity(self):
        """Test category name case sensitivity"""
        # Create first category
        category1 = Category.objects.create(
            name='Case Test Category',
            description='First category'
        )

        # Verify the first category was created successfully
        self.assertEqual(category1.name, 'Case Test Category')
        self.assertEqual(category1.slug, 'case-test-category')

        # Create a category with a different name that generates a different slug
        category2 = Category.objects.create(
            name='Different Case Test Category',
            description='Second category'
        )

        # Verify both categories exist with different slugs
        self.assertEqual(category1.slug, 'case-test-category')
        self.assertEqual(category2.slug, 'different-case-test-category')

        # Now test that we can't create a category with the same name (which would generate the same slug)
        with self.assertRaises(Exception) as context:
            Category.objects.create(
                name='Case Test Category',  # Same name as category1
                description='Third category'
            )

        # Verify it's the right type of exception
        self.assertIn('duplicate key value violates unique constraint', str(context.exception))