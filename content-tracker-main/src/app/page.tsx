// @ts-nocheck
"use client";

import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import KanbanBoard from './KanbanBoard';
import ProjectModal from './ProjectModal';
import AnalyticsView from './AnalyticsView';
import ScriptWorkspace from './ScriptWorkspace';
import CalendarView from './CalendarView'; // Import New Calendar

export default function Page() {
  const [activeTab, setActiveTab] = useState('kanban'); 
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<any | null>(null);
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchProjects = async () => {
    setLoading(true);
    try {
      if (projects.length === 0) {
        // Default seed data with publish dates
        setProjects([
          { id: 1, title: 'New Comedy Reel', stage: 'Idea', description: 'Instagram', publish_date: '2026-05-15', script_link: 'HOOK: Abe yaar tum pagal ho kya? \nBODY: Reels vs Real life explanation.' },
          { id: 2, title: 'Tech Review Video', stage: 'Scripting', description: 'YouTube', publish_date: '2026-05-20', script_link: '' },
          { id: 3, title: 'Vlog Mini', stage: 'Editing', description: 'Instagram', publish_date: '2026-05-28', script_link: '' }
        ]);
      }
    } catch (error: any) {
      alert("Error: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const addProject = async (newProject: any) => {
    const projectToInsert = {
      title: newProject.title,
      stage: newProject.stage,
      description: newProject.description, 
      publish_date: newProject.publish_date, // Saving date field
      script_link: ''
    };
    setProjects([{ ...projectToInsert, id: Date.now() }, ...projects]);
    setIsModalOpen(false);
  };

  const updateScriptContent = (id: number, updatedFields: any) => {
    setProjects(projects.map(p => p.id === id ? { ...p, ...updatedFields } : p));
    if (selectedProject && selectedProject.id === id) {
      setSelectedProject({ ...selectedProject, ...updatedFields });
    }
  };

  return (
    <div className="flex h-screen bg-gray-100 font-sans text-gray-900 overflow-hidden relative">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} openModal={() => setIsModalOpen(true)} />

      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white h-16 border-b border-gray-200 flex items-center justify-between px-8 shadow-sm">
          <div className="flex items-center space-x-4">
            <span className="text-sm font-medium text-gray-500">Workspace:</span>
            <span className="bg-blue-50 text-blue-700 text-xs px-2.5 py-1 rounded-full font-semibold border border-blue-200">
              ⚡ Production Tracker
            </span>
          </div>
          <div className="flex items-center space-x-6">
            <div className="text-right">
              <p className="text-sm font-semibold text-gray-700">Creator Account</p>
              <p className="text-xs text-gray-400">Status: Active</p>
            </div>
            <div className="w-9 h-9 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold shadow-sm">C</div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-8 bg-gray-50">
          {loading ? (
            <div className="flex items-center justify-center h-64 text-gray-500 font-medium">Loading content pipeline...</div>
          ) : (
            <>
              {activeTab === 'kanban' && (
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <h1 className="text-2xl font-bold text-gray-800">Project Pipeline</h1>
                    <p className="text-sm text-gray-500">Total Projects: {projects.length}</p>
                  </div>
                  <KanbanBoard projects={projects} setProjects={setProjects} onCardClick={(proj) => setSelectedProject(proj)} />
                </div>
              )}
              
              {activeTab === 'analytics' && <AnalyticsView projects={projects} />}

              {/* NAYA CONDITION RENDER */}
              {activeTab === 'calendar' && (
                <CalendarView projects={projects} onCardClick={(proj) => setSelectedProject(proj)} />
              )}
            </>
          )}
        </main>
      </div>

      {isModalOpen && <ProjectModal onClose={() => setIsModalOpen(false)} onAdd={addProject} />}

      {selectedProject && (
        <ScriptWorkspace 
          project={selectedProject} 
          onClose={() => setSelectedProject(null)} 
          onSave={updateScriptContent} 
        />
      )}
    </div>
  );
}