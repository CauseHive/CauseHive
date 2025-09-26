from django.contrib import admin
from .models import Category

# Register your models here.
@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ('name', 'slug', 'description_preview')
    search_fields = ('name', 'description')
    prepopulated_fields = {'slug': ('name',)}
    readonly_fields = ('id', 'slug')
    
    def description_preview(self, obj):
        return obj.description[:100] + '...' if len(obj.description) > 100 else obj.description
    description_preview.short_description = "Description Preview"
    
    fieldsets = (
        ('Category Information', {
            'fields': ('name', 'description', 'slug')
        }),
        ('System Fields', {
            'fields': ('id',),
            'classes': ('collapse',)
        }),
    )
