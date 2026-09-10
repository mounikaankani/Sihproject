import math
from app.schemas.agent import ResourceAgentOutput

class ResourceAgent:
    """
    AI Resource Agent:
    Calculates exact emergency humanitarian relief quotas based on
    Sphere International Humanitarian Standards and NDMA relief guidelines.
    """

    def analyze(self, affected_people: int, severity: str, disaster_type: str) -> ResourceAgentOutput:
        count = max(1, affected_people)
        sev = (severity or "MEDIUM").strip().upper()

        # Operational duration multiplier: higher severity implies longer isolation window
        duration_days = {"LOW": 1.5, "MEDIUM": 2.0, "HIGH": 3.0, "CRITICAL": 4.0}.get(sev, 2.0)

        # Standards: 3 meals/day, 3 liters clean water/day/person
        food_packets = int(count * 3 * duration_days)
        water_liters = int(count * 3 * duration_days)
        
        # Medical kits: 1 kit per 4 persons for high/critical, 1 per 6 for medium/low
        med_ratio = 4 if sev in ["HIGH", "CRITICAL"] else 6
        medical_kits = max(5, math.ceil(count / med_ratio))

        # Blankets: 1.5 per person in cold/rainy/waterlogged conditions
        blanket_factor = 2 if sev in ["HIGH", "CRITICAL"] else 1
        blankets = int(count * blanket_factor)

        # Temporary shelters (6-person family all-weather tents)
        shelters = max(2, math.ceil(count / 5.0))

        # Family hygiene packs (soap, water purification tablets, sanitary items)
        hygiene_packs = max(5, math.ceil(count / 2.0))

        dtype = (disaster_type or "").lower()
        if "flood" in dtype:
            strategy = (
                "Airdrop waterproof food/water capsules to stranded rooftop clusters. "
                "Deploy mobile chlorine-dosing water filtration units to elevated relief camps."
            )
        elif "cyclone" in dtype:
            strategy = (
                "Stage bulk food and clean water in designated reinforced cyclone shelters. "
                "Distribute tarpaulin sheets and roof repair kits along inland staging lines."
            )
        elif "fire" in dtype:
            strategy = (
                "Focus on burn dressing supplies, sterile saline eyewashes, oxygen concentrators, "
                "and temporary transition shelters outside smoke dispersal perimeter."
            )
        else:
            strategy = "Establish centralized community kitchen and organized distribution queue."

        rationale = (
            f"Relief formula modeled for {count} affected individuals across a {duration_days}-day "
            f"isolation projection under {sev} severity parameters (Sphere Humanitarian Standards)."
        )

        return ResourceAgentOutput(
            food_packets=food_packets,
            drinking_water_liters=water_liters,
            medical_kits=medical_kits,
            blankets=blankets,
            temporary_shelters=shelters,
            hygiene_packs=hygiene_packs,
            distribution_strategy=strategy,
            allocation_rationale=rationale
        )
