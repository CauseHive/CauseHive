from celery import shared_task
from .models import CachedReportData
from .utils import fetch_admin_data
from django.utils import timezone

@shared_task
def generate_fresh_report():
    try:
        # Fetch users and donations stats
        users = fetch_admin_data('http://localhost:8000/user/admin-see/users/')
        donations_stats = fetch_admin_data('http://localhost:8002/donations/admin/donations/statistics/')

        # Fetch causes (handle paginated or non-paginated)
        causes_data = fetch_admin_data('http://localhost:8001/causes/admin/causes/')
        if isinstance(causes_data, dict) and 'results' in causes_data:
            causes_list = causes_data['results']
            causes_count = causes_data.get('count', len(causes_list))
        else:
            causes_list = causes_data
            causes_count = len(causes_list)

        # Fetch payments (handle paginated or non-paginated)
        payments_data = fetch_admin_data('http://localhost:8002/payments/admin/transactions/')
        if isinstance(payments_data, dict) and 'results' in payments_data:
            payments_list = payments_data['results']
            payments_count = payments_data.get('count', len(payments_list))
        else:
            payments_list = payments_data
            payments_count = len(payments_list)

        # Save dashboard metrics (with full lists and counts)
        CachedReportData.objects.create(
            report_type='dashboard_metrics',
            data={
                'users': users,
                'donations': donations_stats,
                'causes_list': causes_list,
                'causes_count': causes_count,
                'payments_list': payments_list,
                'payments_count': payments_count,
                'generated_at': timezone.now().isoformat()
            },
            generated_at=timezone.now()
        )

        # Save users list
        CachedReportData.objects.create(
            report_type='users_list',
            data=users,
            generated_at=timezone.now()
        )

        # Save donations list
        donations_list = fetch_admin_data('http://localhost:8002/donations/admin/donations/')
        CachedReportData.objects.create(
            report_type='donations_list',
            data=donations_list,
            generated_at=timezone.now()
        )

        # Save causes list
        CachedReportData.objects.create(
            report_type='causes_list',
            data=causes_list,
            generated_at=timezone.now()
        )

        # Save payments list
        CachedReportData.objects.create(
            report_type='payments_list',
            data=payments_list,
            generated_at=timezone.now()
        )

        print("Fresh report generated successfully")

    except Exception as e:
        print(f"Error generating fresh report: {e}")