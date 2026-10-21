from typing import List
from fastapi import APIRouter, Depends, status
from app.schemas import AssetCreate, AssetUpdate, AssetResponse, UserRole
from app.services import AssetService
from app.auth import get_current_user, require_role

router = APIRouter(prefix="/assets", tags=["Équipements (Assets)"])

@router.post("/", response_model=AssetResponse, status_code=status.HTTP_201_CREATED)
async def create_asset(
    asset: AssetCreate, 
    _ = Depends(require_role(UserRole.ADMIN))
):
    return await AssetService.create_asset(asset)

@router.get("/", response_model=List[AssetResponse])
async def list_assets(_ = Depends(get_current_user)):
    return await AssetService.get_all_assets()

@router.get("/{asset_id}", response_model=AssetResponse)
async def get_asset(asset_id: str, _ = Depends(get_current_user)):
    return await AssetService.get_asset_by_id(asset_id)

@router.put("/{asset_id}", response_model=AssetResponse)
async def update_asset(
    asset_id: str, 
    asset: AssetUpdate, 
    _ = Depends(require_role(UserRole.OPERATOR))
):
    return await AssetService.update_asset(asset_id, asset)

@router.delete("/{asset_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_asset(
    asset_id: str, 
    _ = Depends(require_role(UserRole.ADMIN))
):
    await AssetService.delete_asset(asset_id)