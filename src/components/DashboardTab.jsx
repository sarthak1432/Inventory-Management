import React, { useMemo } from 'react';
import { Plus, TrendingUp, Package } from 'lucide-react';
import Dashboard from './Dashboard';

const RecentRow = React.memo(({ item }) => (
  <div className="px-6 py-3.5 flex items-center justify-between hover:bg-slate-50 transition-colors group">
    <div className="flex items-center gap-3">
      <div className="w-8 h-8 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center text-[11px] font-black text-indigo-600">
        {item.name.substring(0, 2).toUpperCase()}
      </div>
      <p className="text-sm font-semibold text-slate-800 group-hover:text-indigo-600 transition-colors">
        {item.name}
      </p>
    </div>
    <div className="hidden sm:block text-right">
      <p className="text-xs text-slate-400 font-medium">Qty</p>
      <p className="text-sm font-bold text-slate-800">{item.quantity}</p>
    </div>
  </div>
));
RecentRow.displayName = 'RecentRow';

const DashboardTab = ({ 
  greeting, 
  inventory, 
  onAddNew, 
  onViewAll,
  uniqueDeptCount
}) => {
  const recentItems = useMemo(() => inventory.slice(0, 5), [inventory]);

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Greeting */}
      <div>
        <h3 className="text-2xl font-black text-slate-900">
          {greeting}, Admin 👋
        </h3>
        <p className="text-slate-500 text-sm mt-1">
          Here's what's happening across your inventory ecosystem today.
        </p>
      </div>

      {/* Dashboard stat cards */}
      <Dashboard inventory={inventory} />

      {/* Recent Assets */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h4 className="font-bold text-slate-900 text-base">Recent Assets</h4>
            <p className="text-[11px] text-slate-400 mt-0.5 font-medium">
              Last {recentItems.length} registered items
            </p>
          </div>
          <button
            onClick={onViewAll}
            className="text-xs font-bold text-indigo-600 hover:text-indigo-800 transition-colors"
          >
            View all →
          </button>
        </div>

        {inventory.length === 0 ? (
          <div className="px-6 py-12 text-center text-slate-400 text-sm">
            No items registered yet.
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {recentItems.map(item => (
              <RecentRow key={item.id} item={item} />
            ))}
          </div>
        )}
      </div>

      {/* Quick-action cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <button
          onClick={onAddNew}
          className="text-left p-5 bg-indigo-600 hover:bg-indigo-700 rounded-2xl text-white transition-all shadow-md shadow-indigo-200 active:scale-[0.98] group"
        >
          <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center mb-3">
            <Plus size={22} />
          </div>
          <p className="font-bold text-base">Add Stocks</p>
          <p className="text-indigo-200 text-xs mt-0.5">Add a new item to the inventory</p>
        </button>

        <button
          onClick={onViewAll}
          className="text-left p-5 bg-white border border-slate-200 hover:border-indigo-200 hover:shadow-md rounded-2xl transition-all active:scale-[0.98] group"
        >
          <div className="w-10 h-10 bg-slate-100 group-hover:bg-indigo-50 rounded-xl flex items-center justify-center mb-3 transition-colors">
            <TrendingUp size={22} className="text-slate-500 group-hover:text-indigo-600 transition-colors" />
          </div>
          <p className="font-bold text-base text-slate-900">Browse Inventory</p>
          <p className="text-slate-400 text-xs mt-0.5">
            {inventory.length} assets across {uniqueDeptCount} workspaces
          </p>
        </button>
      </div>
    </div>
  );
};

export default React.memo(DashboardTab);
