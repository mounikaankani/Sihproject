from sqlalchemy import Column, Integer, String, Float
from app.database.session import Base

class Hospital(Base):
    __tablename__ = "hospitals"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    name = Column(String(255), nullable=False)
    latitude = Column(Float, nullable=False)
    longitude = Column(Float, nullable=False)
    available_beds = Column(Integer, default=50)
    icu_beds = Column(Integer, default=10)
    emergency_capacity = Column(Integer, default=100)
    medical_staff = Column(Integer, default=30)
    contact_phone = Column(String(50), default="+91-11-2390-1000")
    address = Column(String(255), nullable=True)
