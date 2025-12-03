
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .state_machine import StateMachine
import os
import json
from django.conf import settings
from datetime import datetime

class ChatView(APIView):
    def post(self, request):
        current_state = request.data.get('current_state', 'intro')
        user_input = request.data.get('user_input')
        data = request.data.get('data', {})

        # Initialize state machine
        sm = StateMachine(current_state=current_state, data=data)

        if user_input is None and current_state == 'intro':
            # Initial load
            return Response({
                'state': 'intro',
                'prompt': sm.get_prompt(),
                'input_type': sm.STATES['intro']['input_type'],
                'data': {}
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
        else:
            response_data['prompt'] = sm.get_next_prompt()
            if 'options' in sm.STATES[result['state']]:
                response_data['options'] = sm.STATES[result['state']]['options']

        return Response(response_data)

class LeadView(APIView):
    def post(self, request):
        lead_data = request.data
        
        # Define path to JSON file
        data_dir = os.path.join(settings.BASE_DIR, 'data')
        os.makedirs(data_dir, exist_ok=True)
        file_path = os.path.join(data_dir, 'leads.json')
        
        leads = []
        
        # Read existing data
        if os.path.exists(file_path):
            try:
                with open(file_path, 'r') as f:
                    leads = json.load(f)
            except json.JSONDecodeError:
                leads = []
        
        # Append new lead
        # Add a timestamp for better record keeping
        lead_data['timestamp'] = datetime.now().isoformat()
        leads.append(lead_data)
        
        # Write back to file
        with open(file_path, 'w') as f:
            json.dump(leads, f, indent=4)
        
        return Response({
            "status": "success",
            "message": "Lead received and saved",
            "lead_data": lead_data
        })
