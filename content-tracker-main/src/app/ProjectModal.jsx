"use client";

import React, { useState } from 'react';

export default function ProjectModal({ onClose, onAdd }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('Instagram');
  const [publishDate, setPublishDate] = useState(new Date().toISOString().split('T')[0]); // Default aaj ki date

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return alert("Please enter a title!");
    
    onAdd({
      title,
      stage: 'Idea',
      description,
      publish_date: publishDate // Date bhej rahe hain
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center animate-fade-in">
      <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-md border border-gray-100">
        <h2 className="text-xl font-bold text-gray-800 mb-4">🚀 Create New Content Idea</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-600 mb-1">Content Title</label>
            <input 
              type="text" 
              value={title} 
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Funny Relatable Reel" 
              className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-600 mb-1">Platform</label>
            <select 
              value={description} 
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm bg-white"
            >
              <option value="Instagram">Instagram Reel</option>
              <option value="YouTube">YouTube Main Video</option>
            </select>
          </div>

          {/* NAYA DATE FIELD */}
          <div>
            <label className="block text-sm font-semibold text-gray-600 mb-1">Target Publish Date</label>
            <input 
              type="date" 
              value={publishDate} 
              onChange={(e) => setPublishDate(e.target.value)}
              className="w-full p-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm bg-white"
            />
          </div>

          <div className="flex justify-end space-x-3 pt-2 border-t border-gray-100">
            <button 
              type="button" 
              onClick={onClose} 
              className="px-4 py-2 text-sm font-medium text-gray-500 hover:bg-gray-100 rounded-lg transition"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="px-4 py-2 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow transition"
            >
              Add to Pipeline
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}