from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api import intelligence, mandi

app = FastAPI(
    title="KisanLogic AI Backend Engine",
    description="Realtime Agricultural Decision & NASA Intelligence API",
    version="2.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Attach Routers
app.include_router(intelligence.router, prefix="/api/intelligence", tags=["Intelligence"])
app.include_router(mandi.router, prefix="/api", tags=["Mandi Prices"])

@app.get("/")
def root():
    return {
        "status": "online",
        "service": "KisanLogic AI Realtime Backend Engine",
        "version": "2.0.0"
    }