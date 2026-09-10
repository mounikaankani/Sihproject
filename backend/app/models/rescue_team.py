from sqlalchemy import Column, Integer, String, Float, JSON
from app.database.session import Base

class RescueTeam(Base):
    __tablename__ = "rescue_teams"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    name = Column(String(255), nullable=False) # e.g., "NDRF 10th Battalion Unit Alpha"
    unit_type = Column(String(100), default="NDRF Rapid Action") # NDRF, SDRF, Marine Commando, Civil Defense
    latitude = Column(Float, nullable=False)
    longitude = Column(Float, nullable=False)
    personnel_count = Column(Integer, default=25)
    equipment = Column(JSON, default=list) # ["Inflatable Boats", "Life Jackets", "Drones", "Cutters"]
    status = Column(String(50), default="AVAILABLE") # AVAILABLE, DISPATCHED, ON_MISSION, STANDBY
    assigned_disaster_id = Column(Integer, nullable=True)
    contact_radio = Column(String(50), default="CH-09 NDRF-HQ")
