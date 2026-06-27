"use client";

import React, { useEffect, useState } from 'react';
import { createBrowserClient } from '@supabase/ssr';

const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default function Sidebar({ activeTab, setActiveTab, openModal }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser();
      if (data?.user) setUser(data.user);
    };
    getUser();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = '/login';
  };

  const navItems = [
    { key: 'kanban',    icon: '📋', label: 'Kanban Board' },
    { key: 'analytics', icon: '📊', label: 'Analytics' },
    { key: 'calendar',  icon: '📅', label: 'Content Calendar' },
    { key: 'settings',  icon: '⚙️', label: 'Settings' },
  ];

  return (
    <div className="w-64 bg-slate-900 text-white flex flex-col p-4 h-full shadow-xl z-20">

      {/* LOGO */}
      <div className="flex items-center space-x-3 px-2 py-3 border-b border-slate-800 mb-6">
        <span className="text-xl">🎬</span>
        <span className="font-black tracking-wider text-lg text-blue-400">
          ContentTracker
        </span>
      </div>

      {/* NAV */}
      <nav className="space-y-1.5 flex-1">
        {navItems.map(item => (
          <button
            key={item.key}
            onClick={() => setActiveTab(item.key)}
            className={`w-full flex items-center space-x-3 px-4 py-3 text-sm font-medium rounded-xl transition duration-150 ${
              activeTab === item.key
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-slate-400 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <span>{item.icon}</span>
            <span>{item.label}</span>
          </button>
        ))}
      </nav>

      {/* BOTTOM */}
      <div className="space-y-3 mt-4">
        <button
          onClick={openModal}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold py-3 px-4 rounded-xl shadow-lg transition active:scale-95 flex items-center justify-center space-x-2"
        >
          <span>➕</span>
          <span>Create New Project</span>
        </button>

        {/* USER + LOGOUT */}
        <div className="border-t border-slate-800 pt-3 flex items-center justify-between px-1">
          <div className="flex items-center space-x-2 min-w-0">
            <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-xs font-bold shrink-0">
              {user?.email?.[0]?.toUpperCase() || 'U'}
            </div>
            <div className="min-w-0">
              <p className="text-xs font-semibold text-white truncate">
                {user?.email?.split('@')[0] || 'User'}
              </p>
              <p className="text-[10px] text-slate-500 truncate">
                {user?.email || ''}
              </p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            title="Logout"
            className="text-slate-500 hover:text-red-400 transition p-1.5 rounded-lg hover:bg-slate-800 text-lg"
          >
            🚪
          </button>
        </div>
      </div>
    </div>
  );
}