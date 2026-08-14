from app.services.master_intelligence import build_master_farmer_intelligence
from app.services.matching_engine import calculate_match_score
from app.services.coalition_engine import build_coalitions
from app.services.storage_matching import match_storage_options
from app.services.transport_matching import match_transport_options


def build_farmer_opportunities(
    day,
    month,
    previous_price,
    current_price,
    msp,
    weather_risk,
    quantity_quintal,
    storage_cost,
    transport_cost,
    data_quality_score,
    supply_intent,
    buyer_demands,
    all_supplies,
    storages,
    transporters,
    district,
    distance_km,
    storage_days
):
    intelligence = build_master_farmer_intelligence(
        day=day,
        month=month,
        previous_price=previous_price,
        current_price=current_price,
        msp=msp,
        weather_risk=weather_risk,
        quantity_quintal=quantity_quintal,
        storage_cost=storage_cost,
        transport_cost=transport_cost,
        data_quality_score=data_quality_score
    )

    buyer_matches = []

    if supply_intent:
        for demand in buyer_demands:
            if supply_intent.crop_name.lower() != demand.crop_name.lower():
                continue

            result = calculate_match_score(
                supply_intent,
                demand
            )

            if result["score"] >= 50:
                buyer_matches.append({
                    "demand_id": demand.id,
                    "buyer_user_id": demand.buyer_user_id,
                    "crop": demand.crop_name,
                    "buyer_requirement": demand.quantity_quintal,
                    "max_price_per_quintal": demand.max_price_per_quintal,
                    "match_score": result["score"],
                    "reasons": result["reasons"]
                })

    coalitions = build_coalitions(
        all_supplies,
        buyer_demands
    )

    storage_matches = match_storage_options(
        storages=storages,
        crop_name=supply_intent.crop_name if supply_intent else "",
        quantity_quintal=quantity_quintal,
        district=district,
        storage_days=storage_days
    )

    transport_matches = match_transport_options(
        providers=transporters,
        quantity_quintal=quantity_quintal,
        district=district,
        distance_km=distance_km
    )

    return {
        "intelligence": intelligence,
        "buyer_matches": buyer_matches,
        "coalition_opportunities": coalitions,
        "storage_options": storage_matches,
        "transport_options": transport_matches
    }
