from fastapi import APIRouter, HTTPException

from app.services.weather_service import get_weather_data


router = APIRouter(
    prefix="/weather",
    tags=["Weather Intelligence"]
)


@router.get("")
async def get_weather(
    latitude: float,
    longitude: float
):
    try:
        weather = await get_weather_data(
            latitude,
            longitude
        )

        return {
            "location": {
                "latitude": latitude,
                "longitude": longitude
            },
            "current": weather.get("current"),
            "daily": weather.get("daily")
        }

    except Exception as error:
        raise HTTPException(
            status_code=500,
            detail=f"Weather service error: {str(error)}"
        )
