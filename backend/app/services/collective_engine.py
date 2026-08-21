import hashlib
import json
import math
from datetime import datetime

def calculate_farmer_compatibility(f1: dict, f2: dict) -> dict:
    score = 100.0
    reasons = []
    if f1.get("crop", "").lower() != f2.get("crop", "").lower():
        return {"score": 0.0, "reasons": ["Different crops"]}
    reasons.append("✓ Same crop matched")
    if f1.get("variety", "").lower() == f2.get("variety", "").lower():
        reasons.append("✓ Exact variety match (+15%)")
    else:
        score -= 12.0
        reasons.append("ℹ Slightly different variety (-12%)")
    m1, m2 = float(f1.get("moisture_pct", 12.5)), float(f2.get("moisture_pct", 12.5))
    m_diff = abs(m1 - m2)
    score -= (m_diff * 6)
    reasons.append(f"✓ Moisture variance Δ {m_diff:.1f}%")
    dist = float(f2.get("distance_km", 4.0))
    if dist > 5.0: score -= (dist - 5.0) * 1.5
    reasons.append(f"✓ Proximity: {dist:.1f} km away")
    return {"score": max(0, min(100, round(score, 1))), "reasons": reasons}

def generate_digital_quality_passport(lot_id: str, farmers: list, crop: str, variety: str) -> dict:
    total_qty = sum(float(f.get("qty_qtl", 0)) for f in farmers)
    if total_qty == 0: return {}
    w_moisture = sum(float(f.get("qty_qtl", 0)) * float(f.get("moisture_pct", 12.0)) for f in farmers) / total_qty
    w_defect = sum(float(f.get("qty_qtl", 0)) * float(f.get("defect_pct", 2.0)) for f in farmers) / total_qty
    grade = "Grade-A Bulk Commercial" if w_moisture <= 13.0 and w_defect <= 3.0 else "Grade-B Standard Bulk"
    payload = f"{lot_id}|{crop}|{variety}|{total_qty}|{w_moisture:.2f}"
    return {
        "passport_id": f"DQP-{lot_id}",
        "title": "Digital Quality Passport",
        "notice": "Internal aggregated profile. Not a statutory government certificate.",
        "total_quantity_qtl": round(total_qty, 1),
        "weighted_moisture_pct": round(w_moisture, 2),
        "weighted_defect_pct": round(w_defect, 2),
        "overall_grade": grade,
        "integrity_hash": hashlib.sha256(payload.encode()).hexdigest()
    }

def calculate_collective_freight(lot_qty_qtl: float, avg_distance_km: float = 45.0, live_diesel_price: float = 87.80) -> dict:
    trips = max(1, math.ceil(lot_qty_qtl / 30.0))
    solo_cost = round(((avg_distance_km * 2 / 5.5) * trips * live_diesel_price) + (100 * trips) + (8.0 * lot_qty_qtl), 1)
    col_cost = round(((avg_distance_km * 2 / 3.2) * live_diesel_price) + 240.0 + (6.5 * lot_qty_qtl), 1)
    return {
        "collective_freight": {"total_cost": col_cost, "cost_per_qtl": round(col_cost / lot_qty_qtl, 1)},
        "individual_solo_freight": {"total_cost": solo_cost, "cost_per_qtl": round(solo_cost / lot_qty_qtl, 1)},
        "potential_freight_saving": {"total_saving": max(0, round(solo_cost - col_cost, 1)), "saving_pct": round(((solo_cost - col_cost) / solo_cost) * 100, 1) if solo_cost > 0 else 0}
    }

def calculate_farmer_settlements(accepted_price_qtl: float, farmers: list, freight_cost_total: float, handling_total: float, platform_fee_pct: float = 0.5) -> list:
    total_qty = sum(float(f.get("qty_qtl", 0)) for f in farmers)
    if total_qty == 0: return []
    res = []
    for f in farmers:
        qty = float(f.get("qty_qtl", 0))
        ratio = qty / total_qty
        gross = round(accepted_price_qtl * qty, 2)
        p_freight = round(freight_cost_total * ratio, 2)
        p_handling = round(handling_total * ratio, 2)
        p_fee = round(gross * (platform_fee_pct / 100.0), 2)
        net = round(gross - (p_freight + p_handling + p_fee), 2)
        res.append({
            "farmer_name": f.get("name"),
            "quantity_qtl": qty,
            "gross_amount": gross,
            "deductions": {"proportional_freight": p_freight, "handling_mandi_charge": p_handling, "platform_service_fee": p_fee},
            "estimated_net_settlement": net
        })
    return res