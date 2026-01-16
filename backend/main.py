from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from datetime import datetime
from typing import List
import json
import asyncio

from backend.models.database import init_db, SessionLocal, Incident
from backend.api.routes import incidents, cameras
from backend.ai.processor import AIProcessor

app = FastAPI(title="Sentinel AI - Enterprise Surveillance API")

def save_incident_to_db(incident_data: dict):
    db = SessionLocal()
    try:
        incident = Incident(
            timestamp=datetime.fromisoformat(incident_data['timestamp']),
            camera_id=incident_data['camera_id'],
            type=incident_data['type'],
            severity=incident_data['severity'],
            description=incident_data['description'],
            ai_summary=incident_data['ai_summary'],
            confidence=incident_data.get('escalation_score', 0.0),
            owner_id=incident_data.get('owner_id', 'admin')
        )
        db.add(incident)
        db.commit()
    except Exception as e:
        print(f"Error saving incident: {e}")
    finally:
        db.close()

# Initialize DB
init_db()

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Active WebSockets
active_connections: List[WebSocket] = []

async def broadcast_alert(alert_data: dict):
    for connection in active_connections:
        await connection.send_text(json.dumps(alert_data))

# AI Engine
ai_engine = None

from fastapi.responses import StreamingResponse

# ... earlier imports ...

# Real-time Stats Broadcaster
async def broadcast_stats(data: dict):
    for connection in active_connections:
        try:
            await connection.send_json(data)
        except:
             pass

@app.on_event("startup")
async def startup_event():
    import traceback
    try:
        global ai_engine
        ai_engine = AIProcessor(
            broadcast_callback=broadcast_alert,
            save_incident_callback=save_incident_to_db,
            realtime_callback=broadcast_stats
        )
        ai_engine.start_feed(source=0) # Webcam capture
        print("IntentSentinel Vision System initialized on local capture.")
    except Exception as e:
        print(f"FAILED TO START AI ENGINE: {e}")
        traceback.print_exc()

@app.get("/video_feed")
async def video_feed():
    async def gen():
        while True:
            if ai_engine:
                frame = ai_engine.get_frame()
                if frame:
                    yield (b'--frame\r\n'
                           b'Content-Type: image/jpeg\r\n\r\n' + frame + b'\r\n')
                else:
                    await asyncio.sleep(0.1)
            else:
                await asyncio.sleep(0.1)
    return StreamingResponse(gen(), media_type="multipart/x-mixed-replace; boundary=frame")

# Routes
app.include_router(incidents.router)
app.include_router(cameras.router)

@app.post("/api/ai/context")
async def update_ai_context(data: dict):
    if ai_engine:
        owner_id = data.get("owner_id", "admin")
        camera_id = data.get("camera_id", "WEB-01")
        ai_engine.owner_id = owner_id
        ai_engine.camera_id = camera_id
        return {"status": "success", "owner_id": owner_id, "camera_id": camera_id}
    return {"status": "error", "message": "AI Engine not initialized"}

@app.websocket("/ws/alerts")
async def websocket_alerts(websocket: WebSocket):
    await websocket.accept()
    active_connections.append(websocket)
    try:
        while True:
            await websocket.receive_text()
    except WebSocketDisconnect:
        active_connections.remove(websocket)

@app.get("/")
async def root():
    return {
        "name": "Sentinel AI - Enterprise Surveillance API",
        "status": "operational",
        "version": "1.0.0",
        "endpoints": {
            "health": "/health",
            "video_feed": "/video_feed",
            "incidents": "/api/incidents",
            "cameras": "/api/cameras"
        }
    }

@app.get("/health")
async def health():
    return {"status": "operational", "v": "1.0.0"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)
