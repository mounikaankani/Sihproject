from fastapi import APIRouter, Depends, HTTPException, Body
from sqlalchemy.orm import Session
from typing import List, Optional
from app.database.session import get_db
from app.models.rescue_team import RescueTeam
from app.schemas.common import RescueTeamResponse

router = APIRouter(prefix="/api/rescue-teams", tags=["Rescue Teams"])

@router.get("", response_model=List[RescueTeamResponse])
def get_rescue_teams(status: Optional[str] = None, db: Session = Depends(get_db)):
    """List all rescue units."""
    query = db.query(RescueTeam)
    if status:
        query = query.filter(RescueTeam.status == status.upper())
    return query.all()

@router.put("/{id}/status")
def update_team_status(id: int, status: str = Body(..., embed=True), db: Session = Depends(get_db)):
    """Update status of a rescue team."""
    team = db.query(RescueTeam).filter(RescueTeam.id == id).first()
    if not team:
        raise HTTPException(status_code=404, detail="Rescue team not found")
    team.status = status.upper()
    db.commit()
    db.refresh(team)
    return {"message": f"Rescue team {team.name} updated to {team.status}", "team": team}
