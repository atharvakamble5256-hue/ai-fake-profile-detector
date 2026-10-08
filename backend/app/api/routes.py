import uuid
import json
import base64
from datetime import datetime
from typing import Optional, List, Dict, Any
from fastapi import APIRouter, HTTPException, UploadFile, File, Form, Depends, Request
from fastapi.responses import JSONResponse

from backend.app.models import (
    ProfileInput,
    AnalysisResponse,
    HistorySummaryItem,
    FaceAnalysisResult,
    PresetProfile
)
from backend.app.services.image_analyzer import (
    decode_base64_image,
    decode_bytes_image,
    analyze_profile_image
)
from backend.app.services.scoring_engine import analyze_profile_risk
from backend.app.services.sample_profiles import get_sample_presets
from backend.app.database import (
    save_analysis,
    get_history,
    get_analysis_by_id,
    delete_analysis,
    clear_all_history
)

router = APIRouter(prefix="/api")

@router.get("/health")
def health_check():
    import cv2
    return {
        "status": "healthy",
        "service": "AI-Powered Smart Fake Account Detector",
        "opencv_version": cv2.__version__,
        "timestamp": datetime.utcnow().isoformat()
    }

@router.get("/presets", response_model=List[PresetProfile])
def list_presets():
    """Retrieve pre-built demo profiles for hackathon judges"""
    return get_sample_presets()

@router.post("/analyze", response_model=AnalysisResponse)
async def analyze_profile(
    request: Request,
    payload: Optional[ProfileInput] = None
):
    """
    Main analysis endpoint:
    Supports both JSON body and multipart form data (with optional image file or webcam base64)
    """
    profile_data: ProfileInput
    cv_image_array = None
    preview_thumbnail = None

    content_type = request.headers.get("content-type", "")

    if "application/json" in content_type:
        body = await request.json()
        profile_data = ProfileInput(**body)
        if profile_data.image_base64:
            cv_image_array = decode_base64_image(profile_data.image_base64)
            preview_thumbnail = profile_data.image_base64
    else:
        # Handle multipart form data if submitted via FormData
        form = await request.form()
        image_file = form.get("image_file")
        image_base64 = form.get("image_base64")

        profile_data = ProfileInput(
            username=str(form.get("username", "")),
            platform=str(form.get("platform", "generic")),
            display_name=str(form.get("display_name", "")),
            bio=str(form.get("bio", "")),
            followers_count=int(form.get("followers_count", 0)),
            following_count=int(form.get("following_count", 0)),
            posts_count=int(form.get("posts_count", 0)),
            engagement_rate=float(form.get("engagement_rate", 2.5)),
            is_verified=str(form.get("is_verified", "false")).lower() in ("true", "1"),
            has_profile_pic=str(form.get("has_profile_pic", "true")).lower() in ("true", "1"),
            external_url=str(form.get("external_url", ""))
        )

        if image_file and hasattr(image_file, "read"):
            file_bytes = await image_file.read()
            if len(file_bytes) > 0:
                cv_image_array = decode_bytes_image(file_bytes)
                b64 = base64.b64encode(file_bytes).decode("utf-8")
                preview_thumbnail = f"data:image/jpeg;base64,{b64}"
        elif image_base64:
            cv_image_array = decode_base64_image(str(image_base64))
            preview_thumbnail = str(image_base64)

    # 1. Run OpenCV computer vision pipeline if image is provided
    face_cv_result = analyze_profile_image(cv_image_array)

    # If annotated image exists from CV, use it as preview thumbnail
    if face_cv_result.get("annotated_image"):
        preview_thumbnail = face_cv_result["annotated_image"]

    # 2. Run multi-factor risk scoring engine
    risk_evaluation = analyze_profile_risk(profile_data, face_cv_result)

    analysis_id = str(uuid.uuid4())
    created_at = datetime.utcnow().isoformat()

    response_payload = {
        "id": analysis_id,
        "username": profile_data.username,
        "platform": profile_data.platform,
        "display_name": profile_data.display_name or profile_data.username,
        "risk_score": risk_evaluation["risk_score"],
        "classification": risk_evaluation["classification"],
        "confidence_score": risk_evaluation["confidence_score"],
        "verdict_summary": risk_evaluation["verdict_summary"],
        "reasons": [r.model_dump() for r in risk_evaluation["reasons"]],
        "metrics_breakdown": risk_evaluation["metrics_breakdown"].model_dump(),
        "recommendations": [rec.model_dump() for rec in risk_evaluation["recommendations"]],
        "face_analysis": face_cv_result,
        "created_at": created_at,
        "profile_image_preview": preview_thumbnail
    }

    # 3. Persist record to SQLite
    try:
        db_record = {
            "id": analysis_id,
            "username": profile_data.username,
            "platform": profile_data.platform,
            "display_name": profile_data.display_name,
            "followers_count": profile_data.followers_count,
            "following_count": profile_data.following_count,
            "posts_count": profile_data.posts_count,
            "engagement_rate": profile_data.engagement_rate,
            "has_profile_pic": profile_data.has_profile_pic,
            "is_verified": profile_data.is_verified,
            "bio": profile_data.bio,
            "external_url": profile_data.external_url,
            "risk_score": risk_evaluation["risk_score"],
            "classification": risk_evaluation["classification"],
            "confidence_score": risk_evaluation["confidence_score"],
            "verdict_summary": risk_evaluation["verdict_summary"],
            "face_detected": face_cv_result["face_detected"],
            "face_count": face_cv_result["face_count"],
            "face_details": face_cv_result,
            "reasons": [r.model_dump() for r in risk_evaluation["reasons"]],
            "metrics_breakdown": risk_evaluation["metrics_breakdown"].model_dump(),
            "profile_image_preview": preview_thumbnail[:50000] if preview_thumbnail else "",
            "created_at": created_at
        }
        save_analysis(db_record)
    except Exception as db_err:
        print(f"Warning: Database save failed: {db_err}")

    return response_payload

@router.get("/history", response_model=List[HistorySummaryItem])
def get_analysis_history(limit: int = 50):
    """Retrieve history of past profile evaluations"""
    return get_history(limit)

@router.get("/history/{analysis_id}")
def get_single_analysis(analysis_id: str):
    """Retrieve complete report for a specific evaluation"""
    record = get_analysis_by_id(analysis_id)
    if not record:
        raise HTTPException(status_code=404, detail="Analysis report not found")
    return record

@router.delete("/history/{analysis_id}")
def delete_single_analysis(analysis_id: str):
    """Delete an analysis report"""
    deleted = delete_analysis(analysis_id)
    if not deleted:
        raise HTTPException(status_code=404, detail="Analysis report not found")
    return {"success": True, "message": f"Deleted analysis {analysis_id}"}

@router.delete("/history")
def clear_history():
    """Clear all analysis history"""
    count = clear_all_history()
    return {"success": True, "deleted_count": count}

@router.get("/export/{analysis_id}")
def export_analysis_json(analysis_id: str):
    """Export single evaluation as JSON file download payload"""
    record = get_analysis_by_id(analysis_id)
    if not record:
        raise HTTPException(status_code=404, detail="Analysis report not found")
    
    # Return formatted JSON with metadata
    return {
        "report_id": record["id"],
        "generated_by": "AI-Powered Smart Fake Account Detector",
        "generated_at": record["created_at"],
        "account": {
            "username": record["username"],
            "platform": record["platform"],
            "display_name": record["display_name"],
            "followers": record["followers_count"],
            "following": record["following_count"],
            "posts": record["posts_count"],
            "verified": record["is_verified"],
            "bio": record["bio"],
            "external_url": record["external_url"]
        },
        "verdict": {
            "risk_score": record["risk_score"],
            "classification": record["classification"],
            "confidence_score": record["confidence_score"],
            "summary": record["verdict_summary"]
        },
        "metrics_breakdown": record["metrics_breakdown"],
        "reasons": record["reasons"],
        "face_analysis": record["face_details"]
    }
