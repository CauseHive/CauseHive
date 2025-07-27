from django.contrib import admin
from .models import CachedReportData

# Register your models here.
@admin.register(CachedReportData)
class CachedReportDataAdmin(admin.ModelAdmin):
    list_display = ('report_type', 'generated_at')
    search_fields = ('report_type',)