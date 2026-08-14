from collections import defaultdict


def build_coalitions(supplies, demands):
    coalitions = []

    grouped_supplies = defaultdict(list)

    for supply in supplies:
        key = (
            supply.crop_name.lower(),
            (supply.quality_grade or "").lower(),
            (supply.district or "").lower()
        )

        grouped_supplies[key].append(supply)

    for demand in demands:
        key = (
            demand.crop_name.lower(),
            (demand.quality_grade or "").lower(),
            (demand.district or "").lower()
        )

        matching_supplies = grouped_supplies.get(key, [])

        if not matching_supplies:
            continue

        selected_farmers = []
        total_quantity = 0

        for supply in matching_supplies:
            if supply.status != "OPEN":
                continue

            selected_farmers.append({
                "supply_id": supply.id,
                "farmer_id": supply.farmer_id,
                "quantity_quintal": supply.quantity_quintal
            })

            total_quantity += supply.quantity_quintal

            if total_quantity >= demand.quantity_quintal:
                break

        if total_quantity > 0:
            fulfilment_percent = round(
                min(
                    total_quantity / demand.quantity_quintal * 100,
                    100
                ),
                2
            )

            coalitions.append({
                "demand_id": demand.id,
                "crop": demand.crop_name,
                "buyer_requirement": demand.quantity_quintal,
                "coalition_quantity": total_quantity,
                "fulfilment_percent": fulfilment_percent,
                "farmers_count": len(selected_farmers),
                "farmers": selected_farmers
            })

    return coalitions
