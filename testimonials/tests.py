from django.test import TestCase
from django.contrib.auth.models import User
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from causes.models import Cause
from .models import Testimonial, TestimonialLike, TestimonialReport


class TestimonialModelTests(TestCase):
    """Test testimonial models"""
    
    def setUp(self):
        self.user = User.objects.create_user(
            username='testuser',
            email='test@example.com',
            password='testpass123'
        )
        self.cause = Cause.objects.create(
            name='Test Cause',
            description='A test cause',
            target_amount=1000,
            organizer_id=self.user.id
        )
    
    def test_create_testimonial(self):
        """Test creating a testimonial"""
        testimonial = Testimonial.objects.create(
            cause=self.cause,
            user=self.user,
            rating=5,
            review_text="Great cause! Very happy to support."
        )
        
        self.assertEqual(testimonial.rating, 5)
        self.assertEqual(testimonial.review_text, "Great cause! Very happy to support.")
        self.assertTrue(testimonial.is_approved)  # Auto-approved
        self.assertFalse(testimonial.is_featured)
        self.assertFalse(testimonial.is_verified_donation)
    
    def test_testimonial_str(self):
        """Test testimonial string representation"""
        testimonial = Testimonial.objects.create(
            cause=self.cause,
            user=self.user,
            rating=4,
            review_text="Good cause"
        )
        
        expected = f"{self.user.username} - {self.cause.name} (4/5)"
        self.assertEqual(str(testimonial), expected)
    
    def test_user_name_property(self):
        """Test user_name property"""
        testimonial = Testimonial.objects.create(
            cause=self.cause,
            user=self.user,
            rating=5,
            review_text="Excellent"
        )
        
        # Should return username when no first/last name
        self.assertEqual(testimonial.user_name, self.user.username)
        
        # Update user with first/last name
        self.user.first_name = "John"
        self.user.last_name = "Doe"
        self.user.save()
        
        self.assertEqual(testimonial.user_name, "John Doe")
    
    def test_unique_testimonial_per_user_per_cause(self):
        """Test that user can only have one testimonial per cause"""
        Testimonial.objects.create(
            cause=self.cause,
            user=self.user,
            rating=5,
            review_text="First review"
        )
        
        # Attempting to create another should raise IntegrityError
        with self.assertRaises(Exception):
            Testimonial.objects.create(
                cause=self.cause,
                user=self.user,
                rating=4,
                review_text="Second review"
            )


class TestimonialAPITests(APITestCase):
    """Test testimonial API endpoints"""
    
    def setUp(self):
        self.user1 = User.objects.create_user(
            username='user1',
            email='user1@example.com',
            password='testpass123'
        )
        self.user2 = User.objects.create_user(
            username='user2',
            email='user2@example.com',
            password='testpass123'
        )
        self.cause = Cause.objects.create(
            name='Test Cause',
            description='A test cause',
            target_amount=1000,
            organizer_id=self.user1.id
        )
        self.testimonial = Testimonial.objects.create(
            cause=self.cause,
            user=self.user1,
            rating=5,
            review_text="Great cause! Very happy to support.",
            is_approved=True
        )
    
    def test_list_cause_testimonials(self):
        """Test listing testimonials for a cause"""
        url = reverse('testimonials:cause-testimonials-list', 
                     kwargs={'cause_id': self.cause.id})
        response = self.client.get(url)
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data['results']), 1)
        self.assertEqual(response.data['results'][0]['rating'], 5)
    
    def test_create_testimonial_authenticated(self):
        """Test creating testimonial when authenticated"""
        self.client.force_authenticate(user=self.user2)
        
        url = reverse('testimonials:testimonial-create')
        data = {
            'cause': self.cause.id,
            'rating': 4,
            'review_text': 'Good cause, would recommend!'
        }
        response = self.client.post(url, data)
        
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Testimonial.objects.count(), 2)
        
        new_testimonial = Testimonial.objects.get(user=self.user2)
        self.assertEqual(new_testimonial.rating, 4)
        self.assertEqual(new_testimonial.review_text, 'Good cause, would recommend!')
    
    def test_create_testimonial_unauthenticated(self):
        """Test creating testimonial when not authenticated"""
        url = reverse('testimonials:testimonial-create')
        data = {
            'cause': self.cause.id,
            'rating': 4,
            'review_text': 'Good cause'
        }
        response = self.client.post(url, data)
        
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
    
    def test_create_duplicate_testimonial(self):
        """Test creating duplicate testimonial for same cause"""
        self.client.force_authenticate(user=self.user1)
        
        url = reverse('testimonials:testimonial-create')
        data = {
            'cause': self.cause.id,
            'rating': 3,
            'review_text': 'Another review'
        }
        response = self.client.post(url, data)
        
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
    
    def test_testimonial_validation(self):
        """Test testimonial validation"""
        self.client.force_authenticate(user=self.user2)
        
        url = reverse('testimonials:testimonial-create')
        
        # Test invalid rating
        data = {
            'cause': self.cause.id,
            'rating': 6,  # Invalid rating
            'review_text': 'Good cause'
        }
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        
        # Test short review
        data = {
            'cause': self.cause.id,
            'rating': 4,
            'review_text': 'Short'  # Too short
        }
        response = self.client.post(url, data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
    
    def test_toggle_testimonial_like(self):
        """Test liking and unliking testimonials"""
        self.client.force_authenticate(user=self.user2)
        
        url = reverse('testimonials:testimonial-like', 
                     kwargs={'testimonial_id': self.testimonial.id})
        
        # Like the testimonial
        response = self.client.post(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(response.data['liked'])
        self.assertEqual(response.data['likes_count'], 1)
        
        # Unlike the testimonial
        response = self.client.post(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertFalse(response.data['liked'])
        self.assertEqual(response.data['likes_count'], 0)
    
    def test_cause_testimonials_stats(self):
        """Test getting testimonial statistics for a cause"""
        # Create another testimonial
        Testimonial.objects.create(
            cause=self.cause,
            user=self.user2,
            rating=4,
            review_text="Good cause",
            is_approved=True
        )
        
        url = reverse('testimonials:cause-testimonials-stats', 
                     kwargs={'cause_id': self.cause.id})
        response = self.client.get(url)
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['total_reviews'], 2)
        self.assertEqual(response.data['average_rating'], 4.5)
        self.assertIn('rating_distribution', response.data)
        self.assertIn('featured_testimonials', response.data)


class TestimonialLikeTests(TestCase):
    """Test testimonial like functionality"""
    
    def setUp(self):
        self.user1 = User.objects.create_user(
            username='user1',
            email='user1@example.com',
            password='testpass123'
        )
        self.user2 = User.objects.create_user(
            username='user2',
            email='user2@example.com',
            password='testpass123'
        )
        self.cause = Cause.objects.create(
            name='Test Cause',
            description='A test cause',
            target_amount=1000,
            organizer_id=self.user1.id
        )
        self.testimonial = Testimonial.objects.create(
            cause=self.cause,
            user=self.user1,
            rating=5,
            review_text="Great cause!",
            is_approved=True
        )
    
    def test_create_testimonial_like(self):
        """Test creating a testimonial like"""
        like = TestimonialLike.objects.create(
            testimonial=self.testimonial,
            user=self.user2
        )
        
        self.assertEqual(like.testimonial, self.testimonial)
        self.assertEqual(like.user, self.user2)
        self.assertEqual(str(like), f"{self.user2.username} liked {self.testimonial}")
    
    def test_unique_like_per_user_per_testimonial(self):
        """Test that user can only like a testimonial once"""
        TestimonialLike.objects.create(
            testimonial=self.testimonial,
            user=self.user2
        )
        
        # Attempting to create another like should raise IntegrityError
        with self.assertRaises(Exception):
            TestimonialLike.objects.create(
                testimonial=self.testimonial,
                user=self.user2
            )


class TestimonialReportTests(TestCase):
    """Test testimonial reporting functionality"""
    
    def setUp(self):
        self.user1 = User.objects.create_user(
            username='user1',
            email='user1@example.com',
            password='testpass123'
        )
        self.user2 = User.objects.create_user(
            username='user2',
            email='user2@example.com',
            password='testpass123'
        )
        self.cause = Cause.objects.create(
            name='Test Cause',
            description='A test cause',
            target_amount=1000,
            organizer_id=self.user1.id
        )
        self.testimonial = Testimonial.objects.create(
            cause=self.cause,
            user=self.user1,
            rating=5,
            review_text="Great cause!",
            is_approved=True
        )
    
    def test_create_testimonial_report(self):
        """Test creating a testimonial report"""
        report = TestimonialReport.objects.create(
            testimonial=self.testimonial,
            reporter=self.user2,
            reason='spam',
            description='This looks like spam content'
        )
        
        self.assertEqual(report.testimonial, self.testimonial)
        self.assertEqual(report.reporter, self.user2)
        self.assertEqual(report.reason, 'spam')
        self.assertFalse(report.is_resolved)
        self.assertEqual(str(report), f"Report by {self.user2.username} for {self.testimonial}")
    
    def test_unique_report_per_user_per_testimonial(self):
        """Test that user can only report a testimonial once"""
        TestimonialReport.objects.create(
            testimonial=self.testimonial,
            reporter=self.user2,
            reason='spam',
            description='Spam content'
        )
        
        # Attempting to create another report should raise IntegrityError
        with self.assertRaises(Exception):
            TestimonialReport.objects.create(
                testimonial=self.testimonial,
                reporter=self.user2,
                reason='offensive',
                description='Offensive content'
            )