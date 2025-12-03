from django.db import models

class Lead(models.Model):
    lead_source = models.CharField(max_length=100, default="ProfitAdvisor_Chatbot")
    business_type = models.CharField(max_length=100, null=True, blank=True)
    third_party_apps = models.JSONField(default=list, null=True, blank=True)
    email = models.EmailField(max_length=254, null=True, blank=True)
    aov = models.FloatField(null=True, blank=True)
    monthly_orders = models.IntegerField(null=True, blank=True)
    commission_rate = models.FloatField(null=True, blank=True)
    monthly_fixed_fee = models.FloatField(null=True, blank=True)
    calculated_annual_leak = models.FloatField(null=True, blank=True)
    estimated_recovery = models.FloatField(null=True, blank=True)
    lead_score_tag = models.CharField(max_length=50, null=True, blank=True)
    
    # Location Data
    ip_address = models.GenericIPAddressField(null=True, blank=True)
    city = models.CharField(max_length=100, null=True, blank=True)
    region = models.CharField(max_length=100, null=True, blank=True)
    country = models.CharField(max_length=100, null=True, blank=True)
    country_code = models.CharField(max_length=10, null=True, blank=True)

    is_completed = models.BooleanField(default=False)
    consultation_requested = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.email} - {self.created_at}"
