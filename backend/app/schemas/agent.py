from pydantic import BaseModel
from typing import Optional, List, Dict, Any

class WeatherAgentOutput(BaseModel):
    temperature_c: float
    humidity_pct: float
    rainfall_mm: float
    wind_speed_kmh: float
    weather_condition: str
    forecast_summary: str
    weather_risk: str # MODERATE, SEVERE, CATASTROPHIC
    severity_assessment: str
    relevant_warnings: List[str]
    recommended_actions: List[str]

class HospitalAgentOutput(BaseModel):
    recommended_hospital: str
    hospital_id: int
    distance_km: float
    latitude: float
    longitude: float
    available_beds: int
    icu_beds: int
    emergency_capacity: int
    triage_notes: str
    backup_hospital: Optional[str] = None
    backup_hospital_beds: Optional[int] = None
    backup_distance_km: Optional[float] = None

class RescueAgentOutput(BaseModel):
    teams_required: int
    personnel_required: int
    boats_required: int
    vehicles_required: int
    specialized_equipment: List[str]
    rescue_priority: str # P1 - CRITICAL EVACUATION, P2 - URGENT, P3 - RELIEF SUPPORT
    recommended_rescue_actions: List[str]
    assigned_team_names: List[str]

class TrafficRouteWaypoint(BaseModel):
    lat: float
    lng: float
    name: Optional[str] = None

class TrafficAgentOutput(BaseModel):
    primary_route_name: str
    primary_route_status: str # OPEN, CONGESTED, BLOCKED, SUBMERGED
    blocked_roads: List[str]
    alternative_route_name: str
    alternative_route_status: str # CLEAR, SAFE
    estimated_distance_km: float
    estimated_travel_time_min: int
    navigation_advisory: str
    route_waypoints: List[Dict[str, float]]
    blocked_waypoints: List[Dict[str, float]]

class ResourceAgentOutput(BaseModel):
    food_packets: int
    drinking_water_liters: int
    medical_kits: int
    blankets: int
    temporary_shelters: int
    hygiene_packs: int
    distribution_strategy: str
    allocation_rationale: str

class VerificationAgentOutput(BaseModel):
    confidence_score: float # e.g. 88.5
    confidence_label: str # AI-assisted verification / confidence score
    gps_coordinates_valid: bool
    timestamp_freshness: str
    disaster_type_weather_match: bool
    evidence_signals: List[str]
    risk_factors: List[str]
    authenticity_disclaimer: str

class EmergencyResponsePlan(BaseModel):
    disaster_id: int
    disaster_type: str
    severity: str
    location: str
    affected_people: int
    verification: VerificationAgentOutput
    weather: Optional[WeatherAgentOutput] = None
    hospital: Optional[HospitalAgentOutput] = None
    rescue: Optional[RescueAgentOutput] = None
    traffic: Optional[TrafficAgentOutput] = None
    resources: Optional[ResourceAgentOutput] = None
    executive_summary: str
    sms_broadcast_text: str
