# New Constant
APPLOVA_COMMISSION_RATE = 0.10 # 10% effective commission/fee rate for Applova platform

# Constants (Retained for LCLV and Annualization)
LTV_UPLIFT_FACTOR = 0.4      # 40% Uplift factor for owning customer data
ANNUAL_MONTHS = 12
RECOVERY_EFFICIENCY = 0.95   # 95% efficiency in avoiding direct costs

def calculate_profit_gain(aov, orders, commission_rate_tpd, monthly_fixed_fee_tpd):
    """
    Calculate the annual profit gain potential by switching from high TPD commission
    to a direct platform with an effective 10% fee.

    Args:
        aov (float): Average Order Value.
        orders (int): Monthly orders.
        commission_rate_tpd (float): TPD commission rate in percentage (e.g., 30 for 30%).
        monthly_fixed_fee_tpd (float): Monthly fixed platform fees paid to TPD.

    Returns:
        dict: A dictionary containing the calculated financial gain metrics.
    """
    # Ensure inputs are valid numbers
    aov = float(aov)
    orders = int(orders)
    commission_rate_tpd = float(commission_rate_tpd)
    monthly_fixed_fee_tpd = float(monthly_fixed_fee_tpd)
    
    # Calculate the TPD Commission Rate as a decimal
    tpd_commission_decimal = commission_rate_tpd / 100.0

    # 1. Annual Revenue from TPD orders (The base for calculations)
    annual_revenue = aov * orders * ANNUAL_MONTHS
    
    # 2. Commission & Fee Savings (New Core Calculation)
    # The savings is the difference between the TPD rate and the Applova rate (10%) applied to the annual revenue.
    commission_savings = (tpd_commission_decimal - APPLOVA_COMMISSION_RATE) * annual_revenue

    # 3. Fixed Fee Savings (Annualized)
    # The assumption is that these fixed TPD fees are entirely avoided.
    fixed_fee_savings = monthly_fixed_fee_tpd * ANNUAL_MONTHS
    
    # 4. Lost Customer Data Value (LCLV) Gain (Unchanged)
    # This is now framed as a "gain" because the data is recovered.
    lclv_gain = annual_revenue * LTV_UPLIFT_FACTOR

    # Total Direct Cost Savings (The money recovered from commissions and fixed fees)
    total_avoidable_costs = commission_savings + fixed_fee_savings
    
    # Estimated Profit Recovery (The Value Proposition)
    # We apply the 95% efficiency to the avoidable costs, plus 100% of the LCLV gain.
    estimated_recovery_amount = (total_avoidable_costs * RECOVERY_EFFICIENCY) + lclv_gain

    return {
        "annual_revenue_base": annual_revenue,
        "commission_fee_savings": commission_savings,
        "fixed_fee_savings": fixed_fee_savings,
        "lclv_gain": lclv_gain,
        "total_profit_gain_potential": estimated_recovery_amount
    }

def get_lead_score(total_profit_gain_potential):
    """
    Determine the lead score tag based on the total annual profit gain potential.
    
    The thresholds (20k, 60k) are maintained relative to the potential financial impact.
    """
    if total_profit_gain_potential <= 20000:
        return "L-Score: Low"
    elif 20000 < total_profit_gain_potential <= 60000:
        return "L-Score: Medium"
    else:
        return "L-Score: HIGH PRIORITY"
