import React, { useState, useEffect, useRef } from 'react';
import Navbar from './components/Navbar';
import HeroBanner from './components/HeroBanner';
import ProfileInputForm from './components/ProfileInputForm';
import AnalysisResults from './components/AnalysisResults';
import WebcamCaptureModal from './components/WebcamCaptureModal';
import HistoryModal from './components/HistoryModal';
import ExportReportModal from './components/ExportReportModal';
import ScanningOverlay from './components/ScanningOverlay';

import { checkHealth, analyzeProfile } from './services/api';

const INITIAL_FORM = {
  username: '',
  platform: 'twitter',
  display_name: '',
  bio: '',
  followers_count: '',
  following_count: '',
  posts_count: '',
  engagement_rate: 0,
  is_verified: false,
  has_profile_pic: false,
  external_url: '',
  image_base64: null,
};

export default function App() {
  const formSectionRef = useRef(null);
  const resultsSectionRef = useRef(null);

  // System & Meta State
  const [systemOnline, setSystemOnline] = useState(false);
  const [opencvVersion, setOpencvVersion] = useState('');

  // Form State
  const [formData, setFormData] = useState(INITIAL_FORM);
  const [imagePreview, setImagePreview] = useState(null);
  const [imageFile, setImageFile] = useState(null);

  // Analysis Result State
  const [isScanning, setIsScanning] = useState(false);
  const [currentReport, setCurrentReport] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  // Modals
  const [webcamOpen, setWebcamOpen] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [exportOpen, setExportOpen] = useState(false);

  // On mount: ping backend health
  useEffect(() => {
    async function init() {
      const health = await checkHealth();
      if (health && health.status === 'healthy') {
        setSystemOnline(true);
        setOpencvVersion(health.opencv_version || '4.14');
      }
    }
    init();
  }, []);

  const handleWebcamCapture = (dataUrl) => {
    setImagePreview(dataUrl);
    setImageFile(null);
    setFormData((prev) => ({
      ...prev,
      image_base64: dataUrl,
      has_profile_pic: true
    }));
  };

  const handleSubmitAnalysis = async (e) => {
    if (e) e.preventDefault();
    if (!formData.username.trim()) {
      alert('Please enter a username handle.');
      return;
    }

    setErrorMsg(null);
    setIsScanning(true);

    try {
      // Clean numeric fields before submitting
      const payload = {
        ...formData,
        followers_count: Number(formData.followers_count || 0),
        following_count: Number(formData.following_count || 0),
        posts_count: Number(formData.posts_count || 0),
        engagement_rate: Number(formData.engagement_rate || 0),
      };

      // Call real backend API: analyzes with OpenCV & heuristic rules, stores in SQLite
      const [result] = await Promise.all([
        analyzeProfile(payload, imageFile),
        new Promise((resolve) => setTimeout(resolve, 1400)), // scan animation timing
      ]);

      // Update UI with newly generated, stored report
      setCurrentReport(result);

      // Scroll smoothly to results
      setTimeout(() => {
        if (resultsSectionRef.current) {
          resultsSectionRef.current.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    } catch (err) {
      console.error('Analysis error:', err);
      setErrorMsg(err.message || 'An error occurred during AI analysis.');
    } finally {
      setIsScanning(false);
    }
  };

  const handleReset = () => {
    setFormData(INITIAL_FORM);
    setImagePreview(null);
    setImageFile(null);
    setCurrentReport(null);
    setErrorMsg(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectHistoryReport = (record) => {
    setCurrentReport(record);
    // Sync form data
    setFormData({
      username: record.username,
      platform: record.platform,
      display_name: record.display_name,
      bio: record.bio,
      followers_count: record.followers_count,
      following_count: record.following_count,
      posts_count: record.posts_count,
      engagement_rate: record.engagement_rate || 0,
      is_verified: record.is_verified,
      has_profile_pic: record.has_profile_pic,
      external_url: record.external_url,
      image_base64: record.profile_image_preview,
    });
    setImagePreview(record.profile_image_preview || null);

    setTimeout(() => {
      if (resultsSectionRef.current) {
        resultsSectionRef.current.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-cyan-500 selection:text-white">
      
      {/* Top Navbar */}
      <Navbar
        systemOnline={systemOnline}
        opencvVersion={opencvVersion}
        onOpenHistory={() => setHistoryOpen(true)}
        onResetForm={handleReset}
        hasResult={Boolean(currentReport)}
        onOpenExport={() => setExportOpen(true)}
      />

      {/* Hero Section */}
      <HeroBanner
        onScrollToForm={() => {
          if (formSectionRef.current) {
            formSectionRef.current.scrollIntoView({ behavior: 'smooth' });
          }
        }}
      />

      {/* Main App Container */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        
        {/* Error notification banner if any */}
        {errorMsg && (
          <div className="mb-6 p-4 rounded-xl bg-rose-950/70 border border-rose-800 text-rose-300 text-xs flex items-center justify-between">
            <span>{errorMsg}</span>
            <button
              onClick={() => setErrorMsg(null)}
              className="text-rose-400 hover:text-white font-bold"
            >
              &times;
            </button>
          </div>
        )}

        {/* Profile Input Form Anchor */}
        <div ref={formSectionRef} className="space-y-6">
          <ProfileInputForm
            formData={formData}
            setFormData={setFormData}
            imagePreview={imagePreview}
            setImagePreview={setImagePreview}
            imageFile={imageFile}
            setImageFile={setImageFile}
            onOpenWebcam={() => setWebcamOpen(true)}
            onSubmit={handleSubmitAnalysis}
            isAnalyzing={isScanning}
          />
        </div>

        {/* Analysis Results Display (Dynamic upon user action & storage) */}
        {currentReport && (
          <div ref={resultsSectionRef} className="mt-12 pt-8 border-t border-slate-800">
            <AnalysisResults
              report={currentReport}
              onReset={handleReset}
              onOpenExport={() => setExportOpen(true)}
            />
          </div>
        )}

      </main>

      {/* High-Tech Radar Scanning Overlay */}
      <ScanningOverlay isScanning={isScanning} />

      {/* Modals */}
      <WebcamCaptureModal
        isOpen={webcamOpen}
        onClose={() => setWebcamOpen(false)}
        onCapture={handleWebcamCapture}
      />

      <HistoryModal
        isOpen={historyOpen}
        onClose={() => setHistoryOpen(false)}
        onSelectReport={handleSelectHistoryReport}
      />

      <ExportReportModal
        isOpen={exportOpen}
        onClose={() => setExportOpen(false)}
        currentReport={currentReport}
      />

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 py-6 text-center text-xs text-slate-500 font-mono no-print">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div>
            VERIF.AI &bull; AI-Powered Smart Fake Account Detector
          </div>
          <div>
            Built with React, Vite, Tailwind CSS, FastAPI & OpenCV
          </div>
        </div>
      </footer>

    </div>
  );
}
