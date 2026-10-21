from pydantic import BaseModel, EmailStr, Field
from typing import Optional, List
from enum import Enum
from datetime import datetime

class UserRole(str, Enum):
    ADMIN = "admin"
    OPERATOR = "operator"

class AssetStatus(str, Enum):
    ONLINE = "online"
    OFFLINE = "offline"
    MAINTENANCE = "maintenance"

class IncidentSeverity(str, Enum):
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"
    CRITICAL = "critical"

# User Schemas
class UserBase(BaseModel):
    username: str
    email: EmailStr
    role: UserRole = UserRole.OPERATOR

class UserCreate(UserBase):
    password: str

class UserResponse(UserBase):
    id: str

class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"

class TokenData(BaseModel):
    username: Optional[str] = None
    role: Optional[UserRole] = None

# Asset Schemas
class AssetBase(BaseModel):
    name: str = Field(..., min_length=2, max_length=50)
    site: str
    ip_address: str
    status: AssetStatus = AssetStatus.ONLINE

class AssetCreate(AssetBase):
    pass

class AssetUpdate(BaseModel):
    name: Optional[str] = None
    site: Optional[str] = None
    ip_address: Optional[str] = None
    status: Optional[AssetStatus] = None

class AssetResponse(AssetBase):
    id: str

# Incident Schemas
class IncidentBase(BaseModel):
    title: str
    description: str
    severity: IncidentSeverity
    asset_id: str

class IncidentCreate(IncidentBase):
    pass

class IncidentResponse(IncidentBase):
    id: str
    created_at: datetime
    resolved: bool = False