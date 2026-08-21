from fastapi import APIRouter
import pandas as pd
import os
import glob
from datetime import datetime

router = APIRouter()

ORIGIN_FARM = {"lat": 30.7046, "lng": 76.7179} # SAS Nagar / Chandigarh Belt

def find_csv():
    # Check data folder or current folder for any matching csv
    paths = glob.glob("app/data/*.csv") + glob.glob("*.csv") + glob.glob("../*.csv")
    for p in paths:
        if "35985678" in p or "agmarknet" in p:
            return p
    return paths[0] if paths else None

@router.get("/live-rates")
def get_csv_live_rates(crop: str = "Tomato"):
    csv_file = find_csv()
    mandis_list = []
    
    clean_crop = "Tomato" if "tomato" in crop.lower() else "Ginger" if "ginger" in crop.lower() else "Green Chilli" if "chilli" in crop.lower() else "Cauliflower" if "cauli" in crop.lower() else "Wheat" if "wheat" in crop.lower() else crop

    if csv_file and os.path.exists(csv_file):
        try:
            df = pd.read_csv(csv_file)
            matched = df[df['Commodity'].str.contains(clean_crop, case=False, na=False)]
            
            if not matched.empty:
                # Take the latest 5 distinct records from CSV
                recent_rows = matched.tail(5).iloc[::-1]
                
                for idx, (_, row) in enumerate(recent_rows.iterrows()):
                    m_name = str(row['Market'])
                    modal = float(row['Modal_Price'])
                    min_p = float(row.get('Min_Price', modal))
                    max_p = float(row.get('Max_Price', modal))
                    arrival = str(row.get('Arrival_Date', ''))
                    state = str(row.get('State', 'Punjab'))

                    # Transit math
                    km = 15.0 + (idx * 5.0)
                    diesel_cost = round((km * 2 / 4.5 * 87.80) / 100.0, 1)
                    toll_labor = 8.0
                    total_transit = round(diesel_cost + toll_labor, 1)
                    net_in_hand = round(modal - total_transit, 1)

                    mandis_list.append({
                        "id": idx + 1,
                        "name": f"{m_name} (Lot #{idx+1})",
                        "state": state,
                        "modal": modal,
                        "min_price": min_p,
                        "max_price": max_p,
                        "distance_km": km,
                        "drive_time": f"{round(km/40, 1)} hrs",
                        "diesel_cost": diesel_cost,
                        "toll_labor": toll_labor,
                        "total_transport": total_transit,
                        "net_in_hand": net_in_hand,
                        "arrival_date": arrival,
                        "source": f"CSV Row: {arrival} - {clean_crop}",
                        "is_best": (idx == 0)
                    })
        except Exception as e:
            print("CSV Read error:", e)

    return {
        "status": "success",
        "crop": clean_crop,
        "csv_loaded_from": csv_file,
        "total_records_found": len(mandis_list),
        "live_diesel_rate": "₹87.80",
        "mandis": mandis_list
    }