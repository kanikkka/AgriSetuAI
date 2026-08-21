from datetime import datetime

def evaluate_cash_need_mode(days_needed: int, farmer_qty: float, best_buyer_price: float,
                            mandi_spot_price: float, forecasted_14d_price: float,
                            storage_cost_monthly_qtl: float = 45.0) -> dict:
    """
    Evaluates realistic selling options strictly without fabricated promises.
    """
    confirmed_now_val = best_buyer_price if best_buyer_price > 0 else mandi_spot_price
    
    if days_needed <= 3:
        if best_buyer_price >= mandi_spot_price and best_buyer_price > 0:
            return {
                "decision": "SELL NOW TO CONFIRMED BUYER",
                "timeline": f"Within {days_needed} day(s)",
                "liquidity_speed": "Immediate Payment",
                "gross_realization_rate": best_buyer_price,
                "total_estimated_value": round(best_buyer_price * farmer_qty, 2),
                "rationale": f"Based on your urgent requirement ({days_needed} days) and active buyer quotes, selling now provides confirmed liquidity with zero storage charge."
            }
        else:
            return {
                "decision": "SELL NOW AT LOCAL APMC MANDI",
                "timeline": "Today",
                "liquidity_speed": "Same-day Mandi Settlement",
                "gross_realization_rate": mandi_spot_price,
                "total_estimated_value": round(mandi_spot_price * farmer_qty, 2),
                "rationale": "Direct mandi sale gives the fastest settlement when buyer contracts are not ready."
            }
    elif days_needed <= 7:
        return {
            "decision": "COLLECTIVE SELL VIA VIRTUAL LOT",
            "timeline": "5–7 Days",
            "liquidity_speed": "Standard Escrow Settlement",
            "gross_realization_rate": max(best_buyer_price, mandi_spot_price + 80.0),
            "total_estimated_value": round(max(best_buyer_price, mandi_spot_price + 80.0) * farmer_qty, 2),
            "rationale": "7 days allows enough time to aggregate with nearby lots for bulk buyer price bargaining."
        }
    else: # 15 to 30 days
        net_forecasted = forecasted_14d_price - storage_cost_monthly_qtl
        if net_forecasted > confirmed_now_val:
            return {
                "decision": "STORE IN WDRA GODOWN & SELL LATER",
                "timeline": f"{days_needed} Days",
                "liquidity_speed": "Deferred (e-NWR 75% loan available)",
                "gross_realization_rate": forecasted_14d_price,
                "net_after_storage_rate": net_forecasted,
                "total_estimated_value": round(net_forecasted * farmer_qty, 2),
                "rationale": f"AI price forecast projects higher realizations (+₹{round(net_forecasted - confirmed_now_val, 1)}/Qtl after ₹{storage_cost_monthly_qtl} warehouse rent)."
            }
        else:
            return {
                "decision": "SELL NOW (STORAGE GAIN UNLIKELY)",
                "timeline": "Immediate",
                "liquidity_speed": "Fast",
                "gross_realization_rate": confirmed_now_val,
                "total_estimated_value": round(confirmed_now_val * farmer_qty, 2),
                "rationale": "Expected price surge does not offset holding costs and shrinkage risks."
            }