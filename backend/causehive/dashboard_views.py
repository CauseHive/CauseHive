"""
Enhanced Admin Dashboard Views with Charts and Analytics
"""
from django.shortcuts import render
from django.contrib.admin.views.decorators import staff_member_required
from django.db.models import Count, Sum, Avg
from django.utils import timezone
from datetime import timedelta, datetime
from django.http import JsonResponse
import json

# Import models inside functions to avoid circular imports


@staff_member_required
def custom_admin_dashboard(request):
    """
    Custom admin dashboard with interactive charts and analytics
    """
    # Import models here to avoid circular imports
    from users_n_auth.models import User
    from causes.models import Causes
    from donations.models import Donation
    from categories.models import Category
    from payments.models import PaymentTransaction
    from withdrawal_transfer.models import WithdrawalRequest
    
    # Import notification service
    try:
        from notifications.services import NotificationService
        notifications = NotificationService.get_recent_notifications(5)
        unread_count = NotificationService.get_unread_count()
    except ImportError:
        notifications = []
        unread_count = 0
    
    # User statistics
    user_stats = {
        'total_users': User.objects.count(),
        'active_users': User.objects.filter(is_active=True).count(),
        'new_users_today': User.objects.filter(date_joined__date=timezone.now().date()).count(),
        'new_users_this_week': User.objects.filter(
            date_joined__gte=timezone.now() - timedelta(days=7)
        ).count(),
    }
    
    # Cause statistics
    cause_stats = {
        'total_causes': Causes.objects.count(),
        'approved': Causes.objects.filter(status='ongoing').count(),
        'pending': Causes.objects.filter(status='under_review').count(),
        'rejected': Causes.objects.filter(status='rejected').count(),
        'ongoing': Causes.objects.filter(status='ongoing').count(),
        'completed': Causes.objects.filter(status='completed').count(),
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
    
    context = {
        'user_stats': user_stats,
        'cause_stats': cause_stats,
        'donation_stats': donation_stats,
        'recent_activity': recent_activity,
        'top_causes': top_causes,
        'top_donors': top_donors,
        'notifications': notifications,
        'unread_count': unread_count,
    }
    
    return render(request, 'admin/dashboard.html', context)


@staff_member_required
def admin_dashboard_api(request):
    """Aggregate metrics for admin dashboard API."""
    from users_n_auth.models import User
    from causes.models import Causes
    from donations.models import Donation

    total_users = User.objects.count()
    total_causes = Causes.objects.count()
    total_donations = Donation.objects.count()
    total_amount_raised = Donation.objects.filter(status='completed').aggregate(Sum('amount'))['amount__sum'] or 0
    pending_causes = Causes.objects.filter(status='under_review').count()

    return JsonResponse({
        'total_users': total_users,
        'total_causes': total_causes,
        'total_donations': total_donations,
        'total_amount_raised': float(total_amount_raised),
        'pending_causes': pending_causes,
    })


@staff_member_required
def donation_chart_data(request):
    """
    API endpoint for donation chart data
    """
    from donations.models import Donation
    
    # Get last 6 months of data
    six_months_ago = timezone.now() - timedelta(days=180)
    
    # Group donations by month
    donations_by_month = Donation.objects.filter(
        status='completed',
        donated_at__gte=six_months_ago
    ).extra(
        select={'month': "DATE_TRUNC('month', donated_at)"}
    ).values('month').annotate(
        total_amount=Sum('amount'),
        count=Count('id')
    ).order_by('month')
    
    # Format data for Chart.js
    labels = []
    amounts = []
    counts = []
    
    for item in donations_by_month:
        month_name = item['month'].strftime('%b')
        labels.append(month_name)
        amounts.append(float(item['total_amount'] or 0))
        counts.append(item['count'])
    
    return JsonResponse({
        'labels': labels,
        'amounts': amounts,
        'counts': counts
    })


@staff_member_required
def cause_progress_data(request):
    """
    API endpoint for cause progress data
    """
    from causes.models import Causes
    
    causes = Causes.objects.annotate(
        donation_count=Count('donation'),
        total_donated=Sum('donation__amount')
    ).filter(
        donation_count__gt=0
    ).order_by('-total_donated')[:10]
    
    data = []
    for cause in causes:
        progress_percentage = (cause.current_amount / cause.target_amount * 100) if cause.target_amount > 0 else 0
        data.append({
            'name': cause.name,
            'target': float(cause.target_amount),
            'current': float(cause.current_amount),
            'progress': round(progress_percentage, 1),
            'donations': cause.donation_count
        })
    
    return JsonResponse({'causes': data})


@staff_member_required
def user_activity_data(request):
    """
    API endpoint for user activity data
    """
    from users_n_auth.models import User
    from donations.models import Donation
    
    # Get user registrations by day for last 30 days
    thirty_days_ago = timezone.now() - timedelta(days=30)
    
    user_registrations = User.objects.filter(
        date_joined__gte=thirty_days_ago
    ).extra(
        select={'day': "DATE_TRUNC('day', date_joined)"}
    ).values('day').annotate(
        count=Count('id')
    ).order_by('day')
    
    # Get donation activity by day for last 30 days
    donation_activity = Donation.objects.filter(
        donated_at__gte=thirty_days_ago,
        status='completed'
    ).extra(
        select={'day': "DATE_TRUNC('day', donated_at)"}
    ).values('day').annotate(
        count=Count('id'),
        amount=Sum('amount')
    ).order_by('day')
    
    # Format data
    labels = []
    registrations = []
    donations = []
    amounts = []
    
    # Create a complete date range
    current_date = thirty_days_ago.date()
    end_date = timezone.now().date()
    
    while current_date <= end_date:
        date_str = current_date.strftime('%Y-%m-%d')
        labels.append(current_date.strftime('%b %d'))
        
        # Find matching data
        reg_count = next((item['count'] for item in user_registrations if item['day'].date() == current_date), 0)
        don_count = next((item['count'] for item in donation_activity if item['day'].date() == current_date), 0)
        don_amount = next((float(item['amount'] or 0) for item in donation_activity if item['day'].date() == current_date), 0)
        
        registrations.append(reg_count)
        donations.append(don_count)
        amounts.append(don_amount)
        
        current_date += timedelta(days=1)
    
    return JsonResponse({
        'labels': labels,
        'registrations': registrations,
        'donations': donations,
        'amounts': amounts
    })


def platform_metrics(request):
    """Public-safe platform totals aggregated from the database.
    Returns only non-sensitive, aggregate metrics so the homepage can display real data without admin privileges.
    Accessible without authentication.
    """
    from donations.models import Donation
    from causes.models import Causes
    from categories.models import Category
    from users_n_auth.models import User
    totals = {
        'total_donations': 0,
        'total_amount': 0.0,
        'live_causes': 0,
        'categories': 0,
        'total_users': 0,
    }
    try:
        totals['total_donations'] = Donation.objects.count()
        total_amount = Donation.objects.filter(status='completed').aggregate(Sum('amount'))['amount__sum'] or 0
        totals['total_amount'] = float(total_amount)
        totals['live_causes'] = Causes.objects.filter(status='ongoing').count()
        totals['categories'] = Category.objects.count()
        totals['total_users'] = User.objects.count()
    except Exception as e:
        # Return zeros on error but with a message for observability
        return JsonResponse({ 'message': 'metrics_unavailable', **totals }, status=200)
    return JsonResponse(totals)
