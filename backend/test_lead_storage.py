import os
import django
from django.conf import settings
import json

# Configure Django settings manually if not already configured
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from django.test import RequestFactory
from advisor.views import LeadView

def test_lead_storage():
    factory = RequestFactory()
    # Updated data with business_type and third_party_apps
    data = {
        "email": "full_test@example.com", 
        "aov": 65.50, 
        "orders": 250,
        "business_type": "Fast Casual",
        "third_party_apps": ["Uber Eats", "DoorDash"],
        "commission_rate": 25,
        "monthly_fixed_fee": 50
    }
    request = factory.post('/api/lead/', data, content_type='application/json')
    
    view = LeadView.as_view()
    response = view(request)
    
    print(f"Response status: {response.status_code}")
    
    # Check if file exists and verify content
    file_path = os.path.join(settings.BASE_DIR, 'data', 'leads.json')
    if os.path.exists(file_path):
        with open(file_path, 'r') as f:
            content = json.load(f)
            latest = content[-1]
            print(f"Latest Entry: {json.dumps(latest, indent=2)}")
            
            if (latest.get('business_type') == "Fast Casual" and 
                "Uber Eats" in latest.get('third_party_apps', [])):
                print("SUCCESS: All fields including business_type and apps are stored.")
            else:
                print("FAILURE: Fields missing or incorrect.")

if __name__ == "__main__":
    test_lead_storage()
