from fastapi import WebSocket
from typing import List
import json

class ConnectionManager:
    def __init__(self):
        self.active_connections: List[WebSocket] = []

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)

    def disconnect(self, websocket: WebSocket):
        if websocket in self.active_connections:
            self.active_connections.remove(websocket)

    async def broadcast(self, message: dict):
        # Filter out dead connections
        to_remove = []
        for connection in self.active_connections:
            try:
                await connection.send_text(json.dumps(message))
            except:
                to_remove.append(connection)
        
        for dead in to_remove:
            self.disconnect(dead)

manager = ConnectionManager()
