from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
import datetime

from app.database.session import get_db
from app.models.disaster import Disaster
from app.models.alert import Alert
from app.agents.orchestrator import AIOrchestrator
from app.services.sms_service import sms_service

router = APIRouter(prefix="/api/simulate", tags=["Simulation"])
orchestrator = AIOrchestrator()

@router.post("/flood")
async def simulate_flood_emergency(db: Session = Depends(get_db)):
    """
    ONE-CLICK DEMO SCENARIO: 'Simulate Flood Emergency'
    Fulfills all 14 Hackathon demonstration criteria in a single unified flow:
    1. Create a flood disaster in a sample location
    2. Show evidence
    3. Run verification
    4. Run Weather Agent
    5. Run Hospital Agent
    6. Run Rescue Agent
    7. Run Traffic Agent
    8. Run Resource Agent
    9. Generate final Emergency Response Plan
    10. Show government alert
    11. Show rescue-team alert
    12. Show hospital alert
    13. Show recommended route
    14. Show required resources
    """
    # 1. Create realistic flood disaster in sample location (e.g. Krishna Basin, Vijayawada)
    sample_lat = 16.5142
    sample_lng = 80.6321
    sample_evidence = "https://images.unsplash.com/photo-1547683905-f686c993aae5?auto=format&fit=crop&w=1200&q=85"

    flood_disaster = Disaster(
        title="Simulated Embankment Breach & Flash Flood Surge",
        disaster_type="Flood",
        description=(
            "URGENT SIMULATION: Embankment barrier breached at Sector 9 canal crossing. "
            "Rapid water rise of 1.8 meters within 45 minutes. "
            "Approximately 50 to 65 residents stranded on rooftops and elevated bus shelter structures."
        ),
        evidence_url=sample_evidence,
        latitude=sample_lat,
        longitude=sample_lng,
        location_name="Bhavanipuram Lowland Basin & Krishna Riverfront",
        affected_people=50,
        severity="HIGH",
        status="REPORTED"
    )
    db.add(flood_disaster)
    db.commit()
    db.refresh(flood_disaster)

    # 2 - 9. Run Orchestrator (Verification, Weather, Hospital, Rescue, Traffic, Resource Agents)
    plan = await orchestrator.orchestrate(db, flood_disaster)

    # Also trigger SMS Carrier simulation
    sms_service.send_emergency_broadcast(
        recipient_group="PUBLIC_AND_FIRST_RESPONDERS",
        message=plan.sms_broadcast_text,
        disaster_id=flood_disaster.id,
        severity="HIGH"
    )

    # 10 - 12. Fetch generated alerts for government, rescue, and hospital
    alerts = db.query(Alert).filter(Alert.disaster_id == flood_disaster.id).all()

    govt_alert = next((a for a in alerts if a.alert_type == "GOVERNMENT"), None)
    hospital_alert = next((a for a in alerts if a.alert_type == "HOSPITAL"), None)
    rescue_alert = next((a for a in alerts if a.alert_type == "RESCUE"), None)
    resource_alert = next((a for a in alerts if a.alert_type == "RESOURCE"), None)
    sms_alert = next((a for a in alerts if a.alert_type == "SMS"), None)

    return {
        "success": True,
        "message": "Simulate Flood Emergency executed successfully across all 6 AI agents",
        "steps": [
            {"step": 1, "name": "Disaster Created", "detail": f"Flood at [{sample_lat}, {sample_lng}]"},
            {"step": 2, "name": "Evidence Loaded", "detail": sample_evidence},
            {"step": 3, "name": "Verification Agent", "detail": f"Confidence: {plan.verification.confidence_score}% ({plan.verification.confidence_label})"},
            {"step": 4, "name": "Weather Agent", "detail": f"{plan.weather.weather_condition}, {plan.weather.rainfall_mm}mm rain"},
            {"step": 5, "name": "Hospital Agent", "detail": f"{plan.hospital.recommended_hospital} ({plan.hospital.available_beds} beds, {plan.hospital.distance_km} km)"},
            {"step": 6, "name": "Rescue Agent", "detail": f"{plan.rescue.teams_required} teams, {plan.rescue.boats_required} boats, {plan.rescue.personnel_required} personnel"},
            {"step": 7, "name": "Traffic Agent", "detail": f"{plan.traffic.primary_route_name} BLOCKED -> {plan.traffic.alternative_route_name} SAFE"},
            {"step": 8, "name": "Resource Agent", "detail": f"{plan.resources.food_packets} rations, {plan.resources.drinking_water_liters}L water, {plan.resources.medical_kits} med kits"},
            {"step": 9, "name": "Emergency Response Plan", "detail": "Combined into Unified Plan"},
            {"step": 10, "name": "Government Alert", "detail": govt_alert.title if govt_alert else "Govt Alert Active"},
            {"step": 11, "name": "Rescue-Team Alert", "detail": rescue_alert.title if rescue_alert else "Rescue Alert Active"},
            {"step": 12, "name": "Hospital Alert", "detail": hospital_alert.title if hospital_alert else "Hospital Alert Active"},
            {"step": 13, "name": "Recommended Route", "detail": f"{plan.traffic.alternative_route_name} ({plan.traffic.estimated_travel_time_min} mins)"},
            {"step": 14, "name": "Required Resources", "detail": f"Quotas: {plan.resources.food_packets} food, {plan.resources.drinking_water_liters}L water, {plan.resources.temporary_shelters} shelters"}
        ],
        "disaster": {
            "id": flood_disaster.id,
            "title": flood_disaster.title,
            "disaster_type": flood_disaster.disaster_type,
            "description": flood_disaster.description,
            "evidence_url": flood_disaster.evidence_url,
            "latitude": flood_disaster.latitude,
            "longitude": flood_disaster.longitude,
            "affected_people": flood_disaster.affected_people,
            "severity": flood_disaster.severity,
            "status": flood_disaster.status,
            "verification_score": flood_disaster.verification_score
        },
        "response_plan": plan,
        "alerts": {
            "government": govt_alert,
            "rescue": rescue_alert,
            "hospital": hospital_alert,
            "resource": resource_alert,
            "sms": sms_alert
        },
        "sms_broadcast": plan.sms_broadcast_text
    }
