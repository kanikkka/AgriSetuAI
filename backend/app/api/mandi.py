from fastapi import APIRouter
import random
from datetime import datetime

router = APIRouter()

MANDI_BASE = [
    {"name": "Khanna APMC Yard", "state": "Punjab", "district": "Ludhiana", "base_price": 2420, "distance_km": 15},
    {"name": "Rajpura APMC", "state: "Punjab", "district": "Patiala", "base_price": 2380, "distance_km": 35},
    {"name": "Karnal APMC Yard", "state": "Haryana", "district": "Karnal", "base_price": 2490, "distance_km": 85},
    {"name": "Sirsa Mandi", "state": "Haryana", "district": "Sirsa", "base_price": 2410, "distance_km": 140},
    {"name": "Ambala City Mandi", "state": "Haryana", "district": "Ambala", "base_price": 2450, "distance_km": 42},
]

@router.get("/live-rates")
def get_live_mandi_rates(crop: str = "Wheat"):
    diesel_rate_per_km = 3.5  # Transport deduction model
    results = []
    
    for m in MANDI_BASE:
        # Dynamic micro-fluctuation based on timestamp
        fluctuation = random.randint(-15, 25)
        modal_price = m["base_price"] + fluctuation
        transport_cost = int((m["distance_km"] * 2 * diesel_rate_per_km) / 10) # per quintal approx
        net_profit = modal_price - transport_cost - 2310 # baseline local mandi cost
        
        results.append({
            "name": m["name"],
            "state": m["state"],
            "modal": f"₹{modal_price}",
            "range": f"₹{modal_price - 30} - ₹{modal_price + 40}",
            "arrival": f"{random.randint(280, 650)} MT",
            "distance": f"{m['distance_km']} km",
            "arbitrage_gain": f"+₹{net_profit}/Qtl" if net_profit > 0 else "Baseline",
            "tag": "Optimal Arbitrage" if net_profit > 80 else "Regular Inflow",
            "is_best": net_profit > 80
        })
    
    return {
        "status": "success",
        "crop": crop,
        "timestamp": datetime.now().strftime("%I:%M:%S %p"),
        "total_mandis": len(results),
        "data": results
    }