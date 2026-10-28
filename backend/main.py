from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from typing import List
from pydantic import BaseModel
from sqlalchemy import create_engine, Column, Integer, String, ForeignKey
from sqlalchemy.orm import declarative_base, sessionmaker, relationship, Session

SQLALCHEMY_DATABASE_URL = "sqlite:///./nexusops.db"

engine = create_engine(
    SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False}
)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

class EquipmentModel(Base):
    __tablename__ = "equipments"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, index=True)
    type = Column(String)
    site = Column(String)
    status = Column(String)
    incidents = relationship("IncidentModel", back_populates="equipment")

class IncidentModel(Base):
    __tablename__ = "incidents"
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String)
    severity = Column(String)
    status = Column(String)
    equipmentId = Column(Integer, ForeignKey("equipments.id"))
    equipment = relationship("EquipmentModel", back_populates="incidents")

class UserModel(Base):
    __tablename__ = "users"
    id = Column(String, primary_key=True, index=True)
    name = Column(String)
    email = Column(String)
    role = Column(String)

Base.metadata.create_all(bind=engine)

app = FastAPI(title="NexusOps API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.on_event("startup")
def init_db():
    db = SessionLocal()
    if db.query(EquipmentModel.id).count() == 0:
        db.add_all([
            EquipmentModel(id=1, name="Serveur Core A", type="Server", site="Paris", status="online"),
            EquipmentModel(id=2, name="Switch Backbone", type="Network", site="Lyon", status="offline"),
            EquipmentModel(id=3, name="Firewall Edge", type="Security", site="Marseille", status="online")
        ])
        db.add_all([
            UserModel(id="1", name="Alice Admin", email="alice@nexusops.com", role="ADMIN"),
            UserModel(id="2", name="Bob Operator", email="bob@nexusops.com", role="OPERATOR")
        ])
        db.add_all([
            IncidentModel(id=1, title="Perte de connectivité", severity="high", status="open", equipmentId=3),
            IncidentModel(id=2, title="Charge CPU élevée", severity="medium", status="in_progress", equipmentId=1)
        ])
        db.commit()
    db.close()

class Equipment(BaseModel):
    id: int
    name: str
    type: str
    site: str
    status: str
    class Config:
        from_attributes = True

class IncidentCreate(BaseModel):
    title: str
    severity: str
    status: str
    equipmentId: int

class Incident(IncidentCreate):
    id: int
    class Config:
        from_attributes = True

class User(BaseModel):
    id: str
    name: str
    email: str
    role: str
    class Config:
        from_attributes = True

@app.get("/equipments", response_model=List[Equipment])
def get_equipments(db: Session = Depends(get_db)):
    return db.query(EquipmentModel).all()

@app.get("/incidents", response_model=List[Incident])
def get_incidents(db: Session = Depends(get_db)):
    return db.query(IncidentModel).all()

@app.post("/incidents", response_model=Incident, status_code=status.HTTP_201_CREATED)
def create_incident(incident: IncidentCreate, db: Session = Depends(get_db)):
    db_incident = IncidentModel(**incident.dict())
    db.add(db_incident)
    db.commit()
    db.refresh(db_incident)
    return db_incident

@app.get("/users", response_model=List[User])
def get_users(db: Session = Depends(get_db)):
    return db.query(UserModel).all()

@app.get("/metrics")
def get_metrics(db: Session = Depends(get_db)):
    total_eq = db.query(EquipmentModel).count()
    total_inc = db.query(IncidentModel).count()
    active_inc = db.query(IncidentModel).filter(IncidentModel.status != "resolved").count()
    return {
        "totalEquipments": total_eq,
        "totalIncidents": total_inc,
        "activeIncidents": active_inc
    }
@app.delete("/incidents/{incident_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_incident(incident_id: int, db: Session = Depends(get_db)):
    db_incident = db.query(IncidentModel).filter(IncidentModel.id == incident_id).first()
    if not db_incident:
        raise HTTPException(status_code=404, detail="Incident non trouvé")
    db.delete(db_incident)
    db.commit()
    return None