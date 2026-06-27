"use client";

import { useState, useEffect, useRef } from 'react';
import { createBrowserClient } from '@supabase/ssr';
import Sidebar from '../Sidebar';
import KanbanBoard from '../KanbanBoard';
import AnalyticsView from '../AnalyticsView';
import CalendarView from '../CalendarView';
import ProjectModal from '../ProjectModal';
import ScriptWorkspace from '../ScriptWorkspace';

const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// ─── AI CHATBOT ────────────────────────────────────────────────────
function AiChatbot({ projects, onClose }: { projects: any[], onClose: () => void }) {
  const [messages, setMessages] = useState([
    { role: 'assistant', text: '👋 Hi! I am your Content AI. Ask me to write scripts, hooks, captions, or video ideas!' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;
    const userText = input;
    setMessages(prev => [...prev, { role: 'user', text: userText }]);
    setInput('');
    setLoading(true);

    try {
      const projectContext = projects.map(p =>
        `- "${p.title}" (${p.description}, Stage: ${p.stage})`
      ).join('\n');

      // FIX: Call our own Next.js API route instead of Anthropic directly
      // This prevents CORS errors and keeps the API key secure on the server
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'claude-sonnet-4-6',
          max_tokens: 1000,
          system: `You are a helpful content creation assistant for a YouTube and Instagram creator.
Their current projects:
${projectContext}
Help them write scripts, hooks, captions, video ideas, and content strategies. Be creative and concise.`,
          messages: [{ role: 'user', content: userText }]
        })
      });

      const data = await response.json();
      const reply = data.content?.[0]?.text || 'Sorry, could not get a response.';
      setMessages(prev => [...prev, { role: 'assistant', text: reply }]);
    } catch {
      setMessages(prev => [...prev, { role: 'assistant', text: 'Error connecting to AI. Please try again.' }]);
    }
    setLoading(false);
  };

  return (
    <div className="fixed bottom-24 right-6 w-96 h-125 bg-white border border-gray-200 rounded-2xl shadow-2xl z-50 flex flex-col overflow-hidden">
      {/* Header */}
      <div className="bg-blue-600 text-white px-4 py-3 flex items-center justify-between shrink-0">
        <div className="flex items-center space-x-2">
          <span className="text-lg">🤖</span>
          <div>
            <p className="font-bold text-sm">AI Content Assistant</p>
            <p className="text-[10px] text-blue-200">Powered by Claude</p>
          </div>
        </div>
        <button onClick={onClose} className="hover:text-blue-200 font-bold text-lg leading-none">✕</button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] px-3 py-2 rounded-2xl text-sm whitespace-pre-wrap leading-relaxed ${
              msg.role === 'user'
                ? 'bg-blue-600 text-white rounded-br-sm'
                : 'bg-white text-gray-800 border border-gray-200 rounded-bl-sm shadow-sm'
            }`}>
              {msg.text}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-white border border-gray-200 text-gray-400 px-3 py-2 rounded-2xl text-sm">
              ✍️ Thinking...
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input - FIX: Added text-gray-900 and placeholder:text-gray-400 so text is visible */}
      <div className="p-3 border-t border-gray-200 bg-white flex space-x-2 shrink-0">
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && !loading && sendMessage()}
          placeholder="Ask: Write a hook for my reel..."
          className="flex-1 p-2.5 border border-gray-300 rounded-xl text-sm text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-blue-500 focus:outline-none"
        />
        <button
          onClick={sendMessage}
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold px-4 rounded-xl transition"
        >
          ➤
        </button>
      </div>
    </div>
  );
}

// ─── NOTIFICATIONS PANEL ───────────────────────────────────────────
function NotificationsPanel({ projects, onClose }: { projects: any[], onClose: () => void }) {
  const today = new Date();

  const notifications = projects
    .filter(p => p.publish_date)
    .map(p => {
      const diff = Math.ceil(
        (new Date(p.publish_date).getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
      );
      return { ...p, daysLeft: diff };
    })
    .sort((a, b) => a.daysLeft - b.daysLeft);

  const getStyle = (days: number) => {
    if (days < 0)   return { badge: 'bg-red-100 text-red-700',      label: '🔴 Overdue!' };
    if (days === 0) return { badge: 'bg-orange-100 text-orange-700', label: '🟠 Due Today!' };
    if (days <= 3)  return { badge: 'bg-yellow-100 text-yellow-700', label: `🟡 ${days}d left` };
    if (days <= 7)  return { badge: 'bg-blue-100 text-blue-700',     label: `🔵 ${days}d left` };
    return           { badge: 'bg-gray-100 text-gray-600',           label: `⚪ ${days}d left` };
  };

  return (
    <>
      <div className="fixed inset-0 z-40" onClick={onClose} />
      <div className="fixed top-12 right-4 w-80 bg-white border border-gray-200 rounded-2xl shadow-2xl z-50 flex flex-col max-h-[70vh] overflow-hidden">
        <div className="px-4 py-3 border-b border-gray-200 flex items-center justify-between bg-gray-50 rounded-t-2xl">
          <div>
            <h2 className="font-bold text-gray-800 text-sm">🔔 Notifications</h2>
            <p className="text-[10px] text-gray-400">Upcoming deadlines</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 font-bold">✕</button>
        </div>

        <div className="overflow-y-auto p-3 space-y-2">
          {notifications.length === 0 ? (
            <div className="text-center text-gray-400 py-8">
              <p className="text-2xl mb-2">🎉</p>
              <p className="text-sm font-semibold">No deadlines yet!</p>
              <p className="text-xs mt-1">Add publish dates to projects.</p>
            </div>
          ) : (
            notifications.map(project => {
              const s = getStyle(project.daysLeft);
              return (
                <div key={project.id} className="bg-gray-50 border border-gray-200 rounded-xl p-3">
                  <div className="flex items-start justify-between gap-2">
                    <p className="font-semibold text-gray-800 text-sm leading-snug">{project.title}</p>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full whitespace-nowrap ${s.badge}`}>
                      {s.label}
                    </span>
                  </div>
                  <p className="text-xs text-gray-400 mt-1">
                    {project.description} • {project.stage} • {project.publish_date}
                  </p>
                </div>
              );
            })
          )}
        </div>
      </div>
    </>
  );
}

// ─── SEARCH OVERLAY ────────────────────────────────────────────────
function SearchOverlay({ projects, onCardClick, onClose }: {
  projects: any[],
  onCardClick: (p: any) => void,
  onClose: () => void
}) {
  const [query, setQuery] = useState('');

  const filtered = query.trim() === '' ? [] : projects.filter(p =>
    p.title?.toLowerCase().includes(query.toLowerCase()) ||
    p.description?.toLowerCase().includes(query.toLowerCase()) ||
    p.stage?.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-40 z-40" onClick={onClose} />
      <div className="fixed top-16 left-1/2 -translate-x-1/2 w-full max-w-lg z-50 px-4">
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-200">
          <div className="flex items-center px-4 py-3 border-b border-gray-200">
            <span className="text-gray-400 mr-3 text-lg">🔍</span>
            <input
              autoFocus
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              onKeyDown={e => e.key === 'Escape' && onClose()}
              placeholder="Search projects by title, platform, stage..."
              className="flex-1 text-sm text-gray-800 focus:outline-none placeholder-gray-400"
            />
            {query && (
              <button onClick={() => setQuery('')} className="text-gray-400 hover:text-gray-600 ml-2">✕</button>
            )}
          </div>

          <div className="max-h-80 overflow-y-auto">
            {query.trim() === '' ? (
              <div className="text-center text-gray-400 py-8 text-sm">
                Start typing to search your projects...
              </div>
            ) : filtered.length === 0 ? (
              <div className="text-center text-gray-400 py-8 text-sm">
                No results for "{query}"
              </div>
            ) : (
              filtered.map(project => (
                <div
                  key={project.id}
                  onClick={() => { onCardClick(project); onClose(); }}
                  className="flex items-center justify-between px-4 py-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-0 transition"
                >
                  <div>
                    <p className="font-semibold text-gray-800 text-sm">{project.title}</p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {project.description} • {project.publish_date || 'No date'}
                    </p>
                  </div>
                  <span className="text-xs bg-blue-50 text-blue-600 border border-blue-100 px-2 py-0.5 rounded font-bold uppercase ml-4">
                    {project.stage}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </>
  );
}

// ─── SETTINGS VIEW ─────────────────────────────────────────────────
function SettingsView({ projects }: { projects: any[] }) {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data?.user) setUser(data.user);
    });
  }, []);

  return (
    <div className="max-w-xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">⚙️ Settings</h1>
        <p className="text-sm text-gray-400 mt-1">Manage your account and preferences</p>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl p-5 space-y-4">
        <h2 className="text-xs font-bold text-gray-500 uppercase tracking-wider border-b pb-2">Account</h2>
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center text-white text-lg font-bold">
            {user?.email?.[0]?.toUpperCase() || 'U'}
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-800">{user?.email?.split('@')[0] || 'User'}</p>
            <p className="text-xs text-gray-400">{user?.email || ''}</p>
            <span className="text-[10px] bg-green-100 text-green-600 font-bold px-2 py-0.5 rounded-full">Active</span>
          </div>
        </div>
        <button
          onClick={async () => { await supabase.auth.signOut(); window.location.href = '/login'; }}
          className="w-full bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 text-sm font-bold py-2.5 rounded-lg transition"
        >
          🚪 Logout
        </button>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl p-5 space-y-3">
        <h2 className="text-xs font-bold text-gray-500 uppercase tracking-wider border-b pb-2">Project Stats</h2>
        {[
          { label: 'Total Projects',   value: projects.length,                                                                  color: 'text-gray-800' },
          { label: 'Ideas',            value: projects.filter(p => p.stage === 'Idea').length,                                  color: 'text-blue-600' },
          { label: 'In Production',    value: projects.filter(p => ['Scripting','Filming','Editing'].includes(p.stage)).length, color: 'text-amber-600' },
          { label: 'Ready to Publish', value: projects.filter(p => p.stage === 'Ready').length,                                color: 'text-green-600' },
        ].map(stat => (
          <div key={stat.label} className="flex justify-between items-center text-sm">
            <span className="text-gray-500">{stat.label}</span>
            <span className={`font-bold text-base ${stat.color}`}>{stat.value}</span>
          </div>
        ))}
      </div>

      <div className="bg-white border border-gray-200 rounded-xl p-5 space-y-3">
        <h2 className="text-xs font-bold text-gray-500 uppercase tracking-wider border-b pb-2">App Info</h2>
        {[
          { label: 'App Name', value: 'ContentTracker' },
          { label: 'Version',  value: '1.0.0' },
          { label: 'Stack',    value: 'Next.js + Supabase' },
          { label: 'AI',       value: 'Claude (Anthropic)' },
        ].map(item => (
          <div key={item.label} className="flex justify-between text-sm">
            <span className="text-gray-500">{item.label}</span>
            <span className="font-semibold text-gray-800">{item.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── MAIN DASHBOARD ────────────────────────────────────────────────
export default function DashboardPage() {
  const [activeTab, setActiveTab]     = useState('kanban');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [projects, setProjects]       = useState<any[]>([]);
  const [selectedProject, setSelectedProject] = useState<any>(null);
  const [showScript, setShowScript]           = useState(false);
  const [showAI, setShowAI]                   = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showSearch, setShowSearch]           = useState(false);

  const notifCount = projects.filter(p => {
    if (!p.publish_date) return false;
    const diff = Math.ceil(
      (new Date(p.publish_date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
    );
    return diff <= 7;
  }).length;

  useEffect(() => {
    const fetchProjects = async () => {
      const result = await supabase.from('projects').select('*');
      if (!result.error && result.data) setProjects(result.data);
    };
    fetchProjects();
  }, []);

  const handleCardClick = (project: any) => {
    setSelectedProject(project);
    setShowScript(true);
  };

  const handleScriptSave = async (id: string, updates: any) => {
    const result = await supabase.from('projects').update(updates).eq('id', id).select();
    if (!result.error && result.data) {
      setProjects(prev => prev.map(p => p.id === id ? { ...p, ...updates } : p));
    }
  };

  const handleAddProject = async (newProject: any) => {
    const result = await supabase.from('projects').insert([newProject]).select();
    if (!result.error && result.data) {
      setProjects(prev => [...prev, ...result.data]);
      setIsModalOpen(false);
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'kanban':
        return <KanbanBoard projects={projects} setProjects={setProjects} onCardClick={handleCardClick} />;
      case 'analytics':
        return <AnalyticsView projects={projects} />;
      case 'calendar':
        return <CalendarView projects={projects} onCardClick={handleCardClick} />;
      case 'settings':
        return <SettingsView projects={projects} />;
      default:
        return <KanbanBoard projects={projects} setProjects={setProjects} onCardClick={handleCardClick} />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">

      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} openModal={() => setIsModalOpen(true)} />

      <div className="flex-1 flex flex-col overflow-hidden">

        {/* TOP BAR */}
        <div className="h-12 bg-white border-b border-gray-200 flex items-center justify-end px-6 gap-3 shrink-0">

          {/* Search Icon */}
          <button
            onClick={() => setShowSearch(true)}
            className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-500 hover:bg-gray-100 hover:text-blue-600 transition"
            title="Search"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
            </svg>
          </button>

          {/* Bell Icon */}
          <button
            onClick={() => setShowNotifications(v => !v)}
            className="relative w-8 h-8 flex items-center justify-center rounded-lg text-gray-500 hover:bg-gray-100 hover:text-blue-600 transition"
            title="Notifications"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6 6 0 10-12 0v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
            {notifCount > 0 && (
              <span className="absolute top-0.5 right-0.5 bg-red-500 text-white text-[8px] font-bold w-3.5 h-3.5 rounded-full flex items-center justify-center">
                {notifCount}
              </span>
            )}
          </button>

        </div>

        {/* PAGE CONTENT */}
        <main className="flex-1 overflow-auto p-6">
          {renderContent()}
        </main>
      </div>

      {/* MODALS & OVERLAYS */}

      {isModalOpen && (
        <ProjectModal onClose={() => setIsModalOpen(false)} onAdd={handleAddProject} />
      )}

      {showScript && selectedProject && (
        <ScriptWorkspace
          project={selectedProject}
          onClose={() => { setShowScript(false); setSelectedProject(null); }}
          onSave={handleScriptSave}
        />
      )}

      {showNotifications && (
        <NotificationsPanel projects={projects} onClose={() => setShowNotifications(false)} />
      )}

      {showSearch && (
        <SearchOverlay
          projects={projects}
          onCardClick={handleCardClick}
          onClose={() => setShowSearch(false)}
        />
      )}

      {/* AI FLOATING BUTTON */}
      <button
        onClick={() => setShowAI(v => !v)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-xl flex items-center justify-center text-2xl z-50 transition"
        title="AI Assistant"
      >
        🤖
      </button>

      {/* AI CHATBOT WIDGET */}
      {showAI && (
        <AiChatbot projects={projects} onClose={() => setShowAI(false)} />
      )}

    </div>
  );
}