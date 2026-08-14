from collections import defaultdict


def build_intent_network(supplies, demands):
    crop_supply = defaultdict(float)
    crop_demand = defaultdict(float)

    for supply in supplies:
        if supply.status == "OPEN":
            crop_supply[supply.crop_name] += supply.quantity_quintal

    for demand in demands:
        if demand.status == "OPEN":
            crop_demand[demand.crop_name] += demand.quantity_quintal

    crops = set(crop_supply.keys()) | set(crop_demand.keys())

    network = []

    for crop in crops:
        supply = crop_supply.get(crop, 0)
        demand = crop_demand.get(crop, 0)

        gap = supply - demand

        if gap > 0:
            status = "SURPLUS"
        elif gap < 0:
            status = "SHORTAGE"
        else:
            status = "BALANCED"

        network.append({
            "crop": crop,
            "future_supply_quintal": supply,
            "future_demand_quintal": demand,
            "supply_demand_gap": gap,
            "market_status": status
        })

    return network
