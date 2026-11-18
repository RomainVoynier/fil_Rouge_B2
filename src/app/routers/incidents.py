from typing import List

from fastapi import APIRouter, Depends, status

from app.auth import get_current_user
from app.schemas import IncidentCreate, IncidentResponse
from app.services import IncidentService

router = APIRouter(prefix="/incidents", tags=["Incidents"])


@router.post("", response_model=IncidentResponse, status_code=status.HTTP_201_CREATED)
async def create_incident(incident: IncidentCreate, _=Depends(get_current_user)):
    return await IncidentService.create_incident(incident)


@router.get("", response_model=List[IncidentResponse])
async def list_incidents(_=Depends(get_current_user)):
    return await IncidentService.get_all_incidents()