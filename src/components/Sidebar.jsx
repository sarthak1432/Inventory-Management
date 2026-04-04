import React, { useState } from 'react';
import {
  BarChart3,
  Package,
  LogOut,
  Menu,
  X,
  ChevronLeft,
  ChevronRight,
  Users,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import kitsLogo from '../assets/kits_logo.jpg';

const SidebarItem = ({ icon: Icon, label, active, onClick, collapsed }) => (
  <button
    onClick={onClick}
    title={collapsed ? label : undefined}
    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group mb-1
      ${active
        ? 'bg-indigo-600/15 text-indigo-400 border border-indigo-500/20 shadow-sm'
        : 'text-slate-400 hover:bg-white/5 hover:text-slate-200 border border-transparent'
      }`}
  >
    <Icon
      size={19}
      className={`shrink-0 ${active ? 'text-indigo-400' : 'text-slate-500 group-hover:text-slate-200 transition-colors'}`}
    />
    {!collapsed && (
      <span className="font-semibold text-sm tracking-wide truncate">{label}</span>
    )}
  </button>
);

const Sidebar = ({ activeTab, onTabChange, collapsed, onCollapsedChange }) => {
  const [mobileOpen, setMobileOpen] = useState(false);

  const toggleCollapse = () => {
    onCollapsedChange?.(!collapsed);
  };

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { id: 'inventory', label: 'Inventory', icon: Package   },
  ];

  return (
    <>
      {/* Mobile toggle */}
      <div className="lg:hidden fixed top-3 left-4 z-[60]">
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className={`p-3 rounded-2xl shadow-xl transition-all duration-300 active:scale-90
            ${mobileOpen 
              ? 'bg-white text-slate-900 shadow-white/10' 
              : 'bg-indigo-600 text-white shadow-indigo-900/40'}`}
        >
          {mobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Overlay (mobile) */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="lg:hidden fixed inset-0 bg-slate-900/40 z-50 backdrop-blur-md"
            onClick={() => setMobileOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar panel */}
      <aside
        className={`fixed top-0 left-0 h-screen z-[55]
          bg-slate-900 border-r border-white/5
          transition-all duration-300 ease-in-out flex flex-col
          ${collapsed ? 'w-[72px]' : 'w-72'}
          ${mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        {/* Logo */}
        <div className={`flex items-center gap-3 px-4 py-6 mb-2 ${collapsed ? 'justify-center' : ''}`}>
          <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center p-1.5 shadow-lg shadow-black/10 shrink-0 overflow-hidden border border-white/10 group">
             <img 
               src={kitsLogo} 
               alt="KITS Logo" 
               className="w-full h-full object-contain transform group-hover:scale-110 transition-transform duration-500" 
             />
          </div>
          {!collapsed && (
            <div className="animate-fade-in overflow-hidden">
              <h1 className="text-base font-black tracking-tight leading-none text-white uppercase">
                KITS <span className="text-indigo-400 font-extrabold">Inventory</span>
              </h1>
              <p className="text-[9px] text-slate-500 font-bold tracking-widest uppercase mt-1">
                Management System
              </p>
            </div>
          )}
        </div>

        {/* Divider */}
        <div className="mx-4 h-px bg-white/5 mb-4" />

        {/* Nav */}
        <nav className="flex-grow px-3">
          {!collapsed && (
            <p className="text-[9px] text-slate-600 font-bold tracking-widest uppercase mb-3 px-2">
              Main Menu
            </p>
          )}
          {menuItems.map(item => (
            <SidebarItem
              key={item.id}
              label={item.label}
              icon={item.icon}
              active={activeTab === item.id}
              collapsed={collapsed}
              onClick={() => {
                onTabChange(item.id);
                setMobileOpen(false);
              }}
            />
          ))}
        </nav>

        {/* User section */}
        <div className="px-3 pb-4 mt-auto">
          <div className="mx-0 h-px bg-white/5 mb-4" />
          <div className={`flex items-center gap-3 px-2 py-2 rounded-xl mb-2 ${collapsed ? 'justify-center' : ''}`}>
            <div className="w-8 h-8 rounded-lg bg-slate-700 border border-white/10 flex items-center justify-center shrink-0">
              <Users size={15} className="text-slate-400" />
            </div>
            {!collapsed && (
              <div className="overflow-hidden animate-fade-in">
                <p className="text-sm font-bold text-slate-200 leading-none truncate">Administrator</p>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                  <span className="text-[9px] text-emerald-500/80 font-bold tracking-widest uppercase">Online</span>
                </div>
              </div>
            )}
          </div>

          <button
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-500 hover:text-red-400 hover:bg-red-500/5 border border-transparent hover:border-red-500/10 transition-all ${collapsed ? 'justify-center' : ''}`}
          >
            <LogOut size={17} className="shrink-0" />
            {!collapsed && <span className="text-sm font-semibold">Sign Out</span>}
          </button>
        </div>

        {/* Collapse toggle (desktop only) */}
        <button
          onClick={toggleCollapse}
          className="hidden lg:flex absolute -right-3 top-[72px] w-6 h-6 bg-slate-700 hover:bg-indigo-600 rounded-full items-center justify-center text-slate-300 shadow-lg border border-white/10 transition-all"
        >
          {collapsed ? <ChevronRight size={13} /> : <ChevronLeft size={13} />}
        </button>
      </aside>
    </>
  );
};

export default Sidebar;
