import React, { useState, useEffect } from 'react';
import { History, X, Search, Trash2, ExternalLink, Calendar, Users, Eye } from 'lucide-react';
import { fetchHistory, deleteHistoryItem, clearAllHistory, fetchHistoryItem } from '../services/api';

export default function HistoryModal({ isOpen, onClose, onSelectReport }) {
  const [historyItems, setHistoryItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  useEffect(() => {
    if (isOpen) {
      loadHistory();
    }
  }, [isOpen]);

  const loadHistory = async () => {
    setLoading(true);
    try {
      const data = await fetchHistory(50);
      setHistoryItems(data);
    } catch (err) {
      console.error('Failed to load history:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (e, id) => {
    e.stopPropagation();
    if (!window.confirm('Delete this evaluation record?')) return;
    try {
      await deleteHistoryItem(id);
      setHistoryItems((prev) => prev.filter((item) => item.id !== id));
    } catch (err) {
      alert('Failed to delete item: ' + err.message);
    }
  };

  const handleClearAll = async () => {
    if (!window.confirm('Are you sure you want to delete ALL historical scan records?')) return;
    try {
      await clearAllHistory();
      setHistoryItems([]);
    } catch (err) {
      alert('Failed to clear history: ' + err.message);
    }
  };

  const handleSelect = async (id) => {
    try {
      const fullRecord = await fetchHistoryItem(id);
      onSelectReport(fullRecord);
      onClose();
    } catch (err) {
      alert('Failed to load report: ' + err.message);
    }
  };

  if (!isOpen) return null;

  const filteredItems = historyItems.filter((item) => {
    const matchesSearch =
      item.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.display_name && item.display_name.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus =
      statusFilter === 'ALL' || item.classification.toUpperCase() === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getBadge = (classification) => {
    switch (classification) {
      case 'Likely Fake':
        return 'bg-rose-950/80 text-rose-300 border-rose-800';
      case 'Suspicious':
        return 'bg-amber-950/80 text-amber-300 border-amber-800';
      case 'Genuine':
      default:
        return 'bg-emerald-950/80 text-emerald-300 border-emerald-800';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-3xl w-full max-h-[85vh] flex flex-col overflow-hidden shadow-2xl">
        
        {/* Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-cyan-950 text-cyan-400 border border-cyan-800">
              <History className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Scan Analysis History</h3>
              <p className="text-[11px] text-slate-400">Stored locally in SQLite persistent database</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {historyItems.length > 0 && (
              <button
                onClick={handleClearAll}
                className="px-2.5 py-1 text-xs text-rose-400 hover:text-rose-300 hover:bg-rose-950/40 rounded-lg transition-colors border border-rose-900/40 flex items-center gap-1"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Clear All</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="p-3 bg-slate-950/70 border-b border-slate-800 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2">
          <div className="relative flex-1">
            <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by username or handle..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div className="flex items-center gap-1 text-xs">
            {['ALL', 'GENUINE', 'SUSPICIOUS', 'LIKELY FAKE'].map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-2 py-1 rounded-md text-[11px] font-medium transition-colors ${
                  statusFilter === status
                    ? 'bg-cyan-950 text-cyan-300 border border-cyan-800'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        {/* Content list */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {loading ? (
            <div className="text-center py-12 text-slate-400 text-xs font-mono">
              Fetching records from SQLite database...
            </div>
          ) : historyItems.length === 0 ? (
            <div className="text-center py-12 text-slate-400 text-xs px-4">
              <History className="w-8 h-8 text-slate-600 mx-auto mb-2" />
              <p className="font-semibold text-slate-300">No accounts analyzed yet</p>
              <p className="text-[11px] text-slate-500 mt-1">
                Enter an account in the form and click "Run AI Deep Scan". Stored results will appear here.
              </p>
            </div>
          ) : filteredItems.length === 0 ? (
            <div className="text-center py-12 text-slate-500 text-xs">
              No historical analyses match your query.
            </div>
          ) : (
            filteredItems.map((item) => (
              <div
                key={item.id}
                onClick={() => handleSelect(item.id)}
                className="p-3 rounded-xl bg-slate-950 border border-slate-800/80 hover:border-cyan-500/50 hover:bg-slate-800/30 transition-all cursor-pointer flex items-center justify-between gap-3 group"
              >
                <div className="flex items-center gap-3 min-w-0">
                  {/* Thumbnail / avatar */}
                  {item.profile_image_preview ? (
                    <img
                      src={item.profile_image_preview}
                      alt={item.username}
                      className="w-10 h-10 rounded-lg object-cover border border-slate-800 shrink-0"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center font-bold text-slate-400 text-sm shrink-0">
                      {item.username.charAt(0).toUpperCase()}
                    </div>
                  )}

                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <h4 className="text-xs font-bold text-white truncate">
                        @{item.username}
                      </h4>
                      <span className="text-[10px] uppercase font-mono text-slate-400">
                        {item.platform}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-[10px] text-slate-400 font-mono mt-0.5">
                      <span>{item.followers_count.toLocaleString()} followers</span>
                      <span>&bull;</span>
                      <span>{new Date(item.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <div className="text-right">
                    <span className={`inline-block text-[11px] font-bold px-2 py-0.5 rounded border ${getBadge(item.classification)}`}>
                      {item.classification}
                    </span>
                    <div className="text-[10px] font-mono text-slate-400 mt-0.5">
                      Score: <span className="font-bold text-white">{item.risk_score}</span>/100
                    </div>
                  </div>

                  <button
                    onClick={(e) => handleDelete(e, item.id)}
                    className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-950/40 transition-colors"
                    title="Delete record"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-slate-800 bg-slate-900/90 text-right">
          <button
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-medium text-slate-300 hover:text-white bg-slate-800 rounded-lg"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
}
