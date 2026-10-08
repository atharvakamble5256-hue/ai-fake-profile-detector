import math
import re
from typing import Dict, Any, List, Tuple
from backend.app.models import ProfileInput, RiskReason, MetricsBreakdown, Recommendation

SCAM_KEYWORDS = [
    "crypto", "bitcoin", "forex", "airdrop", "giveaway", "free tokens",
    "dm for promo", "dm to collaborate", "invest and earn", "whatsapp",
    "telegram @", "t.me/", "binary option", "100x return", "cashapp",
    "gift card", "send $", "free money", "instant withdrawal"
]

IMPERSONATION_TERMS = [
    "official", "support", "helpdesk", "verify", "security",
    "customer_service", "admin", "moderator", "real_", "_verified"
]

SUSPICIOUS_DOMAINS = [
    "bit.ly", "tinyurl.com", "cutt.ly", "is.gd", "t.me", "wa.me", "rb.gy"
]

def calculate_shannon_entropy(text: str) -> float:
    """Calculate Shannon entropy to detect randomized character strings"""
    if not text:
        return 0.0
    text_clean = text.lower()
    freq = {}
    for char in text_clean:
        freq[char] = freq.get(char, 0) + 1
    entropy = 0.0
    length = len(text_clean)
    for count in freq.values():
        p = count / length
        entropy -= p * math.log2(p)
    return entropy

def analyze_profile_risk(
    profile: ProfileInput,
    face_cv_result: Dict[str, Any]
) -> Dict[str, Any]:
    """
    Comprehensive multi-factor risk scoring engine.
    Calculates 0-100 risk score, confidence score, breakdown dimensions, reasons, and recommendations.
    """
    reasons: List[RiskReason] = []
    base_score = 20  # Neutral baseline
    risk_delta = 0

    # Metric scores initialized to neutral 70 (higher is better/healthier)
    network_health = 70
    identity_score = 70
    content_score = 75
    behavior_score = 70
    visual_score = 75

    # ---------------------------------------------------------
    # 1. NETWORK RATIO ANALYSIS (Followers vs Following)
    # ---------------------------------------------------------
    followers = profile.followers_count
    following = max(0, profile.following_count)
    ratio = followers / max(1, following)

    if following > 2000 and followers < 100:
        impact = 35
        risk_delta += impact
        network_health -= 50
        reasons.append(RiskReason(
            category="network",
            severity="critical",
            title="Severe Follower/Following Imbalance",
            description=f"Account follows {following:,} users with only {followers} followers (Ratio: {ratio:.3f}). Classic automated follow-harvesting bot behavior.",
            impact=impact
        ))
    elif following > 3000 and ratio < 0.2:
        impact = 25
        risk_delta += impact
        network_health -= 35
        reasons.append(RiskReason(
            category="network",
            severity="warning",
            title="Disproportionate Following Footprint",
            description=f"Account maintains high following volume ({following:,}) relative to audience size ({followers:,}).",
            impact=impact
        ))
    elif followers > 20000 and following < 500:
        impact = -15
        risk_delta += impact
        network_health = min(100, network_health + 25)
        reasons.append(RiskReason(
            category="network",
            severity="positive",
            title="High Influence & Authority Ratio",
            description=f"Substantial follower audience ({followers:,}) with controlled following list ({following}), typical of public figures or creators.",
            impact=impact
        ))
    elif 0.4 <= ratio <= 3.5 and 50 <= following <= 2000:
        impact = -10
        risk_delta += impact
        network_health = min(100, network_health + 20)
        reasons.append(RiskReason(
            category="network",
            severity="positive",
            title="Natural Peer-to-Peer Social Ratio",
            description=f"Follower to following ratio ({ratio:.2f}) mirrors authentic organic human networking patterns.",
            impact=impact
        ))

    # ---------------------------------------------------------
    # 2. USERNAME SYNTACTIC & ENTROPY PATTERNS
    # ---------------------------------------------------------
    username = profile.username.strip()
    username_lower = username.lower()

    # Trailing digits check (e.g. username9837194)
    trailing_digits = re.search(r'\d+$', username)
    if trailing_digits:
        digit_count = len(trailing_digits.group(0))
        if digit_count >= 5:
            impact = 25
            risk_delta += impact
            identity_score -= 30
            reasons.append(RiskReason(
                category="username",
                severity="critical",
                title="Excessive Trailing Numeric Suffix",
                description=f"Handle ends with {digit_count} consecutive numeric digits ('{trailing_digits.group(0)}'). Common signature of programmatic bot generation scripts.",
                impact=impact
            ))
        elif digit_count >= 3:
            impact = 10
            risk_delta += impact
            identity_score -= 15
            reasons.append(RiskReason(
                category="username",
                severity="warning",
                title="Generic Auto-Generated Handle Suffix",
                description=f"Handle contains trailing sequence numbers ('{trailing_digits.group(0)}'), often suggested by bot templates.",
                impact=impact
            ))

    # Shannon Entropy check for gibberish/random usernames
    entropy = calculate_shannon_entropy(username)
    if len(username) > 8 and entropy > 3.6:
        impact = 15
        risk_delta += impact
        identity_score -= 20
        reasons.append(RiskReason(
            category="username",
            severity="warning",
            title="High Character Entropy (Potential Keyboard Mash)",
            description=f"Handle exhibits high randomness/entropy ({entropy:.2f} bits), suggesting non-human or disposable creation.",
            impact=impact
        ))

    # Impersonation terms check without verification
    is_verified = profile.is_verified or False
    impersonation_hits = [term for term in IMPERSONATION_TERMS if term in username_lower]
    if impersonation_hits and not is_verified:
        impact = 30
        risk_delta += impact
        identity_score -= 40
        reasons.append(RiskReason(
            category="username",
            severity="critical",
            title="Unverified Authority / Impersonation Keywords",
            description=f"Handle claims official status using keywords: {', '.join(impersonation_hits)} but lacks platform verification.",
            impact=impact
        ))
    elif is_verified:
        impact = -25
        risk_delta += impact
        identity_score = min(100, identity_score + 25)
        reasons.append(RiskReason(
            category="identity",
            severity="positive",
            title="Platform Verified Identity Badge",
            description="Account possesses verified status, substantially mitigating impersonation and bot risks.",
            impact=impact
        ))

    # ---------------------------------------------------------
    # 3. BIO & CONTENT SEMANTIC SIGNALS
    # ---------------------------------------------------------
    bio = (profile.bio or "").strip().lower()
    external_url = (profile.external_url or "").strip().lower()

    if not bio:
        impact = 15
        risk_delta += impact
        content_score -= 25
        reasons.append(RiskReason(
            category="content",
            severity="warning",
            title="Missing Bio / Profile Incompleteness",
            description="Account has an empty biography section, common in disposable or automated scraper bots.",
            impact=impact
        ))
    else:
        # Scam keywords search
        detected_scam_words = [kw for kw in SCAM_KEYWORDS if kw in bio]
        if detected_scam_words:
            impact = 30
            risk_delta += impact
            content_score -= 45
            reasons.append(RiskReason(
                category="content",
                severity="critical",
                title="Suspicious Commercial / Phishing Trigger Words",
                description=f"Biography contains high-risk promotional triggers: {', '.join(detected_scam_words[:4])}.",
                impact=impact
            ))
        elif len(bio) > 30:
            impact = -10
            risk_delta += impact
            content_score = min(100, content_score + 15)
            reasons.append(RiskReason(
                category="content",
                severity="positive",
                title="Comprehensive Biography Content",
                description="Profile includes thoughtful biographical narrative without known spam trigger markers.",
                impact=impact
            ))

    # Check external links
    if external_url or ("http" in bio):
        link_str = external_url + " " + bio
        suspicious_links = [domain for domain in SUSPICIOUS_DOMAINS if domain in link_str]
        if suspicious_links:
            impact = 20
            risk_delta += impact
            content_score -= 30
            reasons.append(RiskReason(
                category="content",
                severity="warning",
                title="Obfuscated URL / Redirect Service Detected",
                description=f"External link uses shortening or messaging redirect ({', '.join(suspicious_links)}), frequently used in affiliate spam or phishing.",
                impact=impact
            ))
        elif any(cred in link_str for cred in ["github.com", "linkedin.com", ".edu", ".gov"]):
            impact = -10
            risk_delta += impact
            content_score = min(100, content_score + 15)
            reasons.append(RiskReason(
                category="content",
                severity="positive",
                title="Verified External Professional Link",
                description="Link directs to recognized professional or academic developer domain.",
                impact=impact
            ))

    # ---------------------------------------------------------
    # 4. ACTIVITY & POSTING CADENCE
    # ---------------------------------------------------------
    posts = profile.posts_count
    engagement = profile.engagement_rate or 0.0

    if posts == 0 and following > 500:
        impact = 20
        risk_delta += impact
        behavior_score -= 30
        reasons.append(RiskReason(
            category="activity",
            severity="warning",
            title="Zero Post Inactive Footprint",
            description=f"Account has 0 published posts yet actively follows {following:,} accounts; characteristic of scraper or burner bot profiles.",
            impact=impact
        ))
    elif posts >= 25:
        impact = -12
        risk_delta += impact
        behavior_score = min(100, behavior_score + 20)
        reasons.append(RiskReason(
            category="activity",
            severity="positive",
            title="Consistent Publishing History",
            description=f"Account exhibits established post volume ({posts:,} posts), demonstrating active creator participation.",
            impact=impact
        ))

    # Engagement Rate anomalies
    if followers > 5000 and engagement < 0.2:
        impact = 20
        risk_delta += impact
        behavior_score -= 25
        reasons.append(RiskReason(
            category="activity",
            severity="warning",
            title="Near-Zero Engagement Rate (Ghost Followers)",
            description=f"Engagement rate is only {engagement:.2f}% despite {followers:,} followers. Signals artificial follower purchasing.",
            impact=impact
        ))
    elif 1.0 <= engagement <= 8.0:
        impact = -8
        risk_delta += impact
        behavior_score = min(100, behavior_score + 10)
        reasons.append(RiskReason(
            category="activity",
            severity="positive",
            title="Healthy Engagement Metric",
            description=f"Engagement rate ({engagement:.1f}%) matches normal authentic community interactions.",
            impact=impact
        ))

    # ---------------------------------------------------------
    # 5. COMPUTER VISION & VISUAL IDENTITY
    # ---------------------------------------------------------
    has_pic = profile.has_profile_pic if profile.has_profile_pic is not None else True
    if not has_pic or face_cv_result.get("is_default_avatar"):
        impact = 25
        risk_delta += impact
        visual_score -= 45
        reasons.append(RiskReason(
            category="visual",
            severity="critical",
            title="Default Placeholder Avatar / No Profile Photo",
            description="Account does not feature a customized personal image, typical of burner or bulk-registered bots.",
            impact=impact
        ))
    else:
        face_count = face_cv_result.get("face_count", 0)
        if face_count == 1:
            impact = -15
            risk_delta += impact
            visual_score = min(100, visual_score + 20)
            reasons.append(RiskReason(
                category="visual",
                severity="positive",
                title="Single Human Portrait Verified (OpenCV)",
                description="Computer vision Haar Cascade identified 1 authentic frontal facial profile with clear resolution.",
                impact=impact
            ))
        elif face_count > 3:
            impact = 10
            risk_delta += impact
            visual_score -= 15
            reasons.append(RiskReason(
                category="visual",
                severity="info",
                title="Multiple Faces in Profile Image",
                description=f"Detected {face_count} distinct faces in avatar frame; atypical for personal verified profile.",
                impact=impact
            ))

        if face_cv_result.get("is_blurry"):
            impact = 12
            risk_delta += impact
            visual_score -= 20
            reasons.append(RiskReason(
                category="visual",
                severity="warning",
                title="Degraded Resolution / Compression Artifacts",
                description="Image Laplacian variance indicates low resolution or repeated scraping re-compression.",
                impact=impact
            ))

        if face_cv_result.get("is_stock_or_ai_suspect"):
            impact = 18
            risk_delta += impact
            visual_score -= 30
            reasons.append(RiskReason(
                category="visual",
                severity="warning",
                title="Suspected AI Synthesized (GAN) Portrait",
                description="Facial geometry exhibits hyper-centered pupil positioning characteristic of StyleGAN generated portraits.",
                impact=impact
            ))

    # ---------------------------------------------------------
    # 6. COMPOSITE SCORING & CLASSIFICATION
    # ---------------------------------------------------------
    raw_risk = base_score + risk_delta
    final_risk = max(0, min(100, raw_risk))

    # Classification buckets
    if final_risk <= 34:
        classification = "Genuine"
        verdict_summary = "This profile displays consistent hallmarks of an authentic human or verified organizational presence with organic network interactions."
    elif final_risk <= 69:
        classification = "Suspicious"
        verdict_summary = "Noticeable anomalies detected in audience ratio, profile completeness, or handle construction. Proceed with informed caution."
    else:
        classification = "Likely Fake"
        verdict_summary = "High density of automated bot signatures, deceptive patterns, or extreme network anomalies identified. Strong probability of fake or malicious account."

    # Confidence score calculation based on data completeness
    confidence = 65
    if profile.bio:
        confidence += 8
    if profile.followers_count > 0 or profile.following_count > 0:
        confidence += 8
    if profile.posts_count > 0:
        confidence += 6
    if face_cv_result.get("annotated_image"):
        confidence += 10
    confidence = min(98, max(45, confidence))

    # Clamp metrics breakdown between 5 and 100
    metrics = MetricsBreakdown(
        network_integrity=max(5, min(100, network_health)),
        identity_authenticity=max(5, min(100, identity_score)),
        content_credibility=max(5, min(100, content_score)),
        behavioral_rhythm=max(5, min(100, behavior_score)),
        visual_quality=max(5, min(100, visual_score))
    )

    # Recommendations
    recommendations: List[Recommendation] = []
    if classification == "Likely Fake":
        recommendations.append(Recommendation(type="caution", text="Do not click external URLs, execute financial transactions, or share credentials with this account."))
        recommendations.append(Recommendation(type="action", text="Report profile for impersonation or automated spam on the hosting platform."))
        recommendations.append(Recommendation(type="action", text="Block to prevent automated follow-drain scraping."))
    elif classification == "Suspicious":
        recommendations.append(Recommendation(type="caution", text="Verify identity through secondary channels (e.g. personal website, verified LinkedIn, cross-platform handles)."))
        recommendations.append(Recommendation(type="caution", text="Inspect recent replies and comments to confirm organic conversational context."))
        recommendations.append(Recommendation(type="action", text="Request official domain confirmation before discussing collaborations."))
    else:
        recommendations.append(Recommendation(type="safe", text="Safe to interact; profile shows organic social graph and authentic account history."))
        recommendations.append(Recommendation(type="safe", text="Identity metrics meet established digital trust standards."))

    return {
        "risk_score": final_risk,
        "classification": classification,
        "confidence_score": confidence,
        "verdict_summary": verdict_summary,
        "reasons": reasons,
        "metrics_breakdown": metrics,
        "recommendations": recommendations
    }
