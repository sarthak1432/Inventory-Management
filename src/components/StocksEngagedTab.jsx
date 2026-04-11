import React, { useMemo, useState } from 'react';
import { ShoppingCart, UserCheck, AlertTriangle, ArrowLeftRight, Clock, Plus, Trash2, Info, Package } from 'lucide-react';
import { motion } from 'framer-motion';
import { formatDate } from '../utils/helpers';

const StatCard = React.memo(({ title, value, icon: Icon, color, bg, active, onClick }) => (
  <button 
    onClick={onClick}
    className={`min-w-[140px] sm:min-w-0 flex-1 bg-white border p-3.5 sm:p-5 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 transition-all group relative overflow-hidden snap-center
      ${active ? 'border-indigo-600 shadow-md ring-1 ring-indigo-600/10' : 'border-slate-200 hover:border-slate-300 hover:shadow-sm'}`}
  >
    {active && <div className="absolute top-0 right-0 w-6 h-6 md:w-8 md:h-8 bg-indigo-600 transform translate-x-3 -translate-y-3 md:translate-x-4 md:-translate-y-4 rotate-45" />}
    <div className={`w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl ${bg} flex items-center justify-center ${color} group-hover:scale-110 transition-transform shadow-sm shrink-0`}>
      <Icon size={20} className="md:w-[22px] md:h-[22px]" />
    </div>
    <div className="text-left w-full truncate">
      <p className="text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1 truncate">{title}</p>
      <h4 className="text-xl md:text-2xl font-black text-slate-900 leading-none">{value}</h4>
    </div>
  </button>
));

const EngagementRow = React.memo(({ item, onReturn, onDelete }) => {
  const isReturnable = item.type === 'in-use';
  
  return (
    <motion.div 
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white border border-slate-200 rounded-2xl p-4 md:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-indigo-200 transition-all group"
    >
      <div className="flex items-start md:items-center gap-3 md:gap-4 flex-grow w-full md:max-w-md">
        <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center font-black text-xs md:text-sm text-slate-400 uppercase shrink-0">
          {item.name.substring(0, 2)}
        </div>
        <div className="min-w-0 flex-grow">
          <div className="flex items-center justify-between md:justify-start gap-2 mb-1 md:mb-1.5">
            <h4 className="font-black text-slate-900 uppercase tracking-tight truncate text-sm md:text-base">{item.name}</h4>
            <span className="px-2 py-0.5 bg-slate-100 text-[9px] md:text-[10px] font-bold text-slate-500 rounded-md uppercase tracking-wider shrink-0 capitalize">{item.department}</span>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center gap-1.5 sm:gap-3 text-slate-400 text-[10px] md:text-[11px] font-bold uppercase tracking-wider">
            {item.receiver && (
              <div className="flex items-center gap-1.5 text-indigo-600 truncate">
                <UserCheck size={12} className="shrink-0" />
                <span className="truncate">{item.receiver}</span>
              </div>
            )}
            <div className="flex items-center gap-1.5 shrink-0">
              <Clock size={12} />
              <span>{formatDate(item.timestamp)}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center gap-3 md:gap-6 lg:gap-10 w-full md:w-auto mt-2 md:mt-0 pt-3 md:pt-0 border-t border-slate-50 md:border-0 sm:justify-between">
        <div className="flex items-center justify-between sm:block w-full sm:w-auto">
          <p className="text-[9px] md:text-[10px] font-black text-slate-300 uppercase tracking-widest mb-0 sm:mb-1">Quantity</p>
          <p className="text-sm md:text-lg font-black text-slate-900 leading-none">{item.quantity} <span className="text-[9px] md:text-[10px] text-slate-400">UNITS</span></p>
        </div>

        <div className="flex items-center gap-2 md:gap-3 w-full sm:w-auto">
          {item.note && (
            <div className="hidden lg:block group/note relative">
              <div className="p-2 transition-colors text-slate-300 hover:text-indigo-400">
                <Info size={18} />
              </div>
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-2 bg-slate-900 text-white text-[10px] rounded-lg opacity-0 invisible group-hover/note:opacity-100 group-hover/note:visible transition-all z-20 font-medium">
                {item.note}
              </div>
            </div>
          )}

          {isReturnable ? (
            <button
              onClick={() => onReturn?.(item)}
              className="flex-1 sm:flex-none justify-center px-4 md:px-5 py-2 md:py-2.5 bg-slate-900 hover:bg-indigo-600 text-white rounded-xl transition-all text-[10px] md:text-[11px] font-black uppercase tracking-widest flex items-center gap-2"
            >
              <ArrowLeftRight size={14} />
              <span>Return</span>
            </button>
          ) : (
            <button
              onClick={() => {
                if (window.confirm('Are you sure you want to permanently delete this record?')) {
                  onDelete(item.id);
                }
              }}
              className="flex-1 sm:flex-none justify-center px-4 md:px-5 py-2 md:py-2.5 bg-white border border-slate-200 text-slate-400 hover:text-red-500 hover:border-red-500 hover:bg-red-50 rounded-xl transition-all text-[10px] md:text-[11px] font-black uppercase tracking-widest flex items-center gap-2"
            >
              <Trash2 size={14} />
              <span>Remove</span>
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
});

const StocksEngagedTab = ({ engaged = [], onReturn, onDeleteEngaged, onEngage }) => {
  const [activeTab, setActiveTab] = useState('in-use');

  const grouped = useMemo(() => ({
    'in-use': engaged.filter(i => i.type === 'in-use'),
    'sold':   engaged.filter(i => i.type === 'sold'),
    'faulty':  engaged.filter(i => i.type === 'faulty')
  }), [engaged]);

  const currentList = grouped[activeTab] || [];

  return (
    <div className="space-y-6 md:space-y-8 pb-12 animate-fade-in px-1">
      {/* Professional Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 sm:gap-6 pb-2 border-b border-slate-100">
        <div>
          <h3 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">Stocks Engaged</h3>
          <p className="text-slate-500 text-xs sm:text-sm md:text-base font-medium mt-1">
            Enterprise Monitoring Console & Asset Distribution
          </p>
        </div>
        
        <button
          onClick={onEngage}
          className="inline-flex items-center justify-center gap-2 bg-indigo-600 hover:bg-slate-900 px-5 py-3 md:px-5 md:py-2.5 rounded-xl font-bold text-white text-[11px] md:text-sm uppercase tracking-widest transition-all shadow-lg shadow-indigo-100 active:scale-95 group shrink-0 w-full sm:w-auto"
        >
          <Plus size={16} className="group-hover:rotate-90 transition-transform duration-300" />
          Engage New Stock
        </button>
      </div>

      {/* KPI Stats Row (Acts as secondary navigation) */}
      <div className="flex overflow-x-auto sm:grid sm:grid-cols-3 gap-3 md:gap-5 pb-2 sm:pb-0 snap-x snap-mandatory -mx-1 px-1 custom-scrollbar">
        <StatCard 
          title="Active Pool" 
          value={grouped['in-use'].length} 
          icon={UserCheck} 
          color="text-indigo-600" 
          bg="bg-indigo-50"
          active={activeTab === 'in-use'}
          onClick={() => setActiveTab('in-use')}
        />
        <StatCard 
          title="Finalised Sales" 
          value={grouped['sold'].length} 
          icon={ShoppingCart} 
          color="text-emerald-600" 
          bg="bg-emerald-50"
          active={activeTab === 'sold'}
          onClick={() => setActiveTab('sold')}
        />
        <StatCard 
          title="Maintenance / Faulty" 
          value={grouped['faulty'].length} 
          icon={AlertTriangle} 
          color="text-red-600" 
          bg="bg-red-50"
          active={activeTab === 'faulty'}
          onClick={() => setActiveTab('faulty')}
        />
      </div>

      {/* Unified Management View */}
      <div className="space-y-4 pt-2">
        <div className="flex items-center justify-between px-2 mb-2">
          <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.3em]">
            {activeTab.replace('-', ' ')} Listings (Showing {currentList.length})
          </h4>
          <div className="h-px bg-slate-100 flex-grow mx-6 hidden sm:block" />
        </div>

        {currentList.length === 0 ? (
          <div className="py-24 flex flex-col items-center justify-center bg-white border border-slate-200 border-dashed rounded-[2.5rem] opacity-40">
            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
              <Package size={32} className="text-slate-300" />
            </div>
            <p className="text-sm font-bold uppercase tracking-widest text-slate-400">No active records found</p>
          </div>
        ) : (
          <div className="space-y-3">
            {currentList.map(item => (
              <EngagementRow key={item.id} item={item} onReturn={onReturn} onDelete={onDeleteEngaged} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default React.memo(StocksEngagedTab);
