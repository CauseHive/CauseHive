from django.core.serializers import serialize
from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions
from .models import CachedReportData
from .serializers import CachedReportDataSerializer
from django.utils import timezone
from datetime import timedelta
from .tasks import generate_fresh_report

# Create your views here.
class DashboardMetricsView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        now = timezone.now()
        one_hour_ago = now - timedelta(hours=1)

        report = CachedReportData.objects.filter(
            report_type='dashboard_metrics',
            generated_at__gte=one_hour_ago).first()

        if report:
            serializer = CachedReportDataSerializer(report)
            return Response(serializer.data['data'])
        else:
            # trigger a fresh report generation here if needed
            generate_fresh_report.delay()
            return Response({"detail": "No report data available for the last hour. Generating fresh report, please try again "}, status=status.HTTP_202_ACCEPTED)

class AdminUserListView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        # Check for recent cached user list
        now = timezone.now()
        one_hour_ago = now - timedelta(hours=1)

        report = CachedReportData.objects.filter(
            report_type='user_list',
            generated_at__gte=one_hour_ago
        ).first()

        if report:
            serializer = CachedReportDataSerializer(report)
            return Response(serializer.data['data'])
        else:
            # Trigger fresh report generation
            generate_fresh_report.delay()
            return Response(
                {"detail": "No recent data available. Generating fresh report, please try again shortly."},
                status=status.HTTP_202_ACCEPTED
            )


class AdminDonationsListView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        # Check for recent cached donations list
        now = timezone.now()
        one_hour_ago = now - timedelta(hours=1)

        report = CachedReportData.objects.filter(
            report_type='donations_list',
            generated_at__gte=one_hour_ago
        ).first()

        if report:
            serializer = CachedReportDataSerializer(report)
            return Response(serializer.data['data'])
        else:
            # Trigger fresh report generation
            generate_fresh_report.delay()
            return Response(
                {"detail": "No recent data available. Generating fresh report, please try again shortly."},
                status=status.HTTP_202_ACCEPTED
            )


class AdminCausesListView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        # Check for recent cached causes list
        now = timezone.now()
        one_hour_ago = now - timedelta(hours=1)

        report = CachedReportData.objects.filter(
            report_type='causes_list',
            generated_at__gte=one_hour_ago
        ).first()

        if report:
            serializer = CachedReportDataSerializer(report)
            return Response(serializer.data['data'])
        else:
            # Trigger fresh report generation
            generate_fresh_report.delay()
            return Response(
                {"detail": "No recent data available. Generating fresh report, please try again shortly."},
                status=status.HTTP_202_ACCEPTED
            )




class AdminPaymentsListView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        # Check for recent cached payments list
        now = timezone.now()
        one_hour_ago = now - timedelta(hours=1)

        report = CachedReportData.objects.filter(
            report_type='payments_list',
            generated_at__gte=one_hour_ago
        ).first()

        if report:
            serializer = CachedReportDataSerializer(report)
            return Response(serializer.data['data'])
        else:
            # Trigger fresh report generation
            generate_fresh_report.delay()
            return Response(
                {"detail": "No recent data available. Generating fresh report, please try again shortly."},
                status=status.HTTP_202_ACCEPTED
            )

class RefreshReportView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        """Manually trigger a fresh report generation"""
        generate_fresh_report.delay()
        return Response(
            {"detail": "Report generation started. Data will be available shortly."},
            status=status.HTTP_202_ACCEPTED
        )