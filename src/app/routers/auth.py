import uuid
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from app.schemas import UserCreate, UserResponse, Token
from app.auth import get_password_hash, verify_password, create_access_token
from app.database import db_users

router = APIRouter(prefix="/auth", tags=["Authentification"])

@router.post("/register", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
async def register(user_in: UserCreate):
    for u in db_users.values():
        if u["username"] == user_in.username:
            raise HTTPException(status_code=400, detail="Nom d'utilisateur déjà pris")
            
    user_id = str(uuid.uuid4())
    user_data = user_in.model_dump()
    user_data["password"] = get_password_hash(user_in.password)
    user_data["id"] = user_id
    db_users[user_id] = user_data
    
    return UserResponse(**user_data)

@router.post("/token", response_model=Token)
async def login(form_data: OAuth2PasswordRequestForm = Depends()):
    user = next((u for u in db_users.values() if u["username"] == form_data.username), None)
    if not user or not verify_password(form_data.password, user["password"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Identifiants incorrects"
        )
    
    access_token = create_access_token(data={"sub": user["username"], "role": user["role"]})
    return Token(access_token=access_token)