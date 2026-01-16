from fastapi import APIRouter, Depends, HTTPException, Header
from sqlalchemy.orm import Session
from backend.models.database import Camera, SessionLocal

router = APIRouter(prefix="/cameras", tags=["cameras"])

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.get("/")
async def get_cameras(x_user_id: str = Header("admin"), db: Session = Depends(get_db)):
    if x_user_id == "admin":
        return db.query(Camera).all()
    return db.query(Camera).filter(Camera.owner_id == x_user_id).all()

@router.post("/")
async def add_camera(name: str, location: str, source: str, x_user_id: str = Header("admin"), db: Session = Depends(get_db)):
    new_cam = Camera(name=name, location=location, source_url=source, owner_id=x_user_id)
    db.add(new_cam)
    db.commit()
    db.refresh(new_cam)
    return new_cam

@router.delete("/{camera_id}")
async def delete_camera(camera_id: int, x_user_id: str = Header("admin"), db: Session = Depends(get_db)):
    cam = db.query(Camera).filter(Camera.id == camera_id).first()
    if not cam:
        raise HTTPException(status_code=404, detail="Camera node not found")
    
    # Permission Check: Admin can delete anything, Operator only their own
    if x_user_id != "admin" and cam.owner_id != x_user_id:
        raise HTTPException(status_code=403, detail="Not authorized to delete this node")
    
    db.delete(cam)
    db.commit()
    return {"status": "success", "message": f"Camera {camera_id} deleted"}
