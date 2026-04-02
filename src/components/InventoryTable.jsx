import React from 'react';
import { Edit2, Trash2, User, Tag, AlertCircle } from 'lucide-react';

const InventoryTable = ({ inventory, activeDept, onEdit, onDelete }) => {
  const filteredInventory = inventory.filter(item => {
    const matchesDept = activeDept === 'All' || item.department === activeDept;
    return matchesDept;
  });

  const getStockStatus = (qty) => {
     if (qty <= 5) return { label: 'CRITICAL', color: 'bg-red-100 text-red-700 border-red-200' };
     if (qty <= 15) return { label: 'LOW', color: 'bg-amber-100 text-amber-700 border-amber-200' };
     return { label: 'OPTIMAL', color: 'bg-emerald-100 text-emerald-700 border-emerald-200' };
  };

  return (
    <div className="animate-fade-in bg-white rounded-b-2xl overflow-hidden">

      {/* Modern Data Grid with Horizontal Scroll Optimization */}
      <div className="relative group/table">
        <div className="overflow-x-auto custom-scrollbar overflow-y-hidden">
          <table className="w-full text-left whitespace-nowrap min-w-[850px] lg:min-w-full border-collapse">
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
                            {item.name.substring(0,2).toUpperCase()}
                        </div>
                        <div>
                            <div className="font-semibold text-slate-900 group-hover:text-indigo-600 transition-colors">{item.name}</div>
                        </div>
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
                        <div className="w-1 h-1 rounded-full bg-current"></div>
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
                            ></div>
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
        {filteredInventory.length === 0 && (
          <div className="p-32 text-center flex flex-col items-center gap-4 opacity-40">
            <AlertCircle size={48} className="text-slate-300" />
            <div>
                <p className="font-bold text-slate-900">No matching assets found.</p>
                <p className="text-xs text-slate-500">System is reporting a null state for the current filters.</p>
            </div>
          </div>
        )}
        </div>
        {/* Right Gradient Indicator for Mobile Scroll */}
        <div className="absolute top-0 right-0 h-full w-10 bg-gradient-to-l from-white pointer-events-none opacity-0 group-hover/table:opacity-100 lg:hidden transition-opacity duration-300" />
      </div>

      <div className="px-6 py-4 bg-slate-50/50 border-t border-slate-100 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button className="px-3 py-1.5 rounded-lg border border-slate-200 text-slate-400 font-bold text-[10px] tracking-widest uppercase hover:bg-white hover:text-slate-700 transition-all">Previous</button>
          <button className="px-3 py-1.5 rounded-lg border border-slate-200 text-slate-400 font-bold text-[10px] tracking-widest uppercase hover:bg-white hover:text-slate-700 transition-all">Next</button>
        </div>
      </div>
    </div>
  );
};

export default InventoryTable;
