# AI-Powered Smart Fake Account Detector (VERIF.AI)

> **Production Architecture &bull; Clean Slate &bull; Explainable Social Media Cyber-Defense**  
> Analyzes real social media profiles and predicts whether an account is **Genuine, Suspicious, or Likely Fake** with a **0–100 risk score, confidence rating, explainable signals, OpenCV facial biometrics, and interactive Recharts visualizations**.

---

## 1. Project Overview & Problem Statement

### The Problem
The rise of automated bot syndicates and AI-generated personas has created severe vulnerabilities in digital trust:
- **Phishing & Financial Scams**: Automated bots promoting fraudulent cryptocurrency airdrops, high-yield investment scams, and gift card theft.
- **Identity Impersonation**: Malicious accounts mimicking verified creators, support personnel, and corporate brands.
- **Astroturfing & Follower Farms**: Artificially manufactured engagement to simulate consensus or defraud advertisers.
- **Malicious Redirection**: Bio links pointing to deceptive link shorteners and messaging channels (`bit.ly`, `t.me`, `wa.me`).

### The Solution: VERIF.AI
**VERIF.AI** is a privacy-first, full-stack intelligence system that assesses social media account credibility through transparent, deterministic heuristics and computer vision:
1. **Empty-State Architecture**: The application starts in a completely clean, pristine state with zero mock profiles, zero demo fixtures, and an empty SQLite database.
2. **Transparent Risk Scoring**: Shannon syntactic entropy, follower-to-following ratio heuristics, cadence velocity analysis, and semantic trigger detection.
3. **OpenCV Computer Vision Engine**: Haar Cascade face detection (`haarcascade_frontalface_default.xml`), Laplacian variance sharpness calculation, and GAN/placeholder detection.
4. **WebRTC Live Biometrics**: Direct in-browser camera integration for live selfie analysis.
5. **Interactive Recharts Visuals**: 5-axis Trust Dimension Radars and comparative baseline bar charts.

---

## 2. Dynamic End-to-End Data Flow

The system strictly follows the production lifecycle:

```
┌─────────────────┐       ┌─────────────────┐       ┌─────────────────┐       ┌─────────────────┐
│   EMPTY STATE   │  ──>  │   USER ACTION   │  ──>  │   DATA STORE    │  ──>  │    UI UPDATE    │
│                 │       │                 │       │                 │       │                 │
│ Form is blank   │       │ User inputs     │       │ Backend runs    │       │ Radial gauge,   │
│ DB has 0 rows   │       │ handle, stats,  │       │ OpenCV + AI     │       │ Recharts radar, │
│ History is empty│       │ photo/webcam    │       │ and saves to DB │       │ CV card, & logs │
└─────────────────┘       └─────────────────┘       └─────────────────┘       └─────────────────┘
```

1. **Empty State**:
   - The application boots clean with no mock or fake records.
   - Form fields start empty with neutral zero defaults.
   - SQLite table `analysis_history` is initialized and empty.
   - History viewer displays an empty state prompt.
2. **User Action**:
   - The user selects a platform, enters a username handle, fills in profile telemetry (followers, following, posts, age, bio, external link).
   - The user optionally uploads a profile photo or captures a live portrait via the WebRTC webcam interface.
   - The user clicks **"Run AI Deep Scan"**.
3. **Data Store**:
   - The FastAPI backend ingests the payload via `POST /api/analyze`.
   - The image is processed through the OpenCV pipeline (Haar Cascade face detection, Laplacian sharpness, HUD annotation).
   - The heuristic scoring engine evaluates all signals and computes a composite risk score (0–100) and confidence rating.
   - The complete report is persisted into SQLite (`backend/data/fake_detector.db`).
4. **UI Update**:
   - The frontend immediately updates to display:
     - The animated radial risk gauge.
     - The Recharts 5-axis Trust Radar and Benchmark Bar Chart.
     - The OpenCV facial bounding box card with diagnostics.
     - Categorized explainable signal breakdown with individual point deltas.
     - Tailored security recommendations.
   - The persistent Analysis History list updates with the new real record.

---

## 3. Key Features

- **Pristine, Production-Grade UI**: Zero mock profiles or fake dummy presets; every report is generated on demand from real user inputs.
- **Transparent 0–100 Risk Classification**:
  - `0 – 34`: **Genuine** (Emerald Green &bull; Low risk)
  - `35 – 69`: **Suspicious** (Amber Orange &bull; Warning signals)
  - `70 – 100`: **Likely Fake** (Crimson Red &bull; High bot probability)
- **Computer Vision & Face Biometrics (OpenCV)**:
  - Real-time facial bounding boxes overlaid with neon HUD telemetry.
  - Laplacian variance sharpness metric for compression artifact and blur detection.
  - Heuristic detection of blank avatars and GAN-generated portrait anomalies.
- **WebRTC Camera Capture**:
  - Live in-browser selfie capture with cyber reticle and viewfinder.
- **Explainable AI Attribution**:
  - Signal list categorized into *Critical*, *Warning*, *Contextual*, and *Positive*.
  - Every factor explicitly details its exact score delta (e.g. `+35 pts` or `-15 pts`).
- **Interactive Recharts Visuals**:
  - Trust Dimension Radar (Network, Identity, Content, Rhythm, Visual).
  - Baseline comparison bar chart.
- **Persistent SQLite History**:
  - Auto-records every executed scan.
  - Search by handle, filter by classification, inspect past reports, or delete records.
- **Forensic Export**:
  - Full raw JSON telemetry download.
  - Print / Save as formatted PDF.
  - Copy text summary to clipboard.
- **Privacy & Safety**:
  - Local processing; no scraping, no private credentials required.

---

## 4. Tech Stack

| Layer | Technology | Details |
|---|---|---|
| **Frontend Framework** | React 19 + Vite | Ultra-fast client build and reactive UI |
| **Styling & Theme** | Tailwind CSS v4 | Futuristic dark cyber-defense interface |
| **Charts & Visualization** | Recharts | Responsive Radar and Bar charts |
| **Icons & UI FX** | Lucide React + Canvas Confetti | Modern UI icons and celebratory effects |
| **Backend Framework** | FastAPI (Python 3.10+) | High-performance async REST API |
| **Computer Vision** | OpenCV (`opencv-python-headless`) + NumPy | Haar Cascades (`haarcascade_frontalface_default.xml`, `haarcascade_eye.xml`) |
| **Database** | SQLite3 | Embedded persistent database (`backend/data/fake_detector.db`) |
| **Web Server** | Uvicorn | ASGI production web server |

---

## 5. Architecture & Folder Structure

```
c:\Users\admin\Desktop\project\
├── backend/
│   ├── app/
│   │   ├── __init__.py
│   │   ├── main.py                   # FastAPI app, CORS, lifespan & router registration
│   │   ├── config.py                 # Configuration and environment variables
│   │   ├── database.py               # SQLite connection, schemas, and CRUD operations
│   │   ├── models.py                 # Pydantic schemas (requests, responses, telemetry)
│   │   ├── services/
│   │   │   ├── __init__.py
│   │   │   ├── scoring_engine.py     # Heuristic risk calculation, entropy & explainability
│   │   │   ├── image_analyzer.py     # OpenCV Haar Cascade, Laplacian blur, HUD bounding boxes
│   │   │   └── sample_profiles.py    # Clean service (returns empty list)
│   │   └── api/
│   │       ├── __init__.py
│   │       └── routes.py             # REST endpoints (/analyze, /history, /export)
│   ├── data/
│   │   └── fake_detector.db          # Auto-created SQLite database
│   ├── requirements.txt              # Python dependencies
│   ├── .env                          # Active backend environment settings
│   ├── .env.example                  # Template for environment configuration
│   └── run.py                        # Python server entrypoint
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx            # Brand, OpenCV status badge, action triggers
│   │   │   ├── HeroBanner.jsx        # Presentation hero with badges and quick actions
│   │   │   ├── ProfileInputForm.jsx  # Clean input form with live entropy cues & upload hooks
│   │   │   ├── WebcamCaptureModal.jsx# WebRTC camera capture modal with cyber HUD
│   │   │   ├── RiskGauge.jsx         # Radial animated risk meter (0-100)
│   │   │   ├── AnalysisResults.jsx   # Full report view combining all diagnostic cards
│   │   │   ├── FaceAnalysisCard.jsx  # OpenCV facial bounding box and CV metrics
│   │   │   ├── ChartsSection.jsx     # Recharts Trust Radar and Benchmark Bar charts
│   │   │   ├── ReasonsBreakdown.jsx  # Explainable signals with impact point tags
│   │   │   ├── RecommendationsCard.jsx # Actionable mitigation and verification advice
│   │   │   ├── HistoryModal.jsx      # SQLite history browser with search and filter
│   │   │   ├── ExportReportModal.jsx # Export to JSON, PDF Print, and clipboard copy
│   │   │   └── ScanningOverlay.jsx   # Radar sweep scanning animation
│   │   ├── services/
│   │   │   └── api.js                # Frontend API fetch client
│   │   ├── App.jsx                   # Central application state orchestrator
│   │   ├── main.jsx                  # React application root
│   │   └── index.css                 # Custom animations and print CSS
│   ├── package.json
│   ├── vite.config.js                # Vite config with Tailwind v4 & backend proxy
│   └── index.html
├── start.bat                         # 1-Click Windows launcher
├── start.sh                          # 1-Click Linux/macOS launcher
└── info.md                           # Documentation (this file)
```

---

## 6. AI & Risk-Scoring Engine Explanation

### 1. Network Graph Ratios
$$\text{Ratio} = \frac{\text{Followers}}{\max(1, \text{Following})}$$
- **Bot Farm Signature**: Account following $> 2,000$ with $< 100$ followers ($\text{Ratio} < 0.05$) $\rightarrow$ **+35 to +40 Risk points**.
- **Follow Churn**: Following $> 3,000$ with low followers $\rightarrow$ **+25 Risk points**.
- **Organic Social Graph**: Ratio between $0.4$ and $3.5$ with realistic following $\rightarrow$ **-10 Risk points** (Trust bonus).
- **Public Authority**: Followers $> 20,000$ with controlled following $\rightarrow$ **-15 Risk points**.

### 2. Syntactic & Shannon Entropy Analysis
$$H(X) = -\sum_{i=1}^n P(x_i) \log_2 P(x_i)$$
- **Trailing Numeric Suffix**: Detects sequence numbers generated by automation scripts (e.g. `user9982314`). $\ge 5$ consecutive digits adds **+25 Risk points**.
- **High Character Entropy**: Gibberish or keyboard mash handles with $H(X) > 3.6$ bits add **+15 Risk points**.
- **Unverified Authority**: Accounts using terms like `official`, `support`, `security`, `giveaway` without platform verification badges trigger an impersonation penalty of **+30 Risk points**.

### 3. Bio & Semantic Phishing Signals
- Bio text is scanned against high-risk commercial and phishing tokens: `crypto`, `airdrop`, `giveaway`, `forex`, `dm for promo`, `whatsapp`, `t.me`, `binary options`, `100x return`. Triggering these adds **+30 Risk points**.
- Detects obfuscated URL shorteners (`bit.ly`, `tinyurl.com`, `cutt.ly`, `t.me`, `wa.me`). Adds **+20 Risk points**.
- Verified developer domains (`github.com`, `linkedin.com`, `.edu`) reward **-10 Risk points**.

### 4. Temporal Dynamics & Post Cadence
- **Fresh Account Velocity**: Account age $< 7$ days with following $> 300$ adds **+25 Risk points**.
- **Zombie Account**: Account age $> 365$ days with $0$ posts and high following adds **+20 Risk points**.
- **Mature Cadence**: Account age $> 180$ days with $\ge 20$ posts rewards **-12 Risk points**.

### 5. Engagement Anomaly
- Normal engagement rate: $1.0\% - 6.0\%$.
- Near-zero engagement ($< 0.2\%$) with $> 5,000$ followers indicates ghost or purchased followers (**+20 Risk points**).

---

## 7. Computer Vision & Webcam Integration Explanation

### OpenCV Facial Analysis Pipeline
When a profile image is uploaded or captured via webcam:
1. **Decoding**: Converts base64 / raw multipart bytes to NumPy array using `cv2.imdecode`.
2. **Preprocessing**: Automatically downsamples images exceeding $800\text{px}$ to ensure $< 80\text{ms}$ execution time, and converts to grayscale.
3. **Face & Eye Detection**:
   - Uses `cv2.CascadeClassifier` with `haarcascade_frontalface_default.xml`.
   - Checks secondary eye features via `haarcascade_eye.xml`.
   - Single clear human portrait rewards a **-15 Risk point** authenticity bonus.
4. **Sharpness & Quality (Laplacian Variance)**:
   $$\text{Sharpness} = \text{Var}\left(\nabla^2 f\right)$$
   - Low variance ($< 60$) flags motion blur or heavily re-compressed scraped images (**+12 Risk points**).
5. **Default Avatar & Placeholder Heuristic**:
   - Analyzes standard deviation and edge density to identify default silhouettes or solid color placeholders (**+25 Risk points**).
6. **GAN/AI Synthesis Indicator**:
   - Checks for hyper-centered eye-line alignment typical of StyleGAN generator architectures.
7. **Annotated HUD Rendering**:
   - Draws glowing neon green bounding boxes with corner accents and confidence tags directly onto the image buffer, returning the annotated image as base64 for display.

### Browser Webcam (WebRTC)
- Leverages HTML5 `navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' } })`.
- Provides a futuristic HUD viewfinder with target crosshairs and alignment guides.
- Renders frame directly to an off-screen HTML5 canvas, exports as base64 JPEG, and feeds it into the OpenCV pipeline.

---

## 8. API Endpoints Reference

All API routes are served under `/api` and documented interactively at `http://127.0.0.1:8000/docs`:

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/health` | Returns service status and OpenCV version |
| `POST` | `/api/analyze` | Evaluates profile telemetry (supports JSON or multipart form with image) |
| `GET` | `/api/history` | Retrieves list of past analysis records from SQLite |
| `GET` | `/api/history/{id}` | Retrieves complete diagnostic record for a specific scan |
| `DELETE` | `/api/history/{id}` | Deletes a specific history record |
| `DELETE` | `/api/history` | Clears all history records |
| `GET` | `/api/export/{id}` | Generates structured JSON download payload |

---

## 9. Installation & Dependency Setup

### Prerequisites
- **Python**: 3.10, 3.11, 3.12, 3.13, or 3.14
- **Node.js**: v18.0.0 or higher
- **npm**: 9.0.0 or higher

### Step 1: Install Backend Dependencies
From the project root:
```bash
python -m pip install -r backend/requirements.txt
```

### Step 2: Install Frontend Dependencies
```bash
cd frontend
npm install
cd ..
```

---

## 10. Environment Variables

Backend settings are managed via `.env` in the `backend/` folder:

```ini
PORT=8000
HOST=0.0.0.0
ENVIRONMENT=development
CORS_ORIGINS=["http://localhost:5173", "http://127.0.0.1:5173"]
DATABASE_PATH=backend/data/fake_detector.db
MAX_IMAGE_SIZE_MB=10
CONFIDENCE_BASE=65
```

---

## 11. Exact Commands to Run the Project

### Option A: Using the Windows Launcher (Recommended)
Double-click `start.bat` in the root folder, or execute:
```cmd
start.bat
```
This automatically launches both the backend and frontend in their respective terminals.

### Option B: Running Manually in Separate Terminals

#### Terminal 1 — Start the Backend:
```bash
python backend/run.py
```
*Backend runs at: `http://127.0.0.1:8000` (API Docs: `http://127.0.0.1:8000/docs`)*

#### Terminal 2 — Start the Frontend:
```bash
cd frontend
npm run dev-- --host 127.0.0.1
```
*Frontend runs at: `http://127.0.0.1:5173`*
 
---

## 12. How to Use the Clean Application

### Step-by-Step Data Flow
1. **Open the Clean Dashboard**: Visit `http://127.0.0.1:5173`.
2. **Observe Empty State**: Notice the form is completely blank with zero pre-filled numbers. History is empty.
3. **Input Account Data (User Action)**:
   - Select platform (e.g. Twitter/X, Instagram, LinkedIn).
   - Enter a target username handle.
   - Enter follower/following numbers, post counts, account age, and bio.
   - Optionally upload a profile photo or click **"Open Webcam"** to capture a live photo.
4. **Trigger Analysis**:
   - Click **"Run AI Deep Scan"**.
   - The radar scanning overlay initiates.
5. **Backend Processing & Data Store**:
   - The backend runs the OpenCV facial detection and scoring algorithms.
   - The analysis record is permanently saved into the SQLite database.
6. **UI Update**:
   - The dashboard dynamically displays the newly generated risk gauge, OpenCV annotated image, Recharts Trust Radar, explainable reasons, and recommendations.
   - Opening **"Analysis History"** in the top navbar shows your newly stored scan.
7. **Export**:
   - Click **"Export Report"** to download the JSON telemetry or print as a PDF document.

---

## 13. Troubleshooting

| Issue | Likely Cause | Solution |
|---|---|---|
| `UnicodeEncodeError: 'charmap'` on Windows | Console encoding default (`cp1252`) | `backend/run.py` automatically forces `PYTHONIOENCODING=utf-8`. |
| `Cannot access webcam` | Browser permission denied or HTTP context | Allow camera permissions in browser settings. Chrome allows `getUserMedia` on `localhost` and `127.0.0.1`. |
| `Port 8000 already in use` | Another process is occupying port 8000 | Kill the process or edit `PORT=8001` in `backend/.env` and `vite.config.js`. |
