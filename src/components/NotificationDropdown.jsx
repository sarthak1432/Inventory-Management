import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, Info, X } from 'lucide-react';

const NotificationDropdown = ({ 
  isOpen, 
  onClose, 
  notifications, 
  onDismiss 
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-40"
          />
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="absolute right-0 mt-3 w-80 bg-white rounded-2xl shadow-2xl border border-slate-200 z-50 overflow-hidden"
          >
            <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <h4 className="font-bold text-slate-800 text-sm">Notifications</h4>
              <span className="px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-700 text-[10px] font-black uppercase">
                {notifications.length} Active
              </span>
            </div>
            <div className="max-h-96 overflow-y-auto custom-scrollbar">
              {notifications.length === 0 ? (
                <div className="p-10 text-center flex flex-col items-center gap-3 opacity-40">
                  <Bell size={32} />
                  <p className="text-xs font-bold text-slate-500">No new alerts.</p>
                </div>
              ) : (
                <div className="divide-y divide-slate-50">
                  {notifications.map(n => (
                    <div key={n.id} className="p-4 hover:bg-slate-50 transition-colors group flex items-start gap-3">
                      <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                        <Info size={16} />
                      </div>
                      <div className="flex-grow min-w-0">
                        <p className="text-xs font-bold text-slate-800 leading-relaxed">{n.message}</p>
                        <p className="text-[10px] text-slate-400 mt-1 uppercase font-black tracking-widest">
                          System Alert · 1st of month
                        </p>
                      </div>
                      <button
                        onClick={() => onDismiss(n.id)}
                        className="p-1.5 opacity-0 group-hover:opacity-100 hover:bg-slate-200 rounded-lg text-slate-400 hover:text-slate-600 transition-all"
                      >
                        <X size={12} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default React.memo(NotificationDropdown);
