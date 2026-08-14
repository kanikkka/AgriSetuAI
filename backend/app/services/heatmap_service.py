from collections import defaultdict


def build_heatmap_data(supplies, demands):
    district_data = defaultdict(
        lambda: {
            "supply": 0.0,
            "demand": 0.0
        }
    )

    for supply in supplies:
        if supply.status != "OPEN":
            continue

        district = supply.district or "Unknown"

        district_data[district]["supply"] += (
            supply.quantity_quintal
        )

    for demand in demands:
        if demand.status != "OPEN":
            continue

        district = demand.district or "Unknown"

        district_data[district]["demand"] += (
            demand.quantity_quintal
        )

    result = []

    for district, values in district_data.items():
        supply = values["supply"]
        demand = values["demand"]

        gap = supply - demand

        if gap > 0:
            status = "SURPLUS"
        elif gap < 0:
            status = "SHORTAGE"
        else:
            status = "BALANCED"

        intensity = abs(gap)

        result.append({
            "district": district,
            "future_supply_quintal": supply,
            "future_demand_quintal": demand,
            "gap": gap,
            "status": status,
            "intensity": intensity
        })

    return result
