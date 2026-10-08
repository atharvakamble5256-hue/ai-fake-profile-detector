import sqlite3
import json
import os
from pathlib import Path
from typing import List, Dict, Any, Optional
from datetime import datetime
from backend.app.config import DATABASE_PATH

# Ensure parent directory exists
os.makedirs(os.path.dirname(DATABASE_PATH), exist_ok=True)

def get_db_connection():
    conn = sqlite3.connect(DATABASE_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS analysis_history (
        id TEXT PRIMARY KEY,
        username TEXT NOT NULL,
        platform TEXT DEFAULT 'twitter',
        display_name TEXT,
        followers_count INTEGER DEFAULT 0,
        following_count INTEGER DEFAULT 0,
        posts_count INTEGER DEFAULT 0,
        engagement_rate REAL DEFAULT 0.0,
        has_profile_pic INTEGER DEFAULT 1,
        is_verified INTEGER DEFAULT 0,
        bio TEXT,
        external_url TEXT,
        risk_score INTEGER NOT NULL,
        classification TEXT NOT NULL,
        confidence_score INTEGER NOT NULL,
        verdict_summary TEXT,
        face_detected INTEGER DEFAULT 0,
        face_count INTEGER DEFAULT 0,
        face_details_json TEXT,
        reasons_json TEXT,
        metrics_breakdown_json TEXT,
        profile_image_preview TEXT,
        created_at TEXT NOT NULL
    )
    """)
    conn.commit()
    conn.close()

def save_analysis(record: Dict[str, Any]) -> str:
    conn = get_db_connection()
    cursor = conn.cursor()
    
    cursor.execute("""
    INSERT INTO analysis_history (
        id, username, platform, display_name, followers_count, following_count,
        posts_count, engagement_rate, has_profile_pic, is_verified,
        bio, external_url, risk_score, classification, confidence_score,
        verdict_summary, face_detected, face_count, face_details_json,
        reasons_json, metrics_breakdown_json, profile_image_preview, created_at
    ) VALUES (
        :id, :username, :platform, :display_name, :followers_count, :following_count,
        :posts_count, :engagement_rate, :has_profile_pic, :is_verified,
        :bio, :external_url, :risk_score, :classification, :confidence_score,
        :verdict_summary, :face_detected, :face_count, :face_details_json,
        :reasons_json, :metrics_breakdown_json, :profile_image_preview, :created_at
    )
    """, {
        "id": record["id"],
        "username": record.get("username", ""),
        "platform": record.get("platform", "generic"),
        "display_name": record.get("display_name", ""),
        "followers_count": record.get("followers_count", 0),
        "following_count": record.get("following_count", 0),
        "posts_count": record.get("posts_count", 0),
        "engagement_rate": record.get("engagement_rate", 0.0),
        "has_profile_pic": 1 if record.get("has_profile_pic", True) else 0,
        "is_verified": 1 if record.get("is_verified", False) else 0,
        "bio": record.get("bio", ""),
        "external_url": record.get("external_url", ""),
        "risk_score": record.get("risk_score", 0),
        "classification": record.get("classification", "Genuine"),
        "confidence_score": record.get("confidence_score", 0),
        "verdict_summary": record.get("verdict_summary", ""),
        "face_detected": 1 if record.get("face_detected", False) else 0,
        "face_count": record.get("face_count", 0),
        "face_details_json": json.dumps(record.get("face_details", {})),
        "reasons_json": json.dumps(record.get("reasons", [])),
        "metrics_breakdown_json": json.dumps(record.get("metrics_breakdown", {})),
        "profile_image_preview": record.get("profile_image_preview", ""),
        "created_at": record.get("created_at", datetime.utcnow().isoformat())
    })
    
    conn.commit()
    conn.close()
    return record["id"]

def get_history(limit: int = 50) -> List[Dict[str, Any]]:
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("""
    SELECT id, username, platform, display_name, followers_count, following_count,
           posts_count, risk_score, classification,
           confidence_score, face_detected, profile_image_preview, created_at
    FROM analysis_history
    ORDER BY created_at DESC
    LIMIT ?
    """, (limit,))
    rows = cursor.fetchall()
    conn.close()
    
    results = []
    for row in rows:
        results.append({
            "id": row["id"],
            "username": row["username"],
            "platform": row["platform"],
            "display_name": row["display_name"],
            "followers_count": row["followers_count"],
            "following_count": row["following_count"],
            "posts_count": row["posts_count"],
            "risk_score": row["risk_score"],
            "classification": row["classification"],
            "confidence_score": row["confidence_score"],
            "face_detected": bool(row["face_detected"]),
            "profile_image_preview": row["profile_image_preview"],
            "created_at": row["created_at"]
        })
    return results

def get_analysis_by_id(analysis_id: str) -> Optional[Dict[str, Any]]:
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM analysis_history WHERE id = ?", (analysis_id,))
    row = cursor.fetchone()
    conn.close()
    
    if not row:
        return None
        
    return {
        "id": row["id"],
        "username": row["username"],
        "platform": row["platform"],
        "display_name": row["display_name"],
        "followers_count": row["followers_count"],
        "following_count": row["following_count"],
        "posts_count": row["posts_count"],
        "engagement_rate": row["engagement_rate"],
        "has_profile_pic": bool(row["has_profile_pic"]),
        "is_verified": bool(row["is_verified"]),
        "bio": row["bio"],
        "external_url": row["external_url"],
        "risk_score": row["risk_score"],
        "classification": row["classification"],
        "confidence_score": row["confidence_score"],
        "verdict_summary": row["verdict_summary"],
        "face_detected": bool(row["face_detected"]),
        "face_count": row["face_count"],
        "face_details": json.loads(row["face_details_json"] or "{}"),
        "reasons": json.loads(row["reasons_json"] or "[]"),
        "metrics_breakdown": json.loads(row["metrics_breakdown_json"] or "{}"),
        "profile_image_preview": row["profile_image_preview"],
        "created_at": row["created_at"]
    }

def delete_analysis(analysis_id: str) -> bool:
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("DELETE FROM analysis_history WHERE id = ?", (analysis_id,))
    deleted = cursor.rowcount > 0
    conn.commit()
    conn.close()
    return deleted

def clear_all_history() -> int:
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("DELETE FROM analysis_history")
    deleted_count = cursor.rowcount
    conn.commit()
    conn.close()
    return deleted_count
