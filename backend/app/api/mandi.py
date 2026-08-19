from fastapi import APIRouter
import random
from datetime import datetime

router = APIRouter()

MANDI_LOCATIONS = [
    {"id": "khanna", "name": "Khanna APMC Yard", "state": "Punjab", "district": "Ludhiana", "lat": 30.7072, "lng": 76.2167, "base_price": 2440, "distance_km": 15, "arrivals": "480 MT"},
    {"id": "rajpura", "name": "Rajpura APMC Yard", "state": "Punjab", "district": "Patiala", "lat": 30.4842, "lng": 76.5939, "base_price": 2380, "distance_km": 35, "arrivals": "310 MT"},
    {"id": "karnal", "name": "Karnal APMC Yard", "state": "Haryana", "district": "Karnal", "lat": 29.6857, "lng": 76.9905, "base_price": 2495, "distance_km": 85, "arrivals": "620 MT"},
    {"id": "sirsa", "name": "Sirsa Grain Market", "state": "Haryana", "district": "Sirsa", "lat": 29.5349, "lng": 75.0298, "base_price": 2410, "distance_km": 140, "arrivals": "280 MT"},
    {"id": "ambala", "name": "Ambala City Mandi", "state": "Haryana", "district": "Ambala", "lat": 30.3782, "lng": 76.7767, "base_price": 2460, "distance_km": 42, "arrivals": "390 MT"},
]

@router.get("/live-rates")
def get_live_mandi_rates(crop: str = "Wheat"):
    diesel_rate_per_km = 3.5
    results = []
    
    for m in MANDI_LOCATIONS:
        fluctuation = random.randint(-10, 20)
        modal_price = m["base_price"] + fluctuation
        transport_cost = int((m["distance_km"] * 2 * diesel_rate_per_km) / 10)
        net_profit = modal_price - transport_cost - 2310
        
        results.append({
            "id": m["id"],
            "name": m["name"],
            "state": m["state"],
            "district": m["district"],
            "lat": m["lat"],
            "lng": m["lng"],
            "modal": f"₹{modal_price}",
            "raw_modal": modal_price,
            "range": f"₹{modal_price - 30} - ₹{modal_price + 35}",
            "arrival": m["arrivals"],
            "distance": f"{m['distance_km']} km",
            "transport_cost": f"₹{transport_cost}/Qtl",
            "net_gain": f"+₹{net_profit}/Qtl" if net_profit > 0 else "Baseline",
            "is_best": net_profit > 80
        })
    
    return {
        "status": "success",
        "crop": crop,
        "timestamp": datetime.now().strftime("%I:%M:%S %p"),
        "mandis": results
    }