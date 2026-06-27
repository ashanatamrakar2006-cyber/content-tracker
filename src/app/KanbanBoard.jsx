"use client";

import React from 'react';

const COLUMNS = ['Idea', 'Scripting', 'Filming', 'Editing', 'Ready'];

export default function KanbanBoard({ projects, setProjects, onCardClick }) {
  
  const moveProject = async (e, id, currentStage) => {
    e.stopPropagation();
    const currentIndex = COLUMNS.indexOf(currentStage);
    if (currentIndex < COLUMNS.length - 1) {
      const nextStage = COLUMNS[currentIndex + 1];
      setProjects(projects.map(p => p.id === id ? { ...p, stage: nextStage } : p));
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
      {COLUMNS.map((column) => (
        <div key={column} className="bg-gray-100 p-4 rounded-xl min-h-130 border border-gray-200 shadow-inner">
          
          <div className="flex justify-between items-center mb-4 border-b border-gray-200 pb-2">
            <h3 className="font-bold text-gray-700 tracking-wide text-sm uppercase">{column}</h3>
            <span className="bg-gray-200 text-gray-600 text-xs font-bold px-2 py-0.5 rounded-full">
              {projects.filter((p) => p.stage === column).length}
            </span>
          </div>

          <div className="space-y-3">
            {projects
              .filter((p) => p.stage === column)
              .map((project) => (
                <div 
                  key={project.id} 
                  onClick={() => onCardClick(project)}
                  className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 hover:shadow-md hover:border-blue-400 cursor-pointer transition duration-200"
                >
                  <h4 className="font-semibold text-gray-800 text-sm leading-snug">{project.title}</h4>
                  
                  <div className="mt-3 flex items-center justify-between">
                    <span className="text-[10px] bg-blue-50 text-blue-600 font-bold px-2 py-0.5 rounded border border-blue-100 uppercase tracking-wider">
                      {project.description || 'Instagram'}
                    </span>
                    
                    {/* NEW LIVE LINK INDICATOR ACCENT */}
                    {project.live_url && (
                      <span className="text-[10px] bg-green-50 text-green-600 border border-green-200 px-1.5 py-0.5 rounded font-extrabold flex items-center space-x-1 animate-pulse">
                        <span>🌐 LIVE</span>
                      </span>
                    )}
                  </div>
                  
                  {column !== 'Ready' && (
                    <button 
                      onClick={(e) => moveProject(e, project.id, project.stage)}
                      className="mt-3 w-full text-center text-xs bg-gray-50 hover:bg-blue-600 hover:text-white text-gray-600 font-medium py-1.5 rounded border border-gray-200 transition duration-150"
                    >
                      Move Next →
                    </button>
                  )}
                </div>
              ))}
          </div>
        </div>
      ))}
    </div>
  );
}