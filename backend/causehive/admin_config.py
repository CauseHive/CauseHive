"""
Advanced Django Admin Customizations for CauseHive
"""
from django.contrib import admin
from django.contrib.admin import AdminSite
from django.utils.html import format_html
from django.urls import path, reverse
from django.shortcuts import render, redirect
from django.contrib import messages
from django.db.models import Count, Sum, Q
from django.utils import timezone
from datetime import timedelta
import csv
from django.http import HttpResponse

class CauseHiveAdminSite(AdminSite):
    site_header = "🎯 CauseHive Administration"
    site_title = "CauseHive Admin"
    index_title = "📊 Dashboard & Analytics"
    
    def get_urls(self):
        urls = super().get_urls()
        custom_urls = [
            path('analytics/', self.admin_view(self.analytics_view), name='analytics'),
            path('export/users/', self.admin_view(self.export_users), name='export_users'),
            path('export/causes/', self.admin_view(self.export_causes), name='export_causes'),
            path('export/donations/', self.admin_view(self.export_donations), name='export_donations'),
        ]
        return custom_urls + urls
    
    def index(self, request, extra_context=None):
        """
        Enhanced admin dashboard with comprehensive statistics
        """
        extra_context = extra_context or {}
        
        # Import models
        from users_n_auth.models import User
        from causes.models import Causes
        from donations.models import Donation
        from cart.models import Cart
        from payments.models import PaymentTransaction
        
        # User analytics
        user_stats = {
            'total': User.objects.count(),
            'active': User.objects.filter(is_active=True).count(),
            'new_today': User.objects.filter(date_joined__date=timezone.now().date()).count(),
            'new_week': User.objects.filter(date_joined__gte=timezone.now() - timedelta(days=7)).count(),
            'new_month': User.objects.filter(date_joined__gte=timezone.now() - timedelta(days=30)).count(),
        }
        
        # Cause analytics
        cause_stats = {
            'total': Causes.objects.count(),
            'active': Causes.objects.filter(status='ongoing').count(),
            'approved': Causes.objects.filter(status='approved').count(),
            'pending': Causes.objects.filter(status='under_review').count(),
            'completed': Causes.objects.filter(status='completed').count(),
            'rejected': Causes.objects.filter(status='rejected').count(),
        }
        
        # Donation analytics
        donation_stats = Donation.objects.filter(status='completed').aggregate(
            total_count=Count('id'),
            total_amount=Sum('amount')
        )
        if donation_stats['total_count'] > 0:
            donation_stats['avg_amount'] = donation_stats['total_amount'] / donation_stats['total_count']
        else:
            donation_stats['avg_amount'] = 0
        
        # Recent activity
        recent_activity = {
            'donations': Donation.objects.select_related('user_id', 'cause_id').order_by('-donated_at')[:10],
            'causes': Causes.objects.select_related('organizer_id', 'category').order_by('-created_at')[:10],
            'users': User.objects.order_by('-date_joined')[:10],
        }
        
        # Top performers
        top_causes = Causes.objects.annotate(
            donation_count=Count('donation')
        ).order_by('-donation_count')[:5]
        
        top_donors = User.objects.annotate(
            donation_count=Count('donation')
        ).filter(donation_count__gt=0).order_by('-donation_count')[:5]
        
        extra_context.update({
            'user_stats': user_stats,
            'cause_stats': cause_stats,
            'donation_stats': donation_stats,
            'recent_activity': recent_activity,
            'top_causes': top_causes,
            'top_donors': top_donors,
        })
        
        return super().index(request, extra_context)
    
    def analytics_view(self, request):
        """
        Advanced analytics view with charts and detailed statistics
        """
        from users_n_auth.models import User
        from causes.models import Causes
        from donations.models import Donation
        
        # Time-based analytics
        last_30_days = timezone.now() - timedelta(days=30)
        
        # User growth over time
        user_growth = []
        for i in range(30):
            date = timezone.now() - timedelta(days=i)
            count = User.objects.filter(date_joined__date=date.date()).count()
            user_growth.append({'date': date.strftime('%Y-%m-%d'), 'count': count})
        
        # Donation trends
        donation_trends = []
        for i in range(30):
            date = timezone.now() - timedelta(days=i)
            amount = Donation.objects.filter(
                donated_at__date=date.date(),
                status='completed'
            ).aggregate(total=Sum('amount'))['total'] or 0
            donation_trends.append({'date': date.strftime('%Y-%m-%d'), 'amount': float(amount)})
        
        context = {
            'user_growth': user_growth,
            'donation_trends': donation_trends,
        }
        
        return render(request, 'admin/analytics.html', context)
    
    def export_users(self, request):
        """
        Export users data to CSV
        """
        from users_n_auth.models import User
        
        response = HttpResponse(content_type='text/csv')
        response['Content-Disposition'] = 'attachment; filename="users_export.csv"'
        
        writer = csv.writer(response)
        writer.writerow(['ID', 'Email', 'First Name', 'Last Name', 'Is Active', 'Date Joined', 'Last Login'])
        
        for user in User.objects.all():
            writer.writerow([
                user.id,
                user.email,
                user.first_name,
                user.last_name,
                user.is_active,
                user.date_joined,
                user.last_login,
            ])
        
        return response
    
    def export_causes(self, request):
        """
        Export causes data to CSV
        """
        from causes.models import Causes
        
        response = HttpResponse(content_type='text/csv')
        response['Content-Disposition'] = 'attachment; filename="causes_export.csv"'
        
        writer = csv.writer(response)
        writer.writerow(['ID', 'Name', 'Category', 'Organizer', 'Status', 'Target Amount', 'Current Amount', 'Created At'])
        
        for cause in Causes.objects.select_related('category', 'organizer_id').all():
            writer.writerow([
                cause.id,
                cause.name,
                cause.category.name,
                cause.organizer_id.email,
                cause.status,
                cause.target_amount,
                cause.current_amount,
                cause.created_at,
            ])
        
        return response
    
    def export_donations(self, request):
        """
        Export donations data to CSV
        """
        from donations.models import Donation
        
        response = HttpResponse(content_type='text/csv')
        response['Content-Disposition'] = 'attachment; filename="donations_export.csv"'
        
        writer = csv.writer(response)
        writer.writerow(['ID', 'Donor Email', 'Cause Name', 'Amount', 'Currency', 'Status', 'Donated At'])
        
        for donation in Donation.objects.select_related('user_id', 'cause_id').all():
            writer.writerow([
                donation.id,
                donation.user_id.email if donation.user_id else 'Anonymous',
                donation.cause_id.name,
                donation.amount,
                donation.currency,
                donation.status,
                donation.donated_at,
            ])
        
        return response

# Create custom admin site
admin_site = CauseHiveAdminSite(name='causehive_admin')
