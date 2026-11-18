from typing import List

from fastapi import APIRouter, Depends

from app.auth import require_role
from app.database import db_users
from app.schemas import UserResponse, UserRole

router = APIRouter(prefix="/users", tags=["Utilisateurs"])


@router.get("", response_model=List[UserResponse])
async def list_users(_=Depends(require_role(UserRole.ADMIN))):
    return [UserResponse(**u) for u in db_users.values()]