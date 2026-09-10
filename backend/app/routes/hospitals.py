from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from typing import List, Optional
import math

from app.database.session import get_db
from app.models.hospital import Hospital
from app.schemas.common import HospitalResponse

router = APIRouter(prefix="/api/hospitals", tags=["Hospitals"])

def haversine(lat1, lon1, lat2, lon2):
    R = 6371.0
    dlat = math.radians(lat2 - lat1)
    dlon = math.radians(lon2 - lon1)
    a = math.sin(dlat / 2)**2 + math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) * math.sin(dlon / 2)**2
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
    return round(R * c, 2)

@router.get("", response_model=List[HospitalResponse])
def get_hospitals(db: Session = Depends(get_db)):
    """List all registered hospitals."""
    return db.query(Hospital).all()

@router.get("/nearby")
def get_nearby_hospitals(
    lat: float = Query(...),
    lng: float = Query(...),
    limit: int = Query(5),
    db: Session = Depends(get_db)
):
    """Find closest hospitals ordered by Haversine distance."""
    hospitals = db.query(Hospital).all()
    results = []
    for h in hospitals:
        dist = haversine(lat, lng, h.latitude, h.longitude)
        results.append({
            "id": h.id,
            "name": h.name,
            "latitude": h.latitude,
            "longitude": h.longitude,
            "available_beds": h.available_beds,
            "icu_beds": h.icu_beds,
            "emergency_capacity": h.emergency_capacity,
            "medical_staff": h.medical_staff,
            "contact_phone": h.contact_phone,
            "address": h.address,
            "distance_km": dist
        })
    results.sort(key=lambda x: x["distance_km"])
    return results[:limit]
