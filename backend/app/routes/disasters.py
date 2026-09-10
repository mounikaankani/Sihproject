from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Query
from sqlalchemy.orm import Session
from typing import List, Optional
import logging

from app.database.session import get_db
from app.models.disaster import Disaster
from app.models.alert import Alert
from app.schemas.disaster import DisasterCreate, DisasterUpdate, DisasterResponse
from app.schemas.agent import EmergencyResponsePlan
from app.agents.orchestrator import AIOrchestrator
from app.services.storage_service import save_uploaded_evidence

router = APIRouter(prefix="/api/disasters", tags=["Disasters"])
logger = logging.getLogger(__name__)
orchestrator = AIOrchestrator()

@router.post("", response_model=DisasterResponse)
async def report_disaster(disaster_in: DisasterCreate, db: Session = Depends(get_db)):
    """
    Citizen Disaster Report submission:
    Stores the disaster report, triggers the multi-agent AI orchestrator,
    generates emergency response plan, and broadcasts multi-tier alerts.
    """
    # Create record
    disaster = Disaster(
        title=disaster_in.title or f"{disaster_in.disaster_type} Incident Report",
        disaster_type=disaster_in.disaster_type,
        description=disaster_in.description,
        evidence_url=disaster_in.evidence_url,
        latitude=disaster_in.latitude,
        longitude=disaster_in.longitude,
        location_name=disaster_in.location_name or f"Sector ({round(disaster_in.latitude, 3)}, {round(disaster_in.longitude, 3)})",
        affected_people=disaster_in.affected_people,
        severity=disaster_in.severity.upper(),
        status="REPORTED"
    )
    db.add(disaster)
    db.commit()
    db.refresh(disaster)

    # Immediately orchestrate AI agents
    try:
        await orchestrator.orchestrate(db, disaster)
    except Exception as e:
        logger.error(f"Error during AI orchestration: {e}")

    return disaster

@router.get("", response_model=List[DisasterResponse])
def list_disasters(
    severity: Optional[str] = Query(None),
    status: Optional[str] = Query(None),
    disaster_type: Optional[str] = Query(None),
    db: Session = Depends(get_db)
):
    """Retrieve all disaster records with optional filtering."""
    query = db.query(Disaster)
    if severity:
        query = query.filter(Disaster.severity == severity.upper())
    if status:
        query = query.filter(Disaster.status == status.upper())
    if disaster_type:
        query = query.filter(Disaster.disaster_type == disaster_type)
    
    return query.order_by(Disaster.created_at.desc()).all()

@router.get("/{id}", response_model=DisasterResponse)
def get_disaster(id: int, db: Session = Depends(get_db)):
    """Retrieve details of a single disaster by ID."""
    disaster = db.query(Disaster).filter(Disaster.id == id).first()
    if not disaster:
        raise HTTPException(status_code=404, detail="Disaster report not found")
    return disaster

@router.put("/{id}", response_model=DisasterResponse)
def update_disaster(id: int, update_in: DisasterUpdate, db: Session = Depends(get_db)):
    """Update disaster fields (e.g. status transition: DISPATCHED, RESOLVED)."""
    disaster = db.query(Disaster).filter(Disaster.id == id).first()
    if not disaster:
        raise HTTPException(status_code=404, detail="Disaster report not found")

    update_data = update_in.model_dump(exclude_unset=True)
    for field, val in update_data.items():
        setattr(disaster, field, val)

    db.commit()
    db.refresh(disaster)
    return disaster

@router.post("/{id}/analyze", response_model=EmergencyResponsePlan)
async def analyze_disaster(id: int, db: Session = Depends(get_db)):
    """Re-run or execute all 6 AI agents on an existing disaster."""
    disaster = db.query(Disaster).filter(Disaster.id == id).first()
    if not disaster:
        raise HTTPException(status_code=404, detail="Disaster report not found")

    plan = await orchestrator.orchestrate(db, disaster)
    return plan

@router.get("/{id}/agents")
def get_disaster_agents(id: int, db: Session = Depends(get_db)):
    """Retrieve structured outputs of all 6 agents for this disaster."""
    disaster = db.query(Disaster).filter(Disaster.id == id).first()
    if not disaster:
        raise HTTPException(status_code=404, detail="Disaster report not found")

    return disaster.response_plan or {}

@router.post("/upload-evidence")
async def upload_evidence(file: UploadFile = File(...)):
    """Upload citizen photo/video evidence securely."""
    file_url = await save_uploaded_evidence(file)
    return {"url": file_url, "filename": file.filename}
