
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .state_machine import StateMachine
import os
import json
from django.conf import settings
from datetime import datetime

from .models import Lead

import requests

def get_client_ip(request):
    x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
    if x_forwarded_for:
        ip = x_forwarded_for.split(',')[0]
    else:
        ip = request.META.get('REMOTE_ADDR')
    return ip

def get_location_from_ip(ip):
    try:
        # Using ip-api.com (Free for non-commercial, 45 req/min)
        # Note: Free tier is HTTP only
        response = requests.get(f'http://ip-api.com/json/{ip}')
        if response.status_code == 200:
            return response.json()
    except Exception as e:
        print(f"Error getting location for IP {ip}: {e}")
    return {}

def save_lead(lead_data, lead_id=None, request=None):
    try:
        if lead_id:
            lead = Lead.objects.get(id=lead_id)
            # Update fields
            for key, value in lead_data.items():
                if hasattr(lead, key):
                    setattr(lead, key, value)
            lead.save()
            return lead.id
        else:
            # New lead creation
            ip_address = None
            location_data = {}
            
            if request:
                ip_address = get_client_ip(request)
                if ip_address:
                    # For local testing, use a public IP if local IP is detected
                    if ip_address == '127.0.0.1':
                         # Use a dummy public IP for testing (e.g., Google DNS) to verify API works
                         # In production, this block should be removed or handled differently
                         # location_data = get_location_from_ip('8.8.8.8') 
                         pass
                    else:
                        location_data = get_location_from_ip(ip_address)

            lead = Lead.objects.create(
                lead_source=lead_data.get('lead_source', 'ProfitAdvisor_Chatbot'),
                business_type=lead_data.get('business_type'),
                third_party_apps=lead_data.get('third_party_apps', []),
                email=lead_data.get('email', ''), # Allow empty email initially
                aov=lead_data.get('aov'),
                monthly_orders=lead_data.get('monthly_orders'),
                commission_rate=lead_data.get('commission_rate'),
                monthly_fixed_fee=lead_data.get('monthly_fixed_fee'),
                calculated_annual_leak=lead_data.get('calculated_annual_leak'),
                estimated_recovery=lead_data.get('estimated_recovery'),
                lead_score_tag=lead_data.get('lead_score_tag'),
                
                # Location Data
                ip_address=ip_address,
                city=location_data.get('city'),
                region=location_data.get('regionName'),
                country=location_data.get('country'),
                country_code=location_data.get('countryCode')
            )
            return lead.id
    except Exception as e:
        print(f"Error saving lead to DB: {e}")
        return None

class ChatView(APIView):
    def post(self, request):
        current_state = request.data.get('current_state', 'intro')
        user_input = request.data.get('user_input')
        data = request.data.get('data', {})

        # Get lead_id from data if it exists
        lead_id = data.get('lead_id')

        # Initialize state machine
        sm = StateMachine(current_state=current_state, data=data)

        if user_input is None and current_state == 'intro':
            # Initial load - just return the prompt, do NOT create a lead yet
            return Response({
                'state': 'intro',
                'prompt': sm.get_prompt(),
                'input_type': sm.STATES['intro']['input_type'],
                'data': data
            })

        # Process input
        result = sm.process_input(user_input)

        if not result['valid']:
            return Response({
                'valid': False,
                'message': result['message'],
                'state': result['state'],
                'prompt': sm.get_prompt(), # Return same prompt
                'input_type': sm.STATES[result['state']]['input_type'],
                'data': data
            })

        # Save progress
        # Extract data to save from result['data']
        # We need to map the flat data structure to our model fields
        lead_data_to_save = {
            'business_type': result['data'].get('business_type'),
            'third_party_apps': result['data'].get('third_party_apps'),
            'email': result['data'].get('email'),
            'aov': result['data'].get('aov'),
            'monthly_orders': result['data'].get('orders'),
            'commission_rate': result['data'].get('commission'),
            'monthly_fixed_fee': result['data'].get('monthly_fixed_fee'),
        }
        
        # If we have a result, add those fields too
        if 'result' in result and 'crm_payload' in result['result']:
             payload = result['result']['crm_payload']
             lead_data_to_save.update({
                 'calculated_annual_leak': payload.get('calculated_annual_leak'),
                 'estimated_recovery': payload.get('estimated_recovery'),
                 'lead_score_tag': payload.get('lead_score_tag'),
                 'is_completed': True
             })

        # Save and get/keep lead_id
        lead_id = save_lead(lead_data_to_save, lead_id=lead_id, request=request)
        result['data']['lead_id'] = lead_id

        # If valid, get next prompt (unless it's the result state)
        response_data = {
            'valid': True,
            'state': result['state'],
            'data': result['data'],
            'input_type': sm.STATES[result['state']]['input_type']
        }

        if result['state'] == 'result':
            response_data['result'] = result['result']
            # No prompt needed for result state as UI handles it, but we can send a completion message
            response_data['prompt'] = "Calculation complete."
            
            # Auto-save the lead (already done above with is_completed=True)
                
        else:
            response_data['prompt'] = sm.get_next_prompt()
            if 'options' in sm.STATES[result['state']]:
                response_data['options'] = sm.STATES[result['state']]['options']

        return Response(response_data)

class LeadView(APIView):
    def post(self, request):
        lead_data = request.data
        lead_id = lead_data.get('lead_id')
        
        if lead_id:
            try:
                lead = Lead.objects.get(id=lead_id)
                lead.consultation_requested = True
                lead.save()
                return Response({
                    "status": "success",
                    "message": "Lead updated with consultation request",
                    "lead_id": lead.id
                })
            except Lead.DoesNotExist:
                return Response({
                    "status": "error",
                    "message": "Lead not found"
                }, status=status.HTTP_404_NOT_FOUND)
        else:
            # Do NOT create a new lead here.
            # If lead_id is missing, it means something went wrong in the flow,
            # but we respect the user's wish to not create duplicates.
            return Response({
                "status": "ignored",
                "message": "No lead_id provided, ignoring request to avoid duplicate."
            })
