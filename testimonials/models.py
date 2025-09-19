from django.db import models
from django.contrib.auth.models import User
from django.core.validators import MinValueValidator, MaxValueValidator
from causes.models import Cause


class Testimonial(models.Model):
    """Model for user testimonials/reviews for causes"""
    
    # Core fields
    cause = models.ForeignKey(
        Cause, 
        on_delete=models.CASCADE, 
        related_name='testimonials',
        help_text="The cause this testimonial is for"
    )
    user = models.ForeignKey(
        User, 
        on_delete=models.CASCADE, 
        related_name='testimonials',
        help_text="The user who wrote this testimonial"
    )
    
    # Content fields
    rating = models.IntegerField(
        validators=[MinValueValidator(1), MaxValueValidator(5)],
        help_text="Rating from 1 to 5 stars"
    )
    review_text = models.TextField(
        max_length=1000,
        help_text="The review/testimonial text"
    )
    
    # Moderation fields
    is_approved = models.BooleanField(
        default=True,
        help_text="Whether this testimonial is approved for display"
    )
    is_featured = models.BooleanField(
        default=False,
        help_text="Whether this testimonial should be featured"
    )
    moderation_notes = models.TextField(
        blank=True,
        null=True,
        help_text="Internal notes for moderation"
    )
    
    # Metadata fields
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    # Verification fields
    is_verified_donation = models.BooleanField(
        default=False,
        help_text="Whether this user has made a verified donation to this cause"
    )
    
    class Meta:
        db_table = 'testimonials_testimonial'
        verbose_name = 'Testimonial'
        verbose_name_plural = 'Testimonials'
        ordering = ['-created_at']
        unique_together = ['cause', 'user']  # One testimonial per user per cause
        indexes = [
            models.Index(fields=['cause', '-created_at']),
            models.Index(fields=['user', '-created_at']),
            models.Index(fields=['is_approved', '-created_at']),
            models.Index(fields=['rating', '-created_at']),
        ]
    
    def __str__(self):
        return f"{self.user.username} - {self.cause.name} ({self.rating}/5)"
    
    @property
    def user_name(self):
        """Get user's display name"""
        if hasattr(self.user, 'profile') and self.user.profile.display_name:
            return self.user.profile.display_name
        return f"{self.user.first_name} {self.user.last_name}".strip() or self.user.username
    
    def save(self, *args, **kwargs):
        # Auto-approve testimonials (can be changed later for moderation)
        if self.pk is None:  # New testimonial
            self.is_approved = True
        super().save(*args, **kwargs)


class TestimonialLike(models.Model):
    """Model for tracking likes on testimonials"""
    
    testimonial = models.ForeignKey(
        Testimonial,
        on_delete=models.CASCADE,
        related_name='likes',
        help_text="The testimonial being liked"
    )
    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='testimonial_likes',
        help_text="The user who liked this testimonial"
    )
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'testimonials_testimonial_like'
        verbose_name = 'Testimonial Like'
        verbose_name_plural = 'Testimonial Likes'
        unique_together = ['testimonial', 'user']  # One like per user per testimonial
        indexes = [
            models.Index(fields=['testimonial', '-created_at']),
            models.Index(fields=['user', '-created_at']),
        ]
    
    def __str__(self):
        return f"{self.user.username} liked {self.testimonial}"


class TestimonialReport(models.Model):
    """Model for reporting inappropriate testimonials"""
    
    REPORT_REASONS = [
        ('spam', 'Spam'),
        ('inappropriate', 'Inappropriate Content'),
        ('offensive', 'Offensive Language'),
        ('fake', 'Fake Review'),
        ('other', 'Other'),
    ]
    
    testimonial = models.ForeignKey(
        Testimonial,
        on_delete=models.CASCADE,
        related_name='reports',
        help_text="The testimonial being reported"
    )
    reporter = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='testimonial_reports',
        help_text="The user who reported this testimonial"
    )
    reason = models.CharField(
        max_length=20,
        choices=REPORT_REASONS,
        help_text="Reason for reporting"
    )
    description = models.TextField(
        max_length=500,
        blank=True,
        help_text="Additional details about the report"
    )
    
    # Resolution fields
    is_resolved = models.BooleanField(
        default=False,
        help_text="Whether this report has been resolved"
    )
    resolution_notes = models.TextField(
        blank=True,
        null=True,
        help_text="Notes about how this report was resolved"
    )
    resolved_by = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='resolved_testimonial_reports',
        help_text="The admin who resolved this report"
    )
    resolved_at = models.DateTimeField(
        null=True,
        blank=True,
        help_text="When this report was resolved"
    )
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'testimonials_testimonial_report'
        verbose_name = 'Testimonial Report'
        verbose_name_plural = 'Testimonial Reports'
        ordering = ['-created_at']
        unique_together = ['testimonial', 'reporter']  # One report per user per testimonial
        indexes = [
            models.Index(fields=['testimonial', '-created_at']),
            models.Index(fields=['is_resolved', '-created_at']),
        ]
    
    def __str__(self):
        return f"Report by {self.reporter.username} for {self.testimonial}"