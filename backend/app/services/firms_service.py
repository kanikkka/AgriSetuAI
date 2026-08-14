import io
import httpx
import pandas as pd

from app.core.config import settings


BASE_URL = "https://firms.modaps.eosdis.nasa.gov/api/area/csv"


async def get_punjab_fire_data(days: int = 1):
    # Approx Punjab bounding box:
    # west,south,east,north
    area = "73.8,29.5,76.9,32.6"

    source = "VIIRS_NOAA20_NRT"

    url = (
        f"{BASE_URL}/"
        f"{settings.NASA_FIRMS_MAP_KEY}/"
        f"{source}/"
        f"{area}/"
        f"{days}"
    )

    async with httpx.AsyncClient() as client:
        response = await client.get(
            url,
            timeout=20.0
        )

        response.raise_for_status()

    df = pd.read_csv(
        io.StringIO(response.text)
    )

    return df
