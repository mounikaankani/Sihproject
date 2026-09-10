from pydantic import BaseModel
from typing import Optional, List
import datetime

class AlertCreate(BaseModel):
    disaster_id: Optional[int] = None
    alert_type: str = "GOVERNMENT" # GOVERNMENT, HOSPITAL, RESCUE, RESOURCE, SMS
    target_role: str = "ALL"
    title: str
    message: str
    severity: str = "HIGH"

class AlertResponse(AlertCreate):
    id: int
    status: str
    created_at: datetime.datetime

    class Config:
        from_attributes = True

class HospitalResponse(BaseModel):
    id: int
    name: str
    latitude: float
    longitude: float
    available_beds: int
    icu_beds: int
    emergency_capacity: int
    medical_staff: int
    contact_phone: str
    address: Optional[str] = None

    class Config:
        from_attributes = True

class RescueTeamResponse(BaseModel):
    id: int
    name: str
    unit_type: str
    latitude: float
    longitude: float
    personnel_count: int
    equipment: List[str]
    status: str
    assigned_disaster_id: Optional[int] = None
    contact_radio: str

    class Config:
        from_attributes = True

class ResourceResponse(BaseModel):
    id: int
    item_name: str
    category: str
    total_stock: int
    available_stock: int
    unit: str
    warehouse_location: str

    class Config:
        from_attributes = True
