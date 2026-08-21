from fastapi import APIRouter
import requests
import os
from datetime import datetime

router = APIRouter()

ORIGIN_FARM = {"lat": 30.9010, "lng": 75.8573} # Ludhiana Farm Cluster

# Mandi Location Mapping for exact OSRM Highway routing
APMC_GEO_LOOKUP = {
    "Khanna": {"lat": 30.7072, "lng": 76.2167},
    "Rajpura": {"lat": 30.4842, "lng": 76.5939},
    "Sirhind": {"lat": 30.6425, "lng": 76.3858},
    "Karnal": {"lat": 29.6857, "lng": 76.9905},
    "Ambala City": {"lat": 30.3782, "lng": 76.7767},
    "Sirsa": {"lat": 29.5349, "lng": 75.0298},
    "Ludhiana": {"lat": 30.9010, "lng": 75.8573},
    "Moga": {"lat": 30.8165, "lng": 75.1717},
}

def get_live_punjab_diesel():
    try:
        r = requests.get("https://dailyfuelprice.com/api/v1/diesel/punjab", timeout=2)
        if r.status_code == 200:
            return float(r.json().get("price", 87.80))
    except Exception:
        pass
    return 87.80

def get_osrm_distance(dest_lat, dest_lng):
    try:
        url = f"http://router.project-osrm.org/route/v1/driving/{ORIGIN_FARM['lng']},{ORIGIN_FARM['lat']};{dest_lng},{dest_lat}?overview=false"
        r = requests.get(url, timeout=3)
        if r.status_code == 200:
            routes = r.json().get("routes", [])
            if routes:
                km = round(routes[0]["distance"] / 1000.0, 1)
                hours = round(routes[0]["duration"] / 3600.0, 1)
                return km, hours
    except Exception:
        pass
    return 45.0, 1.2

@router.get("/live-rates")
def get_live_rates(crop: str = "Wheat"):
    api_key = os.getenv("DATA_GOV_IN_API_KEY", "579b464db66ec23bdd000001cdd3946e44ce4aad7209ff7b23ac571b")
    diesel_rate = get_live_punjab_diesel()

    # Query official data.gov.in Agmarknet Resource API
    gov_url = f"https://api.data.gov.in/resource/9ef84268-d588-465a-a308-a864a43d0070?api-key={api_key}&format=json&limit=50&filters[commodity]={crop}"
    
    mandis_list = []
    
    try:
        resp = requests.get(gov_url, timeout=5)
        if resp.status_code == 200:
            records = resp.json().get("records", [])
            
            for idx, item in enumerate(records):
                m_name = item.get("market", "Unknown Mandi")
                state = item.get("state", "Punjab")
                modal_price = float(item.get("modal_price", 0))
                min_price = float(item.get("min_price", 0))
                max_price = float(item.get("max_price", 0))
                arrival_date = item.get("arrival_date", datetime.now().strftime("%d/%m/%Y"))

                if modal_price <= 0:
                    continue

                # Geolocation lookup for real OSRM routing
                geo = APMC_GEO_LOOKUP.get(m_name, {"lat": 30.7072, "lng": 76.2167})
                km, drive_time = get_osrm_distance(geo["lat"], geo["lng"])

                # Fuel Calculation (Round Trip / Tractor 100 Qtl)
                liters = (km * 2) / 4.5
                diesel_cost_qtl = round((liters * diesel_rate) / 100.0, 1)
                toll_labor = 8.0 if state.lower() == "punjab" else 10.0
                total_transit = round(diesel_cost_qtl + toll_labor, 1)
                net_in_hand = round(modal_price - total_transit, 1)

                mandis_list.append({
                    "id": idx + 1,
                    "name": f"{m_name} Mandi",
                    "state": state,
                    "modal": modal_price,
                    "min_price": min_price,
                    "max_price": max_price,
                    "arrival_date": arrival_date,
                    "distance_km": km,
                    "drive_time": f"{drive_time} hrs",
                    "diesel_cost": diesel_cost_qtl,
                    "toll_labor": toll_labor,
                    "total_transport": total_transit,
                    "net_in_hand": net_in_hand,
                    "source": "Agmarknet Official Gov Stream"
                })
    except Exception as e:
        print("Gov API fetch exception:", e)

    # Sort descending by highest net realization
    mandis_list.sort(key=lambda x: x["net_in_hand"], reverse=True)

    return {
        "status": "success",
        "crop": crop,
        "source": "Government of India (Agmarknet Live API)",
        "live_diesel_rate": f"₹{diesel_rate}",
        "record_count": len(mandis_list),
        "mandis": mandis_list
    }