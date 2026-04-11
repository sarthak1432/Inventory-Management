import React, { useMemo, useState } from 'react';
import { ShoppingCart, UserCheck, AlertTriangle, ArrowLeftRight, Clock, Plus, Trash2, ChevronUp } from 'lucide-react';
import { motion } from 'framer-motion';
import { formatDate } from '../utils/helpers';

const EngagedBoardCard = React.memo(({ item, onReturn, onDelete }) => {
  const isReturnable = item.type === 'in-use';
  
  return (
    <motion.div 
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-white border border-slate-100 rounded-xl p-3 shadow-sm hover:shadow-md transition-all group relative"
    >
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-slate-50 flex items-center justify-center font-bold text-[9px] text-slate-400 border border-slate-100 uppercase">
            {item.name.substring(0, 2)}
          </div>
          <div>
            <h4 className="font-bold text-slate-900 text-[13px] leading-tight uppercase tracking-tight">{item.name}</h4>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="text-[8px] font-black text-indigo-600 uppercase tracking-widest">{item.department}</span>
              {item.receiver && (
                <span className="text-[8px] font-bold text-slate-400 uppercase tracking-tight pl-1.5 border-l border-slate-200">
                  {item.receiver}
                </span>
              )}
            </div>
          </div>
        </div>
        <div className="text-right">
          <p className="text-[13px] font-black text-slate-900 leading-none">{item.quantity}</p>
          <p className="text-[7px] font-bold text-slate-300 uppercase tracking-widest">Units</p>
        </div>
      </div>

      {item.note && (
        <p className="text-[9px] text-slate-500 font-medium italic mb-3 line-clamp-1 opacity-70">
          "{item.note}"
        </p>
      )}

      <div className="flex items-center justify-between pt-2.5 border-t border-slate-50">
        <div className="flex items-center gap-1 text-slate-400">
          <Clock size={9} />
          <span className="text-[8px] font-bold uppercase tracking-widest">
            {formatDate(item.timestamp)}
          </span>
        </div>
        
        <div className="flex gap-1.5">
          {isReturnable ? (
            <button
              onClick={() => onReturn?.(item)}
              className="px-2.5 py-1 bg-slate-900 hover:bg-indigo-600 text-white rounded-lg transition-all text-[9px] font-bold uppercase tracking-wider flex items-center gap-1.5"
            >
              <ArrowLeftRight size={9} />
              Return
            </button>
          ) : (
            <div className="flex items-center gap-1.5">
              <span className="px-1.5 py-0.5 bg-slate-50 text-[8px] font-black text-slate-400 rounded-md border border-slate-100 uppercase tracking-wider scale-95">
                {item.type === 'sold' ? 'Sold' : 'Faulty'}
              </span>
              <button
                onClick={() => {
                  if (window.confirm('Delete this record?')) {
                    onDelete(item.id);
                  }
                }}
                className="p-1 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                title="Delete Record"
              >
                <Trash2 size={13} />
              </button>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
});

// Memoized Board component that acts as a "Dropdown" Category
const Board = React.memo(({ title, icon: Icon, items, color, bg, onReturn, onDelete, defaultOpen = true }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="flex flex-col bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm h-full hover:shadow-md transition-all">
      {/* Category Header / Dropdown Trigger */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full p-4 border-b border-slate-100 ${bg} flex items-center justify-between hover:bg-slate-50 transition-all text-left group`}
      >
        <div className="flex items-center gap-3">
          <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-white shadow-lg ${color} group-hover:scale-105 transition-transform shrink-0`}>
            <Icon size={16} />
          </div>
          <div>
            <h3 className="font-black text-slate-900 uppercase tracking-tighter leading-none text-xs md:text-sm">{title}</h3>
            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">{items.length} Active Records</p>
          </div>
        </div>
        <div className={`p-1.5 rounded-lg bg-white/80 text-slate-400 group-hover:text-indigo-600 transition-all shadow-sm ${isOpen ? 'rotate-180 bg-indigo-50 text-indigo-600' : ''}`}>
          <ChevronUp size={16} />
        </div>
      </button>
      
      {/* Collapsible List Container */}
      <motion.div
        initial={false}
        animate={{ 
          height: isOpen ? 'auto' : 0,
          opacity: isOpen ? 1 : 0
        }}
        transition={{ duration: 0.3, ease: [0.04, 0.62, 0.23, 0.98] }}
        className="overflow-hidden bg-white"
      >
        <div className="p-3 md:p-4 space-y-3 md:space-y-4 max-h-[500px] overflow-y-auto custom-scrollbar">
          {items.length === 0 ? (
            <div className="h-40 flex flex-col items-center justify-center opacity-30 border-2 border-dashed border-slate-100 rounded-xl">
              <Icon size={24} className="mb-3" />
              <p className="text-[10px] font-bold uppercase tracking-widest text-center px-6 leading-relaxed">No current records in this category</p>
            </div>
          ) : (
            items.map(item => (
              <EngagedBoardCard key={item.id} item={item} onReturn={onReturn} onDelete={onDelete} />
            ))
          )}
        </div>
      </motion.div>
    </div>
  );
});

const StocksEngagedTab = ({ engaged = [], onReturn, onDeleteEngaged, onEngage }) => {
  const grouped = useMemo(() => ({
    'in-use': engaged.filter(i => i.type === 'in-use'),
    'sold':   engaged.filter(i => i.type === 'sold'),
    'faulty':  engaged.filter(i => i.type === 'faulty')
  }), [engaged]);

  return (
    <div className="space-y-6 md:space-y-8 pb-10 animate-fade-in px-1">
      {/* Page Header standardized with Inventory tab */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-2xl font-black text-slate-900 tracking-tight">Stocks Engaged</h3>
          <p className="text-slate-500 text-sm mt-0.5 font-medium">
            Monitoring {engaged.length} active assignments across all workspaces
          </p>
        </div>
        
        <button
          onClick={onEngage}
          className="inline-flex items-center justify-center gap-2 bg-indigo-600 hover:bg-slate-900 px-4 py-2 md:px-5 md:py-2.5 rounded-xl font-bold text-white text-[10px] md:text-xs transition-all shadow-lg shadow-indigo-100 active:scale-95 group shrink-0"
        >
          <Plus size={16} className="group-hover:rotate-90 transition-transform duration-300" />
          Engage Stock
        </button>
      </div>

      {/* 3-Column Grid Layout (Desktop) / Vertical Stack (Mobile) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in items-start pt-2">
        <Board 
          title="IN USE" 
          icon={UserCheck} 
          items={grouped['in-use']} 
          color="bg-indigo-600" 
          bg="bg-indigo-50/20"
          onReturn={onReturn}
          onDelete={onDeleteEngaged}
        />
        <Board 
          title="Sold Assets" 
          icon={ShoppingCart} 
          items={grouped['sold']} 
          color="bg-emerald-600"
          bg="bg-emerald-50/20"
          onDelete={onDeleteEngaged}
        />
        <Board 
          title="Faulty / Maintenance" 
          icon={AlertTriangle} 
          items={grouped['faulty']} 
          color="bg-red-600"
          bg="bg-red-50/20"
          onDelete={onDeleteEngaged}
        />
      </div>
    </div>
  );
};

export default React.memo(StocksEngagedTab);
