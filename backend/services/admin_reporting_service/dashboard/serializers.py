from rest_framework import serializers
from .models import CachedReportData

class CachedReportDataSerializer(serializers.ModelSerializer):
    class Meta:
        model = CachedReportData
        fields = ['id', 'report_type', 'data', 'generated_at']