from fastapi import APIRouter
from app.db import get_db_connection
from app.ml_engine import train_and_predict_crop_price

router = APIRouter()

@router.get("/live-rates")
def get_live_rates(crop: str = "Wheat"):
    conn = get_db_connection()
    rows = conn.execute("SELECT * FROM mandi_rates WHERE crop = ?", (crop,)).fetchall()
    conn.close()

    diesel_rate_per_km = 3.5
    mandis = []
    
    for r in rows:
        modal = r["modal_price"]
        dist = r["distance_km"]
        transport_cost = int((dist * 2 * diesel_rate_per_km) / 10)
        net_profit = int(modal - transport_cost - 2310)

        mandis.append({
            "id": r["id"],
            "name": r["mandi_name"],
            "state": r["state"],
            "modal": f"₹{int(modal)}",
            "raw_modal": modal,
            "range": f"₹{int(r['min_price'])} - ₹{int(r['max_price'])}",
            "arrival": f"{int(r['arrival_mt'])} MT",
            "distance": f"{int(dist)} km",
            "transport_cost": f"₹{transport_cost}/Qtl",
            "net_gain": f"+₹{net_profit}/Qtl" if net_profit > 0 else "Baseline",
            "is_best": net_profit > 80
        })

    return {"status": "success", "crop": crop, "mandis": mandis}

@router.get("/forecast")
def get_ml_forecast(crop: str = "Wheat"):
    return train_and_predict_crop_price(crop)