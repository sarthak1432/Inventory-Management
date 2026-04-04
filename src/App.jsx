import React, { useState, useEffect } from 'react';
import { useInventory } from './hooks/useInventory';
import { useDepartments } from './hooks/useDepartments';

import InventoryTable from './components/InventoryTable';
import ItemModal from './components/ItemModal';
import Sidebar from './components/Sidebar';
import {
  Plus, Bell, User, RefreshCcw,
  Package, TrendingUp, Check, X, Search, Info
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

/* ─── Greeting helper ─── */
function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  return 'Good evening';
}

/* ─── Dashboard recent-assets mini-list ─── */
const RecentRow = ({ item }) => (
  <div className="px-6 py-3.5 flex items-center justify-between hover:bg-slate-50 transition-colors group">
    <div className="flex items-center gap-3">
      <div className="w-8 h-8 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center text-[11px] font-black text-indigo-600">
        {item.name.substring(0, 2).toUpperCase()}
      </div>
      <div>
        <p className="text-sm font-semibold text-slate-800 group-hover:text-indigo-600 transition-colors">
          {item.name}
        </p>
      </div>
    </div>
    <div className="flex items-center gap-6 text-right">
      <div className="hidden sm:block">
        <p className="text-xs text-slate-400 font-medium">Qty</p>
        <p className="text-sm font-bold text-slate-800">{item.quantity}</p>
      </div>
    </div>
  </div>
);


/* ══════════════════════════════════════════ */
function App() {
  const { inventory, loading: invLoading, addItem, updateItem, deleteItem } = useInventory();
  const { departments, loading: deptLoading, addDepartment, deleteDepartment } = useDepartments();

  const [activeTab, setActiveTab] = useState(() => localStorage.getItem('activeTab') || 'dashboard');
  const [activeDept, setActiveDept] = useState(() => localStorage.getItem('activeDept') || 'All');
  const [isModalOpen, setIsModalOpen]       = useState(false);
  const [editingItem, setEditingItem]       = useState(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(() => JSON.parse(localStorage.getItem('sidebarCollapsed') || 'false'));
  const [addingDept, setAddingDept]         = useState(false);
  const [newDeptName, setNewDeptName]       = useState('');
  const [searchTerm, setSearchTerm]         = useState('');
  const [notifications, setNotifications]   = useState(() => JSON.parse(localStorage.getItem('notifications') || '[]'));
  const [isNotifyOpen, setIsNotifyOpen]     = useState(false);

  const loading = invLoading || deptLoading;

  // Monthly Check Effect
  useEffect(() => {
    const today = new Date();
    const isFirstOfMonth = today.getDate() === 1;
    const currentMonthKey = `${today.getFullYear()}-${today.getMonth()}`;
    const lastCheck = localStorage.getItem('lastCheckMonth');

    if (isFirstOfMonth && lastCheck !== currentMonthKey) {
      const newNotification = {
        id: Date.now(),
        message: "Please Check all the Stocks properly",
        timestamp: today.toISOString(),
        read: false
      };
      
      setNotifications(prev => {
        const updated = [newNotification, ...prev];
        localStorage.setItem('notifications', JSON.stringify(updated));
        return updated;
      });
      localStorage.setItem('lastCheckMonth', currentMonthKey);
    }
  }, []);

  // Sync notifications to localStorage
  useEffect(() => {
    localStorage.setItem('notifications', JSON.stringify(notifications));
  }, [notifications]);

  const dismissNotification = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  useEffect(() => {
    localStorage.setItem('activeTab', activeTab);
  }, [activeTab]);

  useEffect(() => {
    localStorage.setItem('activeDept', activeDept);
  }, [activeDept]);

  useEffect(() => {
    localStorage.setItem('sidebarCollapsed', JSON.stringify(sidebarCollapsed));
  }, [sidebarCollapsed]);

  const confirmAddDept = async () => {
    const trimmed = newDeptName.trim();
    if (trimmed && !departments.some(d => d.name === trimmed)) {
      await addDepartment(trimmed);
      setActiveDept(trimmed);
    }
    setNewDeptName('');
    setAddingDept(false);
  };

  const cancelAddDept = () => {
    setNewDeptName('');
    setAddingDept(false);
  };

  const handleAddNew = () => { setEditingItem(null); setIsModalOpen(true); };
  const handleEdit   = (item) => { setEditingItem(item); setIsModalOpen(true); };

  const handleSave = async (formData) => {
    if (editingItem) await updateItem(editingItem.id, formData);
    else             await addItem(formData);
    setIsModalOpen(false);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this asset permanently?')) await deleteItem(id);
  };

  /* Page title map */
  const PAGE_TITLES = {
    dashboard: { label: 'Overview',  sub: 'Your inventory at a glance' },
    inventory: { label: 'Inventory', sub: 'Manage assets across all workspaces' },
  };

  const allDepts = ['All', ...departments];

  /* ── Loading screen ── */
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center gap-3">
        <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-200 animate-pulse">
          <Package className="text-white" size={24} />
        </div>
        <p className="text-slate-500 font-semibold text-sm tracking-wide">Loading system data…</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      {/* ── Sidebar ── */}
      <Sidebar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        collapsed={sidebarCollapsed}
        onCollapsedChange={setSidebarCollapsed}
      />

      {/* ── Main column, offset by sidebar width ── */}
      <div
        className={`min-h-screen flex flex-col transition-all duration-300 ease-in-out
          ${sidebarCollapsed ? 'lg:pl-[72px]' : 'lg:pl-72'}`}
      >
        {/* ── Top Navbar ── */}
        <nav className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-slate-200 px-4 sm:px-6 py-3">
          <div className="flex items-center justify-between">
            {/* Page breadcrumb */}
            <div className="pl-14 lg:pl-0">
              <h2 className="text-sm sm:text-base font-bold text-slate-900 leading-none">
                {PAGE_TITLES[activeTab].label}
              </h2>
              <p className="text-[10px] sm:text-[11px] text-slate-400 mt-0.5 font-medium">
                {PAGE_TITLES[activeTab].sub}
              </p>
            </div>

            {/* Right controls */}
            <div className="flex items-center gap-3">
              {/* Bell with Dropdown */}
              <div className="relative">
                <button 
                  onClick={() => setIsNotifyOpen(!isNotifyOpen)}
                  className={`relative p-2 rounded-lg transition-all ${isNotifyOpen ? 'bg-indigo-50 text-indigo-600' : 'text-slate-400 hover:text-indigo-600 hover:bg-indigo-50'}`}
                >
                  <Bell size={19} />
                  {notifications.length > 0 && (
                    <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white animate-pulse" />
                  )}
                </button>

                <AnimatePresence>
                  {isNotifyOpen && (
                    <>
                      <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setIsNotifyOpen(false)}
                        className="fixed inset-0 z-40"
                      />
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        className="absolute right-0 mt-3 w-80 bg-white rounded-2xl shadow-2xl border border-slate-200 z-50 overflow-hidden"
                      >
                        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                          <h4 className="font-bold text-slate-800 text-sm">Notifications</h4>
                          <span className="px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-700 text-[10px] font-black uppercase">
                            {notifications.length} Active
                          </span>
                        </div>
                        <div className="max-h-96 overflow-y-auto custom-scrollbar">
                          {notifications.length === 0 ? (
                            <div className="p-10 text-center flex flex-col items-center gap-3 opacity-40">
                              <Bell size={32} />
                              <p className="text-xs font-bold text-slate-500">No new alerts.</p>
                            </div>
                          ) : (
                            <div className="divide-y divide-slate-50">
                              {notifications.map(n => (
                                <div key={n.id} className="p-4 hover:bg-slate-50 transition-colors group flex items-start gap-3">
                                  <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                                    <Info size={16} />
                                  </div>
                                  <div className="flex-grow min-w-0">
                                    <p className="text-xs font-bold text-slate-800 leading-relaxed">{n.message}</p>
                                    <p className="text-[10px] text-slate-400 mt-1 uppercase font-black tracking-widest">
                                      System Alert · 1st of month
                                    </p>
                                  </div>
                                  <button 
                                    onClick={() => dismissNotification(n.id)}
                                    className="p-1.5 opacity-0 group-hover:opacity-100 hover:bg-slate-200 rounded-lg text-slate-400 hover:text-slate-600 transition-all"
                                  >
                                    <X size={12} />
                                  </button>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
              </div>

              {/* Divider */}
              <div className="h-7 w-px bg-slate-200" />

              {/* User pill */}
              <div className="flex items-center gap-2.5 cursor-pointer group">
                <div className="text-right hidden sm:block">
                  <p className="text-sm font-bold text-slate-800 leading-none">Administrator</p>
                </div>
                <div className="w-8 h-8 rounded-lg bg-slate-800 group-hover:bg-indigo-600 flex items-center justify-center text-white transition-colors">
                  <User size={16} />
                </div>
              </div>
            </div>
          </div>
        </nav>

        {/* ── Page Content ── */}
        <main className="flex-grow p-6 lg:p-8">

          {/* ══ DASHBOARD TAB ══ */}
          {activeTab === 'dashboard' && (
            <div className="space-y-8 animate-fade-in">
              {/* Greeting */}
              <div>
                <h3 className="text-2xl font-black text-slate-900">
                  {getGreeting()}, Admin 👋
                </h3>
                <p className="text-slate-500 text-sm mt-1">
                  Here's what's happening across your inventory ecosystem today.
                </p>
              </div>

              {/* Recent Assets */}
              <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-slate-900 text-base">Recent Assets</h4>
                    <p className="text-[11px] text-slate-400 mt-0.5 font-medium">
                      Last {Math.min(5, inventory.length)} registered items
                    </p>
                  </div>
                  <button
                    onClick={() => setActiveTab('inventory')}
                    className="text-xs font-bold text-indigo-600 hover:text-indigo-800 transition-colors flex items-center gap-1"
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
                    {inventory.slice(0, 5).map(item => (
                      <RecentRow key={item.id} item={item} />
                    ))}
                  </div>
                )}
              </div>

              {/* Quick-action cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <button
                  onClick={handleAddNew}
                  className="text-left p-5 bg-indigo-600 hover:bg-indigo-700 rounded-2xl text-white transition-all shadow-md shadow-indigo-200 active:scale-[0.98] group"
                >
                  <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center mb-3">
                    <Plus size={22} />
                  </div>
                  <p className="font-bold text-base">Add Stocks</p>
                  <p className="text-indigo-200 text-xs mt-0.5">Add a new item to the inventory</p>
                </button>

                <button
                  onClick={() => setActiveTab('inventory')}
                  className="text-left p-5 bg-white border border-slate-200 hover:border-indigo-200 hover:shadow-md rounded-2xl transition-all active:scale-[0.98] group"
                >
                  <div className="w-10 h-10 bg-slate-100 group-hover:bg-indigo-50 rounded-xl flex items-center justify-center mb-3 transition-colors">
                    <TrendingUp size={22} className="text-slate-500 group-hover:text-indigo-600 transition-colors" />
                  </div>
                  <p className="font-bold text-base text-slate-900">Browse Inventory</p>
                  <p className="text-slate-400 text-xs mt-0.5">
                    {inventory.length} assets across {new Set(inventory.map(i => i.department).filter(Boolean)).size} workspaces
                  </p>
                </button>
              </div>
            </div>
          )}

          {/* ══ INVENTORY TAB ══ */}
          {activeTab === 'inventory' && (
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
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-11 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 placeholder:text-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all shadow-sm"
                    />
                  </div>
                  <button
                    onClick={handleAddNew}
                    className="inline-flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 px-5 py-2.5 rounded-xl font-bold text-white text-sm transition-all shadow-md shadow-indigo-200 active:scale-95"
                  >
                    <Plus size={17} />
                    Add Stocks
                  </button>
                </div>
              </div>

              {/* Department pill tabs - Horizontal Scroll on Mobile */}
              <div className="relative group/scroll">
                <div className="flex gap-2 items-center overflow-x-auto pb-2 sm:pb-0 no-scrollbar sm:flex-wrap">
                  {/* "All" Pill */}
                  <button
                    onClick={() => setActiveDept('All')}
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
                        onClick={() => setActiveDept(dept.name)}
                        className={`pl-4 pr-8 py-2 rounded-xl text-xs font-bold tracking-wide transition-all whitespace-nowrap
                          ${activeDept === dept.name
                            ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200'
                            : 'bg-white border border-slate-200 text-slate-500 hover:border-indigo-300 hover:text-indigo-600'
                          }`}
                      >
                        {dept.name}
                      </button>
                      <button
                        onClick={(e) => { 
                          e.stopPropagation(); 
                          if(window.confirm(`Delete "${dept.name}" department?`)) deleteDepartment(dept.id); 
                        }}
                        className="absolute right-2 p-1 text-slate-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all rounded hover:bg-black/5"
                        title="Remove Department"
                      >
                        <X size={12} />
                      </button>
                    </div>
                  ))}

                  {/* Inline add-department */}
                  {addingDept ? (
                    <div className="flex items-center gap-1.5 animate-fade-in shrink-0">
                      <input
                        autoFocus
                        type="text"
                        value={newDeptName}
                        onChange={e => setNewDeptName(e.target.value)}
                        onKeyDown={e => {
                          if (e.key === 'Enter') confirmAddDept();
                          if (e.key === 'Escape') cancelAddDept();
                        }}
                        placeholder="Name..."
                        className="px-3 py-2 rounded-xl border border-indigo-300 bg-white text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-200 w-32"
                      />
                      <button
                        onClick={confirmAddDept}
                        className="p-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white transition-colors"
                      >
                        <Check size={14} />
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setAddingDept(true)}
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
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
              </div>
            </div>
          )}


        </main>

        {/* ── Footer ── */}
        <footer className="py-5 border-t border-slate-100 text-center">
          <p className="text-[11px] text-slate-400 font-medium">
            KITS Inventory · 2026
          </p>
        </footer>
      </div>

      {/* ── Modal ── */}
      <ItemModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
        editingItem={editingItem}
        departments={departments.map(d => d.name)}
      />
    </div>
  );
}

export default App;
