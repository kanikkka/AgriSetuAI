from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.mandi import router as mandi_router
from app.api.quality import router as quality_router
from app.api.copilot import router as copilot_router
from app.api.coalition import router as coalition_router
from app.api.notifications import router as notify_router

app = FastAPI(title="AgriSetu AI Enterprise API")

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
app.include_router(notify_router, prefix="/api/notify", tags=["Notifications"])

@app.get("/")
def read_root():
    return {"status": "online", "engine": "AgriSetu AI Kisan v3.0 Production", "sync": "Agmarknet Live Gateway"}