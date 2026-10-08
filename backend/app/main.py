import sys
import os

# Ensure UTF-8 output encoding on Windows console
if sys.platform == "win32":
    try:
        sys.stdout.reconfigure(encoding='utf-8')
        sys.stderr.reconfigure(encoding='utf-8')
    except Exception:
        pass

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
import uvicorn

from backend.app.config import CORS_ORIGINS, PORT, HOST
from backend.app.database import init_db
from backend.app.api.routes import router as api_router

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: initialize database tables
    print("[INIT] Initializing Fake Account Detector Database...")
    init_db()
    print("[SUCCESS] Database ready.")
    yield
    print("[SHUTDOWN] Shutting down service...")

app = FastAPI(
    title="AI-Powered Smart Fake Account Detector API",
    description="Full-stack AI & CV powered social media account credibility and bot detection service.",
    version="1.0.0",
    lifespan=lifespan
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins for dev/hackathon
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register routes
app.include_router(api_router)

@app.get("/")
def root():
    return {
        "service": "AI-Powered Smart Fake Account Detector API",
        "version": "1.0.0",
        "status": "online",
        "docs_url": "/docs",
        "health_check": "/api/health"
    }

if __name__ == "__main__":
    uvicorn.run("backend.app.main:app", host=HOST, port=PORT, reload=True)
