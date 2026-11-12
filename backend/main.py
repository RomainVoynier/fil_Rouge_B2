from datetime import datetime, timedelta
from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from sqlalchemy.orm import Session
from jose import JWTError, jwt
import bcrypt

from database import SessionLocal, engine
import models

models.Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="NexusOps API",
    description="API de gestion et d'authentification pour NexusOps",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

SECRET_KEY = "votre_cle_secrete_super_seure"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login")

class LoginData(BaseModel):
    email: str
    password: str

class RegisterData(BaseModel):
    name: str
    email: str
    password: str
    role: str = "operator"

class EquipmentCreate(BaseModel):
    name: str
    type: str
    status: str = "active"

class IncidentCreate(BaseModel):
    title: str
    severity: str
    description: str | None = None
    equipment_id: int | None = None

class Token(BaseModel):
    access_token: str
    token_type: str

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return bcrypt.checkpw(plain_password.encode('utf-8'), hashed_password.encode('utf-8'))

def get_password_hash(password: str) -> str:
    pwd_bytes = password.encode('utf-8')
    salt = bcrypt.gensalt()
    hashed = bcrypt.hashpw(pwd_bytes, salt)
    return hashed.decode('utf-8')

def create_access_token(data: dict, expires_delta: timedelta | None = None):
    to_encode = data.copy()
    expire = datetime.utcnow() + (expires_delta or timedelta(minutes=15))
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Impossible de valider les identifiants",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception
    user = db.query(models.User).filter(models.User.email == email).first()
    if user is None:
        raise credentials_exception
    return user

@app.post("/login", response_model=Token, summary="Connexion utilisateur", description="Permet de s'authentifier et de récupérer un token JWT.")
def login(form_data: LoginData, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.email == form_data.email).first()
    if not user or not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Identifiants incorrects",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.email, "role": user.role}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}

@app.post("/register", summary="Inscription utilisateur", description="Crée un nouveau compte utilisateur dans le système.")
def register(form_data: RegisterData, db: Session = Depends(get_db)):
    existing_user = db.query(models.User).filter(models.User.email == form_data.email).first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cet email est deja utilise",
        )
    
    hashed_password = get_password_hash(form_data.password)
    new_user = models.User(
        name=form_data.name,
        email=form_data.email,
        hashed_password=hashed_password,
        role=form_data.role,
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return {"message": "Utilisateur cree avec succes"}

@app.get("/users", summary="Lister les utilisateurs", description="Récupère la liste de tous les utilisateurs enregistrés (Protégé).")
def get_users(db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    return db.query(models.User).all()

@app.delete("/users/{user_id}", summary="Supprimer un utilisateur", description="Supprime un utilisateur par son ID (Protégé).")
def delete_user(user_id: int, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    user = db.query(models.User).filter(models.User.id == user_id).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Utilisateur non trouve"
        )
    db.delete(user)
    db.commit()
    return {"message": "Utilisateur supprime avec succes"}

@app.get("/equipments", summary="Lister les équipements", description="Récupère la liste de tous les équipements.")
def get_equipments(db: Session = Depends(get_db)):
    return db.query(models.Equipment).all()

@app.post("/equipments", summary="Créer un équipement", description="Ajoute un nouvel équipement (Protégé).")
def create_equipment(form_data: EquipmentCreate, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    equipment = models.Equipment(
        name=form_data.name,
        type=form_data.type,
        status=form_data.status
    )
    db.add(equipment)
    db.commit()
    db.refresh(equipment)
    return equipment

@app.get("/incidents", summary="Lister les incidents", description="Récupère la liste de tous les incidents.")
def get_incidents(db: Session = Depends(get_db)):
    return db.query(models.Incident).all()

@app.post("/incidents", summary="Créer un incident", description="Enregistre un nouvel incident (Protégé).")
def create_incident(form_data: IncidentCreate, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    incident = models.Incident(
        title=form_data.title,
        severity=form_data.severity,
        description=form_data.description,
        equipment_id=form_data.equipment_id
    )
    db.add(incident)
    db.commit()
    db.refresh(incident)
    return incident

@app.delete("/incidents/{incident_id}", summary="Supprimer un incident", description="Supprime un incident par son ID (Protégé).")
def delete_incident(incident_id: int, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    incident = db.query(models.Incident).filter(models.Incident.id == incident_id).first()
    if not incident:
        raise HTTPException(status_code=404, detail="Incident non trouve")
    db.delete(incident)
    db.commit()
    return {"message": "Incident supprime"}

@app.get("/metrics", summary="Indicateurs clés", description="Récupère les statistiques globales de la plateforme.")
def get_metrics(db: Session = Depends(get_db)):
    total_equipments = db.query(models.Equipment).count()
    total_incidents = db.query(models.Incident).count()
    open_incidents = db.query(models.Incident).filter(models.Incident.status == "open").count()
    return {
        "total_equipments": total_equipments,
        "total_incidents": total_incidents,
        "open_incidents": open_incidents
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="127.0.0.1", port=3001, reload=True)