"use client";

import React, { useEffect, useState } from 'react';
import { createBrowserClient } from '@supabase/ssr';

const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default function Sidebar({ activeTab, setActiveTab, openModal }) {
  const [user, setUser] = useState(null);
  const [isOpen, setIsOpen] = useState(false);

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

  const handleNavClick = (key) => {
    setActiveTab(key);
    setIsOpen(false); // close sidebar on mobile after clicking
  };

  return (
    <>
      {/* HAMBURGER BUTTON - only visible on mobile */}
      <button
        onClick={() => setIsOpen(v => !v)}
        className="md:hidden fixed top-3 left-4 z-50 w-9 h-9 flex flex-col items-center justify-center space-y-1.5 bg-slate-900 rounded-lg shadow-lg"
      >
        <span className={`block w-5 h-0.5 bg-white transition-all duration-300 ${isOpen ? 'rotate-45 translate-y-2' : ''}`} />
        <span className={`block w-5 h-0.5 bg-white transition-all duration-300 ${isOpen ? 'opacity-0' : ''}`} />
        <span className={`block w-5 h-0.5 bg-white transition-all duration-300 ${isOpen ? '-rotate-45 -translate-y-2' : ''}`} />
      </button>

      {/* BACKDROP - mobile only, closes sidebar when clicked outside */}
      {isOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* SIDEBAR */}
      <div className={`
        fixed md:relative top-0 left-0 h-full z-40
        w-64 bg-slate-900 text-white flex flex-col p-4 shadow-xl
        transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        md:translate-x-0
      `}>

        {/* LOGO */}
        <div className="flex items-center space-x-3 px-2 py-3 border-b border-slate-800 mb-6 mt-2 md:mt-0">
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
              onClick={() => handleNavClick(item.key)}
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
            onClick={() => { openModal(); setIsOpen(false); }}
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
    </>
  );
}