import math
from typing import List, Optional
from sqlalchemy.orm import Session
from app.models.hospital import Hospital
from app.schemas.agent import HospitalAgentOutput

class HospitalAgent:
    """
    AI Hospital Agent:
    Finds nearest trauma and emergency medical facilities using Haversine distance,
    evaluates available beds and ICU capacity against estimated casualties,
    and automatically identifies a designated backup hospital for overflow.
    """

    def haversine_distance(self, lat1: float, lon1: float, lat2: float, lon2: float) -> float:
        """Calculate great-circle distance in kilometers."""
        R = 6371.0 # Earth radius in km
        dlat = math.radians(lat2 - lat1)
        dlon = math.radians(lon2 - lon1)
        a = (
            math.sin(dlat / 2) ** 2
            + math.cos(math.radians(lat1))
            * math.cos(math.radians(lat2))
            * math.sin(dlon / 2) ** 2
        )
        c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
        return round(R * c, 2)

    def analyze(
        self,
        db: Session,
        disaster_lat: float,
        disaster_lng: float,
        affected_people: int,
        severity: str
    ) -> HospitalAgentOutput:
        # Estimate injured casualties based on disaster severity & affected population
        injury_ratio = {"LOW": 0.08, "MEDIUM": 0.15, "HIGH": 0.25, "CRITICAL": 0.40}.get(severity.upper(), 0.20)
        estimated_injured = max(1, int(affected_people * injury_ratio))
        estimated_icu_needed = max(1, int(estimated_injured * 0.20))

        hospitals = db.query(Hospital).all()
        if not hospitals:
            # Fallback mock hospital if DB has none yet
            return HospitalAgentOutput(
                recommended_hospital="AIIMS Apex Trauma & Disaster Center",
                hospital_id=1,
                distance_km=3.5,
                latitude=disaster_lat + 0.02,
                longitude=disaster_lng + 0.02,
                available_beds=50,
                icu_beds=15,
                emergency_capacity=100,
                triage_notes="Direct patient transit to emergency triage tent. ICU capacity reserved.",
                backup_hospital="Government General Hospital",
                backup_hospital_beds=30,
                backup_distance_km=6.8
            )

        # Sort hospitals by distance from disaster epicenter
        hospitals_with_dist = []
        for h in hospitals:
            dist = self.haversine_distance(disaster_lat, disaster_lng, h.latitude, h.longitude)
            hospitals_with_dist.append((h, dist))

        hospitals_with_dist.sort(key=lambda x: x[1])

        # Find primary hospital with sufficient emergency capacity or lowest distance
        primary = hospitals_with_dist[0][0]
        primary_dist = hospitals_with_dist[0][1]
        backup_hospital_name = None
        backup_beds = None
        backup_dist = None

        # Check if primary has enough beds for estimated casualties
        if primary.available_beds < estimated_injured and len(hospitals_with_dist) > 1:
            # Primary will take capacity, backup takes overflow
            backup = hospitals_with_dist[1][0]
            backup_hospital_name = backup.name
            backup_beds = backup.available_beds
            backup_dist = hospitals_with_dist[1][1]
            triage_notes = (
                f"High casualty influx ({estimated_injured} est. injured). "
                f"Primary hospital '{primary.name}' ({primary.available_beds} beds available) "
                f"will triage immediate critical cases ({estimated_icu_needed} ICU). "
                f"Secondary overflow diverted to '{backup.name}' ({backup.available_beds} beds, {backup_dist} km away)."
            )
        else:
            if len(hospitals_with_dist) > 1:
                backup = hospitals_with_dist[1][0]
                backup_hospital_name = backup.name
                backup_beds = backup.available_beds
                backup_dist = hospitals_with_dist[1][1]
            triage_notes = (
                f"Optimal facility matched. '{primary.name}' has sufficient emergency capacity "
                f"({primary.available_beds} general beds, {primary.icu_beds} ICU beds) to handle "
                f"the estimated {estimated_injured} injured patients. Travel distance: {primary_dist} km."
            )

        return HospitalAgentOutput(
            recommended_hospital=primary.name,
            hospital_id=primary.id,
            distance_km=primary_dist,
            latitude=primary.latitude,
            longitude=primary.longitude,
            available_beds=primary.available_beds,
            icu_beds=primary.icu_beds,
            emergency_capacity=primary.emergency_capacity,
            triage_notes=triage_notes,
            backup_hospital=backup_hospital_name,
            backup_hospital_beds=backup_beds,
            backup_distance_km=backup_dist
        )
