import datetime
from sqlalchemy.orm import Session
from app.models.disaster import Disaster
from app.models.hospital import Hospital
from app.models.rescue_team import RescueTeam
from app.models.resource import Resource
from app.models.alert import Alert

def seed_database(db: Session):
    # Only seed if tables are empty
    if db.query(Hospital).first():
        return

    # 1. Seed Hospitals
    hospitals = [
        Hospital(
            name="AIIMS Apex Trauma & Disaster Center",
            latitude=16.5120,
            longitude=80.6250,
            available_beds=68,
            icu_beds=18,
            emergency_capacity=150,
            medical_staff=45,
            contact_phone="+91-866-2489001",
            address="National Highway Sector 4, Emergency Quad"
        ),
        Hospital(
            name="Government General Hospital & Trauma Care",
            latitude=16.5050,
            longitude=80.6400,
            available_beds=42,
            icu_beds=12,
            emergency_capacity=120,
            medical_staff=35,
            contact_phone="+91-866-2577002",
            address="Civil Hospital Road, Ward 12"
        ),
        Hospital(
            name="Apollo Emergency & Multi-Specialty Hub",
            latitude=16.5300,
            longitude=80.6100,
            available_beds=25,
            icu_beds=8,
            emergency_capacity=80,
            medical_staff=28,
            contact_phone="+91-866-2699003",
            address="Bypass Expressway, Health City"
        ),
        Hospital(
            name="St. Joseph Red Cross Disaster Relief Clinic",
            latitude=16.4800,
            longitude=80.6600,
            available_beds=15,
            icu_beds=4,
            emergency_capacity=50,
            medical_staff=18,
            contact_phone="+91-866-2311004",
            address="Mission Compound, South Ring"
        ),
        Hospital(
            name="Apex Critical Care & Casualty Hospital",
            latitude=16.5450,
            longitude=80.6700,
            available_beds=32,
            icu_beds=10,
            emergency_capacity=90,
            medical_staff=30,
            contact_phone="+91-866-2844005",
            address="Eastern Corridor Tech Park"
        )
    ]
    db.add_all(hospitals)

    # 2. Seed Rescue Teams
    rescue_teams = [
        RescueTeam(
            name="NDRF 10th Battalion - Rapid Flood Unit Alpha",
            unit_type="NDRF Special Ops",
            latitude=16.5250,
            longitude=80.6050,
            personnel_count=35,
            equipment=["4 Inflatable Gemini Motorboats", "Sonar Deep Scanners", "Thermal Drones", "60 Life Vests"],
            status="AVAILABLE",
            contact_radio="CH-09 NDRF-HQ"
        ),
        RescueTeam(
            name="SDRF Disaster Marine & Riverine Taskforce",
            unit_type="State Disaster Response Force",
            latitude=16.4950,
            longitude=80.6450,
            personnel_count=28,
            equipment=["3 Zodiac Inflatable Rafts", "High-Power Outboard Motors", "Life Bouys", "Medical Stretchers"],
            status="AVAILABLE",
            contact_radio="CH-04 SDRF-DELTA"
        ),
        RescueTeam(
            name="State Fire & Tactical Heavy Rescue Squad",
            unit_type="Civil Defense & Fire Rescue",
            latitude=16.5400,
            longitude=80.6300,
            personnel_count=22,
            equipment=["Hydraulic Cutters", "High-Discharge De-Watering Pumps", "Rescue Ladders", "Emergency Lighting Towers"],
            status="AVAILABLE",
            contact_radio="CH-12 FIRE-CTRL"
        ),
        RescueTeam(
            name="Army HADR Humanitarian Rescue Column",
            unit_type="Indian Armed Forces HADR",
            latitude=16.4700,
            longitude=80.5900,
            personnel_count=45,
            equipment=["All-Terrain 4x4 Amphibious Trucks", "Satellite Ground Terminal", "Emergency Field Surgery Unit"],
            status="STANDBY",
            contact_radio="CH-01 ARMY-HADR"
        )
    ]
    db.add_all(rescue_teams)

    # 3. Seed Resources
    resources = [
        Resource(
            item_name="Ready-to-Eat Rations & Food Packets (Meal Ready)",
            category="RATION",
            total_stock=25000,
            available_stock=23400,
            unit="packets",
            warehouse_location="District Civil Supplies Warehouse 1"
        ),
        Resource(
            item_name="Purified Potable Drinking Water Jerricans (5 Litres)",
            category="WATER",
            total_stock=30000,
            available_stock=28200,
            unit="litres",
            warehouse_location="State Water Mission Emergency Depo"
        ),
        Resource(
            item_name="Emergency Trauma Medical Kits & Antiseptics",
            category="MEDICAL",
            total_stock=5000,
            available_stock=4750,
            unit="kits",
            warehouse_location="Red Cross Regional Disaster Supply Center"
        ),
        Resource(
            item_name="Thermal Fleece Blankets & Water-Resistant Mats",
            category="SHELTER",
            total_stock=12000,
            available_stock=11300,
            unit="units",
            warehouse_location="Central State Disaster Relief Depo"
        ),
        Resource(
            item_name="Emergency Waterproof Family Tents (6-Person)",
            category="SHELTER",
            total_stock=2000,
            available_stock=1880,
            unit="tents",
            warehouse_location="Central State Disaster Relief Depo"
        ),
        Resource(
            item_name="Solar Emergency Lanterns & Signaling Flares",
            category="RESCUE_GEAR",
            total_stock=6000,
            available_stock=5600,
            unit="units",
            warehouse_location="NDRF Logistics Hub"
        )
    ]
    db.add_all(resources)

    # 4. Seed Pre-existing Disasters
    disasters = [
        Disaster(
            title="Severe Flash Flood & Embankment Breach",
            disaster_type="Flood",
            description="Rising water levels in the lower basin caused flooding in low-lying residential clusters. Over 70 households stranded on rooftops.",
            evidence_url="https://images.unsplash.com/photo-1547683905-f686c993aae5?auto=format&fit=crop&w=800&q=80",
            latitude=16.5062,
            longitude=80.6480,
            location_name="Bhavanipuram Lowland Basin, Sector 4",
            affected_people=85,
            severity="HIGH",
            status="DISPATCHED",
            verification_score=92.5,
            verification_details={
                "confidence": 92.5,
                "label": "HIGH CONFIDENCE (AI Verified)",
                "gps_valid": True,
                "weather_correlation": "Heavy Precipitation (135mm in past 6 hrs)",
                "visual_cues": "Submerged structures, muddy turbulent water flow, elevated citizens",
                "risk_multiplier": "Flash flood warning active"
            },
            response_plan={
                "disaster": "Flood",
                "severity": "HIGH",
                "weather": {"rainfall": "135 mm/h", "wind": "42 km/h", "warning": "Red Flood Alert"},
                "rescue": {"teams": 2, "personnel": 45, "boats": 4, "priority": "P1 - Immediate Evacuation"},
                "hospital": {"recommended": "AIIMS Apex Trauma & Disaster Center", "distance_km": 4.2, "available_beds": 68},
                "traffic": {"primary_route": "NH-65 Main Bridge (SUBMERGED)", "alternate_route": "Eastern Canal Ring Corridor (CLEAR)"},
                "resources": {"food_packets": 255, "water_litres": 255, "medical_kits": 85, "tents": 15}
            },
            created_at=datetime.datetime.utcnow() - datetime.timedelta(hours=2)
        ),
        Disaster(
            title="Severe Cyclone Storm Surge & Coastal Winds",
            disaster_type="Cyclone",
            description="High-velocity gale winds exceeding 110 km/h with 2.5m storm surges breaching coastal fishing villages.",
            evidence_url="https://images.unsplash.com/photo-1527482797697-8795b05a13fe?auto=format&fit=crop&w=800&q=80",
            latitude=16.1875,
            longitude=81.1389,
            location_name="Machilipatnam Coastal Belt",
            affected_people=220,
            severity="CRITICAL",
            status="VERIFIED",
            verification_score=95.0,
            verification_details={
                "confidence": 95.0,
                "label": "CRITICAL CONFIDENCE",
                "gps_valid": True,
                "weather_correlation": "Severe Cyclonic Storm landfall",
                "visual_cues": "Uprooted trees, high tides, tin roof damage"
            },
            response_plan={
                "disaster": "Cyclone",
                "severity": "CRITICAL",
                "weather": {"rainfall": "190 mm/h", "wind": "115 km/h", "warning": "Red Storm Surge Alert"},
                "rescue": {"teams": 4, "personnel": 90, "boats": 6, "priority": "P1 - Coastal Evacuation"},
                "hospital": {"recommended": "District Red Cross Medical Hub", "distance_km": 8.5, "available_beds": 50},
                "traffic": {"primary_route": "Coastal Link Road (BLOCKED)", "alternate_route": "State Highway 32 Inward Bypass (CLEAR)"},
                "resources": {"food_packets": 660, "water_litres": 660, "medical_kits": 220, "tents": 40}
            },
            created_at=datetime.datetime.utcnow() - datetime.timedelta(hours=5)
        ),
        Disaster(
            title="Industrial Chemical Fire & Structural Hazard",
            disaster_type="Fire",
            description="Major fire incident at solvent chemical storage plant with dense toxic smoke plumes spreading toward nearby settlements.",
            evidence_url="https://images.unsplash.com/photo-1599818816933-4f96885df491?auto=format&fit=crop&w=800&q=80",
            latitude=16.5500,
            longitude=80.5800,
            location_name="Autonagar Industrial Phase II",
            affected_people=40,
            severity="HIGH",
            status="REPORTED",
            verification_score=88.0,
            verification_details={
                "confidence": 88.0,
                "label": "HIGH CONFIDENCE",
                "gps_valid": True,
                "weather_correlation": "Dry, 38C ambient, NW wind carrying plumes",
                "visual_cues": "Dense black smoke, active flames, industrial silos"
            },
            response_plan=None,
            created_at=datetime.datetime.utcnow() - datetime.timedelta(minutes=45)
        )
    ]
    db.add_all(disasters)

    # 5. Seed Alerts
    alerts = [
        Alert(
            disaster_id=1,
            alert_type="GOVERNMENT",
            target_role="DISTRICT_MAGISTRATE",
            title="FLASH FLOOD ESCALATION: Bhavanipuram Lowland Basin",
            message="Emergency alert: 85 citizens stranded due to embankment overflow. P1 evacuation mobilized with NDRF Unit Alpha.",
            severity="HIGH"
        ),
        Alert(
            disaster_id=1,
            alert_type="HOSPITAL",
            target_role="CHIEF_MEDICAL_OFFICER",
            title="TRAUMA ADVISORY: AIIMS Trauma Center On Standby",
            message="Prepare 25 emergency trauma beds and flood-related hypothermia care units. First evacuees arriving via Alternate Canal Corridor.",
            severity="HIGH"
        ),
        Alert(
            disaster_id=2,
            alert_type="GOVERNMENT",
            target_role="NDMA_WAR_ROOM",
            title="CRITICAL CYCLONE IMPACT: Machilipatnam Coastal Belt",
            message="Severe Cyclonic Storm surge landfall. 4 NDRF columns deployed with satellite radios. Mandatory shelter evacuation triggered.",
            severity="CRITICAL"
        ),
        Alert(
            disaster_id=1,
            alert_type="SMS",
            target_role="PUBLIC_CITIZEN",
            title="CIVIL EMERGENCY SMS BROADCAST",
            message="🚨 DISASTER ALERT: Flood detected at Bhavanipuram Basin. Severity: HIGH. Evacuate to AIIMS Trauma shelter. Route: Canal Ring Road.",
            severity="HIGH"
        )
    ]
    db.add_all(alerts)

    db.commit()
