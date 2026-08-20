from fastapi import APIRouter
import requests
from app.db import get_db_connection
from app.ml_engine import run_lstm_attention_forecast

router = APIRouter()

ORIGIN_FARM = {"lat": 30.9010, "lng": 75.8573} # Ludhiana Farming Belt

VEHICLE_SPECS = {
    "tractor": {"name": "Tractor Trolley (Standard)", "capacity_qtl": 100.0, "mileage_km_l": 4.5, "toll_per_km": 0.0},
    "pickup": {"name": "Tata Ace / Bolero Pickup", "capacity_qtl": 30.0, "mileage_km_l": 11.5, "toll_per_km": 1.2},
    "truck": {"name": "10-Wheeler Commercial Truck", "capacity_qtl": 250.0, "mileage_km_l": 3.0, "toll_per_km": 2.8}
}

def fetch_live_punjab_diesel_rate():
    try:
        url = "https://dailyfuelprice.com/api/v1/diesel/punjab"
        resp = requests.get(url, timeout=2)
        if resp.status_code == 200:
            data = resp.json()
            return float(data.get("price", 87.50))
    except Exception:
        pass
    return 87.80 # Spot Diesel Rate / Liter in Punjab

def fetch_osrm_road_distance(origin_lng, origin_lat, dest_lng, dest_lat):
    try:
        url = f"http://router.project-osrm.org/route/v1/driving/{origin_lng},{origin_lat};{dest_lng},{dest_lat}?overview=false"
        resp = requests.get(url, timeout=3)
        if resp.status_code == 200:
            data = resp.json()
            if data.get("routes") and len(data["routes"]) > 0:
                meters = data["routes"][0]["distance"]
                duration_sec = data["routes"][0]["duration"]
                return round(meters / 1000.0, 1), round(duration_sec / 3600.0, 1)
    except Exception:
        pass
    return None, None

@router.get("/live-rates")
def get_live_rates(crop: str = "Wheat", vehicle: str = "tractor", pool_members: int = 1):
    conn = get_db_connection()
    rows = conn.execute("SELECT * FROM mandi_rates WHERE crop = ?", (crop,)).fetchall()
    conn.close()

    live_diesel_price = fetch_live_punjab_diesel_rate()
    v_spec = VEHICLE_SPECS.get(vehicle.lower(), VEHICLE_SPECS["tractor"])
    
    mandis = []
    
    for r in rows:
        dest_lat = 30.7072 if "Khanna" in r["mandi_name"] else 30.4842 if "Rajpura" in r["mandi_name"] else 29.6857 if "Karnal" in r["mandi_name"] else 29.5349
        dest_lng = 76.2167 if "Khanna" in r["mandi_name"] else 76.5939 if "Rajpura" in r["mandi_name"] else 76.9905 if "Karnal" in r["mandi_name"] else 75.0298
        
        # Real OSRM Road Distance & Transit Hours
        road_km, drive_hours = fetch_osrm_road_distance(ORIGIN_FARM["lng"], ORIGIN_FARM["lat"], dest_lng, dest_lat)
        if road_km is None:
            road_km = r["distance_km"]
            drive_hours = round(road_km / 35.0, 1)

        # 1. Fuel Cost Component (Round Trip)
        liters_needed = (road_km * 2) / v_spec["mileage_km_l"]
        fuel_cost_total = liters_needed * live_diesel_price
        fuel_cost_per_qtl = fuel_cost_total / v_spec["capacity_qtl"]

        # 2. NHAI Highway Tolls & Palledari/Labor (₹8/Qtl Mandi Handling standard)
        toll_cost_total = road_km * 2 * v_spec["toll_per_km"]
        toll_cost_per_qtl = toll_cost_total / v_spec["capacity_qtl"]
        mandi_labor_per_qtl = 8.0

        # Total Landed Transit Cost
        total_freight_per_qtl = round(fuel_cost_per_qtl + toll_cost_per_qtl + mandi_labor_per_qtl, 1)

        # Shared Freight Pooling Discount Calculation
        pool_split_count = max(1, min(pool_members, 4))
        shared_freight_per_qtl = round(
            ((fuel_cost_per_qtl + toll_cost_per_qtl) / pool_split_count) + mandi_labor_per_qtl, 1
        )
        
        modal = r["modal_price"]
        net_profit_solo = round(modal - total_freight_per_qtl - 2310.0, 1)
        net_profit_pooled = round(modal - shared_freight_per_qtl - 2310.0, 1)

        mandis.append({
            "id": r["id"],
            "name": r["mandi_name"],
            "state": r["state"],
            "modal": f"₹{int(modal)}",
            "raw_modal": modal,
            "range": f"₹{int(r['min_price'])} - ₹{int(r['max_price'])}",
            "arrival": f"{int(r['arrival_mt'])} MT",
            "distance": f"{road_km} km (Highway)",
            "drive_time": f"{drive_hours} hrs",
            "breakdown": {
                "diesel_fuel": f"₹{round(fuel_cost_per_qtl, 1)}/Qtl",
                "highway_toll": f"₹{round(toll_cost_per_qtl, 1)}/Qtl",
                "mandi_labor": f"₹{mandi_labor_per_qtl}/Qtl",
                "solo_total": f"₹{total_freight_per_qtl}/Qtl",
                "pooled_total": f"₹{shared_freight_per_qtl}/Qtl"
            },
            "transport_cost": f"₹{total_freight_per_qtl}/Qtl",
            "shared_transport_cost": f"₹{shared_freight_per_qtl}/Qtl",
            "net_gain": f"+₹{int(net_profit_solo)}/Qtl" if net_profit_solo > 0 else "Baseline",
            "net_gain_pooled": f"+₹{int(net_profit_pooled)}/Qtl" if net_profit_pooled > 0 else "Baseline",
            "is_best": net_profit_solo > 80
        })

    return {
        "status": "success",
        "crop": crop,
        "selected_vehicle": v_spec["name"],
        "vehicle_payload_qtl": v_spec["capacity_qtl"],
        "live_diesel_rate": f"₹{live_diesel_price}/Liter",
        "pool_members": pool_split_count,
        "mandis": mandis
    }

@router.get("/forecast")
def get_pytorch_lstm_forecast(crop: str = "Wheat"):
    return run_lstm_attention_forecast(crop)