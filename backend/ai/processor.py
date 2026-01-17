import logging
import time
import threading
import random
from datetime import datetime
import asyncio
import queue

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Critical Vision Libs
try:
    import cv2
    import numpy as np
    HAS_AI_LIBS = True
except ImportError:
    HAS_AI_LIBS = False
    logger.warning("CRITICAL: OpenCV/NumPy not found. Webcam will NOT work.")

# Advanced AI Libs (Optional/Conceptual for now)
try:
    import tensorflow as tf
    import google.generativeai as genai
    HAS_ADVANCED_AI = True
except ImportError:
    HAS_ADVANCED_AI = False
    logger.warning("Advanced AI (TF/GenAI) not found. Using logic placeholders.")

class AIProcessor:
    def __init__(self, broadcast_callback=None, save_incident_callback=None, realtime_callback=None):
        self.is_running = False
        self.broadcast_callback = broadcast_callback
        self.save_incident_callback = save_incident_callback
        self.realtime_callback = realtime_callback
        self.camera_id = "WEB-01"
        self.owner_id = "admin"
        self.frame_queue = queue.Queue(maxsize=10)
        self.escalation_score = 0.0
        self.escalation_start_time = None # Track when escalation began
        self.cap = None
        
    def start_feed(self, source=0, camera_id="DEMO-USER-CAM", owner_id="admin"):
        self.camera_id = camera_id
        self.owner_id = owner_id
        if self.is_running: return
        self.is_running = True
        self.thread = threading.Thread(target=self._process_loop, args=(source,), daemon=True)
        self.thread.start()
        
    def _process_loop(self, source):
        loop = asyncio.new_event_loop()
        asyncio.set_event_loop(loop)
        
        last_incident_time = time.time()
        frame1 = None
        
        # Safe Placeholder
        placeholder_bytes = b""
        if HAS_AI_LIBS:
            try:
                self.cap = cv2.VideoCapture(source)
                placeholder = np.zeros((480, 640, 3), dtype=np.uint8)
                cv2.putText(placeholder, "ENCRYPTED_FEED_OFFLINE", (150, 240), cv2.FONT_HERSHEY_SIMPLEX, 1, (255, 255, 255), 2)
                _, placeholder_bytes = cv2.imencode('.jpg', placeholder)
                placeholder_bytes = placeholder_bytes.tobytes()
            except Exception as e:
                logger.error(f"Error initializing camera: {e}")

        while self.is_running:
            frame_to_send = None
            
            # Auto-Reconnect Logic
            if HAS_AI_LIBS:
                if self.cap is None or not self.cap.isOpened():
                    try:
                        self.cap = cv2.VideoCapture(source)
                        if not self.cap.isOpened():
                             time.sleep(2.0)
                             continue
                    except:
                        time.sleep(2.0)
                        continue

                ret, frame = self.cap.read()
                if ret:
                    if frame1 is None:
                        frame1 = frame
                        
                    # Real-time Movement Analysis
                    try:
                        diff = cv2.absdiff(frame1, frame)
                        gray = cv2.cvtColor(diff, cv2.COLOR_BGR2GRAY)
                        blur = cv2.GaussianBlur(gray, (5,5), 0)
                        _, thresh = cv2.threshold(blur, 20, 255, cv2.THRESH_BINARY)
                        dilated = cv2.dilate(thresh, None, iterations=3)
                        motion_score = np.sum(dilated) / (frame.shape[0] * frame.shape[1] * 255)
                        
                        target_score = min(1.0, motion_score * 20)
                        self.escalation_score = self.escalation_score * 0.7 + target_score * 0.3
                    except Exception as e:
                       self.escalation_score = 0.0
                    
                    frame1 = frame 
                    frame_to_send = frame

                    # Temporal Confirmation Logic
                    # Required: Sustained > 0.5 for more than 2.0 seconds
                    if self.escalation_score > 0.5:
                        if self.escalation_start_time is None:
                            self.escalation_start_time = time.time()
                            logger.info("Escalation detected. Monitoring for persistence...")
                        
                        duration = time.time() - self.escalation_start_time
                        
                        # Trigger incident only if sustained and cooldown passed
                        if duration >= 2.0 and (time.time() - last_incident_time > 10):
                            meta = {
                                "type": "Rapid Escalation", 
                                "sev": "High", 
                                "desc": f"Sustained motion anomaly (duration: {round(duration, 1)}s) detected in secure zone."
                            }
                            loop.run_until_complete(self._handle_incident(meta))
                            last_incident_time = time.time()
                            self.escalation_start_time = None # Reset after trigger
                    else:
                        if self.escalation_start_time is not None:
                            logger.info("Escalation subsided. Resetting confirmation timer.")
                        self.escalation_start_time = None
                else:
                    if self.cap:
                        self.cap.release()
                    self.cap = None
                    time.sleep(0.5)
            else:
                time.sleep(0.5)

            # Send frame to queue
            if not self.frame_queue.full():
                if frame_to_send is not None and HAS_AI_LIBS:
                    _, buffer = cv2.imencode('.jpg', frame_to_send)
                    self.frame_queue.put(buffer.tobytes())
                elif placeholder_bytes:
                    self.frame_queue.put(placeholder_bytes)
            
            # Broadcast Real-time Stats
            if self.realtime_callback:
                 try:
                     loop.run_until_complete(self.realtime_callback({
                         "type": "stats",
                         "score": round(self.escalation_score, 2),
                         "cam": self.camera_id,
                         "confirmed": self.escalation_start_time is not None and (time.time() - self.escalation_start_time >= 2.0)
                     }))
                 except:
                     pass

            time.sleep(0.05)

    async def _handle_incident(self, incident_meta):
        ai_desc = incident_meta['desc']
        full_meta = {
            "timestamp": datetime.utcnow().isoformat(),
            "camera_id": self.camera_id,
            "type": incident_meta['type'],
            "severity": incident_meta['sev'],
            "description": ai_desc,
            "owner_id": self.owner_id,
            "escalation_score": round(self.escalation_score, 2),
            "ai_summary": f"Temporal sentinel analysis: {incident_meta['type']} confirmed after sustained anomaly detection."
        }
        if self.save_incident_callback: self.save_incident_callback(full_meta)
        if self.broadcast_callback: await self.broadcast_callback(full_meta)

    def get_frame(self):
        try:
            return self.frame_queue.get(timeout=0.01)
        except:
            return None

    def stop(self):
        self.is_running = False
        if self.cap:
            self.cap.release()
