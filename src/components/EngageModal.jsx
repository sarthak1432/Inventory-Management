import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { X, CheckCircle2, AlertCircle, ShoppingCart, UserCheck, AlertTriangle, ChevronRight, Package } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const TYPES = [
  { id: 'in-use', label: 'IN USE',     icon: UserCheck,    color: 'text-indigo-600', bg: 'bg-indigo-50', border: 'border-indigo-100', desc: 'Currently in use' },
  { id: 'sold',   label: 'Sold',       icon: ShoppingCart, color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-100', desc: 'Asset sale / removal' },
  { id: 'faulty', label: 'Defaulty',   icon: AlertTriangle, color: 'text-red-600',    bg: 'bg-red-50',    border: 'border-red-100',    desc: 'Damaged or faulty' },
];

const EngageModal = ({ isOpen, onClose, item, onEngage, inventory = [] }) => {
  const [type, setType] = useState('in-use');
  const [quantity, setQuantity] = useState(1);
  const [note, setNote] = useState('');
  const [receiver, setReceiver] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Selection Logic
  const [step, setStep] = useState(0); // 0: Select Item, 1: Configure
  const [selectedItem, setSelectedItem] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (isOpen) {
      setQuantity(1);
      setNote('');
      setError(null);
      setSearchTerm('');
      
      if (item) {
        setSelectedItem(item);
        setReceiver(item.assignee || '');
        setStep(1);
      } else {
        setSelectedItem(null);
        setReceiver('');
        setStep(0);
      }
    }
  }, [isOpen, item]);

  const activeItem = item || selectedItem;

  const filteredInventory = useMemo(() => {
    if (!searchTerm) return inventory.slice(0, 10);
    return inventory.filter(i => 
      i.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      i.department?.toLowerCase().includes(searchTerm.toLowerCase())
    ).slice(0, 10);
  }, [inventory, searchTerm]);

  const handleSelectItem = (targetItem) => {
    if (targetItem.quantity <= 0) return;
    setSelectedItem(targetItem);
    setReceiver(targetItem.assignee || '');
    setStep(1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!activeItem) return;
    if (quantity <= 0) return setError("Quantity must be greater than 0");
    if (quantity > activeItem.quantity) return setError(`Only ${activeItem.quantity} units available`);

    setLoading(true);
    setError(null);
    try {
      await onEngage(activeItem, quantity, type, note, receiver);
      onClose();
    } catch (err) {
      setError(err?.message || "Transaction failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

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
                  {step === 0 ? <Package size={24} /> : <ChevronRight size={24} />}
                </div>
                <div>
                  <h2 className="text-xl font-black text-slate-900 leading-none uppercase tracking-tight">
                    {step === 0 ? 'Pick an Item' : 'Engage Stock'}
                  </h2>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1.5">
                    {step === 0 ? 'Select from active inventory' : `${activeItem?.name} · ${activeItem?.department}`}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {step === 1 && !item && (
                  <button 
                    onClick={() => setStep(0)}
                    className="p-2 hover:bg-white rounded-full transition-colors text-indigo-600 hover:text-indigo-800 text-[10px] font-black uppercase tracking-widest"
                  >
                    Back to List
                  </button>
                )}
                <button onClick={onClose} className="p-2 hover:bg-white rounded-full transition-colors text-slate-400 hover:text-slate-600 border border-transparent hover:border-slate-100">
                  <X size={20} />
                </button>
              </div>
            </div>

            <div className="max-h-[70vh] overflow-y-auto overflow-x-hidden custom-scrollbar">
              {step === 0 ? (
                <div className="p-8 space-y-6">
                  {/* Search */}
                  <div className="relative group">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors pointer-events-none">
                      <ChevronRight size={18} />
                    </div>
                    <input
                      autoFocus
                      type="text"
                      placeholder="Search to pick an item..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-11 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-indigo-100 focus:bg-white focus:border-indigo-300 transition-all font-bold text-sm text-slate-800"
                    />
                  </div>

                  {/* List */}
                  <div className="space-y-2">
                    {filteredInventory.length === 0 ? (
                      <div className="text-center py-10 opacity-40 italic text-sm">No items matching your search.</div>
                    ) : (
                      filteredInventory.map(invItem => (
                        <button
                          key={invItem.id}
                          disabled={invItem.quantity <= 0}
                          onClick={() => handleSelectItem(invItem)}
                          className={`w-full flex items-center justify-between p-4 rounded-2xl border-2 transition-all group
                            ${invItem.quantity <= 0 
                              ? 'bg-slate-50 border-slate-50 opacity-50 cursor-not-allowed' 
                              : 'bg-white border-slate-50 hover:border-indigo-100 hover:bg-indigo-50/50 hover:translate-x-1'}`}
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center font-bold text-[10px] text-slate-400">
                              {invItem.name.substring(0, 2).toUpperCase()}
                            </div>
                            <div className="text-left">
                              <p className="text-sm font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">{invItem.name}</p>
                              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{invItem.department}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-xs font-black text-slate-900">{invItem.quantity}</p>
                            <p className="text-[8px] font-black text-slate-300 uppercase tracking-tighter">Units</p>
                          </div>
                        </button>
                      ))
                    )}
                  </div>
                </div>
              ) : (
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
                          max={activeItem?.quantity}
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
                        <p className="text-xl font-black text-slate-400">{activeItem?.quantity} <span className="text-[10px] tracking-widest">LEFT</span></p>
                      </div>
                    </div>
                  </div>

                  {/* Receiver */}
                  <div className="space-y-2">
                    <label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] px-1">Assign To / Receiver</label>
                    <div className="relative group/input">
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-indigo-400 group-focus-within/input:text-indigo-600 transition-colors pointer-events-none">
                        <UserCheck size={16} />
                      </div>
                      <input
                        type="text"
                        placeholder="Who is receiving this?"
                        value={receiver}
                        onChange={(e) => setReceiver(e.target.value)}
                        className="w-full pl-11 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-indigo-100 focus:bg-white focus:border-indigo-300 transition-all font-bold text-sm text-slate-800"
                      />
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
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default React.memo(EngageModal);
