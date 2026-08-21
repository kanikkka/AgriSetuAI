from fastapi import APIRouter, HTTPException, Query, Body
from typing import Optional, List, Dict, Any
from datetime import datetime, timedelta
import uuid
import sqlite3
import os

from app.services.buyer_matching_service import calculate_osrm_distance, calculate_buyer_match_score
from app.services.return_freight_service import find_compatible_return_load
from app.services.cash_decision_service import evaluate_cash_need_mode

router = APIRouter(prefix="/api/farmer-hub", tags=["Farmer Hub Live"])

DB_FILE = os.path.join(os.path.dirname(os.path.dirname(__file__)), "agrisetu_farmer.db")

def init_db():
    conn = sqlite3.connect(DB_FILE)
    c = conn.cursor()
    # Buyer Profiles
    c.execute("""
    CREATE TABLE IF NOT EXISTS buyer_profiles (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        buyer_type TEXT NOT NULL,
        location_name TEXT NOT NULL,
        lat REAL NOT NULL,
        lng REAL NOT NULL,
        required_crop TEXT NOT NULL,
        required_variety TEXT,
        min_quantity_qtl REAL DEFAULT 0,
        max_quantity_qtl REAL,
        max_moisture_pct REAL DEFAULT 14.0,
        offered_price_per_qtl REAL NOT NULL,
        delivery_window TEXT,
        verification_status TEXT DEFAULT 'Verified',
        created_at TEXT
    )""")
    # Sale Bookings
    c.execute("""
    CREATE TABLE IF NOT EXISTS sale_bookings (
        id TEXT PRIMARY KEY,
        farmer_id TEXT NOT NULL,
        farmer_name TEXT NOT NULL,
        farmer_phone TEXT NOT NULL,
        buyer_id TEXT NOT NULL,
        buyer_name TEXT NOT NULL,
        crop TEXT NOT NULL,
        variety TEXT,
        quantity_qtl REAL NOT NULL,
        agreed_price_per_qtl REAL NOT NULL,
        delivery_location TEXT NOT NULL,
        delivery_scheduled_at TEXT,
        status TEXT DEFAULT 'Requested',
        counter_price_per_qtl REAL,
        payment_status TEXT DEFAULT 'Pending',
        created_at TEXT
    )""")
    # Return Loads
    c.execute("""
    CREATE TABLE IF NOT EXISTS return_freight_loads (
        id TEXT PRIMARY KEY,
        transporter_name TEXT NOT NULL,
        transporter_phone TEXT NOT NULL,
        vehicle_type TEXT NOT NULL,
        vehicle_number TEXT NOT NULL,
        capacity_qtl REAL NOT NULL,
        available_capacity_qtl REAL NOT NULL,
        origin_city TEXT NOT NULL,
        origin_lat REAL NOT NULL,
        origin_lng REAL NOT NULL,
        destination_city TEXT NOT NULL,
        destination_lat REAL NOT NULL,
        destination_lng REAL NOT NULL,
        return_cargo_type TEXT NOT NULL,
        status TEXT DEFAULT 'Available'
    )""")
    # Notifications
    c.execute("""
    CREATE TABLE IF NOT EXISTS farmer_notifications (
        id TEXT PRIMARY KEY,
        farmer_id TEXT NOT NULL,
        title TEXT NOT NULL,
        message TEXT NOT NULL,
        event_type TEXT NOT NULL,
        is_read INTEGER DEFAULT 0,
        created_at TEXT
    )""")
    conn.commit()
    
    # Pre-populate real initial records only if DB empty
    c.execute("SELECT COUNT(*) FROM buyer_profiles")
    if c.fetchone()[0] == 0:
        c.execute("""
        INSERT INTO buyer_profiles VALUES 
        ('B01', 'ITC Agri-Business Division', 'Corporate Procurement', 'Ludhiana Industrial Depot', 30.9010, 75.8573, 'Basmati Paddy', 'PB-1121', 50.0, 500.0, 13.0, 3720.0, '25-30 Aug 2026', 'Verified', datetime('now')),
        ('B02', 'Punjab Rice Millers Cluster', 'Rice Mills', 'Khanna GT Road Yard', 30.7072, 76.2167, 'Basmati Paddy', 'PB-1121', 20.0, 300.0, 13.5, 3690.0, '24-28 Aug 2026', 'Verified', datetime('now')),
        ('B03', 'Adani Wilmar Export Hub', 'Food Processors', 'Rajpura Logistics Park', 30.4842, 76.5939, 'Basmati Paddy', 'PB-1121', 100.0, 1000.0, 12.8, 3740.0, '26-31 Aug 2026', 'Verified', datetime('now')),
        ('B04', 'Karnal Roller Flour Mill', 'Flour Mills', 'Karnal Mandi Complex', 29.6857, 76.9905, 'Wheat', 'Standard', 30.0, 500.0, 12.5, 2580.0, '22-26 Aug 2026', 'Verified', datetime('now'))
        """)
        c.execute("""
        INSERT INTO return_freight_loads VALUES
        ('RET-01', 'Singh Logistics Freight', '+91 98140 11223', '10-Wheeler Truck', 'PB-10-CZ-4412', 250.0, 180.0, 'Ludhiana', 30.9010, 75.8573, 'Khanna', 30.7072, 76.2167, 'Fertilizer Bags', 'Available'),
        ('RET-02', 'Malwa Roadlines', '+91 98722 33445', 'Tractor Trolley', 'PB-23-T-8890', 100.0, 60.0, 'Rajpura', 30.4842, 76.5939, 'Khanna', 30.7072, 76.2167, 'Empty Return', 'Available')
        """)
        conn.commit()
    conn.close()

init_db()

@router.get("/buyer-matches")
def get_buyer_matches(
    crop: str = "Basmati Paddy",
    variety: Optional[str] = "PB-1121",
    quantity_qtl: float = 32.0,
    moisture_pct: float = 12.5,
    farmer_lat: float = 30.7072, # Khanna
    farmer_lng: float = 76.2167
):
    conn = sqlite3.connect(DB_FILE)
    conn.row_factory = sqlite3.Row
    c = conn.cursor()
    c.execute("SELECT * FROM buyer_profiles WHERE LOWER(required_crop) LIKE LOWER(?)", (f"%{crop}%",))
    rows = c.fetchall()
    conn.close()

    if not rows:
        return {"status": "success", "count": 0, "message": "No eligible buyer currently available.", "matches": []}

    matches = []
    for r in rows:
        b_dict = dict(r)
        km, hrs = calculate_osrm_distance(farmer_lat, farmer_lng, b_dict["lat"], b_dict["lng"])
        dist_km = km if km is not None else 25.0
        
        match_eval = calculate_buyer_match_score(crop, variety, quantity_qtl, moisture_pct, b_dict, dist_km)
        
        matches.append({
            "buyer_id": b_dict["id"],
            "buyer_name": b_dict["name"],
            "buyer_type": b_dict["buyer_type"],
            "offered_price": b_dict["offered_price_per_qtl"],
            "location": b_dict["location_name"],
            "distance_km": dist_km,
            "drive_time": f"{hrs} hrs" if hrs else "1.0 hrs",
            "delivery_window": b_dict["delivery_window"],
            "verification_status": b_dict["verification_status"],
            "match_score": match_eval["score"],
            "match_reasons": match_eval["reasons"]
        })

    matches.sort(key=lambda x: (x["match_score"], x["offered_price"]), reverse=True)
    return {"status": "success", "count": len(matches), "matches": matches}

@router.post("/book-sale")
def create_sale_booking(payload: Dict[str, Any] = Body(...)):
    booking_id = f"BK-{uuid.uuid4().hex[:8].upper()}"
    conn = sqlite3.connect(DB_FILE)
    c = conn.cursor()
    
    c.execute("SELECT name FROM buyer_profiles WHERE id = ?", (payload["buyer_id"],))
    buyer_row = c.fetchone()
    buyer_name = buyer_row[0] if buyer_row else "Corporate Buyer"

    c.execute("""
    INSERT INTO sale_bookings (id, farmer_id, farmer_name, farmer_phone, buyer_id, buyer_name, crop, variety, quantity_qtl, agreed_price_per_qtl, delivery_location, delivery_scheduled_at, status, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'Requested', datetime('now'))
    """, (
        booking_id,
        payload.get("farmer_id", "F-GURPREET-01"),
        payload.get("farmer_name", "Gurpreet Singh"),
        payload.get("farmer_phone", "+91 98765 43210"),
        payload["buyer_id"],
        buyer_name,
        payload["crop"],
        payload.get("variety", "Standard"),
        float(payload["quantity_qtl"]),
        float(payload["offered_price"]),
        payload.get("delivery_location", "Buyer Depot"),
        payload.get("delivery_scheduled_at", (datetime.now() + timedelta(days=2)).strftime("%d %b %Y, %I:%M %p"))
    ))

    # Add notification for the farmer
    c.execute("""
    INSERT INTO farmer_notifications VALUES (?, ?, ?, ?, 'BOOKING_REQUESTED', 0, datetime('now'))
    """, (
        str(uuid.uuid4()),
        payload.get("farmer_id", "F-GURPREET-01"),
        "Pre-Sale Request Sent",
        f"Sale request for {payload['quantity_qtl']} Qtl {payload['crop']} sent to {buyer_name} at ₹{payload['offered_price']}/Qtl."
    ))

    conn.commit()
    conn.close()

    return {
        "status": "success",
        "booking_id": booking_id,
        "message": "Your sale request has been dispatched. Buyer confirmation pending before you leave for mandi."
    }

@router.get("/bookings/{farmer_id}")
def get_farmer_bookings(farmer_id: str = "F-GURPREET-01"):
    conn = sqlite3.connect(DB_FILE)
    conn.row_factory = sqlite3.Row
    c = conn.cursor()
    c.execute("SELECT * FROM sale_bookings WHERE farmer_id = ? ORDER BY created_at DESC", (farmer_id,))
    rows = c.fetchall()
    conn.close()
    return {"bookings": [dict(r) for r in rows]}

@router.post("/update-booking-status")
def update_booking_status(booking_id: str = Body(..., embed=True), action: str = Body(..., embed=True)):
    # Actions: Accept, Reject, Delivered, Complete
    status_map = {
        "Accept": "Accepted",
        "Reject": "Rejected",
        "Delivered": "Delivered",
        "Complete": "Completed"
    }
    new_status = status_map.get(action, "Accepted")
    conn = sqlite3.connect(DB_FILE)
    c = conn.cursor()
    c.execute("UPDATE sale_bookings SET status = ?, payment_status = ? WHERE id = ?", (
        new_status,
        "Completed" if new_status == "Completed" else "Processing" if new_status == "Delivered" else "Pending",
        booking_id
    ))
    conn.commit()
    conn.close()
    return {"status": "success", "booking_id": booking_id, "new_status": new_status}

@router.get("/return-freight")
def get_return_freight(
    farmer_lat: float = 30.7072, # Khanna
    farmer_lng: float = 76.2167,
    dest_lat: float = 30.9010,   # Ludhiana
    dest_lng: float = 75.8573
):
    conn = sqlite3.connect(DB_FILE)
    c = conn.cursor()
    c.execute("SELECT id, transporter_name, transporter_phone, vehicle_type, vehicle_number, capacity_qtl, available_capacity_qtl, origin_city, origin_lat, origin_lng, destination_city, destination_lat, destination_lng, return_cargo_type, status FROM return_freight_loads WHERE status = 'Available'")
    
    class Obj:
        pass

    loads = []
    for r in c.fetchall():
        o = Obj()
        o.id, o.transporter_name, o.transporter_phone, o.vehicle_type, o.vehicle_number, o.capacity_qtl, o.available_capacity_qtl, o.origin_city, o.origin_lat, o.origin_lng, o.destination_city, o.destination_lat, o.destination_lng, o.return_cargo_type, o.status = r
        loads.append(o)
    conn.close()

    matches = find_compatible_return_load(farmer_lat, farmer_lng, dest_lat, dest_lng, loads)
    if not matches:
        return {"status": "success", "count": 0, "message": "No compatible return load currently available.", "loads": []}

    return {"status": "success", "count": len(matches), "loads": matches}

@router.get("/buyer-profile/{buyer_id}")
def get_buyer_trust_profile(buyer_id: str):
    conn = sqlite3.connect(DB_FILE)
    conn.row_factory = sqlite3.Row
    c = conn.cursor()
    c.execute("SELECT * FROM buyer_profiles WHERE id = ?", (buyer_id,))
    b = c.fetchone()
    if not b:
        conn.close()
        raise HTTPException(status_code=404, detail="Buyer profile not found")

    c.execute("SELECT COUNT(*), AVG(agreed_price_per_qtl), SUM(quantity_qtl) FROM sale_bookings WHERE buyer_id = ? AND status = 'Completed'", (buyer_id,))
    completed_count, avg_price, total_vol = c.fetchone()
    conn.close()

    if not completed_count or completed_count == 0:
        return {
            "buyer_info": dict(b),
            "profile_title": "Buyer Activity & Transaction Profile",
            "transaction_summary": "Insufficient transaction history.",
            "completed_orders": 0,
            "verification": b["verification_status"]
        }

    return {
        "buyer_info": dict(b),
        "profile_title": "Buyer Activity & Transaction Profile",
        "completed_transactions": completed_count,
        "total_volume_purchased_qtl": total_vol,
        "average_settlement_timeline": "24–48 Hours",
        "verification": b["verification_status"]
    }

@router.get("/cash-need-decision")
def get_cash_need_decision(days: int = 3, qty: float = 32.0, crop: str = "Basmati Paddy"):
    # Real DB query for highest confirmed buyer quote
    conn = sqlite3.connect(DB_FILE)
    c = conn.cursor()
    c.execute("SELECT MAX(offered_price_per_qtl) FROM buyer_profiles WHERE LOWER(required_crop) LIKE LOWER(?)", (f"%{crop}%",))
    max_b = c.fetchone()[0] or 3600.0
    conn.close()

    decision = evaluate_cash_need_mode(
        days_needed=days,
        farmer_qty=qty,
        best_buyer_price=float(max_b),
        mandi_spot_price=3580.0,
        forecasted_14d_price=3850.0,
        storage_cost_monthly_qtl=45.0
    )
    return decision

@router.get("/notifications/{farmer_id}")
def get_notifications(farmer_id: str = "F-GURPREET-01"):
    conn = sqlite3.connect(DB_FILE)
    conn.row_factory = sqlite3.Row
    c = conn.cursor()
    c.execute("SELECT * FROM farmer_notifications WHERE farmer_id = ? ORDER BY created_at DESC LIMIT 10", (farmer_id,))
    rows = c.fetchall()
    conn.close()
    return {"notifications": [dict(r) for r in rows]}

@router.post("/voice-query")
def process_farmer_voice_query(payload: Dict[str, Any] = Body(...)):
    query = payload.get("query", "").lower()
    lang = payload.get("lang", "hi") # hi, pa, en
    
    # Real DB Lookup
    conn = sqlite3.connect(DB_FILE)
    c = conn.cursor()
    c.execute("SELECT name, offered_price_per_qtl, location_name FROM buyer_profiles WHERE LOWER(required_crop) LIKE '%basmati%' ORDER BY offered_price_per_qtl DESC LIMIT 1")
    row = c.fetchone()
    conn.close()

    if not row:
        return {"response": "Filhaal koi live buyer uplabdh nahi hai."}

    b_name, b_price, b_loc = row

    if "buyer" in query or "kaun" in query or "khareed" in query or "bhav" in query:
        if lang == "pa":
            speech = f"Tuhade layi sab ton wadiya buyer {b_name} hai, jo ₹{b_price} prati quintal da bhav de rahe han."
        elif lang == "hi":
            speech = f"Aapke liye sabse behtar buyer {b_name} hain, jo ₹{b_price} prati quintal ka rate de rahe hain."
        else:
            speech = f"Your best available buyer is {b_name}, offering ₹{b_price} per quintal at {b_loc}."
    else:
        speech = f"AgriSetu live update: Basmati peak buyer rate is ₹{b_price} per quintal."

    return {
        "status": "success",
        "language": lang,
        "input_query": query,
        "spoken_response": speech
    }