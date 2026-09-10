from pydantic import BaseModel, Field
from typing import Optional, Any, Dict, List
import datetime

class DisasterBase(BaseModel):
    title: Optional[str] = None
    disaster_type: str # Flood, Cyclone, Earthquake, Fire, Landslide
    description: str
    evidence_url: Optional[str] = None
    latitude: float = Field(..., ge=-90.0, le=90.0)
    longitude: float = Field(..., ge=-180.0, le=180.0)
    location_name: Optional[str] = None
    affected_people: int = Field(default=0, ge=0)
    severity: str = "MEDIUM" # LOW, MEDIUM, HIGH, CRITICAL

class DisasterCreate(DisasterBase):
    pass

class DisasterUpdate(BaseModel):
    title: Optional[str] = None
    disaster_type: Optional[str] = None
    description: Optional[str] = None
    evidence_url: Optional[str] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    location_name: Optional[str] = None
    affected_people: Optional[int] = None
    severity: Optional[str] = None
    status: Optional[str] = None
    verification_score: Optional[float] = None
    verification_details: Optional[Dict[str, Any]] = None
    response_plan: Optional[Dict[str, Any]] = None

class DisasterResponse(DisasterBase):
    id: int
    status: str
    verification_score: float
    verification_details: Optional[Dict[str, Any]] = None
    response_plan: Optional[Dict[str, Any]] = None
    created_at: datetime.datetime
    updated_at: datetime.datetime

    class Config:
        from_attributes = True
