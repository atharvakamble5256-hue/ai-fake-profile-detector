import os
import json
from pathlib import Path
from dotenv import load_dotenv

# Load environment variables
env_path = Path(__file__).resolve().parent.parent / ".env"
load_dotenv(dotenv_path=env_path)

BASE_DIR = Path(__file__).resolve().parent.parent

PORT = int(os.getenv("PORT", "8000"))
HOST = os.getenv("HOST", "0.0.0.0")
ENVIRONMENT = os.getenv("ENVIRONMENT", "development")

# Database Path
DB_RELATIVE = os.getenv("DATABASE_PATH", "backend/data/fake_detector.db")
DATABASE_PATH = str(BASE_DIR.parent / DB_RELATIVE if not Path(DB_RELATIVE).is_absolute() else DB_RELATIVE)

# CORS Origins
raw_origins = os.getenv("CORS_ORIGINS", '["*"]')
try:
    CORS_ORIGINS = json.loads(raw_origins)
except Exception:
    CORS_ORIGINS = ["*"]

MAX_IMAGE_SIZE_MB = int(os.getenv("MAX_IMAGE_SIZE_MB", "10"))
CONFIDENCE_BASE = int(os.getenv("CONFIDENCE_BASE", "65"))
