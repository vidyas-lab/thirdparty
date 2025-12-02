
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .state_machine import StateMachine

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

        return Response(response_data)

class LeadView(APIView):
    def post(self, request):
        # This endpoint would handle the final CRM hand-off
        # For now, we just echo back the data as a confirmation
        lead_data = request.data
        
        # In a real app, save to DB or send to CRM here
        
        return Response({
            "status": "success",
            "message": "Lead received",
            "lead_data": lead_data
        })
