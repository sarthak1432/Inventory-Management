import React, { useState, useCallback, useEffect } from 'react';
import { X, CheckCircle2, AlertCircle, ShoppingCart, UserCheck, AlertTriangle, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const TYPES = [
  { id: 'in-use', label: 'IN USE',     icon: UserCheck,    color: 'text-indigo-600', bg: 'bg-indigo-50', border: 'border-indigo-100', desc: 'Currently in use' },
  { id: 'sold',   label: 'Sold',       icon: ShoppingCart, color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-100', desc: 'Asset sale / removal' },
  { id: 'faulty', label: 'Defaulty',   icon: AlertTriangle, color: 'text-red-600',    bg: 'bg-red-50',    border: 'border-red-100',    desc: 'Damaged or faulty' },
];

const EngageModal = ({ isOpen, onClose, item, onEngage }) => {
  const [type, setType] = useState('in-use');
  const [quantity, setQuantity] = useState(1);
  const [note, setNote] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isOpen) {
      setQuantity(1);
      setNote('');
      setError(null);
    }
  }, [isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (quantity <= 0) return setError("Quantity must be greater than 0");
    if (quantity > item.quantity) return setError(`Only ${item.quantity} units available`);

    setLoading(true);
    setError(null);
    try {
      await onEngage(item, quantity, type, note);
      onClose();
    } catch (err) {
      setError(err?.message || "Transaction failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!item) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-lg bg-white rounded-[2.5rem] shadow-2xl overflow-hidden"
          >
            {/* Header */}
            <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-indigo-100">
                  <ChevronRight size={24} />
                </div>
                <div>
                  <h2 className="text-xl font-black text-slate-900 leading-none uppercase tracking-tight">Engage Stock</h2>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1.5">{item.name} · {item.department}</p>
                </div>
              </div>
              <button onClick={onClose} className="p-2 hover:bg-white rounded-full transition-colors text-slate-400 hover:text-slate-600 border border-transparent hover:border-slate-100">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-8 space-y-6">
              {/* Type Selection */}
              <div className="space-y-3">
                <label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] px-1">Engagement Type</label>
                <div className="grid grid-cols-1 gap-3">
                  {TYPES.map(t => (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => setType(t.id)}
                      className={`flex items-center gap-4 p-4 rounded-2xl border-2 transition-all text-left group
                        ${type === t.id 
                          ? `${t.bg} ${t.border} border-current ring-4 ring-offset-0 ring-opacity-10 translate-x-1` 
                          : 'bg-white border-slate-100 hover:border-slate-200 hover:bg-slate-50'}`}
                      style={{ borderColor: type === t.id ? 'currentcolor' : undefined }}
                    >
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110 ${type === t.id ? 'bg-white' : t.bg}`}>
                        <t.icon size={20} className={t.color} />
                      </div>
                      <div>
                        <p className={`text-sm font-black uppercase tracking-wide leading-none ${type === t.id ? t.color : 'text-slate-700'}`}>{t.label}</p>
                        <p className="text-[10px] text-slate-400 font-bold mt-1 uppercase tracking-widest opacity-70">{t.desc}</p>
                      </div>
                      {type === t.id && <CheckCircle2 size={18} className={`ml-auto ${t.color}`} />}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quantity Input */}
              <div className="grid grid-cols-2 gap-6 pt-2">
                <div className="space-y-2">
                  <label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] px-1">Amount</label>
                  <div className="relative">
                    <input
                      type="number"
                      min="1"
                      max={item.quantity}
                      value={quantity}
                      onChange={(e) => setQuantity(parseInt(e.target.value) || 0)}
                      className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-indigo-100 focus:bg-white focus:border-indigo-300 transition-all font-black text-lg text-slate-800"
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-black text-slate-300 uppercase tracking-widest">Units</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] px-1">Available Pool</label>
                  <div className="p-4 bg-slate-100/50 rounded-2xl flex items-center justify-center border border-dashed border-slate-200">
                    <p className="text-xl font-black text-slate-400">{item.quantity} <span className="text-[10px] tracking-widest">LEFT</span></p>
                  </div>
                </div>
              </div>

              {/* Note */}
              <div className="space-y-2">
                <label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] px-1">Optional Note</label>
                <textarea
                  placeholder="e.g. Sales Order #123, Moving to AI Lab Floor 2..."
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-indigo-100 focus:bg-white focus:border-indigo-300 transition-all font-semibold text-sm text-slate-800 h-20 resize-none"
                />
              </div>

              {error && (
                <div className="flex items-center gap-3 p-4 bg-red-50 text-red-600 rounded-2xl border border-red-100">
                  <AlertCircle size={18} className="shrink-0" />
                  <p className="text-xs font-bold leading-tight uppercase tracking-wide">{error}</p>
                </div>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-5 bg-slate-900 hover:bg-indigo-600 text-white rounded-2xl font-black text-xs uppercase tracking-[0.3em] transition-all shadow-xl shadow-slate-200 active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-3"
              >
                {loading ? 'Processing Transaction...' : 'Commit Engagement'}
              </button>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default React.memo(EngageModal);
