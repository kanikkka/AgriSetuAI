from fastapi import APIRouter
from pydantic import BaseModel
from typing import List

router = APIRouter()

class LogisticsRoute(BaseModel):
    id: int
    driver: str
    vehicle: str
    route: str
    available_capacity: str
    cost_sharing: str
    phone: str

class Warehouse(BaseModel):
    id: int
    name: str
    type: str
    distance: str
    rate: str
    capacity_available: str
    receipt_loan: str

LOGISTICS_DB: List[LogisticsRoute] = [
    LogisticsRoute(id=1, driver="Gurdeep Singh (Trolley)", vehicle="Swaraj 855 Double Trolley", route="Khanna ➔ Karnal Yard", available_capacity="120 Qtl Space Open", cost_sharing="₹14/Qtl (Save 45%)", phone="+91 98140-99881"),
    LogisticsRoute(id=2, driver="Jaswinder Logistics", vehicle="Eicher 14 Wheeler Truck", route="Samrala ➔ Rajpura APMC", available_capacity="250 Qtl Space Open", cost_sharing="₹18/Qtl (Save 35%)", phone="+91 94172-33441"),
]

WAREHOUSES_DB: List[Warehouse] = [
    Warehouse(id=1, name="CWC Central Warehouse Ludhiana", type="WDRA Certified", distance="12 km away", rate="₹4.20/Qtl/Month", capacity_available="1,400 MT Available", receipt_loan="Eligible for 75% e-NWR Loan"),
    Warehouse(id=2, name="Punjab State Warehousing Corp (Khanna)", type="State Mandi Yard", distance="4 km away", rate="₹3.80/Qtl/Month", capacity_available="850 MT Available", receipt_loan="Eligible for NABARD Subsidy"),
]

@router.get("/logistics")
def get_logistics():
    return {"status": "success", "rides": [r.dict() for r in LOGISTICS_DB]}

@router.get("/warehouses")
def get_warehouses():
    return {"status": "success", "warehouses": [w.dict() for w in WAREHOUSES_DB]}