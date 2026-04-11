import React from 'react';
import { Search, Plus, X, Check, UserPlus, User } from 'lucide-react';
import InventoryTable from './InventoryTable';

const InventoryTab = ({ 
  inventory, 
  departments, 
  activeDept, 
  searchTerm, 
  addingDept, 
  newDeptName, 
  onSearchChange, 
  onAddNew, 
  onDeptChange, 
  onDeleteDept,
  onUpdateDept,
  onAddDeptClick, 
  onNewDeptNameChange, 
  onConfirmAddDept, 
  onCancelAddDept, 
  onEdit, 
  onDelete,
  onEngage 
}) => {
  return (
    <div className="space-y-5 animate-fade-in">
      {/* Header row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-2xl font-black text-slate-900">Resource Inventory</h3>
          <p className="text-slate-500 text-sm mt-0.5">
            {inventory.length} total assets registered
          </p>
        </div>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full sm:w-auto">
          <div className="relative group/search flex-grow sm:flex-grow-0 sm:min-w-[280px]">
            <Search
              size={18}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within/search:text-indigo-600 transition-colors pointer-events-none"
            />
            <input
              type="text"
              placeholder="Search items by name..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pl-11 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 placeholder:text-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all shadow-sm"
            />
          </div>
          <button
            onClick={onAddNew}
            className="inline-flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 px-5 py-2.5 rounded-xl font-bold text-white text-sm transition-all shadow-md shadow-indigo-200 active:scale-95"
          >
            <Plus size={17} />
            Add Stocks
          </button>
        </div>
      </div>

      {/* Department pill tabs */}
      <div className="relative group/scroll">
        <div className="flex gap-2 items-center overflow-x-auto pb-2 sm:pb-0 no-scrollbar sm:flex-wrap">
          {/* "All" Pill */}
          <button
            onClick={() => onDeptChange('All')}
            className={`whitespace-nowrap px-4 py-2 rounded-xl text-xs font-bold tracking-wide transition-all shrink-0
              ${activeDept === 'All'
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200'
                : 'bg-white border border-slate-200 text-slate-500 hover:border-indigo-300 hover:text-indigo-600'
              }`}
          >
            All Assets
          </button>

          {/* Firestore Department Pills */}
          {departments.map(dept => (
            <div key={dept.id} className="relative group flex items-center shrink-0">
              <button
                onClick={() => onDeptChange(dept.name)}
                className={`pl-4 pr-16 py-2 rounded-xl text-xs font-bold tracking-wide transition-all whitespace-nowrap
                  ${activeDept === dept.name
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200'
                    : 'bg-white border border-slate-200 text-slate-500 hover:border-indigo-300 hover:text-indigo-600'
                  }`}
              >
                {dept.name}
              </button>
              
              <div className="absolute right-2 flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-all">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    const head = window.prompt(`Set Department Head for ${dept.name}:`, dept.head);
                    if (head !== null) onUpdateDept(dept.id, { head });
                  }}
                  className={`p-1 rounded hover:bg-black/5 ${activeDept === dept.name ? 'text-white/70 hover:text-white' : 'text-slate-400 hover:text-indigo-600'}`}
                  title="Assign Dept Head"
                >
                  {dept.head ? <User size={12} /> : <UserPlus size={12} />}
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteDept(dept.id, dept.name);
                  }}
                  className={`p-1 rounded hover:bg-black/5 ${activeDept === dept.name ? 'text-white/70 hover:text-white' : 'text-slate-400 hover:text-red-500'}`}
                  title="Remove Department"
                >
                  <X size={12} />
                </button>
              </div>
            </div>
          ))}

          {/* Inline add-department */}
          {addingDept ? (
            <div className="flex items-center gap-1.5 animate-fade-in shrink-0">
              <input
                autoFocus
                type="text"
                value={newDeptName}
                onChange={e => onNewDeptNameChange(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Enter')  onConfirmAddDept();
                  if (e.key === 'Escape') onCancelAddDept();
                }}
                placeholder="Name..."
                className="px-3 py-2 rounded-xl border border-indigo-300 bg-white text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-200 w-32"
              />
              <button
                onClick={onConfirmAddDept}
                className="p-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white transition-colors"
              >
                <Check size={14} />
              </button>
            </div>
          ) : (
            <button
              onClick={onAddDeptClick}
              className="whitespace-nowrap px-4 py-2 rounded-xl border border-dashed border-slate-300 text-slate-400 hover:border-indigo-400 hover:text-indigo-600 text-xs font-bold tracking-wide transition-all flex items-center gap-1 shrink-0"
            >
              <Plus size={14} />
              New
            </button>
          )}
        </div>
        {/* Visual scroll indicator (mobile only) */}
        <div className="absolute right-0 top-0 h-full w-8 bg-gradient-to-l from-slate-50 pointer-events-none sm:hidden" />
      </div>

      {/* Table card */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        <InventoryTable
          inventory={inventory}
          activeDept={activeDept}
          searchTerm={searchTerm}
          onEdit={onEdit}
          onDelete={onDelete}
          onEngage={onEngage}
        />
      </div>
    </div>
  );
};

export default React.memo(InventoryTab);
