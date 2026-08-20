from fastapi import APIRouter
from pydantic import BaseModel
from app.db import get_db_connection
import hashlib
import time

router = APIRouter()

class JoinPoolReq(BaseModel):
    deal_id: int
    quantity_qtl: float
    farmer_name: str
    farmer_phone: str

class RateArhtiyaReq(BaseModel):
    arhtiya_id: int
    settlement_hours: float
    rating_out_of_5: float

class ReserveGodownReq(BaseModel):
    warehouse_id: int
    deposit_qtl: float
    duration_months: int
    farmer_name: str

# 1. Real Corporate RFQs
@router.get("/deals")
def get_corporate_deals():
    conn = get_db_connection()
    rows = conn.execute("SELECT * FROM corporate_rfqs WHERE status = 'Open'").fetchall()
    conn.close()
    return {"status": "success", "deals": [dict(r) for r in rows]}

@router.post("/join-pool")
def join_pool(req: JoinPoolReq):
    conn = get_db_connection()
    row = conn.execute("SELECT * FROM corporate_rfqs WHERE id = ?", (req.deal_id,)).fetchone()
    if not row:
        conn.close()
        return {"status": "error", "message": "Deal not found"}
    
    new_pooled = row["current_pooled_qtl"] + req.quantity_qtl
    conn.execute("UPDATE corporate_rfqs SET current_pooled_qtl = ? WHERE id = ?", (new_pooled, req.deal_id))
    conn.commit()
    conn.close()

    extra_gain = (row["offered_rate"] - 2310) * req.quantity_qtl
    return {
        "status": "success",
        "message": f"Successfully pooled {req.quantity_qtl} Qtl with {row['buyer_name']}",
        "new_total_pooled": new_pooled,
        "farmer_extra_profit": f"₹{int(extra_gain):,}"
    }

# 2. Real Arhtiya Ledger & Trust Scoring
@router.get("/arhtiyas")
def get_arhtiyas():
    conn = get_db_connection()
    rows = conn.execute("SELECT * FROM arhtiyas").fetchall()
    conn.close()
    
    result = []
    for r in rows:
        count = r["total_settlements"]
        avg_score = round(r["total_rating_sum"] / count, 1) if count > 0 else 4.5
        result.append({
            "id": r["id"],
            "name": r["name"],
            "mandi": r["mandi"],
            "shop_no": r["shop_no"],
            "commission_rate": f"{r['commission_rate']}%",
            "avg_settlement": f"{round(r['avg_settlement_hours'], 1)} Hours",
            "trust_score": f"{avg_score} / 5.0",
            "settlements_count": count
        })
    return {"status": "success", "arhtiyas": result}

@router.post("/rate-arhtiya")
def rate_arhtiya(req: RateArhtiyaReq):
    conn = get_db_connection()
    row = conn.execute("SELECT * FROM arhtiyas WHERE id = ?", (req.arhtiya_id,)).fetchone()
    if not row:
        conn.close()
        return {"status": "error", "message": "Arhtiya not found"}

    new_count = row["total_settlements"] + 1
    new_sum = row["total_rating_sum"] + req.rating_out_of_5
    new_avg_hours = ((row["avg_settlement_hours"] * row["total_settlements"]) + req.settlement_hours) / new_count

    conn.execute("""
    UPDATE arhtiyas 
    SET total_settlements = ?, total_rating_sum = ?, avg_settlement_hours = ?
    WHERE id = ?
    """, (new_count, new_sum, new_avg_hours, req.arhtiya_id))
    conn.commit()
    conn.close()

    return {"status": "success", "message": "Arhtiya trust ledger updated dynamically."}

# 3. Real WDRA Godowns & e-NWR Hashing
@router.get("/warehouses")
def get_warehouses():
    conn = get_db_connection()
    rows = conn.execute("SELECT * FROM warehouses").fetchall()
    conn.close()

    result = []
    for r in rows:
        vacant = r["total_capacity_mt"] - r["occupied_capacity_mt"]
        result.append({
            "id": r["id"],
            "name": r["name"],
            "wdra_reg_no": r["wdra_reg_no"],
            "location": r["location"],
            "distance_km": f"{int(r['distance_km'])} km",
            "monthly_rent_qtl": f"₹{r['monthly_rent_qtl']}/Qtl",
            "available_capacity_mt": f"{int(vacant)} MT",
            "occupancy_rate": f"{round((r['occupied_capacity_mt'] / r['total_capacity_mt']) * 100, 1)}%"
        })
    return {"status": "success", "warehouses": result}

@router.post("/reserve-warehouse")
def reserve_warehouse(req: ReserveGodownReq):
    conn = get_db_connection()
    wh = conn.execute("SELECT * FROM warehouses WHERE id = ?", (req.warehouse_id,)).fetchone()
    if not wh:
        conn.close()
        return {"status": "error", "message": "Warehouse not found"}

    deposit_mt = req.deposit_qtl / 10.0
    vacant = wh["total_capacity_mt"] - wh["occupied_capacity_mt"]
    if deposit_mt > vacant:
        conn.close()
        return {"status": "error", "message": "Requested capacity exceeds available space"}

    conn.execute("UPDATE warehouses SET occupied_capacity_mt = occupied_capacity_mt + ? WHERE id = ?", (deposit_mt, req.warehouse_id))
    conn.commit()
    conn.close()

    # Generate Real SHA-256 Verifiable e-NWR Receipt Token
    token_seed = f"{req.farmer_name}-{req.deposit_qtl}-{time.time()}-{wh['wdra_reg_no']}"
    enwr_hash = "ENWR-" + hashlib.sha256(token_seed.encode()).hexdigest()[:12].upper()
    loan_credit = int(req.deposit_qtl * 2400 * 0.75)

    return {
        "status": "success",
        "enwr_token": enwr_hash,
        "farmer_name": req.farmer_name,
        "deposited_qtl": req.deposit_qtl,
        "monthly_rent": f"₹{int(req.deposit_qtl * wh['monthly_rent_qtl'] * req.duration_months):,}",
        "instant_loan_credit_limit": f"₹{loan_credit:,} (75% MSP Floor)"
    }