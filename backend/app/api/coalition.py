from fastapi import APIRouter
from pydantic import BaseModel
from typing import List, Optional
import datetime

router = APIRouter()

# --- 1. LIVE DATA MODELS ---
class CorporateDeal(BaseModel):
    id: int
    name: str
    crop: str
    offer_price: int
    min_volume: int
    current_pooled: int
    badge: str
    status: str
    closing_days: int

class RideShare(BaseModel):
    id: int
    driver_name: str
    vehicle: str
    route_from: str
    route_to: str
    total_capacity: int
    available_capacity: int
    price_per_qtl: int
    phone: str
    status: str

class WarehouseSlot(BaseModel):
    id: int
    name: str
    type: str
    location: str
    distance_km: int
    rate_monthly_qtl: float
    total_capacity_mt: int
    available_capacity_mt: int
    enwr_loan_eligible: bool
    booked: bool = False

# --- 2. IN-MEMORY LIVE PERSISTENT STATE ---
CORPORATE_DEALS: List[CorporateDeal] = [
    CorporateDeal(id=1, name="ITC Agri-Business Hub", crop="Wheat HD-2967 (Grade A)", offer_price=2620, min_volume=500, current_pooled=320, badge="Verified Buyer", status="Active Procurement", closing_days=3),
    CorporateDeal(id=2, name="Adani Wilmar Logistics", crop="Basmati Paddy 1121 Export Quality", offer_price=3850, min_volume=600, current_pooled=450, badge="Direct Export", status="Urgent Batch", closing_days=2),
    CorporateDeal(id=3, name="Cargill India Foods", crop="Hybrid Yellow Maize", offer_price=2190, min_volume=300, current_pooled=180, badge="Bulk Processor", status="Closing Soon", closing_days=5),
    CorporateDeal(id=4, name="Patanjali Bio Research", crop="Organic Mustard Seed", offer_price=5600, min_volume=200, current_pooled=140, badge="Direct FMCG", status="Procuring", closing_days=7),
]

RIDES_DB: List[RideShare] = [
    RideShare(id=1, driver_name="Gurdeep Singh (Trolley)", vehicle="Swaraj 855 Double Trolley", route_from="Khanna", route_to="Karnal Yard", total_capacity=200, available_capacity=80, price_per_qtl=14, phone="+91 98140-99881", status="Open"),
    RideShare(id=2, driver_name="Jaswinder Logistics", vehicle="Eicher 14 Wheeler Truck", route_from="Samrala", route_to="Rajpura APMC", total_capacity=350, available_capacity=190, price_per_qtl=18, phone="+91 94172-33441", status="Open"),
    RideShare(id=3, driver_name="Baldev Transport", vehicle="Mahindra Bolero Pickup", route_from="Ludhiana", route_to="Sirsa Yard", total_capacity=60, available_capacity=25, price_per_qtl=22, phone="+91 98721-55662", status="Open"),
]

WAREHOUSES_DB: List[WarehouseSlot] = [
    WarehouseSlot(id=1, name="CWC Central Warehouse Ludhiana", type="WDRA Certified", location="Ludhiana Industrial Area", distance_km=12, rate_monthly_qtl=4.20, total_capacity_mt=2500, available_capacity_mt=1400, enwr_loan_eligible=True),
    WarehouseSlot(id=2, name="Punjab State Warehousing Corp", type="State Mandi Yard", location="Khanna APMC Outer Yard", distance_km=4, rate_monthly_qtl=3.80, total_capacity_mt=1800, available_capacity_mt=850, enwr_loan_eligible=True),
    WarehouseSlot(id=3, name="Karnal Agro Silos Complex", type="Pvt Cold Storage", location="GT Road, Karnal", distance_km=28, rate_monthly_qtl=5.10, total_capacity_mt=4000, available_capacity_mt=2200, enwr_loan_eligible=True),
]

# --- 3. INPUT REQUEST SCHEMAS ---
class JoinPoolRequest(BaseModel):
    deal_id: int
    farmer_name: str
    farmer_phone: str
    quantity_qtl: int

class BookRideRequest(BaseModel):
    ride_id: int
    farmer_name: str
    farmer_phone: str
    required_qtl: int

class ReserveWarehouseRequest(BaseModel):
    warehouse_id: int
    farmer_name: str
    farmer_phone: str
    deposit_qtl: int
    duration_months: int

class PostRideRequest(BaseModel):
    driver_name: str
    vehicle: str
    route_from: str
    route_to: str
    available_capacity: int
    price_per_qtl: int
    phone: str

# --- 4. API ENDPOINTS ---

# A. Bulk Bargaining
@router.get("/deals")
def get_deals():
    return {"status": "success", "deals": [d.dict() for d in CORPORATE_DEALS]}

@router.post("/join-pool")
def join_coalition_pool(req: JoinPoolRequest):
    deal = next((d for d in CORPORATE_DEALS if d.id == req.deal_id), None)
    if not deal:
        return {"status": "error", "message": "Deal not found"}
    
    deal.current_pooled += req.quantity_qtl
    pct = min(100, int((deal.current_pooled / deal.min_volume) * 100))
    extra_profit = (deal.offer_price - 2310) * req.quantity_qtl
    
    return {
        "status": "success",
        "message": f"Successfully pooled {req.quantity_qtl} Qtl with {deal.name}!",
        "current_pooled": deal.current_pooled,
        "target_volume": deal.min_volume,
        "progress_pct": pct,
        "farmer_extra_earning": f"₹{extra_profit:,}",
        "whatsapp_notification": f"Sent to {req.farmer_phone}: Your batch is locked at ₹{deal.offer_price}/Qtl."
    }

# B. Tractor / Logistics Sharing
@router.get("/logistics")
def get_rides():
    return {"status": "success", "rides": [r.dict() for r in RIDES_DB]}

@router.post("/book-ride")
def book_tractor_space(req: BookRideRequest):
    ride = next((r for r in RIDES_DB if r.id == req.ride_id), None)
    if not ride:
        return {"status": "error", "message": "Ride not found"}
    if ride.available_capacity < req.required_qtl:
        return {"status": "error", "message": f"Only {ride.available_capacity} Qtl space available"}

    ride.available_capacity -= req.required_qtl
    total_cost = req.required_qtl * ride.price_per_qtl
    saved = int(total_cost * 0.40) # 40% saving compared to private hired truck

    return {
        "status": "success",
        "message": f"Trolley space of {req.required_qtl} Qtl confirmed with {ride.driver_name}!",
        "driver_phone": ride.phone,
        "remaining_capacity": ride.available_capacity,
        "total_fare": f"₹{total_cost:,}",
        "cost_saved": f"₹{saved:,}",
        "pickup_status": "Driver notified via automated SMS"
    }

@router.post("/post-ride")
def post_new_ride(req: PostRideRequest):
    new_id = len(RIDES_DB) + 1
    new_ride = RideShare(
        id=new_id,
        driver_name=req.driver_name,
        vehicle=req.vehicle,
        route_from=req.route_from,
        route_to=req.route_to,
        total_capacity=req.available_capacity,
        available_capacity=req.available_capacity,
        price_per_qtl=req.price_per_qtl,
        phone=req.phone,
        status="Open"
    )
    RIDES_DB.insert(0, new_ride)
    return {"status": "success", "message": "Logistics ride listed on network", "ride": new_ride.dict()}

# C. Warehouse / Godown Locator
@router.get("/warehouses")
def get_warehouses():
    return {"status": "success", "warehouses": [w.dict() for w in WAREHOUSES_DB]}

@router.post("/reserve-warehouse")
def reserve_godown_space(req: ReserveWarehouseRequest):
    wh = next((w for w in WAREHOUSES_DB if w.id == req.warehouse_id), None)
    if not wh:
        return {"status": "error", "message": "Warehouse not found"}

    needed_mt = req.deposit_qtl / 10.0
    if wh.available_capacity_mt < needed_mt:
        return {"status": "error", "message": "Requested capacity exceeds available space"}

    wh.available_capacity_mt = int(wh.available_capacity_mt - needed_mt)
    monthly_rent = int(req.deposit_qtl * wh.rate_monthly_qtl * req.duration_months)
    loan_limit = int(req.deposit_qtl * 2400 * 0.75) # 75% value on MSP

    return {
        "status": "success",
        "message": f"Storage Bay reserved at {wh.name} for {req.deposit_qtl} Qtl!",
        "monthly_rent_total": f"₹{monthly_rent:,}",
        "enwr_receipt_id": f"NWR-2026-PB-{req.warehouse_id}98",
        "instant_loan_credit_limit": f"₹{loan_limit:,} (75% e-NWR Floor)",
        "remaining_capacity_mt": f"{wh.available_capacity_mt} MT"
    }