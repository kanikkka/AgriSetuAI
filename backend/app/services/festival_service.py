from datetime import datetime


def analyze_festival_demand(
    festival,
    current_date: str
):
    today = datetime.strptime(
        current_date,
        "%Y-%m-%d"
    )

    festival_date = datetime.strptime(
        festival.festival_date,
        "%Y-%m-%d"
    )

    days_until = (
        festival_date - today
    ).days

    impact = festival.expected_demand_change_percent

    if days_until < 0:
        status = "PAST"

    elif days_until <= 7 and impact > 0:
        status = "HIGH_DEMAND_WINDOW"

    elif days_until <= 15 and impact > 0:
        status = "RISING_DEMAND"

    else:
        status = "NORMAL"

    return {
        "festival": festival.festival_name,
        "crop": festival.crop_name,
        "days_until_festival": days_until,
        "expected_demand_change_percent": impact,
        "status": status
    }
