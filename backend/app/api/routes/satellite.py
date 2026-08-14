from fastapi import APIRouter, HTTPException

from app.services.firms_service import get_punjab_fire_data


router = APIRouter(
    prefix="/satellite",
    tags=["NASA FIRMS Intelligence"]
)


@router.get("/fires")
async def get_fire_intelligence(
    days: int = 1
):
    try:
        df = await get_punjab_fire_data(days)

        if df.empty:
            return {
                "total_detections": 0,
                "average_frp": 0,
                "high_intensity_detections": 0,
                "detections": []
            }

        average_frp = round(
            float(df["frp"].mean()),
            2
        )

        high_intensity = df[
            df["frp"] >= 10
        ]

        records = df[
            [
                "latitude",
                "longitude",
                "acq_date",
                "acq_time",
                "confidence",
                "frp",
                "daynight"
            ]
        ].head(100).to_dict(
            orient="records"
        )

        return {
            "total_detections": len(df),
            "average_frp": average_frp,
            "high_intensity_detections": len(high_intensity),
            "detections": records
        }

    except Exception as error:
        raise HTTPException(
            status_code=500,
            detail=f"NASA FIRMS error: {str(error)}"
        )
