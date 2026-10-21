import uuid
from typing import List, Optional
from fastapi import HTTPException, status
from app.database import db_assets, db_incidents
from app.schemas import AssetCreate, AssetUpdate, AssetResponse

class AssetService:
    @staticmethod
    async def create_asset(data: AssetCreate) -> AssetResponse:
        asset_id = str(uuid.uuid4())
        asset = AssetResponse(id=asset_id, **data.model_dump())
        db_assets[asset_id] = asset
        return asset

    @staticmethod
    async def get_all_assets() -> List[AssetResponse]:
        return list(db_assets.values())

    @staticmethod
    async def get_asset_by_id(asset_id: str) -> AssetResponse:
        if asset_id not in db_assets:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Équipement avec l'ID {asset_id} introuvable"
            )
        return db_assets[asset_id]

    @staticmethod
    async def update_asset(asset_id: str, data: AssetUpdate) -> AssetResponse:
        asset = await AssetService.get_asset_by_id(asset_id)
        stored_data = asset.model_dump()
        update_data = data.model_dump(exclude_unset=True)
        stored_data.update(update_data)
        
        updated_asset = AssetResponse(**stored_data)
        db_assets[asset_id] = updated_asset
        return updated_asset

    @staticmethod
    async def delete_asset(asset_id: str) -> None:
        await AssetService.get_asset_by_id(asset_id)
        del db_assets[asset_id]