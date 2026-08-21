from fastapi import APIRouter, Body
from typing import List, Dict, Any
from datetime import datetime
from app.services.collective_engine import (
    calculate_farmer_compatibility, generate_digital_quality_passport,
    calculate_collective_freight, calculate_farmer_settlements
)

router = APIRouter(prefix="/api/collective", tags=["AgriSetu Collective Dynamic"])

LIVE_STATE = {
    "farmers": [
        {"id": "F1", "name": "Gurpreet Singh", "village": "Khanna", "crop": "Basmati Paddy", "variety": "PB-1121", "qty_qtl": 32.0, "moisture_pct": 12.5, "defect_pct": 1.8, "distance_km": 0.0, "individual_rate": 3600.0},
        {"id": "F2", "name": "Harbhajan Gill", "village": "Bhadla", "crop": "Basmati Paddy", "variety": "PB-1121", "qty_qtl": 28.0, "moisture_pct": 12.8, "defect_pct": 2.1, "distance_km": 3.8, "individual_rate": 3590.0}
    ],
    "bids": [
        {"id": "B1", "buyer_name": "ITC Agri-Business", "category": "Corporate", "bid_rate": 3720.0},
        {"id": "B2", "buyer_name": "Adani Wilmar Export", "category": "Processor", "bid_rate": 3700.0}
    ]
}

@router.post("/calculate-dynamic")
def calculate_dynamic_state(payload: Dict[str, Any] = Body(...)):
    farmers = payload.get("farmers", LIVE_STATE["farmers"])
    bids = payload.get("bids", LIVE_STATE["bids"])
    total_qty = sum(float(f.get("qty_qtl", 0)) for f in farmers)
    lot_id = f"LOT-{datetime.now().strftime('%Y%m%d%H%M')}"
    passport = generate_digital_quality_passport(lot_id, farmers, "Basmati Paddy", "PB-1121")
    freight = calculate_collective_freight(total_qty if total_qty > 0 else 1.0, 38.0, 87.80)
    highest_bid = float(max(bids, key=lambda x: float(x.get("bid_rate", 0)))["bid_rate"]) if bids else 3600.0
    settlement = calculate_farmer_settlements(highest_bid, farmers, freight["collective_freight"]["total_cost"], 6.5 * total_qty)

    return {
        "status": "success",
        "total_quantity_qtl": round(total_qty, 1),
        "passport": passport,
        "freight": freight,
        "highest_bid": highest_bid,
        "settlements": settlement
    }