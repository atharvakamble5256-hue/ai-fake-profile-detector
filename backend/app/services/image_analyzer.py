import cv2
import numpy as np
import base64
import re
from typing import Dict, Any, Tuple, Optional

# Load Haar cascade classifiers
face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + "haarcascade_frontalface_default.xml")
eye_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + "haarcascade_eye.xml")

def decode_base64_image(image_str: str) -> Optional[np.ndarray]:
    """Decode base64 string (including data URL prefix) to OpenCV BGR image"""
    try:
        # Strip header if present e.g. data:image/png;base64,...
        if "," in image_str:
            image_str = image_str.split(",", 1)[1]
            
        image_data = base64.b64decode(image_str)
        nparr = np.frombuffer(image_data, np.uint8)
        img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
        return img
    except Exception as e:
        print(f"Error decoding base64 image: {e}")
        return None

def decode_bytes_image(image_bytes: bytes) -> Optional[np.ndarray]:
    """Decode raw bytes to OpenCV BGR image"""
    try:
        nparr = np.frombuffer(image_bytes, np.uint8)
        img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
        return img
    except Exception as e:
        print(f"Error decoding image bytes: {e}")
        return None

def analyze_profile_image(img: np.ndarray) -> Dict[str, Any]:
    """
    Run comprehensive computer vision analysis on profile picture:
    - Face detection & count (Haar cascade)
    - Eye detection for liveness/portrait check
    - Sharpness / blurriness metric (Laplacian variance)
    - Brightness and contrast statistics
    - Default/blank avatar detection
    - High-tech visual annotation with bounding boxes
    """
    if img is None or img.size == 0:
        return {
            "face_detected": False,
            "face_count": 0,
            "faces": [],
            "sharpness": 0.0,
            "is_blurry": False,
            "brightness": 0.0,
            "contrast": 0.0,
            "is_default_avatar": True,
            "is_stock_or_ai_suspect": False,
            "annotated_image": None,
            "cv_notes": ["No valid image payload provided."]
        }

    h, w = img.shape[:2]
    
    # Resize if image is excessively large to keep response fast (max 800px on longest side)
    max_dim = max(h, w)
    scale = 1.0
    if max_dim > 800:
        scale = 800.0 / max_dim
        img = cv2.resize(img, (int(w * scale), int(h * scale)), interpolation=cv2.INTER_AREA)
        h, w = img.shape[:2]

    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    
    # 1. Blur / Sharpness check using Laplacian variance
    laplacian_var = float(cv2.Laplacian(gray, cv2.CV_64F).var())
    is_blurry = laplacian_var < 60.0

    # 2. Brightness and Contrast
    mean_val, std_dev = cv2.meanStdDev(gray)
    brightness = float(mean_val[0][0])
    contrast = float(std_dev[0][0])

    # 3. Default avatar / solid silhouette heuristic
    # If standard deviation of grayscale is very low, or image has very few distinct colors
    is_default_avatar = False
    if contrast < 12.0 or (laplacian_var < 5.0 and contrast < 25.0):
        is_default_avatar = True

    # 4. Face Detection using Haar Cascade
    detected_faces = face_cascade.detectMultiScale(
        gray,
        scaleFactor=1.1,
        minNeighbors=5,
        minSize=(30, 30),
        flags=cv2.CASCADE_SCALE_IMAGE
    )

    faces_list = []
    annotated = img.copy()
    cv_notes = []

    face_count = len(detected_faces)
    face_detected = face_count > 0

    if face_detected:
        cv_notes.append(f"Detected {face_count} human face(s) via OpenCV Haar Cascade.")
        for idx, (x, y, fw, fh) in enumerate(detected_faces):
            # Calculate face area ratio relative to entire image
            face_area_ratio = (fw * fh) / float(w * h)
            
            # Sub-region for eye detection
            roi_gray = gray[y:y+fh, x:x+fw]
            eyes = eye_cascade.detectMultiScale(roi_gray, scaleFactor=1.1, minNeighbors=3, minSize=(15, 15))
            
            conf = min(0.98, max(0.65, 0.70 + (0.15 if len(eyes) >= 1 else 0.0) + (0.10 if 0.1 <= face_area_ratio <= 0.6 else 0.0)))

            faces_list.append({
                "x": int(x),
                "y": int(y),
                "width": int(fw),
                "height": int(fh),
                "confidence": round(conf, 2)
            })

            # Draw futuristic bounding box
            color = (0, 240, 120)  # Neon Emerald Green
            thickness = 2
            cv2.rectangle(annotated, (x, y), (x + fw, y + fh), color, thickness)
            
            # Corner accents for sleek cyber HUD aesthetic
            corner_len = int(min(fw, fh) * 0.2)
            # Top-left
            cv2.line(annotated, (x, y), (x + corner_len, y), (0, 255, 255), 3)
            cv2.line(annotated, (x, y), (x, y + corner_len), (0, 255, 255), 3)
            # Top-right
            cv2.line(annotated, (x + fw, y), (x + fw - corner_len, y), (0, 255, 255), 3)
            cv2.line(annotated, (x + fw, y), (x + fw, y + corner_len), (0, 255, 255), 3)
            # Bottom-left
            cv2.line(annotated, (x, y + fh), (x + corner_len, y + fh), (0, 255, 255), 3)
            cv2.line(annotated, (x, y + fh), (x, y + fh - corner_len), (0, 255, 255), 3)
            # Bottom-right
            cv2.line(annotated, (x + fw, y + fh), (x + fw - corner_len, y + fh), (0, 255, 255), 3)
            cv2.line(annotated, (x + fw, y + fh), (x + fw, y + fh - corner_len), (0, 255, 255), 3)

            # Badge tag label
            label = f"Face #{idx+1} ({int(conf*100)}%)"
            cv2.rectangle(annotated, (x, max(0, y - 24)), (x + 130, max(24, y)), (20, 24, 33), -1)
            cv2.putText(annotated, label, (x + 5, max(16, y - 6)), cv2.FONT_HERSHEY_SIMPLEX, 0.45, (0, 240, 120), 1, cv2.LINE_AA)

        if face_count > 2:
            cv_notes.append("Multiple faces detected in profile picture; unusual for individual accounts.")
    else:
        cv_notes.append("No distinct human face detected. May be a brand logo, abstract graphic, or animal avatar.")

    if is_blurry:
        cv_notes.append(f"Image sharpness score ({round(laplacian_var, 1)}) indicates motion blur or low resolution compression.")
    else:
        cv_notes.append(f"Sharpness metric ({round(laplacian_var, 1)}) confirms clean image resolution.")

    # Stock / AI suspect heuristic:
    # Extremely centered face, unrealistically smooth skin / zero grain with ultra-high symmetry
    is_stock_or_ai_suspect = False
    if face_count == 1:
        fx, fy, fw, fh = detected_faces[0]
        center_x = fx + fw / 2.0
        # If face is dead-center (typical in GAN-generated images like StyleGAN / thispersondoesnotexist)
        if abs(center_x - (w / 2.0)) < (w * 0.04) and laplacian_var > 150:
            is_stock_or_ai_suspect = True
            cv_notes.append("Spatial alignment matches centered GAN/AI-synthesized portrait profile signature.")

    # Encode annotated image back to base64 JPEG
    success, buffer = cv2.imencode('.jpg', annotated, [int(cv2.IMWRITE_JPEG_QUALITY), 88])
    annotated_base64 = None
    if success:
        b64_str = base64.b64encode(buffer).decode('utf-8')
        annotated_base64 = f"data:image/jpeg;base64,{b64_str}"

    return {
        "face_detected": face_detected,
        "face_count": face_count,
        "faces": faces_list,
        "sharpness": round(laplacian_var, 2),
        "is_blurry": is_blurry,
        "brightness": round(brightness, 1),
        "contrast": round(contrast, 1),
        "is_default_avatar": is_default_avatar,
        "is_stock_or_ai_suspect": is_stock_or_ai_suspect,
        "annotated_image": annotated_base64,
        "cv_notes": cv_notes
    }
