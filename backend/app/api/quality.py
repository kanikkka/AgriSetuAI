from fastapi import APIRouter, UploadFile, File, Form
import random
import time

router = APIRouter()

@router.post("/analyze-grain")
async def analyze_grain_sample(
    crop_type: str = Form("Wheat"),
    file: UploadFile = File(None)
):
    # Simulated Deep Learning / CV Feature Extraction
    time.sleep(0.8) # realistic processing lag
    
    # Generate realistic grain metrics within FCI standard ranges
    moisture = round(random.uniform(10.5, 13.8), 1)
    broken_grains = round(random.uniform(1.2, 4.8), 1)
    foreign_matter = round(random.uniform(0.3, 1.4), 1)
    immature_shriveled = round(random.uniform(0.8, 2.5), 1)
    
    # FCI Compliance Logic
    is_grade_a = moisture <= 12.0 and broken_grains <= 4.0 and foreign_matter <= 1.0
    dockage_penalty = 0 if is_grade_a else int((max(0, moisture - 12.0) * 20) + (max(0, broken_grains - 4.0) * 15))
    
    return {
        "status": "success",
        "crop": crop_type,
        "filename": file.filename if file else "live_sample.jpg",
        "quality_score": 94 if is_grade_a else 78,
        "grade": "FCI Grade A (Premium Procurement)" if is_grade_a else "FAQ Standard (Minor Dockage)",
        "dockage_penalty": f"₹{dockage_penalty}/Qtl" if dockage_penalty > 0 else "₹0 (0% Cut Guaranteed)",
        "metrics": {
            "moisture": {"value": moisture, "limit": 12.0, "unit": "%", "status": "Pass" if moisture <= 12.0 else "High"},
            "broken": {"value": broken_grains, "limit": 4.0, "unit": "%", "status": "Pass" if broken_grains <= 4.0 else "Moderate"},
            "foreign_matter": {"value": foreign_matter, "limit": 1.0, "unit": "%", "status": "Pass" if foreign_matter <= 1.0 else "Attention"},
            "shriveled": {"value": immature_shriveled, "limit": 3.0, "unit": "%", "status": "Pass"}
        },
        "advisory": "Clean moisture profile. Recommended for direct FCI/corporate procurement to avoid arhatiya commission deductions." if is_grade_a else "Slight sun drying (1-2 hours) recommended to reduce moisture below 12.0%."
    }