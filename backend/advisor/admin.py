from django.contrib import admin
from .models import Lead

@admin.register(Lead)
class LeadAdmin(admin.ModelAdmin):
    list_display = ('email', 'business_type', 'calculated_annual_leak', 'lead_score_tag', 'created_at')
    list_filter = ('business_type', 'lead_score_tag', 'created_at')
    search_fields = ('email', 'business_type')
    readonly_fields = ('created_at',)
