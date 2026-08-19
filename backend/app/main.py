from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.mandi import router as mandi_router

app = FastAPI(title="AgriSetu AI Backend Engine")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(mandi_router, prefix="/api/mandi", tags=["Mandi"])

@app.get("/")
def read_root():
    return {"status": "online", "engine": "AgriSetu AI Kisan v2.0"}