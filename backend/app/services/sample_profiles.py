from typing import List, Dict, Any
from backend.app.models import PresetProfile

SAMPLE_PROFILES: List[PresetProfile] = []

def get_sample_presets() -> List[Dict[str, Any]]:
    """Brand new clean state: returns no pre-configured mock profiles"""
    return []
