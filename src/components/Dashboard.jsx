import React, { useMemo } from 'react';
import { Package, AlertTriangle, Layers, ArrowUpRight, ArrowDownRight } from 'lucide-react';

const StatCard = ({ title, value, icon: Icon, color, trend, label }) => (
  <div className="bg-white border border-slate-200 p-6 rounded-2xl flex items-start gap-4 group hover:shadow-lg transition-all duration-300">
    <div className={`p-3 rounded-xl ${color} flex items-center justify-center`}>
      <Icon size={22} className="text-white" />
    </div>

    <div className="flex-grow">
      <div className="flex items-center justify-between mb-1">
        <p className="text-slate-500 font-bold text-[10px] tracking-widest uppercase">{title}</p>
        <div className={`flex items-center gap-1 text-[10px] font-bold ${trend === 'up' ? 'text-emerald-600' : 'text-red-600'}`}>
          {trend === 'up' ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
          {label}
        </div>
      </div>

      <div className="flex items-baseline gap-2">
        <h3 className="text-2xl font-black text-slate-900 tracking-tight">{value}</h3>
      </div>

      {/* Subtle Mini Progress Bar for Visual Density */}
      <div className="w-full h-1 bg-slate-100 rounded-full mt-3 overflow-hidden">
        <div
          className={`h-full opacity-60 ${trend === 'up' ? 'bg-emerald-500' : 'bg-red-500'}`}
          style={{ width: '65%' }}
        />
      </div>
    </div>
  </div>
);

const Dashboard = ({ inventory }) => {
  const safeInventory = useMemo(
    () => (Array.isArray(inventory) ? inventory : []),
    [inventory]
  );

  const totalItems = safeInventory.length;

  const lowStockItems = useMemo(
    () => safeInventory.filter(item => item?.quantity <= 5).length,
    [safeInventory]
  );

  const totalDepartments = useMemo(
    () => new Set(safeInventory.filter(i => i?.department).map(item => item.department)).size,
    [safeInventory]
  );

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
        <StatCard
          title="Consolidated Assets"
          value={totalItems}
          icon={Package}
          color="bg-slate-800"
          trend="up"
          label="+Sync Live"
        />
        <StatCard
          title="Critical Alerts"
          value={lowStockItems}
          icon={AlertTriangle}
          color="bg-red-600"
          trend="down"
          label="Requires Action"
        />
        <StatCard
          title="Active Workspaces"
          value={totalDepartments}
          icon={Layers}
          color="bg-indigo-500"
          trend="up"
          label="Labs Engaged"
        />
      </div>
    </div>
  );
};

export default React.memo(Dashboard);
