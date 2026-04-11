import React from 'react';
import { Bell, User } from 'lucide-react';
import NotificationDropdown from './NotificationDropdown';

const PAGE_TITLES = {
  dashboard:        { label: 'Overview',       sub: 'Your inventory at a glance' },
  inventory:        { label: 'Inventory',      sub: 'Manage assets across all workspaces' },
  'stocks-engaged': { label: 'Stocks Engaged', sub: 'Monitoring active asset assignments' },
};

const Navbar = ({ 
  activeTab, 
  notifications, 
  isNotifyOpen, 
  onToggleNotify, 
  onCloseNotify, 
  onDismissNotification 
}) => {
  return (
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
              onClick={onToggleNotify}
              className={`relative p-2 rounded-lg transition-all ${isNotifyOpen ? 'bg-indigo-50 text-indigo-600' : 'text-slate-400 hover:text-indigo-600 hover:bg-indigo-50'}`}
            >
              <Bell size={19} />
              {notifications.length > 0 && (
                <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white animate-pulse" />
              )}
            </button>

            <NotificationDropdown 
              isOpen={isNotifyOpen}
              onClose={onCloseNotify}
              notifications={notifications}
              onDismiss={onDismissNotification}
            />
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
  );
};

export default React.memo(Navbar);
