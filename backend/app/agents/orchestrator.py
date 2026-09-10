import logging
from typing import Dict, Any, Optional
from sqlalchemy.orm import Session
from app.models.disaster import Disaster
from app.models.alert import Alert
from app.agents.weather_agent import WeatherAgent
from app.agents.hospital_agent import HospitalAgent
from app.agents.rescue_agent import RescueAgent
from app.agents.traffic_agent import TrafficAgent
from app.agents.resource_agent import ResourceAgent
from app.agents.verification_agent import VerificationAgent
from app.schemas.agent import EmergencyResponsePlan

logger = logging.getLogger(__name__)

class AIOrchestrator:
    """
    Central AI Multi-Agent Orchestrator:
    Receives citizen disaster incident reports, determines agent activation graph,
    coordinates parallel agent execution, synthesizes the unified Emergency Response Plan,
    and dispatches multi-tier alerts to Government, Hospitals, Responders, and SMS broadcasts.
    """

    def __init__(self):
        self.weather_agent = WeatherAgent()
        self.hospital_agent = HospitalAgent()
        self.rescue_agent = RescueAgent()
        self.traffic_agent = TrafficAgent()
        self.resource_agent = ResourceAgent()
        self.verification_agent = VerificationAgent()

    async def orchestrate(self, db: Session, disaster: Disaster) -> EmergencyResponsePlan:
        dtype = disaster.disaster_type or "General Disaster"
        lat = disaster.latitude
        lng = disaster.longitude
        affected = disaster.affected_people or 25
        severity = disaster.severity or "HIGH"

        logger.info(f"Orchestrating agents for disaster {disaster.id} ({dtype}, Severity: {severity})")

        # 1. Run Weather Agent
        weather_output = await self.weather_agent.analyze(lat, lng, dtype)

        # 2. Run Hospital Agent
        hospital_output = self.hospital_agent.analyze(db, lat, lng, affected, severity)

        # 3. Run Rescue Agent
        rescue_output = self.rescue_agent.analyze(db, dtype, affected, severity)

        # 4. Run Traffic Agent
        traffic_output = self.traffic_agent.analyze(
            disaster_lat=lat,
            disaster_lng=lng,
            hospital_lat=hospital_output.latitude,
            hospital_lng=hospital_output.longitude,
            disaster_type=dtype
        )

        # 5. Run Resource Agent
        resource_output = self.resource_agent.analyze(affected, severity, dtype)

        # 6. Run Verification Agent
        # Count nearby existing reports
        existing_count = db.query(Disaster).filter(
            Disaster.id != disaster.id,
            Disaster.status != "RESOLVED"
        ).count()

        verification_output = self.verification_agent.analyze(
            disaster_type=dtype,
            description=disaster.description,
            evidence_url=disaster.evidence_url,
            latitude=lat,
            longitude=lng,
            weather_condition=weather_output.weather_condition,
            rainfall_mm=weather_output.rainfall_mm,
            wind_speed_kmh=weather_output.wind_speed_kmh,
            existing_reports_count=existing_count
        )

        # Generate Response Engine Formatted Summary
        exec_summary = (
            f"DISASTER:\n{dtype}\n\n"
            f"LOCATION:\n{round(lat, 6)}, {round(lng, 6)}\n\n"
            f"SEVERITY:\n{severity}\n\n"
            f"AFFECTED PEOPLE:\n{affected}\n\n"
            f"WEATHER:\n{weather_output.weather_condition} ({weather_output.rainfall_mm}mm rain, {weather_output.wind_speed_kmh} km/h wind)\n\n"
            f"RESCUE:\n{rescue_output.teams_required} rescue teams, {rescue_output.boats_required} boats, {rescue_output.personnel_required} personnel\n\n"
            f"HOSPITAL:\n{hospital_output.recommended_hospital} recommended ({hospital_output.available_beds} beds available, {hospital_output.distance_km} km)\n\n"
            f"TRAFFIC:\n{traffic_output.primary_route_name} {traffic_output.primary_route_status}. {traffic_output.alternative_route_name} recommended\n\n"
            f"RESOURCES:\n{resource_output.food_packets} food packets, {resource_output.drinking_water_liters} liters water, {resource_output.medical_kits} medical kits"
        )

        # SMS broadcast format
        sms_text = (
            f"🚨 DISASTER ALERT:\n"
            f"{dtype} detected at [{round(lat, 4)}, {round(lng, 4)}].\n"
            f"Severity: {severity}.\n"
            f"Affected people: {affected}.\n"
            f"Rescue team required: {rescue_output.teams_required}.\n"
            f"Recommended hospital: {hospital_output.recommended_hospital}."
        )

        plan = EmergencyResponsePlan(
            disaster_id=disaster.id,
            disaster_type=dtype,
            severity=severity,
            location=f"{round(lat, 5)}, {round(lng, 5)}" + (f" ({disaster.location_name})" if disaster.location_name else ""),
            affected_people=affected,
            verification=verification_output,
            weather=weather_output,
            hospital=hospital_output,
            rescue=rescue_output,
            traffic=traffic_output,
            resources=resource_output,
            executive_summary=exec_summary,
            sms_broadcast_text=sms_text
        )

        # Update disaster in database with verification and response plan
        disaster.verification_score = verification_output.confidence_score
        disaster.verification_details = verification_output.model_dump()
        disaster.response_plan = plan.model_dump()
        disaster.status = "VERIFIED" if disaster.status == "REPORTED" else disaster.status
        db.add(disaster)

        # Multi-Tier Alerts Generation (Government, Hospital, Rescue, Resource, SMS)
        self._dispatch_alerts(db, disaster, plan)

        db.commit()
        db.refresh(disaster)
        return plan

    def _dispatch_alerts(self, db: Session, disaster: Disaster, plan: EmergencyResponsePlan):
        """Generates synchronized multi-agency alerts."""
        alerts = [
            # 1. Government Alert
            Alert(
                disaster_id=disaster.id,
                alert_type="GOVERNMENT",
                target_role="DISTRICT_MAGISTRATE_AND_NDMA",
                title=f"WAR ROOM ALERT: {disaster.disaster_type.upper()} ({disaster.severity})",
                message=(
                    f"Verified incident at {disaster.location_name or 'Zone'}. "
                    f"Estimated {disaster.affected_people} citizens affected. "
                    f"AI Verification Confidence: {plan.verification.confidence_score}%. "
                    f"Action Required: Approve rescue column dispatch and declare Level-2 Emergency."
                ),
                severity=disaster.severity
            ),
            # 2. Hospital Alert
            Alert(
                disaster_id=disaster.id,
                alert_type="HOSPITAL",
                target_role="EMERGENCY_MEDICAL_SUPERINTENDENT",
                title=f"MASS CASUALTY INFLUX: {plan.hospital.recommended_hospital}",
                message=(
                    f"Standby for emergency arrivals from {disaster.disaster_type} zone. "
                    f"Expected triage load: {max(1, int(disaster.affected_people * 0.25))} casualties. "
                    f"Transit route cleared via {plan.traffic.alternative_route_name}."
                ),
                severity=disaster.severity
            ),
            # 3. Rescue-Team Alert
            Alert(
                disaster_id=disaster.id,
                alert_type="RESCUE",
                target_role="NDRF_COMMAND_UNIT",
                title=f"RESCUE MOBILIZATION: {plan.rescue.teams_required} Teams Assigned",
                message=(
                    f"Mobilize {plan.rescue.personnel_required} personnel and {plan.rescue.boats_required} watercraft. "
                    f"Priority: {plan.rescue.rescue_priority}. Primary obstacle: {plan.traffic.primary_route_status}."
                ),
                severity=disaster.severity
            ),
            # 4. Resource-Team Alert
            Alert(
                disaster_id=disaster.id,
                alert_type="RESOURCE",
                target_role="CIVIL_SUPPLIES_OFFICER",
                title="LOGISTICS DISPATCH: Emergency Rations & Water",
                message=(
                    f"Immediate dispatch requisition: {plan.resources.food_packets} Food Packets, "
                    f"{plan.resources.drinking_water_liters}L Potable Water, {plan.resources.medical_kits} First Aid Kits, "
                    f"and {plan.resources.temporary_shelters} Family Shelters."
                ),
                severity=disaster.severity
            ),
            # 5. Public SMS Alert
            Alert(
                disaster_id=disaster.id,
                alert_type="SMS",
                target_role="PUBLIC_BROADCAST",
                title=f"EMERGENCY SMS DISPATCH: {disaster.disaster_type}",
                message=plan.sms_broadcast_text,
                severity=disaster.severity
            )
        ]
        db.add_all(alerts)
