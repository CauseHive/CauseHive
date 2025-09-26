"""
Custom Django Admin Dashboard
"""
from django.contrib import admin
from django.urls import path
from django.shortcuts import render
from django.db.models import Count, Sum, Q
from django.utils import timezone
from datetime import timedelta
from django.contrib.admin.views.main import ChangeList
from django.contrib.admin import AdminSite

class CauseHiveAdminSite(AdminSite):
    site_header = "CauseHive Administration"
    site_title = "CauseHive Admin"
    index_title = "Dashboard"
    
    def index(self, request, extra_context=None):
        """
        Custom admin dashboard with statistics
        """
        extra_context = extra_context or {}
        
        # Get statistics
        from users_n_auth.models import User
        from causes.models import Causes
        from donations.models import Donation
        from cart.models import Cart
        from payments.models import PaymentTransaction
        
        # User statistics
        total_users = User.objects.count()
        active_users = User.objects.filter(is_active=True).count()
        new_users_today = User.objects.filter(date_joined__date=timezone.now().date()).count()
        new_users_this_week = User.objects.filter(
            date_joined__gte=timezone.now() - timedelta(days=7)
        ).count()
        
        # Cause statistics
        total_causes = Causes.objects.count()
        active_causes = Causes.objects.filter(status='ongoing').count()
        approved_causes = Causes.objects.filter(status='approved').count()
        pending_causes = Causes.objects.filter(status='under_review').count()
        
        # Donation statistics
        total_donations = Donation.objects.count()
        completed_donations = Donation.objects.filter(status='completed').count()
        total_donated_amount = Donation.objects.filter(status='completed').aggregate(
            total=Sum('amount')
        )['total'] or 0
        
        # Recent activity
        recent_donations = Donation.objects.select_related('user_id', 'cause_id').order_by('-donated_at')[:5]
        recent_causes = Causes.objects.select_related('organizer_id', 'category').order_by('-created_at')[:5]
        recent_users = User.objects.order_by('-date_joined')[:5]
        
        # Cart statistics
        active_carts = Cart.objects.filter(status='active').count()
        completed_carts = Cart.objects.filter(status='completed').count()
        
        # Payment statistics
        total_payments = PaymentTransaction.objects.count()
        completed_payments = PaymentTransaction.objects.filter(status='completed').count()
        pending_payments = PaymentTransaction.objects.filter(status='pending').count()
        
        extra_context.update({
            'total_users': total_users,
            'active_users': active_users,
            'new_users_today': new_users_today,
            'new_users_this_week': new_users_this_week,
            'total_causes': total_causes,
            'active_causes': active_causes,
            'approved_causes': approved_causes,
            'pending_causes': pending_causes,
            'total_donations': total_donations,
            'completed_donations': completed_donations,
            'total_donated_amount': total_donated_amount,
            'recent_donations': recent_donations,
            'recent_causes': recent_causes,
            'recent_users': recent_users,
            'active_carts': active_carts,
            'completed_carts': completed_carts,
            'total_payments': total_payments,
            'completed_payments': completed_payments,
            'pending_payments': pending_payments,
        })
        
        return super().index(request, extra_context)

# Create custom admin site instance
admin_site = CauseHiveAdminSite(name='causehive_admin')
