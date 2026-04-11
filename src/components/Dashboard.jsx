import React, { useMemo } from 'react';
import { Package, AlertTriangle, Layers, ArrowUpRight, ArrowDownRight } from 'lucide-react';

// Moved outside component — constant, never changes
const TARGET_DEPARTMENTS = ['3d section', 'front desk area', 'service department'];

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

  const targetedLowStock = useMemo(
    () => safeInventory.filter(item => {
      if (!item?.department) return false;
      const dept = item.department.toLowerCase();
      return TARGET_DEPARTMENTS.some(td => dept.includes(td)) && (item.quantity || 0) <= 50;
    }),
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

      {targetedLowStock.length > 0 && (
        <div className="bg-white border border-red-200 rounded-2xl shadow-sm overflow-hidden animate-slide-up">
          <div className="bg-red-50 px-6 py-4 border-b border-red-100 flex items-center gap-3">
            <div className="p-2 bg-red-100 rounded-lg">
              <AlertTriangle size={18} className="text-red-700 animate-pulse" />
            </div>
            <div>
              <h4 className="font-bold text-red-900">Restock Notifications</h4>
              <p className="text-[11px] font-bold text-red-600/70 tracking-wide uppercase mt-0.5">
                Priority Target Areas (&lt;= 50 units)
              </p>
            </div>
          </div>
          <div className="divide-y divide-red-50">
            {targetedLowStock.map(item => (
              <div key={item.id} className="px-6 py-4 flex flex-wrap items-center justify-between gap-4 hover:bg-red-50/50 transition-colors">
                <div>
                  <p className="font-bold text-slate-800 text-sm">{item.name}</p>
                  <p className="text-[11px] text-slate-500 font-bold uppercase tracking-wider mt-0.5">{item.department}</p>
                </div>
                <div className="text-right whitespace-nowrap bg-red-100 px-4 py-1.5 rounded-xl border border-red-200 shadow-sm border-b-2">
                  <p className="text-[9px] font-black uppercase tracking-widest text-red-500 mb-0.5">Amount Remaining</p>
                  <p className="text-xl leading-none font-black text-red-700">{item.quantity}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default React.memo(Dashboard);
