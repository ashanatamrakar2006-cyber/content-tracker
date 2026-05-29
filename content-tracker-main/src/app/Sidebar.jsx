"use client";

import React from 'react';

export default function Sidebar({ activeTab, setActiveTab, openModal }) {
  return (
    <div className="w-64 bg-slate-900 text-white flex flex-col justify-between p-4 h-full shadow-xl z-20">
      <div className="space-y-8">
        {/* LOGO */}
        <div className="flex items-center space-x-3 px-2 py-3 border-b border-slate-800">
          <span className="text-xl">🎬</span>
          <span className="font-black tracking-wider text-lg bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
            ContentTracker
          </span>
        </div>

        {/* NAVIGATION LINKS */}
        <nav className="space-y-1.5">
          <button
            onClick={() => setActiveTab('kanban')}
            className={`w-full flex items-center space-x-3 px-4 py-3 text-sm font-medium rounded-xl transition duration-150 ${
              activeTab === 'kanban' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <span>📋</span>
            <span>Kanban Board</span>
          </button>

          <button
            onClick={() => setActiveTab('analytics')}
            className={`w-full flex items-center space-x-3 px-4 py-3 text-sm font-medium rounded-xl transition duration-150 ${
              activeTab === 'analytics' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <span>📊</span>
            <span>Analytics Summary</span>
          </button>

          {/* NAYA TAB BUTTON */}
          <button
            onClick={() => setActiveTab('calendar')}
            className={`w-full flex items-center space-x-3 px-4 py-3 text-sm font-medium rounded-xl transition duration-150 ${
              activeTab === 'calendar' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <span>📅</span>
            <span>Content Calendar</span>
          </button>
        </nav>
      </div>

      {/* CREATE NEW PROJECT BUTTON */}
      <button
        onClick={openModal}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold py-3 px-4 rounded-xl shadow-lg hover:shadow-blue-500/20 transition transform active:scale-95 flex items-center justify-center space-x-2"
      >
        <span>➕</span>
        <span>Create New Project</span>
      </button>
    </div>
  );
}