export type SeverityLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
export type DisasterStatus = 'REPORTED' | 'VERIFIED' | 'DISPATCHED' | 'RESOLVED';

export interface WeatherData {
  temperature_c: number;
  humidity_pct: number;
  rainfall_mm: number;
  wind_speed_kmh: number;
  weather_condition: string;
  forecast_summary: string;
  weather_risk: string;
  severity_assessment: string;
  relevant_warnings: string[];
  recommended_actions: string[];
}

export interface HospitalData {
  recommended_hospital: string;
  hospital_id: number;
  distance_km: number;
  latitude: number;
  longitude: number;
  available_beds: number;
  icu_beds: number;
  emergency_capacity: number;
  triage_notes: string;
  backup_hospital?: string;
  backup_hospital_beds?: number;
  backup_distance_km?: number;
}

export interface RescueData {
  teams_required: number;
  personnel_required: number;
  boats_required: number;
  vehicles_required: number;
  specialized_equipment: string[];
  rescue_priority: string;
  recommended_rescue_actions: string[];
  assigned_team_names: string[];
}

export interface TrafficData {
  primary_route_name: string;
  primary_route_status: string;
  blocked_roads: string[];
  alternative_route_name: string;
  alternative_route_status: string;
  estimated_distance_km: number;
  estimated_travel_time_min: number;
  navigation_advisory: string;
  route_waypoints: { lat: number; lng: number }[];
  blocked_waypoints: { lat: number; lng: number }[];
}

export interface ResourceData {
  food_packets: number;
  drinking_water_liters: number;
  medical_kits: number;
  blankets: number;
  temporary_shelters: number;
  hygiene_packs: number;
  distribution_strategy: string;
  allocation_rationale: string;
}

export interface VerificationData {
  confidence_score: number;
  confidence_label: string;
  gps_coordinates_valid: boolean;
  timestamp_freshness: string;
  disaster_type_weather_match: boolean;
  evidence_signals: string[];
  risk_factors: string[];
  authenticity_disclaimer: string;
}

export interface EmergencyResponsePlan {
  disaster_id: number;
  disaster_type: string;
  severity: SeverityLevel;
  location: string;
  affected_people: number;
  verification: VerificationData;
  weather?: WeatherData;
  hospital?: HospitalData;
  rescue?: RescueData;
  traffic?: TrafficData;
  resources?: ResourceData;
  executive_summary: string;
  sms_broadcast_text: string;
}

export interface Disaster {
  id: number;
  title: string;
  disaster_type: string;
  description: string;
  evidence_url?: string;
  latitude: number;
  longitude: number;
  location_name?: string;
  affected_people: number;
  severity: SeverityLevel;
  status: DisasterStatus;
  verification_score: number;
  verification_details?: VerificationData;
  response_plan?: EmergencyResponsePlan;
  created_at: string;
  updated_at: string;
}

export interface Hospital {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  available_beds: number;
  icu_beds: number;
  emergency_capacity: number;
  medical_staff: number;
  contact_phone: string;
  address?: string;
  distance_km?: number;
}

export interface RescueTeam {
  id: number;
  name: string;
  unit_type: string;
  latitude: number;
  longitude: number;
  personnel_count: number;
  equipment: string[];
  status: 'AVAILABLE' | 'DISPATCHED' | 'ON_MISSION' | 'STANDBY';
  assigned_disaster_id?: number;
  contact_radio: string;
}

export interface ResourceItem {
  id: number;
  item_name: string;
  category: string;
  total_stock: number;
  available_stock: number;
  unit: string;
  warehouse_location: string;
}

export interface Alert {
  id: number;
  disaster_id?: number;
  alert_type: 'GOVERNMENT' | 'HOSPITAL' | 'RESCUE' | 'RESOURCE' | 'SMS';
  target_role: string;
  title: string;
  message: string;
  severity: SeverityLevel;
  status: string;
  created_at: string;
}

export interface SimulationStep {
  step: number;
  name: string;
  detail: string;
}

export interface SimulationResult {
  success: boolean;
  message: string;
  steps: SimulationStep[];
  disaster: Disaster;
  response_plan: EmergencyResponsePlan;
  alerts: {
    government?: Alert;
    rescue?: Alert;
    hospital?: Alert;
    resource?: Alert;
    sms?: Alert;
  };
  sms_broadcast: string;
}
