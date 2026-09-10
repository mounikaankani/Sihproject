import datetime
from sqlalchemy import Column, Integer, String, DateTime, Text
from app.database.session import Base

class Alert(Base):
    __tablename__ = "alerts"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    disaster_id = Column(Integer, nullable=True)
    alert_type = Column(String(50), default="GOVERNMENT") # GOVERNMENT, HOSPITAL, RESCUE, RESOURCE, SMS
    target_role = Column(String(100), default="ALL") # NDMA, DISTRICT_MAGISTRATE, CHIEF_MEDICAL_OFFICER, NDRF_COMMANDER
    title = Column(String(255), nullable=False)
    message = Column(Text, nullable=False)
    severity = Column(String(50), default="HIGH") # LOW, MEDIUM, HIGH, CRITICAL
    status = Column(String(50), default="ACTIVE") # ACTIVE, ACKNOWLEDGED, RESOLVED
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
