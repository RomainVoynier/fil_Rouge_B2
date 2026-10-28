from pydantic import BaseModel
from typing import Optional

class Equipment(BaseModel):
    id: int
    name: str
    type: str
    site: str
    status: str

class IncidentCreate(BaseModel):
    title: str
    severity: str
    status: str
    equipmentId: int

class Incident(IncidentCreate):
    id: int