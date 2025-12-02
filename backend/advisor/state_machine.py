
import re
import google.generativeai as genai
import os
from django.conf import settings
from .logic import calculate_profit_leak, get_lead_score

# Configure Gemini
# Note: In a real scenario, ensure GOOGLE_API_KEY is set in environment variables
if os.environ.get("GOOGLE_API_KEY"):
    genai.configure(api_key=os.environ.get("GOOGLE_API_KEY"))

class StateMachine:
    STATES = {
        "intro": {
            "next": "aov",
            "prompt": "Welcome! I'm your ProfitAdvisor AI. I specialize in quantifying the hidden costs of third-party apps. Ready to see your Annual Profit Leak?",
            "input_type": "button",
            "validation": lambda x: True # No input validation needed for start button
        },
        "aov": {
            "next": "orders",
            "prompt": "Excellent. What is your typical average order value (AOV) for third-party orders? (e.g., 35.50)",
            "input_type": "numeric_float",
            "validation": lambda x: float(x) > 0
        },
        "orders": {
            "next": "commission",
            "prompt": "Roughly, how many third-party delivery orders do you process per month? (e.g., 400)",
            "input_type": "numeric_int",
            "validation": lambda x: int(x) > 0
        },
        "commission": {
            "next": "email",
            "prompt": "We need the primary pain point: What is the estimated commission rate you pay (e.g., 25, 30)? Please enter as a whole number (%).",
            "input_type": "numeric_float",
            "validation": lambda x: 0 < float(x) <= 50
        },
        "email": {
            "next": "result",
            "prompt": "Great! I have all the numbers. To generate and email you the full Profit Recovery Report with the breakdown, what is your best email address?",
            "input_type": "email",
            "validation": lambda x: re.match(r"[^@]+@[^@]+\.[^@]+", x) is not None
        },
        "result": {
            "next": "end",
            "prompt": "Calculation complete.", # This will be overridden by the result payload
            "input_type": "none",
            "validation": lambda x: True
        }
    }

    def __init__(self, current_state="intro", data=None):
        self.current_state = current_state
        self.data = data or {}

    def get_prompt(self):
        # In a real implementation, we could use Gemini here to rephrase the prompt based on context
        # For now, we return the hardcoded prompt to ensure strict adherence to the script
        # If Gemini is required for "persona", we can wrap this.
        
        base_prompt = self.STATES[self.current_state]["prompt"]
        
        # Example of using Gemini to "maintain persona" if API key is present
        # But keeping the core message intact. 
        # For this strict flow, hardcoded is safer and faster.
        return base_prompt

    def process_input(self, user_input):
        state_config = self.STATES[self.current_state]
        
        # Validate input
        try:
            if not state_config["validation"](user_input):
                return {
                    "valid": False,
                    "message": "Invalid input. Please try again.",
                    "state": self.current_state
                }
        except ValueError:
             return {
                "valid": False,
                "message": "Invalid format. Please enter a valid number.",
                "state": self.current_state
            }

        # Update data
        if self.current_state == "aov":
            self.data["aov"] = float(user_input)
        elif self.current_state == "orders":
            self.data["orders"] = int(user_input)
        elif self.current_state == "commission":
            self.data["commission"] = float(user_input)
        elif self.current_state == "email":
            self.data["email"] = user_input

        # Transition
        next_state = state_config["next"]
        self.current_state = next_state
        
        response = {
            "valid": True,
            "state": self.current_state,
            "data": self.data
        }

        if self.current_state == "result":
            # Perform calculation
            metrics = calculate_profit_leak(
                self.data["aov"], 
                self.data["orders"], 
                self.data["commission"]
            )
            lead_score = get_lead_score(metrics["total_annual_leak"])
            
            response["result"] = {
                "metrics": metrics,
                "lead_score": lead_score,
                "formatted_leak": f"${metrics['total_annual_leak']:,.0f}",
                "formatted_recovery": f"${metrics['recovery_amount']:,.0f}"
            }
            
        return response

    def get_next_prompt(self):
        return self.STATES[self.current_state]["prompt"]
