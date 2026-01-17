from fastapi import APIRouter, Depends, HTTPException, Header
from sqlalchemy.orm import Session
from backend.models.database import Incident, SessionLocal

router = APIRouter(prefix="/incidents", tags=["incidents"])

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.get("/")
async def get_incidents(x_user_id: str = Header("admin"), db: Session = Depends(get_db)):
    if x_user_id == "admin":
        return db.query(Incident).order_by(Incident.timestamp.desc()).all()
    return db.query(Incident).filter(Incident.owner_id == x_user_id).order_by(Incident.timestamp.desc()).all()

@router.get("/{incident_id}")
async def get_incident(incident_id: int, db: Session = Depends(get_db)):
    incident = db.query(Incident).filter(Incident.id == incident_id).first()
    if not incident:
        raise HTTPException(status_code=404, detail="Incident not found")
    return incident

from pydantic import BaseModel
from typing import Optional

class IncidentUpdate(BaseModel):
    status: str
    notes: Optional[str] = None

from backend.api.websocket_manager import manager

@router.put("/{incident_id}")
async def update_incident(incident_id: int, update: IncidentUpdate, db: Session = Depends(get_db)):
    incident = db.query(Incident).filter(Incident.id == incident_id).first()
    if not incident:
        raise HTTPException(status_code=404, detail="Incident not found")
    
    incident.status = update.status
    # incident.notes = update.notes # stored in DB if column exists, for now just log/ack
    
    db.commit()
    db.refresh(incident)
    
    # Broadcast update
    await manager.broadcast({
        "msg_type": "incident_update",
        "id": incident.id,
        "status": incident.status,
        "notes": update.notes
    })
    
    return incident
