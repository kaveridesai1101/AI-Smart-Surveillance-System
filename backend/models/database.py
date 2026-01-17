from sqlalchemy import Column, Integer, String, Float, DateTime, Text
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from datetime import datetime

DATABASE_URL = "sqlite:///./surveillance_system.db"

Base = declarative_base()

class Incident(Base):
    __tablename__ = "incidents"
    
    id = Column(Integer, primary_key=True, index=True)
    timestamp = Column(DateTime, default=datetime.utcnow)
    camera_id = Column(String)
    type = Column(String)
    severity = Column(String)
    description = Column(Text)
    ai_summary = Column(Text, nullable=True)
    confidence = Column(Float, default=0.0)
    owner_id = Column(String, default="admin")
    snapshot_path = Column(String, nullable=True)

class Camera(Base):
    __tablename__ = "cameras"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    location = Column(String)
    source_url = Column(String)
    owner_id = Column(String, default="admin")
    status = Column(String, default="active")

# Database setup (corrected create_engine)
from sqlalchemy import create_engine
engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def init_db():
    Base.metadata.create_all(bind=engine)
