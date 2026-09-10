import math
from typing import List
from sqlalchemy.orm import Session
from app.models.rescue_team import RescueTeam
from app.schemas.agent import RescueAgentOutput

class RescueAgent:
    """
    AI Rescue Agent:
    Determines NDRF/SDRF tactical response: personnel sizing, watercraft,
    heavy rescue equipment, tactical priorities, and specific rescue battalion assignments.
    """

    def analyze(
        self,
        db: Session,
        disaster_type: str,
        affected_people: int,
        severity: str
    ) -> RescueAgentOutput:
        dtype = (disaster_type or "").strip().lower()
        sev = (severity or "MEDIUM").strip().upper()

        # Severity multiplier
        sev_multiplier = {"LOW": 1, "MEDIUM": 1.5, "HIGH": 2.2, "CRITICAL": 3.0}.get(sev, 1.5)

        # Baseline calculations based on affected population
        # 1 rescue team per ~40-50 people in critical/high emergencies
        base_teams = max(1, math.ceil((affected_people / 35.0) * (sev_multiplier / 2.0)))
        teams_required = min(8, base_teams) # Cap at realistic maximum for a district deployment
        personnel_required = teams_required * 18 # 18 specialist personnel per squad

        boats_required = 0
        vehicles_required = max(2, teams_required * 2)
        equipment = []
        actions = []

        if "flood" in dtype:
            priority = "P1 - LIFE SAFETY & WATER EVACUATION" if sev in ["HIGH", "CRITICAL"] else "P2 - URGENT FLOOD ASSISTANCE"
            boats_required = max(2, math.ceil(teams_required * 1.5))
            equipment = [
                f"{boats_required} Inflatable Motorized Gemini Boats with Outboards",
                f"{affected_people * 2} Standard ISI Life Vests & Buoys",
                "Deep-water underwater sonar imaging units",
                "Tactical thermal-imaging drones for rooftop survivor locating",
                "Submersible high-flow trash pumps for dewatering key access points"
            ]
            actions = [
                "Establish amphibious launch point at highest elevated road crest",
                "Prioritize rooftop and tree-sheltered residents; rescue infants, elderly and pregnant women first",
                "Rig safety guide lines across submerged current crossings",
                "Broadcast megaphoned loudspeaker instructions in local dialect",
                "Air-drop inflatable life rafts to isolated pocket clusters unable to be reached by boat"
            ]

        elif "cyclone" in dtype:
            priority = "P1 - STORM SURGE RESCUE & CLEARANCE"
            boats_required = max(1, teams_required)
            equipment = [
                "Chain saws and heavy hydraulic tree-clearing winches",
                "All-weather SATCOM terminals (Inmarsat/BGAN)",
                f"{boats_required} Reinforced shallow-draft rescue skiffs",
                "Emergency lighting masts & generator trailering sets",
                "Portable floodlights and structural stabilization jacks"
            ]
            actions = [
                "Clear arterial roads of fallen trees and electrical pylons to permit ambulance transit",
                "Evacuate vulnerable mud-and-thatch hutments to reinforced cyclone multi-purpose shelters",
                "Set up satellite communication relay as cellular towers are disabled"
            ]

        elif "fire" in dtype:
            priority = "P1 - FIRE SUPPRESSION & CASUALTY RESCUE"
            boats_required = 0
            vehicles_required = max(3, teams_required * 2)
            equipment = [
                "Multi-stage high pressure fire tenders and foam crash tenders",
                "Self-Contained Breathing Apparatus (SCBA) air packs (60 sets)",
                "Thermal imaging search cameras for smoke-blinded interiors",
                "Hydraulic spreading tools & reinforced rescue litters",
                "Burn casualty cooling dressings & mobile oxygen stations"
            ]
            actions = [
                "Isolate flammable gas pipelines and hazardous solvent tanks",
                "Conduct interior primary search with SCBA teams in 2-person buddy pairs",
                "Deploy aerial ladder water monitors to protect exposed adjacent structures",
                "Establish triage decontamination sector upwind of smoke plume"
            ]

        elif "earthquake" in dtype:
            priority = "P1 - COLLAPSED STRUCTURE SEARCH & RESCUE (CSSR)"
            boats_required = 0
            vehicles_required = max(2, teams_required * 2)
            equipment = [
                "Acoustic listening devices and optical search cameras (Snake-cams)",
                "Pneumatic lifting bags (20-ton capacity) and hydraulic shoring struts",
                "Diamond-edge concrete cutters and rotary hammer drills",
                "K-9 Search and Rescue dog handlers",
                "Spinal immobilization boards and cervical collars"
            ]
            actions = [
                "Sectorize collapsed zones into Alpha, Bravo, Charlie structural grids",
                "Enforce strict 10-minute silence drills for acoustic detector survivor locating",
                "Shore unstable lintels and overhangs before entry into void spaces",
                "Administer on-site crush syndrome intravenous prophylaxis prior to debris extrication"
            ]

        elif "landslide" in dtype:
            priority = "P1 - MUD DEBRIS EXCAVATION & EVACUATION"
            boats_required = 0
            equipment = [
                "Mini tracked excavators and heavy earthmovers",
                "Soil stabilization netting and sandbag bulkheads",
                "Trench rescue shoring shields",
                "High-intensity floodlight arrays"
            ]
            actions = [
                "Establish spotters with horns on uphill ridge to monitor secondary slope slippage",
                "Divert hillside runoff away from active excavation zones using quick trenches",
                "Probe debris field using structural avalanche/mud probes"
            ]

        else:
            priority = "P2 - GENERAL FIRST RESPONDER DISPATCH"
            equipment = ["Multi-purpose emergency rescue kit", "First responder vehicle", "Communications pack"]
            actions = ["Conduct on-site situation assessment and cordon danger zone."]

        # Query rescue teams in DB to assign available names
        assigned_names = []
        try:
            db_teams = db.query(RescueTeam).filter(RescueTeam.status.in_(["AVAILABLE", "STANDBY"])).limit(teams_required).all()
            if db_teams:
                assigned_names = [t.name for t in db_teams]
        except Exception:
            pass

        if not assigned_names:
            assigned_names = [
                "NDRF 10th Battalion - Rapid Flood Unit Alpha",
                "SDRF Disaster Marine & Riverine Taskforce",
                "State Fire & Tactical Heavy Rescue Squad"
            ][:teams_required]

        return RescueAgentOutput(
            teams_required=teams_required,
            personnel_required=personnel_required,
            boats_required=boats_required,
            vehicles_required=vehicles_required,
            specialized_equipment=equipment,
            rescue_priority=priority,
            recommended_rescue_actions=actions,
            assigned_team_names=assigned_names
        )
