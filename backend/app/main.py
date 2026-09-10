import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from app.database.session import Base, engine, SessionLocal
from app.database.seed_data import seed_database
from app.routes import disasters, hospitals, rescue_teams, resources, alerts, simulation

# Create database tables
Base.metadata.create_all(bind=engine)

# Auto seed database on boot
with SessionLocal() as db:
    seed_database(db)

app = FastAPI(
    title="RESQAI - AI-Powered Multi-Agent Disaster Response Platform",
    description="Enterprise-grade autonomous emergency operations center coordinating specialized AI agents for multi-disaster response",
    version="1.0.0"
)

# CORS configuration for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Ensure uploads directory exists and mount static files
uploads_dir = os.path.join(os.path.dirname(os.path.dirname(__file__)), "uploads")
os.makedirs(uploads_dir, exist_ok=True)
app.mount("/uploads", StaticFiles(directory=uploads_dir), name="uploads")

# Register routers
app.include_router(disasters.router)
app.include_router(hospitals.router)
app.include_router(rescue_teams.router)
app.include_router(resources.router)
app.include_router(alerts.router)
app.include_router(simulation.router)

@app.get("/")
def root():
    return {
        "system": "RESQAI",
        "tagline": "AI-Powered Multi-Agent Disaster Response Platform",
        "version": "1.0.0",
        "status": "OPERATIONAL",
        "docs_url": "/docs"
    }

@app.get("/api/health")
def health():
    return {"status": "healthy", "service": "RESQAI Emergency Management Engine"}
