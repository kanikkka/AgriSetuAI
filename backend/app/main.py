from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.mandi import router as mandi_router
from app.api.quality import router as quality_router
from app.api.copilot import router as copilot_router
from app.api.coalition import router as coalition_router
from app.api.telemetry_ivr import router as telemetry_router
from app.db import init_db

app = FastAPI(title="AgriSetu AI Enterprise Production")

init_db()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(mandi_router, prefix="/api/mandi", tags=["Mandi"])
app.include_router(quality_router, prefix="/api/quality", tags=["Quality"])
app.include_router(copilot_router, prefix="/api/copilot", tags=["Copilot"])
app.include_router(coalition_router, prefix="/api/coalitions", tags=["Coalitions"])
app.include_router(telemetry_router, prefix="/api/telemetry", tags=["IoT & Telephony"])

@app.get("/")
def read_root():
    return {"status": "online", "iot_gateway": "Active", "ivr_telephony": "Active"}