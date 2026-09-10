import datetime
from sqlalchemy import Column, Integer, String, Float, DateTime, Text, JSON
from app.database.session import Base

class Disaster(Base):
    __tablename__ = "disasters"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    title = Column(String(255), nullable=True)
    disaster_type = Column(String(100), nullable=False) # Flood, Cyclone, Earthquake, Fire, Landslide
    description = Column(Text, nullable=False)
    evidence_url = Column(String(500), nullable=True)
    latitude = Column(Float, nullable=False)
    longitude = Column(Float, nullable=False)
    location_name = Column(String(255), nullable=True)
    affected_people = Column(Integer, default=0)
    severity = Column(String(50), default="MEDIUM") # LOW, MEDIUM, HIGH, CRITICAL
    status = Column(String(50), default="REPORTED") # REPORTED, VERIFIED, DISPATCHED, RESOLVED
    verification_score = Column(Float, default=0.0)
    verification_details = Column(JSON, nullable=True)
    response_plan = Column(JSON, nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)
