from sqlalchemy import Column, Integer, String
from app.database.session import Base

class Resource(Base):
    __tablename__ = "resources"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    item_name = Column(String(255), nullable=False) # e.g. "Food Packets (Ready-to-Eat)", "Potable Drinking Water (Liters)"
    category = Column(String(100), nullable=False) # RATION, WATER, MEDICAL, SHELTER, RESCUE_GEAR
    total_stock = Column(Integer, default=1000)
    available_stock = Column(Integer, default=1000)
    unit = Column(String(50), default="packets")
    warehouse_location = Column(String(255), default="Central State Disaster Relief Depo")
