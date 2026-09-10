from fastapi import APIRouter, Depends, HTTPException, Body
from sqlalchemy.orm import Session
from typing import List, Optional
from app.database.session import get_db
from app.models.alert import Alert
from app.schemas.common import AlertCreate, AlertResponse
from app.services.sms_service import sms_service

router = APIRouter(prefix="/api/alerts", tags=["Alerts"])

@router.get("", response_model=List[AlertResponse])
def get_alerts(
    alert_type: Optional[str] = None,
    severity: Optional[str] = None,
    limit: int = 50,
    db: Session = Depends(get_db)
):
    """List recent multi-tier emergency alerts."""
    query = db.query(Alert)
    if alert_type:
        query = query.filter(Alert.alert_type == alert_type.upper())
    if severity:
        query = query.filter(Alert.severity == severity.upper())
    return query.order_by(Alert.created_at.desc()).limit(limit).all()

@router.post("", response_model=AlertResponse)
def create_manual_alert(alert_in: AlertCreate, db: Session = Depends(get_db)):
    """Create a manual broadcast or administrative alert."""
    alert = Alert(
        disaster_id=alert_in.disaster_id,
        alert_type=alert_in.alert_type.upper(),
        target_role=alert_in.target_role,
        title=alert_in.title,
        message=alert_in.message,
        severity=alert_in.severity.upper(),
        status="ACTIVE"
    )
    db.add(alert)
    db.commit()
    db.refresh(alert)

    # Dispatch SMS if requested or alert is CRITICAL
    if alert.alert_type == "SMS" or alert.severity in ["HIGH", "CRITICAL"]:
        sms_service.send_emergency_broadcast(
            recipient_group=alert.target_role,
            message=alert.message,
            disaster_id=alert.disaster_id or 0,
            severity=alert.severity
        )

    return alert

@router.get("/sms-logs")
def get_sms_logs():
    """Retrieve simulated/live SMS carrier gateway transmission logs."""
    return {
        "disclaimer": "SMS alerts are routed via external cellular gateways. Browsers do not send direct SMS.",
        "logs": sms_service.get_recent_sms_logs()
    }
