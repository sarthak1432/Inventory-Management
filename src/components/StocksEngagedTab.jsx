import React, { useMemo } from 'react';
import { Users, ShoppingCart, UserCheck, AlertTriangle, ArrowLeftRight, Clock, Info, Plus } from 'lucide-react';
import { motion } from 'framer-motion';

const EngagedBoardCard = ({ item, onReturn, departments = [] }) => {
  const isReturnable = item.type === 'in-use';
  
  const deptHead = useMemo(() => {
    return departments.find(d => d.name === item.department)?.head;
  }, [departments, item.department]);
  
  return (
    <motion.div 
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm hover:shadow-md transition-all group relative overflow-hidden"
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center font-bold text-[10px] text-slate-500">
            {item.name.substring(0, 2).toUpperCase()}
          </div>
          <div>
            <h4 className="font-bold text-slate-900 text-sm leading-tight uppercase">{item.name}</h4>
            <div className="flex items-center gap-2 mt-0.5">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none shrink-0">{item.department}</p>
              {deptHead && (
                <div className="flex items-center gap-1 pl-1.5 border-l border-slate-200">
                  <User size={8} className="text-indigo-400" />
                  <span className="text-[9px] font-black text-indigo-500 uppercase tracking-tighter truncate max-w-[50px]">{deptHead}</span>
                </div>
              )}
              {item.receiver && (
                <div className="flex items-center gap-1 pl-1.5 border-l border-slate-200">
                  <div className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
                  <span className="text-[9px] font-black text-indigo-700 uppercase tracking-tight">{item.receiver}</span>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="text-right">
          <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest block leading-none">Qty</span>
          <span className="text-sm font-black text-slate-900">{item.quantity}</span>
        </div>
      </div>

      {item.note && (
        <div className="mb-4 p-2 bg-slate-50 rounded-lg flex gap-2 border border-slate-100">
          <Info size={12} className="text-slate-400 shrink-0 mt-0.5" />
          <p className="text-[10px] text-slate-500 font-medium leading-relaxed italic line-clamp-2">
            "{item.note}"
          </p>
        </div>
      )}

      <div className="flex items-center justify-between pt-3 border-t border-slate-100 mt-2">
        <div className="flex items-center gap-1.5 text-slate-400">
          <Clock size={12} />
          <span className="text-[9px] font-bold uppercase tracking-widest">
            {item.timestamp?.toDate ? item.timestamp.toDate().toLocaleDateString() : 'Just now'}
          </span>
        </div>
        
        {isReturnable && (
          <button
            onClick={() => onReturn?.(item)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 hover:bg-indigo-600 text-indigo-600 hover:text-white rounded-lg transition-all text-[10px] font-bold uppercase tracking-wider"
          >
            <ArrowLeftRight size={12} />
            Return
          </button>
        )}
      </div>
    </motion.div>
  );
};

const Board = ({ title, icon: Icon, items, color, bg, onReturn, departments }) => (
  <div className="flex flex-col bg-slate-50/50 rounded-2xl md:rounded-3xl border border-slate-200/60 overflow-hidden h-full">
    <div className={`p-4 md:p-5 border-b border-slate-200/60 ${bg} flex items-center justify-between`}>
      <div className="flex items-center gap-2 md:gap-3">
        <div className={`w-8 h-8 md:w-10 md:h-10 rounded-lg md:rounded-xl flex items-center justify-center text-white shadow-lg ${color}`}>
          <Icon size={16} className="md:w-5 md:h-5" />
        </div>
        <div>
          <h3 className="font-black text-slate-900 uppercase tracking-tight leading-none text-xs md:text-sm">{title}</h3>
          <p className="text-[9px] md:text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1 md:mt-1.5">{items.length} Records</p>
        </div>
      </div>
    </div>
    
    <div className="p-3 md:p-4 flex-grow overflow-y-auto space-y-3.5 md:space-y-4 custom-scrollbar max-h-[450px] md:max-h-[600px]">
      {items.length === 0 ? (
        <div className="h-32 md:h-40 flex flex-col items-center justify-center opacity-30 border-2 border-dashed border-slate-200 rounded-2xl">
          <Icon size={24} className="mb-2 md:w-8 md:h-8" />
          <p className="text-[9px] md:text-[10px] font-bold uppercase tracking-widest text-center px-4">No active records</p>
        </div>
      ) : (
        items.map(item => (
          <EngagedBoardCard key={item.id} item={item} onReturn={onReturn} departments={departments} />
        ))
      )}
    </div>
  </div>
);

const StocksEngagedTab = ({ engaged = [], onReturn, departments = [], onEngage, inventory = [] }) => {
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
        departments={departments}
      />
      <Board 
        title="Sold Assets" 
        icon={ShoppingCart} 
        items={grouped['sold']} 
        color="bg-emerald-600"
        bg="bg-emerald-50/30"
        departments={departments}
      />
      <Board 
        title="Faulty/Default" 
        icon={AlertTriangle} 
        items={grouped['faulty']} 
        color="bg-red-600"
        bg="bg-red-50/30"
        departments={departments}
      />
      </div>
    </div>
  );
};

export default React.memo(StocksEngagedTab);
