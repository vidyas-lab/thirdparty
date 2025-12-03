
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
            "next": "business_type",
            "prompt": "Welcome! I'm your ProfitAdvisor AI. I specialize in quantifying the hidden costs of third-party apps. Ready to see your Annual Profit Leak?",
            "input_type": "button",
            "validation": lambda x: True
        },
        "business_type": {
            "next": "aov",
            "prompt": "To better tailor your analysis, what best describes your primary business type?",
            "input_type": "select_button",
            "options": ["QSR", "Fast Casual", "Full Service", "Other"],
            "validation": lambda x: x in ["QSR", "Fast Casual", "Full Service", "Other"]
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
            "next": "fixed_fees",
            "prompt": "We need the primary pain point: What is the estimated commission rate you pay (e.g., 25, 30)? Please enter as a whole number (%).",
            "input_type": "numeric_float",
            "validation": lambda x: 0 < float(x) <= 100
        },
        "fixed_fees": {
            "next": "third_party_apps",
            "prompt": "Great point! We must include hidden fees. Do you pay any monthly fixed platform fees (e.g., subscription, marketing fee) to third-party apps? (e.g., 100)",
            "input_type": "numeric_float",
            "validation": lambda x: float(x) >= 0
        },
        "third_party_apps": {
            "next": "email",
            "prompt": "Got it. Which third-party delivery apps do you currently use?",
            "input_type": "multi_select",
            "options": ["DoorDash", "Uber Eats", "Grubhub", "SkipTheDishes/Other"],
            "validation": lambda x: len(x) > 0
        },
        "email": {
            "next": "result",
            "prompt": "Great! I have all the numbers. To generate and email you the full Profit Recovery Report with the breakdown, what is your email address?",
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
        if self.current_state == "business_type":
            self.data["business_type"] = user_input
        elif self.current_state == "aov":
            self.data["aov"] = float(user_input)
        elif self.current_state == "orders":
            self.data["orders"] = int(user_input)
        elif self.current_state == "commission":
            self.data["commission"] = float(user_input)
        elif self.current_state == "fixed_fees":
            self.data["monthly_fixed_fee"] = float(user_input)
        elif self.current_state == "third_party_apps":
            self.data["third_party_apps"] = user_input
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
                self.data["commission"],
                self.data.get("monthly_fixed_fee", 0)
            )
            lead_score = get_lead_score(metrics["total_annual_leak"])
            
            crm_payload = {
                "lead_source": "ProfitAdvisor_Chatbot",
                "lead_id": self.data.get("lead_id"),
                "business_type": self.data.get("business_type"),
                "third_party_apps": self.data.get("third_party_apps"),
                "email": self.data.get("email"),
                "aov": self.data.get("aov"),
                "monthly_orders": self.data.get("orders"),
                "commission_rate": self.data.get("commission"),
                "monthly_fixed_fee": self.data.get("monthly_fixed_fee"),
                "calculated_annual_leak": metrics["total_annual_leak"],
                "estimated_recovery": metrics["recovery_amount"],
                "lead_score_tag": lead_score
            }

            # Calculate percentages
            total = metrics["total_annual_leak"]
            breakdown = {}
            
            if total > 0:
                breakdown = {
                    "commission_loss": {
                        "value": metrics["annual_commission_loss"],
                        "percentage": (metrics["annual_commission_loss"] / total) * 100,
                        "formatted": f"${metrics['annual_commission_loss']:,.0f}"
                    },
                    "payment_fee_leak": {
                        "value": metrics["annual_payment_fee_leak"],
                        "percentage": (metrics["annual_payment_fee_leak"] / total) * 100,
                        "formatted": f"${metrics['annual_payment_fee_leak']:,.0f}"
                    },
                    "fixed_fee_loss": {
                        "value": metrics["annual_fixed_fee_loss"],
                        "percentage": (metrics["annual_fixed_fee_loss"] / total) * 100,
                        "formatted": f"${metrics['annual_fixed_fee_loss']:,.0f}"
                    },
                    "lost_customer_value": {
                        "value": metrics["lclv"],
                        "percentage": (metrics["lclv"] / total) * 100,
                        "formatted": f"${metrics['lclv']:,.0f}"
                    }
                }

            return {
                "valid": True,
                "state": self.current_state,
                "data": self.data,
                "result": {
                    "formatted_leak": f"${metrics['total_annual_leak']:,.0f}",
                    "formatted_recovery": f"${metrics['recovery_amount']:,.0f}",
                    "lead_score": lead_score,
                    "breakdown": breakdown,
                    "crm_payload": crm_payload
                }
            }
            
        return response

    def get_next_prompt(self):
        return self.STATES[self.current_state]["prompt"]
