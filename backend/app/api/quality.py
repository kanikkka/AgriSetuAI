from fastapi import APIRouter, UploadFile, File, Form
import random
import time
import uuid

router = APIRouter()

@router.post("/analyze-grain")
async def analyze_grain_sample(
    crop_type: str = Form("Wheat"),
    file: UploadFile = File(None)
):
    time.sleep(0.6)
    moisture = round(random.uniform(10.5, 12.8), 1)
    broken_grains = round(random.uniform(1.2, 3.8), 1)
    foreign_matter = round(random.uniform(0.3, 0.9), 1)
    is_grade_a = moisture <= 12.0 and broken_grains <= 4.0 and foreign_matter <= 1.0
    
    lot_id = f"LOT-{random.randint(1000, 9999)}-PB"
    qr_data = f"AGRISETU-PASS:{lot_id}|CROP:{crop_type}|GRADE:Grade-A|MOISTURE:{moisture}%|DOCKAGE:0%"

    return {
        "status": "success",
        "lot_id": lot_id,
        "crop": crop_type,
        "quality_score": 96 if is_grade_a else 82,
        "grade": "FCI Grade A (Premium Direct Pass)" if is_grade_a else "FAQ Standard (Minor Sun-Drying Needed)",
        "dockage_penalty": "₹0 (0% Cut Guaranteed)",
        "metrics": {
            "moisture": {"value": moisture, "limit": 12.0, "status": "Compliant"},
            "broken": {"value": broken_grains, "limit": 4.0, "status": "Safe"},
            "foreign_matter": {"value": foreign_matter, "limit": 1.0, "status": "Clean"}
        },
        "qr_payload": qr_data,
        "gate_pass": {
            "farmer_name": "Sardar Harpreet Singh",
            "dispatch_yard": "Khanna APMC Main Gate",
            "truck_no": "PB-10-CZ-4921",
            "est_weight": "250 Quintals",
            "issue_time": time.strftime("%d %b %Y, %I:%M %p")
        }
    }