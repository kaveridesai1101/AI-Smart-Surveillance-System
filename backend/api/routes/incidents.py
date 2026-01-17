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

@router.patch("/{incident_id}/status")
async def update_incident_status(incident_id: int, status: str, db: Session = Depends(get_db)):
    incident = db.query(Incident).filter(Incident.id == incident_id).first()
    if not incident:
        raise HTTPException(status_code=404, detail="Incident not found")
    
    incident.status = status
    db.commit()

    # Broadcast update to all connected clients
    from backend.main import broadcast_alert
    await broadcast_alert({
        "type": "incident_update",
        "id": incident_id,
        "status": status
    })

    return {"message": "Status updated", "id": incident_id, "status": status}
