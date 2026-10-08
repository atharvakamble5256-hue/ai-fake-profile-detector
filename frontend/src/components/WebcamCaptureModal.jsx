import React, { useRef, useState, useEffect } from 'react';
import { Camera, X, RefreshCw, Check, AlertCircle } from 'lucide-react';

export default function WebcamCaptureModal({ isOpen, onClose, onCapture }) {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);

  const [capturedImage, setCapturedImage] = useState(null);
  const [cameraError, setCameraError] = useState(null);
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    if (isOpen) {
      startCamera();
    } else {
      stopCamera();
      setCapturedImage(null);
      setCameraError(null);
    }

    return () => {
      stopCamera();
    };
  }, [isOpen]);

  const startCamera = async () => {
    setIsInitializing(true);
    setCameraError(null);
    setCapturedImage(null);

    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Webcam API is not supported in this browser environment.');
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 640 },
          height: { ideal: 480 },
          facingMode: 'user'
        },
        audio: false
      });

      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
      setIsInitializing(false);
    } catch (err) {
      console.error('Camera access error:', err);
      setCameraError(err.message || 'Unable to access camera. Please check browser permissions.');
      setIsInitializing(false);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
  };

  const takeSnapshot = () => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;

    const ctx = canvas.getContext('2d');
    // Mirror horizontally for natural webcam feel
    ctx.translate(canvas.width, 0);
    ctx.scale(-1, 1);
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
    setCapturedImage(dataUrl);
    stopCamera();
  };

  const retakeSnapshot = () => {
    setCapturedImage(null);
    startCamera();
  };

  const confirmCapture = () => {
    if (capturedImage) {
      onCapture(capturedImage);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl relative">
        
        {/* Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-cyan-950 text-cyan-400 border border-cyan-800">
              <Camera className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Live Camera Biometric Capture</h3>
              <p className="text-[11px] text-slate-400">WebRTC MediaStream &bull; Instant OpenCV Face Analysis</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Viewfinder area */}
        <div className="p-4 bg-slate-950 relative flex items-center justify-center min-h-[320px]">
          
          {cameraError ? (
            <div className="text-center p-6 max-w-sm">
              <div className="w-12 h-12 rounded-full bg-rose-950/70 text-rose-400 flex items-center justify-center mx-auto mb-3 border border-rose-800">
                <AlertCircle className="w-6 h-6" />
              </div>
              <p className="text-sm font-medium text-rose-300 mb-2">Camera Access Unavailable</p>
              <p className="text-xs text-slate-400 mb-4">{cameraError}</p>
              <button
                onClick={startCamera}
                className="px-4 py-2 rounded-lg bg-slate-800 text-xs font-semibold text-slate-200 hover:bg-slate-700"
              >
                Try Again
              </button>
            </div>
          ) : capturedImage ? (
            <div className="relative w-full rounded-xl overflow-hidden border border-cyan-500/50 shadow-lg">
              <img
                src={capturedImage}
                alt="Captured Snapshot"
                className="w-full object-cover max-h-[340px]"
              />
              <div className="absolute top-2 right-2 px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 text-[10px] font-mono border border-cyan-800">
                FRAME CAPTURED
              </div>
            </div>
          ) : (
            <div className="relative w-full rounded-xl overflow-hidden bg-black flex items-center justify-center">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full max-h-[340px] object-cover -scale-x-100"
              />

              {/* Futuristic Cyber Reticle HUD */}
              <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                {/* Center target circle */}
                <div className="w-44 h-56 rounded-full border border-dashed border-cyan-400/50 flex items-center justify-center">
                  <div className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                </div>

                {/* Corner crosshairs */}
                <div className="absolute top-4 left-4 w-6 h-6 border-t-2 border-l-2 border-cyan-400" />
                <div className="absolute top-4 right-4 w-6 h-6 border-t-2 border-r-2 border-cyan-400" />
                <div className="absolute bottom-4 left-4 w-6 h-6 border-b-2 border-l-2 border-cyan-400" />
                <div className="absolute bottom-4 right-4 w-6 h-6 border-b-2 border-r-2 border-cyan-400" />

                <div className="absolute top-4 left-1/2 -translate-x-1/2 text-[10px] font-mono tracking-wider text-cyan-400 bg-slate-900/80 px-2 py-0.5 rounded border border-cyan-800/80">
                  ALIGN FACE IN VIEW
                </div>
              </div>
            </div>
          )}

          {/* Hidden Canvas */}
          <canvas ref={canvasRef} className="hidden" />
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-slate-800 bg-slate-900/90 flex items-center justify-between">
          <p className="text-[11px] text-slate-400">
            Privacy notice: Captured images stay on your local session.
          </p>

          <div className="flex items-center gap-2">
            {capturedImage ? (
              <>
                <button
                  onClick={retakeSnapshot}
                  className="px-3 py-1.5 rounded-lg text-xs font-medium text-slate-300 bg-slate-800 hover:bg-slate-700 flex items-center gap-1.5 transition-colors"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Retake</span>
                </button>
                <button
                  onClick={confirmCapture}
                  className="px-4 py-1.5 rounded-lg text-xs font-semibold text-white bg-gradient-to-r from-cyan-500 to-blue-600 hover:shadow-md hover:shadow-cyan-500/20 flex items-center gap-1.5 transition-all"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Use This Photo</span>
                </button>
              </>
            ) : (
              <button
                disabled={Boolean(cameraError || isInitializing)}
                onClick={takeSnapshot}
                className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-cyan-500 hover:bg-cyan-400 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-cyan-500/20 flex items-center gap-2 transition-all cursor-pointer"
              >
                <Camera className="w-4 h-4" />
                <span>Capture Frame</span>
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
