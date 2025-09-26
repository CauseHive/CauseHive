"""
Custom Admin Widgets for Enhanced UI
"""
from django import forms
from django.utils.html import format_html
from django.utils.safestring import mark_safe
from django.db.models import Count, Sum
from django.urls import reverse
import json


class ChartWidget(forms.Widget):
    """
    Custom widget for displaying charts in admin forms
    """
    def __init__(self, chart_type='bar', data_url=None, *args, **kwargs):
        self.chart_type = chart_type
        self.data_url = data_url
        super().__init__(*args, **kwargs)
    
    def render(self, name, value, attrs=None, renderer=None):
        chart_id = f"chart_{name}_{id(self)}"
        
        html = f"""
        <div id="{chart_id}" style="width: 100%; height: 300px; margin: 20px 0;">
            <canvas id="{chart_id}_canvas"></canvas>
        </div>
        <script>
        document.addEventListener('DOMContentLoaded', function() {{
            const ctx = document.getElementById('{chart_id}_canvas').getContext('2d');
            const chart = new Chart(ctx, {{
                type: '{self.chart_type}',
                data: {{
                    labels: ['Loading...'],
                    datasets: [{{
                        label: 'Data',
                        data: [0],
                        backgroundColor: 'rgba(52, 152, 219, 0.2)',
                        borderColor: 'rgba(52, 152, 219, 1)',
                        borderWidth: 1
                    }}]
                }},
                options: {{
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {{
                        y: {{
                            beginAtZero: true
                        }}
                    }}
                }}
            }});
            
            // Load data if URL provided
            {f"fetch('{self.data_url}').then(response => response.json()).then(data => {{ chart.data = data; chart.update(); }});" if self.data_url else ""}
        }});
        </script>
        """
        
        return mark_safe(html)


class ProgressBarWidget(forms.Widget):
    """
    Custom widget for displaying progress bars
    """
    def __init__(self, current_field=None, target_field=None, *args, **kwargs):
        self.current_field = current_field
        self.target_field = target_field
        super().__init__(*args, **kwargs)
    
    def render(self, name, value, attrs=None, renderer=None):
        if not value:
            return mark_safe('<div class="progress-bar">No data available</div>')
        
        # This would need to be implemented based on your specific use case
        # For now, return a simple progress bar
        return format_html(
            '<div class="progress-bar" style="width: 100%; height: 20px; background-color: #e9ecef; border-radius: 10px; overflow: hidden;">'
            '<div class="progress-fill" style="width: {}%; height: 100%; background-color: #3498db; display: flex; align-items: center; justify-content: center; color: white; font-size: 12px; font-weight: bold;">'
            '{}%</div></div>',
            75, 75  # Placeholder values
        )


class StatsWidget(forms.Widget):
    """
    Custom widget for displaying statistics cards
    """
    def __init__(self, stats_data=None, *args, **kwargs):
        self.stats_data = stats_data or {}
        super().__init__(*args, **kwargs)
    
    def render(self, name, value, attrs=None, renderer=None):
        stats_html = ""
        for stat in self.stats_data:
            stats_html += format_html(
                '<div class="stat-card" style="display: inline-block; margin: 10px; padding: 15px; background: white; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); text-align: center; min-width: 120px;">'
                '<div class="stat-title" style="font-size: 12px; color: #666; text-transform: uppercase; margin-bottom: 5px;">{}</div>'
                '<div class="stat-value" style="font-size: 24px; font-weight: bold; color: #2c3e50;">{}</div>'
                '<div class="stat-subtitle" style="font-size: 11px; color: #999;">{}</div>'
                '</div>',
                stat.get('title', ''),
                stat.get('value', 0),
                stat.get('subtitle', '')
            )
        
        return mark_safe(f'<div class="stats-container">{stats_html}</div>')


class RecentActivityWidget(forms.Widget):
    """
    Custom widget for displaying recent activity feed
    """
    def __init__(self, activities=None, *args, **kwargs):
        self.activities = activities or []
        super().__init__(*args, **kwargs)
    
    def render(self, name, value, attrs=None, renderer=None):
        activities_html = ""
        for activity in self.activities[:5]:  # Show only last 5
            activities_html += format_html(
                '<div class="activity-item" style="padding: 10px 0; border-bottom: 1px solid #eee; display: flex; align-items: center;">'
                '<div class="activity-icon" style="font-size: 1.5em; margin-right: 15px; width: 30px; text-align: center;">{}</div>'
                '<div class="activity-content" style="flex: 1;">'
                '<div style="font-weight: 500; color: #333;">{}</div>'
                '<div style="font-size: 12px; color: #666; margin-top: 2px;">{}</div>'
                '</div>'
                '</div>',
                activity.get('icon', '📝'),
                activity.get('description', ''),
                activity.get('time', '')
            )
        
        return mark_safe(f'<div class="activity-feed">{activities_html}</div>')


class CustomAdminForm(forms.ModelForm):
    """
    Base form class with custom widgets for admin
    """
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        # Add custom styling to all fields
        for field_name, field in self.fields.items():
            if hasattr(field.widget, 'attrs'):
                field.widget.attrs.update({
                    'class': 'form-control',
                    'style': 'border-radius: 6px; border: 1px solid #dee2e6; padding: 10px;'
                })
    
    class Media:
        css = {
            'all': ('admin/css/custom_admin.css',)
        }
        js = ('admin/js/custom_admin.js',)
