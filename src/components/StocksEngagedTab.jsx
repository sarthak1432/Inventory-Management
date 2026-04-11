import React, { useMemo, useState } from 'react';
import { Users, ShoppingCart, UserCheck, AlertTriangle, ArrowLeftRight, Clock, Info, Plus, Trash2, User, ChevronDown, ChevronUp } from 'lucide-react';
import { motion } from 'framer-motion';

const EngagedBoardCard = ({ item, onReturn, onDelete, departments = [] }) => {
  const isReturnable = item.type === 'in-use';
  
  return (
    <motion.div 
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-white border border-slate-100 rounded-2xl p-4 shadow-sm hover:shadow-md transition-all group relative"
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center font-bold text-[10px] text-slate-400 border border-slate-100 uppercase">
            {item.name.substring(0, 2)}
          </div>
          <div>
            <h4 className="font-bold text-slate-900 text-sm leading-tight uppercase tracking-tight">{item.name}</h4>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-[9px] font-black text-indigo-600 uppercase tracking-widest">{item.department}</span>
              {item.receiver && (
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-tight pl-2 border-l border-slate-200">
                  {item.receiver}
                </span>
              )}
            </div>
          </div>
        </div>
        <div className="text-right">
          <p className="text-sm font-black text-slate-900 leading-none">{item.quantity}</p>
          <p className="text-[8px] font-bold text-slate-300 uppercase tracking-widest">Units</p>
        </div>
      </div>

      {item.note && (
        <p className="text-[10px] text-slate-500 font-medium italic mb-4 line-clamp-1 opacity-70">
          "{item.note}"
        </p>
      )}

      <div className="flex items-center justify-between pt-3 border-t border-slate-50">
        <div className="flex items-center gap-1.5 text-slate-400">
          <Clock size={10} />
          <span className="text-[9px] font-bold uppercase tracking-widest">
            {item.timestamp?.toDate ? item.timestamp.toDate().toLocaleDateString() : 'New'}
          </span>
        </div>
        
        <div className="flex gap-2">
          {isReturnable ? (
            <button
              onClick={() => onReturn?.(item)}
              className="px-3 py-1.5 bg-slate-900 hover:bg-indigo-600 text-white rounded-lg transition-all text-[10px] font-bold uppercase tracking-wider flex items-center gap-2"
            >
              <ArrowLeftRight size={10} />
              Return
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <span className="px-2 py-1 bg-slate-50 text-[9px] font-bold text-slate-400 rounded-md border border-slate-100 uppercase tracking-wider">
                {item.type === 'sold' ? 'Sold' : 'Defaulty'}
              </span>
              <button
                onClick={() => {
                  if (window.confirm('Delete this record?')) {
                    onDelete(item.id);
                  }
                }}
                className="p-1.5 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                title="Delete Record"
              >
                <Trash2 size={14} />
              </button>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

const Board = ({ title, icon: Icon, items, color, bg, onReturn, onDelete, departments }) => {
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <div className="flex flex-col bg-slate-50/50 rounded-2xl md:rounded-3xl border border-slate-200/60 overflow-hidden h-full">
      <button 
        onClick={() => setIsExpanded(!isExpanded)}
        className={`w-full p-4 md:p-5 border-b border-slate-200/60 ${bg} flex items-center justify-between hover:brightness-95 transition-all text-left group`}
      >
        <div className="flex items-center gap-2 md:gap-3">
          <div className={`w-8 h-8 md:w-10 md:h-10 rounded-lg md:rounded-xl flex items-center justify-center text-white shadow-lg ${color} group-hover:scale-110 transition-transform`}>
            <Icon size={16} className="md:w-5 md:h-5" />
          </div>
          <div>
            <h3 className="font-black text-slate-900 uppercase tracking-tight leading-none text-xs md:text-sm">{title}</h3>
            <p className="text-[9px] md:text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1 md:mt-1.5">{items.length} Records</p>
          </div>
        </div>
        <div className={`p-2 rounded-lg bg-white/50 text-slate-400 group-hover:text-slate-600 transition-all ${!isExpanded ? 'rotate-180' : ''}`}>
          <ChevronUp size={16} />
        </div>
      </button>
      
      <motion.div
        initial={false}
        animate={{ 
          height: isExpanded ? 'auto' : 0,
          opacity: isExpanded ? 1 : 0
        }}
        transition={{ duration: 0.3, ease: [0.04, 0.62, 0.23, 0.98] }}
        className="overflow-hidden bg-white/30"
      >
        <div className="p-3 md:p-4 space-y-3.5 md:space-y-4 max-h-[450px] md:max-h-[600px] overflow-y-auto custom-scrollbar">
          {items.length === 0 ? (
            <div className="h-32 md:h-40 flex flex-col items-center justify-center opacity-30 border-2 border-dashed border-slate-200 rounded-2xl">
              <Icon size={24} className="mb-2 md:w-8 md:h-8" />
              <p className="text-[9px] md:text-[10px] font-bold uppercase tracking-widest text-center px-4">No active records</p>
            </div>
          ) : (
            items.map(item => (
              <EngagedBoardCard key={item.id} item={item} onReturn={onReturn} onDelete={onDelete} departments={departments} />
            ))
          )}
        </div>
      </motion.div>
    </div>
  );
};

const StocksEngagedTab = ({ engaged = [], onReturn, onDeleteEngaged, departments = [], onEngage, inventory = [] }) => {
  const grouped = useMemo(() => {
    return {
      'in-use': engaged.filter(i => i.type === 'in-use'),
      'sold':   engaged.filter(i => i.type === 'sold'),
      'faulty':  engaged.filter(i => i.type === 'faulty')
    };
  }, [engaged]);

  return (
    <div className="space-y-8 pb-10">
      {/* Header section with Engage Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-2xl font-black text-slate-900 leading-tight">Engaged Asset Tracking</h3>
          <p className="text-slate-500 text-sm mt-0.5 font-medium">Monitoring active assignments across departments</p>
        </div>
        
        <button
          onClick={onEngage}
          className="inline-flex items-center justify-center gap-2 bg-indigo-600 hover:bg-slate-900 px-5 py-2.5 rounded-xl font-bold text-white text-sm transition-all shadow-md shadow-indigo-200 active:scale-95 group"
        >
          <ArrowLeftRight size={17} className="group-hover:rotate-180 transition-transform duration-500" />
          Engage Stock
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 animate-fade-in items-start">
      <Board 
        title="IN USE" 
        icon={UserCheck} 
        items={grouped['in-use']} 
        color="bg-indigo-600" 
        bg="bg-indigo-50/30"
        onReturn={onReturn}
        onDelete={onDeleteEngaged}
        departments={departments}
      />
      <Board 
        title="Sold Assets" 
        icon={ShoppingCart} 
        items={grouped['sold']} 
        color="bg-emerald-600"
        bg="bg-emerald-50/30"
        onDelete={onDeleteEngaged}
        departments={departments}
      />
      <Board 
        title="Faulty/Default" 
        icon={AlertTriangle} 
        items={grouped['faulty']} 
        color="bg-red-600"
        bg="bg-red-50/30"
        onDelete={onDeleteEngaged}
          departments={departments}
      />
      </div>
    </div>
  );
};

export default React.memo(StocksEngagedTab);
