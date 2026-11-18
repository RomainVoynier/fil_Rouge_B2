from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    role = Column(String, default="operator")

class Equipment(Base):
    __tablename__ = "equipments"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    type = Column(String)
    status = Column(String, default="active")

    incidents = relationship("Incident", back_populates="equipment")

class Incident(Base):
    __tablename__ = "incidents"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True)
    severity = Column(String)
    description = Column(String, nullable=True)
    status = Column(String, default="open")
    equipment_id = Column(Integer, ForeignKey("equipments.id"), nullable=True)

    equipment = relationship("Equipment", back_populates="incidents")