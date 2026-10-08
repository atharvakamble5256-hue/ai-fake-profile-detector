from pydantic import BaseModel, Field
from typing import List, Dict, Any, Optional

class ProfileInput(BaseModel):
    username: str = Field(..., description="Social media username/handle")
    platform: str = Field("generic", description="Platform e.g. twitter, instagram, linkedin, tiktok")
    display_name: Optional[str] = Field("", description="Profile display name")
    bio: Optional[str] = Field("", description="Account biography / description")
    followers_count: int = Field(0, ge=0, description="Number of followers")
    following_count: int = Field(0, ge=0, description="Number of following accounts")
    posts_count: int = Field(0, ge=0, description="Total posts published")
    engagement_rate: Optional[float] = Field(0.0, ge=0.0, le=100.0, description="Average engagement rate in percent")
    is_verified: Optional[bool] = Field(False, description="Whether account is blue badge verified")
    has_profile_pic: Optional[bool] = Field(False, description="Whether account has a profile picture")
    external_url: Optional[str] = Field("", description="Website link in bio")
    image_base64: Optional[str] = Field(None, description="Optional profile image as base64 data URL")

class FaceDetectionBox(BaseModel):
    x: int
    y: int
    width: int
    height: int
    confidence: float

class FaceAnalysisResult(BaseModel):
    face_detected: bool
    face_count: int
    faces: List[FaceDetectionBox] = []
    sharpness: float
    is_blurry: bool
    brightness: float
    contrast: float
    is_default_avatar: bool
    is_stock_or_ai_suspect: bool
    annotated_image: Optional[str] = None
    cv_notes: List[str] = []

class RiskReason(BaseModel):
    category: str  # 'network', 'username', 'content', 'activity', 'visual'
    severity: str  # 'critical', 'warning', 'info', 'positive'
    title: str
    description: str
    impact: int    # score delta (+/-)

class MetricsBreakdown(BaseModel):
    network_integrity: int      # 0 - 100
    identity_authenticity: int  # 0 - 100
    content_credibility: int    # 0 - 100
    behavioral_rhythm: int      # 0 - 100
    visual_quality: int         # 0 - 100

class Recommendation(BaseModel):
    type: str  # 'action', 'caution', 'safe'
    text: str

class AnalysisResponse(BaseModel):
    id: str
    username: str
    platform: str
    display_name: str
    risk_score: int                 # 0 - 100
    classification: str             # "Genuine", "Suspicious", "Likely Fake"
    confidence_score: int           # 0 - 100
    verdict_summary: str
    reasons: List[RiskReason]
    metrics_breakdown: MetricsBreakdown
    recommendations: List[Recommendation]
    face_analysis: FaceAnalysisResult
    created_at: str
    profile_image_preview: Optional[str] = None

class HistorySummaryItem(BaseModel):
    id: str
    username: str
    platform: str
    display_name: Optional[str]
    followers_count: int
    following_count: int
    posts_count: int
    risk_score: int
    classification: str
    confidence_score: int
    face_detected: bool
    profile_image_preview: Optional[str]
    created_at: str

class PresetProfile(BaseModel):
    id: str
    label: str
    category: str  # 'Likely Fake', 'Suspicious', 'Genuine'
    description: str
    data: ProfileInput
