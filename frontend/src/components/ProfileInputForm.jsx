import React, { useRef, useState } from 'react';
import {
  User,
  AtSign,
  Camera,
  Upload,
  Link as LinkIcon,
  AlertCircle,
  Sparkles,
  ShieldCheck
} from 'lucide-react';

const PLATFORMS = [
  { id: 'twitter', name: 'Twitter / X' },
  { id: 'instagram', name: 'Instagram' },
  { id: 'tiktok', name: 'TikTok' },
  { id: 'linkedin', name: 'LinkedIn' },
  { id: 'generic', name: 'General Web' },
];

export default function ProfileInputForm({
  formData,
  setFormData,
  imagePreview,
  setImagePreview,
  imageFile,
  setImageFile,
  onOpenWebcam,
  onSubmit,
  isAnalyzing
}) {
  const fileInputRef = useRef(null);
  const [dragActive, setDragActive] = useState(false);

  // Live syntax feedback for username
  const trailingDigits = (formData.username || '').match(/\d+$/);
  const hasTrailingDigits = trailingDigits && trailingDigits[0].length >= 4;

  // Live bio trigger detection
  const bioLower = (formData.bio || '').toLowerCase();
  const hasScamTriggers = ['crypto', 'airdrop', 'giveaway', 'forex', 'dm for promo', 'whatsapp', 't.me'].some(
    (kw) => bioLower.includes(kw)
  );

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : type === 'number' ? (value === '' ? '' : Number(value)) : value,
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onload = () => {
        setImagePreview(reader.result);
        setFormData((prev) => ({
          ...prev,
          image_base64: reader.result,
          has_profile_pic: true
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      setImageFile(file);
      const reader = new FileReader();
      reader.onload = () => {
        setImagePreview(reader.result);
        setFormData((prev) => ({
          ...prev,
          image_base64: reader.result,
          has_profile_pic: true
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreview(null);
    setFormData((prev) => ({ ...prev, image_base64: null }));
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <form
      onSubmit={onSubmit}
      className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6 shadow-xl relative"
    >
      <div className="flex items-center justify-between mb-5 pb-3 border-b border-slate-800">
        <div>
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-cyan-400" />
            Social Profile Analysis Form
          </h2>
          <p className="text-xs text-slate-400">
            Enter the account details to scan for bot signals, entropy anomalies, and facial authenticity
          </p>
        </div>
        <span className="text-[11px] font-mono text-cyan-400 px-2.5 py-1 rounded-full bg-cyan-950 border border-cyan-800">
          Ready For Scan
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Left Column: Account Details & Identity */}
        <div className="space-y-4">
          
          {/* Platform selector */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Platform
            </label>
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-1.5">
              {PLATFORMS.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => setFormData((prev) => ({ ...prev, platform: p.id }))}
                  className={`px-2 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                    formData.platform === p.id
                      ? 'bg-cyan-500 text-slate-950 font-bold shadow-sm shadow-cyan-500/20'
                      : 'bg-slate-950 text-slate-400 border border-slate-800 hover:text-white'
                  }`}
                >
                  {p.name.split(' ')[0]}
                </button>
              ))}
            </div>
          </div>

          {/* Username handle */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Username Handle <span className="text-cyan-400">*</span>
            </label>
            <div className="relative">
              <AtSign className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                name="username"
                required
                value={formData.username}
                onChange={handleInputChange}
                placeholder="Enter handle e.g. username"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500 font-mono"
              />
            </div>
            {hasTrailingDigits && (
              <p className="text-[10px] text-amber-400 mt-1 flex items-center gap-1 font-mono">
                <AlertCircle className="w-3 h-3" />
                Handle ends with numeric digits ({trailingDigits[0]}); bot script pattern detected.
              </p>
            )}
          </div>

          {/* Display Name */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Display Name
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                name="display_name"
                value={formData.display_name}
                onChange={handleInputChange}
                placeholder="Account display name (optional)"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500"
              />
            </div>
          </div>

          {/* Biography */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Profile Biography / Description
            </label>
            <textarea
              name="bio"
              rows={3}
              value={formData.bio}
              onChange={handleInputChange}
              placeholder="Paste or type bio text..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500 resize-none leading-relaxed"
            />
            {hasScamTriggers && (
              <p className="text-[10px] text-rose-400 mt-1 flex items-center gap-1 font-mono">
                <AlertCircle className="w-3 h-3" />
                Detected commercial, giveaway, or redirect keywords in bio.
              </p>
            )}
          </div>

          {/* External URL */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              External Website / Bio Link
            </label>
            <div className="relative">
              <LinkIcon className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                name="external_url"
                value={formData.external_url}
                onChange={handleInputChange}
                placeholder="e.g. https://example.com"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500 font-mono"
              />
            </div>
          </div>

          {/* Verification & Profile Pic Toggles */}
          <div className="grid grid-cols-2 gap-3 pt-1">
            <label className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-950 border border-slate-800 cursor-pointer hover:border-slate-700">
              <input
                type="checkbox"
                name="is_verified"
                checked={formData.is_verified}
                onChange={handleInputChange}
                className="rounded border-slate-700 text-cyan-500 focus:ring-0"
              />
              <span className="text-xs font-medium text-slate-300">Verified Badge</span>
            </label>

            <label className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-950 border border-slate-800 cursor-pointer hover:border-slate-700">
              <input
                type="checkbox"
                name="has_profile_pic"
                checked={formData.has_profile_pic}
                onChange={handleInputChange}
                className="rounded border-slate-700 text-cyan-500 focus:ring-0"
              />
              <span className="text-xs font-medium text-slate-300">Has Profile Photo</span>
            </label>
          </div>

        </div>

        {/* Right Column: Numbers, Engagement & Image/Webcam */}
        <div className="space-y-4">
          
          {/* Numbers Grid */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Followers Count
              </label>
              <input
                type="number"
                name="followers_count"
                min="0"
                placeholder="0"
                value={formData.followers_count}
                onChange={handleInputChange}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500 font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Following Count
              </label>
              <input
                type="number"
                name="following_count"
                min="0"
                placeholder="0"
                value={formData.following_count}
                onChange={handleInputChange}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500 font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Total Published Posts
              </label>
              <input
                type="number"
                name="posts_count"
                min="0"
                placeholder="0"
                value={formData.posts_count}
                onChange={handleInputChange}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500 font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Account Age (Days)
              </label>
              <input
                type="number"
                name="account_age_days"
                min="0"
                placeholder="0"
                value={formData.account_age_days}
                onChange={handleInputChange}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500 font-mono"
              />
            </div>
          </div>

          {/* Engagement rate */}
          <div>
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="font-semibold text-slate-300">
                Avg. Engagement Rate
              </span>
              <span className="font-mono text-cyan-400 font-bold">
                {formData.engagement_rate || 0}%
              </span>
            </div>
            <input
              type="range"
              name="engagement_rate"
              min="0"
              max="20"
              step="0.1"
              value={formData.engagement_rate || 0}
              onChange={handleInputChange}
              className="w-full accent-cyan-400 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-mono mt-0.5">
              <span>0% (Inactive)</span>
              <span>2.5% (Typical Organic)</span>
              <span>15%+ (High)</span>
            </div>
          </div>

          {/* Image & Webcam Biometrics Section */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                <Camera className="w-3.5 h-3.5 text-cyan-400" />
                Profile Picture Analysis (OpenCV)
              </label>
              <button
                type="button"
                onClick={onOpenWebcam}
                className="text-xs text-cyan-400 hover:text-cyan-300 font-medium flex items-center gap-1 cursor-pointer"
              >
                <Camera className="w-3 h-3" />
                <span>Open Webcam</span>
              </button>
            </div>

            {imagePreview ? (
              <div className="relative p-2 rounded-xl bg-slate-950 border border-cyan-500/40 flex items-center gap-3">
                <img
                  src={imagePreview}
                  alt="Avatar Preview"
                  className="w-14 h-14 rounded-lg object-cover border border-slate-800"
                />
                <div className="flex-1 min-w-0">
                  <span className="text-xs font-semibold text-white block truncate">
                    {imageFile ? imageFile.name : 'Webcam Photo Captured'}
                  </span>
                  <span className="text-[10px] text-cyan-400 font-mono">
                    Ready for OpenCV Haar Cascade
                  </span>
                </div>
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  className="px-2 py-1 text-xs text-rose-400 hover:text-rose-300 bg-rose-950/40 rounded-lg border border-rose-900/50"
                >
                  Remove
                </button>
              </div>
            ) : (
              <div
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`p-4 rounded-xl border border-dashed text-center cursor-pointer transition-all ${
                  dragActive
                    ? 'border-cyan-400 bg-cyan-950/30'
                    : 'border-slate-800 bg-slate-950/50 hover:border-slate-700'
                }`}
              >
                <Upload className="w-6 h-6 text-slate-500 mx-auto mb-1.5" />
                <p className="text-xs text-slate-300 font-medium">
                  Upload profile picture or <span className="text-cyan-400">browse file</span>
                </p>
                <p className="text-[10px] text-slate-500 mt-0.5">
                  PNG, JPG, WEBP &bull; Facial bounding, sharpness & GAN check
                </p>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </div>
            )}
          </div>

        </div>

      </div>

      {/* Submit Button */}
      <div className="mt-6 pt-4 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
        <p className="text-[11px] text-slate-400">
          Privacy guarantee: No credentials needed. Analysis runs locally and securely.
        </p>

        <button
          type="submit"
          disabled={isAnalyzing}
          className="w-full sm:w-auto px-7 py-3 rounded-xl font-bold text-sm bg-gradient-to-r from-cyan-500 via-sky-500 to-blue-600 text-white shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          <Sparkles className="w-4 h-4" />
          <span>{isAnalyzing ? 'Analyzing Account...' : 'Run AI Deep Scan'}</span>
        </button>
      </div>
    </form>
  );
}
