"use client";

import React, { useState, useEffect } from 'react';

export default function ScriptWorkspace({ project, onClose, onSave }) {
  const [scriptText, setScriptText] = useState('');
  const [title, setTitle] = useState('');
  const [liveLink, setLiveLink] = useState(''); // New State for Link
  const [notes, setNotes] = useState('');       // New State for Notes

  useEffect(() => {
    if (project) {
      setScriptText(project.script_link || '');
      setTitle(project.title || '');
      setLiveLink(project.live_url || '');     // Load saved link
      setNotes(project.editor_notes || '');    // Load saved notes
    }
  }, [project]);

  const handleSave = () => {
    onSave(project.id, { 
      title, 
      script_link: scriptText,
      live_url: liveLink,
      editor_notes: notes
    });
    alert("Project details updated successfully!");
  };

  return (
    <div className="fixed inset-y-0 right-0 w-full max-w-xl bg-white shadow-2xl z-50 flex flex-col border-l border-gray-200">
      
      {/* HEADER */}
      <div className="p-6 border-b border-gray-200 flex items-center justify-between bg-gray-50">
        <div>
          <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full uppercase border border-blue-100">
            ✍️ Content Workspace
          </span>
          <input 
            type="text" 
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="text-xl font-bold text-gray-800 mt-2 bg-transparent border-b border-transparent hover:border-gray-300 focus:border-blue-500 focus:outline-none w-full py-1"
          />
        </div>
        <button onClick={onClose} className="text-gray-400 hover:text-gray-600 bg-gray-100 hover:bg-gray-200 p-2 rounded-full transition">✖</button>
      </div>

      {/* BODY WORKSPACE */}
      <div className="flex-1 p-6 flex flex-col space-y-5 overflow-y-auto">
        
        {/* SCRIPT AREA */}
        <div className="flex flex-col flex-1 min-h-[200px]">
          <label className="block text-sm font-bold text-gray-600 mb-2">Video Script / Hook / Captions:</label>
          <textarea
            value={scriptText}
            onChange={(e) => setScriptText(e.target.value)}
            placeholder="Write your creative lines here..."
            className="w-full flex-1 p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none font-mono text-sm bg-gray-50 resize-none"
          />
        </div>

        {/* NAYA SECTION: LIVE POST LINKS & NOTES */}
        <div className="border-t border-gray-200 pt-4 space-y-4">
          <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wider">🔗 Distribution & Archive</h3>
          
          <div>
            <label className="block text-xs font-bold text-gray-500 mb-1">Live Video / Reel URL:</label>
            <input 
              type="url"
              value={liveLink}
              onChange={(e) => setLiveLink(e.target.value)}
              placeholder="e.g., https://www.instagram.com/reel/... or YouTube link"
              className="w-full p-2.5 border border-gray-300 rounded-lg text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none bg-gray-50 font-mono text-blue-600"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-500 mb-1">Creator Production Notes:</label>
            <input 
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g., Thumbnail updated, Audio credits added, Collab pending..."
              className="w-full p-2.5 border border-gray-300 rounded-lg text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none bg-gray-50"
            />
          </div>
        </div>

      </div>

      {/* BOTTOM ACTIONS */}
      <div className="p-4 border-t border-gray-200 bg-gray-50 flex justify-end space-x-3">
        <button onClick={onClose} className="px-5 py-2 text-sm font-medium text-gray-600 hover:bg-gray-200 rounded-lg transition">Close</button>
        <button onClick={handleSave} className="px-6 py-2 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow transition">Save All Changes</button>
      </div>
    </div>
  );
}