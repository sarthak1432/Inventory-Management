import React, { useMemo } from 'react';
import { Edit2, Trash2, User, Tag, AlertCircle, Link } from 'lucide-react';
// Moved outside component — pure function, no closure dependencies
const getStockStatus = (qty) => {
  if (qty <= 5)  return { label: 'CRITICAL', color: 'bg-red-100 text-red-700 border-red-200' };
  if (qty <= 15) return { label: 'LOW',      color: 'bg-amber-100 text-amber-700 border-amber-200' };
  return           { label: 'OPTIMAL',  color: 'bg-emerald-100 text-emerald-700 border-emerald-200' };
};

const InventoryTable = ({ inventory, activeDept, searchTerm, onEdit, onDelete, onEngage }) => {
  const filteredInventory = useMemo(() => {
    return inventory.filter(item => {
      // If there is a search term, search globally (ignore department filter)
      if (searchTerm) return item.name.toLowerCase().includes(searchTerm.toLowerCase());
      return activeDept === 'All' || item.department === activeDept;
    });
  }, [inventory, activeDept, searchTerm]);

  return (
    <div className="animate-fade-in bg-white rounded-b-2xl overflow-hidden">

      {/* Modern Data Grid with Horizontal Scroll Optimization */}
      <div className="relative group/table bg-white">

        {/* MOBILE LAYOUT: Stacked Cards */}
        <div className="md:hidden flex flex-col divide-y divide-slate-100">
          {filteredInventory.map(item => {
            const status = getStockStatus(item.quantity);
            return (
              <div key={item.id} className="p-4 space-y-4 hover:bg-slate-50 transition-colors">
                {/* Header: Name and Status */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center font-bold text-xs text-indigo-700 shadow-sm shrink-0">
                      {item.name.substring(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <div className="font-bold text-slate-900 text-sm">{item.name}</div>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{item.department || 'GLOBAL'}</span>
                      </div>
                    </div>
                  </div>
                  <span className={`inline-flex items-center gap-1.5 px-2 py-1 rounded bg-slate-50 text-[9px] font-black tracking-widest uppercase border ${status.color}`}>
                    {status.label}
                  </span>
                </div>

                {/* Body: Details Grid */}
                <div className="grid grid-cols-2 gap-3 p-3 bg-slate-50/50 rounded-xl border border-slate-100">
                  <div>
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Stock Lvl</p>
                    <p className="font-bold text-slate-800 text-sm">{item.quantity} Units</p>
                  </div>
                  <div>
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Responsible</p>
                    <p className="font-bold text-slate-700 text-xs truncate">{item.assignee || 'Unassigned'}</p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-1">
                  <button
                    onClick={() => onEdit(item)}
                    className="flex-1 py-2 rounded-lg bg-white border border-slate-200 text-xs font-bold text-slate-600 shadow-sm hover:border-indigo-300 hover:text-indigo-600 transition-colors flex items-center justify-center gap-2"
                  >
                    <Edit2 size={14} /> Edit
                  </button>
                  <button
                    onClick={() => onEngage(item)}
                    disabled={item.quantity <= 0}
                    className="flex-1 py-2 rounded-lg bg-slate-900 border border-slate-900 text-xs font-bold text-white shadow-sm hover:bg-slate-800 transition-colors flex items-center justify-center gap-2 disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    <Link size={14} /> Engage
                  </button>
                  <button
                    onClick={() => onDelete(item.id)}
                    className="p-2 rounded-lg bg-white border border-slate-200 text-xs font-bold text-slate-400 shadow-sm hover:border-red-300 hover:text-red-600 transition-colors flex items-center justify-center"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* DESKTOP LAYOUT: Traditional Table */}
        <div className="hidden md:block overflow-x-auto custom-scrollbar overflow-y-hidden">
          <table className="w-full text-left whitespace-nowrap min-w-full border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-500 font-bold uppercase text-[10px] tracking-widest border-b border-slate-200">
                <th className="px-6 py-4">Asset Name</th>
                <th className="px-6 py-4">Operational Lab</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Stock</th>
                <th className="px-6 py-4">Responsible</th>
                <th className="px-6 py-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredInventory.map((item) => {
                const status = getStockStatus(item.quantity);
                return (
                  <tr key={item.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center font-bold text-xs text-slate-600 shadow-sm">
                          {item.name.substring(0, 2).toUpperCase()}
                        </div>
                        <div className="font-semibold text-slate-900 group-hover:text-indigo-600 transition-colors">{item.name}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-100 border border-slate-200 text-[10px] font-black text-slate-600 tracking-wider uppercase">
                        <Tag size={10} className="opacity-50" />
                        {item.department || 'GLOBAL'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[10px] font-black tracking-widest uppercase shadow-sm ${status.color}`}>
                        <div className="w-1 h-1 rounded-full bg-current" />
                        {status.label}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <span className="font-bold text-sm text-slate-900">{item.quantity}</span>
                        <div className="h-1.5 w-12 bg-slate-100 rounded-full overflow-hidden hidden xl:block">
                          <div
                            className={`h-full ${item.quantity <= 5 ? 'bg-red-500' : 'bg-indigo-600'}`}
                            style={{ width: `${Math.min(item.quantity / 50 * 100, 100)}%` }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-1.5">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-lg bg-slate-100 flex items-center justify-center text-slate-400">
                            <User size={12} />
                          </div>
                          <span className="text-xs font-semibold text-slate-600 group-hover:text-slate-900 transition-colors truncate max-w-[120px]">
                            {item.assignee || 'UNASSIGNED'}
                          </span>
                        </div>
                        {item.assignTo && (
                          <div className="flex items-center gap-2 pl-1.5 border-l-2 border-indigo-200 bg-indigo-50/50 py-0.5 rounded-r">
                            <span className="text-[9px] font-black text-indigo-500 uppercase tracking-[0.2em] scale-90 origin-left">TO:</span>
                            <span className="text-[10px] font-bold text-indigo-700 truncate max-w-[100px]">{item.assignTo}</span>
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex justify-center gap-2 opacity-0 group-hover:opacity-100 transition-all duration-200">
                        <button
                          className="p-2.5 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 hover:shadow-md transition-all"
                          onClick={() => onEngage(item)}
                          disabled={item.quantity <= 0}
                          title="Engage Stock"
                        >
                          <Link size={14} />
                        </button>
                        <button
                          className="p-2.5 rounded-lg bg-white border border-slate-200 text-slate-400 hover:text-indigo-600 hover:border-indigo-200 hover:shadow-sm transition-all"
                          onClick={() => onEdit(item)}
                          title="Edit Record"
                        >
                          <Edit2 size={14} />
                        </button>
                        <button
                          className="p-2.5 rounded-lg bg-white border border-slate-200 text-slate-400 hover:text-red-600 hover:border-red-200 hover:shadow-sm transition-all"
                          onClick={() => onDelete(item.id)}
                          title="Delete Record"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          <div className="hidden md:block absolute top-0 right-0 h-full w-10 bg-gradient-to-l from-white pointer-events-none opacity-0 group-hover/table:opacity-100 transition-opacity duration-300" />
        </div>
      </div>

      {filteredInventory.length === 0 && (
        <div className="p-32 text-center flex flex-col items-center gap-4 opacity-40">
          <AlertCircle size={48} className="text-slate-300" />
          <div>
            <p className="font-bold text-slate-900">No matching assets found.</p>
            <p className="text-xs text-slate-500">System is reporting a null state for the current filters.</p>
          </div>
        </div>
      )}

      <div className="px-6 py-4 bg-slate-50/50 border-t border-slate-100 flex items-center justify-between">
        <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">
          Showing {filteredInventory.length} of {inventory.length} items
        </div>
      </div>
    </div>
  );
};

export default React.memo(InventoryTable);
