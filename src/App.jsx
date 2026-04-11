import React, { useState, useEffect, useMemo, useCallback } from 'react';
import Sidebar from './components/Sidebar';
import ItemModal from './components/ItemModal';
import Navbar from './components/Navbar';
import DashboardTab from './components/DashboardTab';
import InventoryTab from './components/InventoryTab';
import StocksEngagedTab from './components/StocksEngagedTab';
import EngageModal from './components/EngageModal';

import { useInventory } from './hooks/useInventory';
import { useDepartments } from './hooks/useDepartments';
import { useEngagedStocks } from './hooks/useEngagedStocks';

import { Package } from 'lucide-react';

/* ─── Greeting helper — pure, no deps ─── */
function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  return 'Good evening';
}

/* ══════════════════════════════════════════ */
function App() {
  const { inventory, loading: invLoading, addItem, updateItem, deleteItem } = useInventory();
  const { departments, loading: deptLoading, addDepartment, updateDepartment, deleteDepartment } = useDepartments();
  const { engaged, loading: engLoading, engageStock, returnStock } = useEngagedStocks();

  /* ── UI State — initialised from localStorage once ── */
  const [activeTab, setActiveTab] = useState(
    () => localStorage.getItem('activeTab') || 'dashboard'
  );
  const [activeDept, setActiveDept] = useState(
    () => localStorage.getItem('activeDept') || 'All'
  );
  const [sidebarCollapsed, setSidebarCollapsed] = useState(
    () => JSON.parse(localStorage.getItem('sidebarCollapsed') || 'false')
  );
  const [notifications, setNotifications] = useState(
    () => JSON.parse(localStorage.getItem('notifications') || '[]')
  );

  const [isModalOpen, setIsModalOpen]   = useState(false);
  const [editingItem, setEditingItem]   = useState(null);
  const [addingDept, setAddingDept]     = useState(false);
  const [newDeptName, setNewDeptName]   = useState('');
  const [searchTerm, setSearchTerm]     = useState('');
  const [isNotifyOpen, setIsNotifyOpen] = useState(false);

  const [isEngageModalOpen, setIsEngageModalOpen] = useState(false);
  const [activeEngageItem, setActiveEngageItem]   = useState(null);

  const loading = invLoading || deptLoading || engLoading;

  /* ── Persist UI state to localStorage (consolidated) ── */
  useEffect(() => {
    localStorage.setItem('activeTab', activeTab);
    localStorage.setItem('activeDept', activeDept);
    localStorage.setItem('sidebarCollapsed', JSON.stringify(sidebarCollapsed));
    localStorage.setItem('notifications', JSON.stringify(notifications));
  }, [activeTab, activeDept, sidebarCollapsed, notifications]);

  /* ── Monthly stock-check notification (runs once on mount) ── */
  useEffect(() => {
    const today = new Date();
    if (today.getDate() !== 1) return; // bail early — not the 1st

    const currentMonthKey = `${today.getFullYear()}-${today.getMonth()}`;
    if (localStorage.getItem('lastCheckMonth') === currentMonthKey) return;

    setNotifications(prev => {
      const updated = [{
        id: Date.now(),
        message: "Please Check all the Stocks properly",
        timestamp: today.toISOString(),
        read: false
      }, ...prev];
      return updated;
    });
    localStorage.setItem('lastCheckMonth', currentMonthKey);
  }, []);

  /* ── Faulty Stock Check (Proactive Alert) ── */
  useEffect(() => {
    if (engLoading) return;

    const hasFaulty = engaged.some(item => item.type === 'faulty');
    if (!hasFaulty) return;

    const today = new Date();
    const todayStr = today.toDateString(); // e.g. "Mon Apr 13 2026"
    
    // Check if we already notified about faulty stock today
    if (localStorage.getItem('lastFaultyCheckDate') === todayStr) return;

    setNotifications(prev => {
      const updated = [{
        id: Date.now(),
        message: "⚠️ Please exchange the defaulty stock found in your inventory",
        timestamp: today.toISOString(),
        read: false
      }, ...prev];
      return updated;
    });
    
    localStorage.setItem('lastFaultyCheckDate', todayStr);
    setIsNotifyOpen(true); // Automatically open the notification tray so they see it 'right now'
  }, [engaged, engLoading]);

  /* ── Memoised derived values ── */
  const greeting = useMemo(() => getGreeting(), []);

  const recentItems = useMemo(() => inventory.slice(0, 5), [inventory]);

  const uniqueDeptCount = useMemo(
    () => new Set(inventory.map(i => i.department).filter(Boolean)).size,
    [inventory]
  );

  /* ── Stable callbacks ── */
  const dismissNotification = useCallback((id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  }, []);

  const handleAddNew = useCallback(() => {
    setEditingItem(null);
    setIsModalOpen(true);
  }, []);

  const handleEdit = useCallback((item) => {
    setEditingItem(item);
    setIsModalOpen(true);
  }, []);

  const handleSave = useCallback(async (formData) => {
    if (editingItem) await updateItem(editingItem.id, formData);
    else             await addItem(formData);
    setIsModalOpen(false);
  }, [editingItem, updateItem, addItem]);

  const handleDelete = useCallback(async (id) => {
    if (window.confirm('Delete this asset permanently?')) await deleteItem(id);
  }, [deleteItem]);

  const confirmAddDept = useCallback(async () => {
    const trimmed = newDeptName.trim();
    if (trimmed && !departments.some(d => d.name === trimmed)) {
      await addDepartment(trimmed);
      setActiveDept(trimmed);
    }
    setNewDeptName('');
    setAddingDept(false);
  }, [newDeptName, departments, addDepartment]);

  const cancelAddDept = useCallback(() => {
    setNewDeptName('');
    setAddingDept(false);
  }, []);

  const handleCloseModal = useCallback(() => setIsModalOpen(false), []);
  const toggleNotify    = useCallback(() => setIsNotifyOpen(o => !o), []);
  const closeNotify     = useCallback(() => setIsNotifyOpen(false), []);

  const handleDeleteDept = useCallback(async (id, name) => {
    if (window.confirm(`Delete "${name}" department?`)) {
      await deleteDepartment(id);
      if (activeDept === name) setActiveDept('All');
    }
  }, [deleteDepartment, activeDept]);

  const handleOpenEngage = useCallback((item) => {
    setActiveEngageItem(item);
    setIsEngageModalOpen(true);
  }, []);

  const handleCloseEngage = useCallback(() => {
    setIsEngageModalOpen(false);
    setActiveEngageItem(null);
  }, []);

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
        <Navbar 
          activeTab={activeTab}
          notifications={notifications}
          isNotifyOpen={isNotifyOpen}
          onToggleNotify={toggleNotify}
          onCloseNotify={closeNotify}
          onDismissNotification={dismissNotification}
        />

        {/* ── Page Content ── */}
        <main className="flex-grow p-6 lg:p-8">
          {activeTab === 'dashboard' ? (
            <DashboardTab 
              greeting={greeting}
              inventory={inventory}
              uniqueDeptCount={uniqueDeptCount}
              onAddNew={handleAddNew}
              onViewAll={() => setActiveTab('inventory')}
            />
          ) : activeTab === 'stocks-engaged' ? (
            <StocksEngagedTab 
              engaged={engaged} 
              onReturn={returnStock}
              departments={departments}
              onEngage={() => handleOpenEngage(null)}
              inventory={inventory}
            />
          ) : (
            <InventoryTab 
              inventory={inventory}
              departments={departments}
              activeDept={activeDept}
              searchTerm={searchTerm}
              addingDept={addingDept}
              newDeptName={newDeptName}
              onSearchChange={setSearchTerm}
              onAddNew={handleAddNew}
              onDeptChange={setActiveDept}
              onDeleteDept={handleDeleteDept}
              onUpdateDept={updateDepartment}
              onAddDeptClick={() => setAddingDept(true)}
              onNewDeptNameChange={setNewDeptName}
              onConfirmAddDept={confirmAddDept}
              onCancelAddDept={cancelAddDept}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onEngage={handleOpenEngage}
            />
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
        onClose={handleCloseModal}
        onSave={handleSave}
        editingItem={editingItem}
        departments={departments.map(d => d.name)}
      />

      <EngageModal
        isOpen={isEngageModalOpen}
        onClose={handleCloseEngage}
        item={activeEngageItem}
        onEngage={engageStock}
        inventory={inventory}
      />
    </div>
  );
}

export default App;
