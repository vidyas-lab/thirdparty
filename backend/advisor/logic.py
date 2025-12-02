
# Constants
TPD_FEE = 0.035  # 3.5%
APPLOVA_FEE = 0.029  # 2.9%
LTV_UPLIFT_FACTOR = 0.4  # 40% Uplift
ANNUAL_MONTHS = 12
RECOVERY_EFFICIENCY = 0.95  # 95%

def calculate_profit_leak(aov, orders, commission_rate):
    """
    Calculate the annual profit leak based on AOV, monthly orders, and commission rate.
    
    Args:
        aov (float): Average Order Value.
        orders (int): Monthly orders.
        commission_rate (float): Commission rate in percentage (e.g., 30 for 30%).
        
    Returns:
        dict: A dictionary containing the calculated metrics.
    """
    # Ensure inputs are valid numbers
    aov = float(aov)
    orders = int(orders)
    commission_rate = float(commission_rate)

    # Annual Commission Loss
    annual_commission_loss = (aov * orders * (commission_rate / 100)) * ANNUAL_MONTHS

    # Annual Payment Fee Leak
    annual_payment_fee_leak = (aov * orders * ANNUAL_MONTHS) * (TPD_FEE - APPLOVA_FEE)

    # Lost Customer Data Value (LCLV)
    lclv = (aov * orders * ANNUAL_MONTHS) * LTV_UPLIFT_FACTOR

    # Total Annual Leak
    total_annual_leak = annual_commission_loss + annual_payment_fee_leak + lclv

    # Estimated Recovery Amount
    recovery_amount = ((annual_commission_loss + annual_payment_fee_leak) * RECOVERY_EFFICIENCY) + lclv

    return {
        "annual_commission_loss": annual_commission_loss,
        "annual_payment_fee_leak": annual_payment_fee_leak,
        "lclv": lclv,
        "total_annual_leak": total_annual_leak,
        "recovery_amount": recovery_amount
    }

def get_lead_score(total_annual_leak):
    """
    Determine the lead score tag based on the total annual leak.
    
    Args:
        total_annual_leak (float): The calculated total annual leak.
        
    Returns:
        str: The lead score tag (Low, Medium, HIGH PRIORITY).
    """
    if total_annual_leak <= 20000:
        return "L-Score: Low"
    elif 20000 < total_annual_leak <= 60000:
        return "L-Score: Medium"
    else:
        return "L-Score: HIGH PRIORITY"
