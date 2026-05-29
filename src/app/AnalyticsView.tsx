"use client";

import React from 'react';

export default function AnalyticsView({ projects }: { projects: any[] }) {
  const totalProjects = projects.length;
  
  const instagramCount = projects.filter(p => 
    p.description === 'Instagram' || p.description === 'Instagram Reel'
  ).length;
  
  const youtubeCount = projects.filter(p => 
    p.description === 'YouTube' || p.description === 'YouTube Main Video' || p.description === 'Shorts'
  ).length;
  
  const productionCount = projects.filter(p => 
    p.stage === 'Scripting' || p.stage === 'Filming' || p.stage === 'Editing'
  ).length;
  
  const readyCount = projects.filter(p => p.stage === 'Ready').length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-2">
        <h1 className="text-2xl font-bold text-gray-800">Analytics Summary</h1>
        <p className="text-sm text-gray-500">Real-time content distribution metrics</p>
      </div>

      {/* TOP SUMMARY WIDGETS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col justify-between">
          <span className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Total Active Content</span>
          <span className="text-4xl font-extrabold text-gray-800 mt-2">{totalProjects}</span>
          <div className="text-xs text-blue-600 font-medium mt-4">All pipeline items included</div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col justify-between">
          <span className="text-sm font-semibold text-gray-400 uppercase tracking-wider">In Production Pipeline</span>
          <span className="text-4xl font-extrabold text-amber-600 mt-2">{productionCount}</span>
          <div className="text-xs text-gray-500 mt-4">Scripting, Filming, or Editing stages</div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col justify-between">
          <span className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Ready to Publish</span>
          <span className="text-4xl font-extrabold text-green-600 mt-2">{readyCount}</span>
          <div className="text-xs text-gray-500 mt-4">Finalized assets waiting for upload</div>
        </div>
      </div>

      {/* PLATFORM BREAKDOWN */}
      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm mt-8">
        <h3 className="text-lg font-bold text-gray-800 mb-4 border-b pb-2">Platform Distribution</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Instagram Widget */}
          <div className="p-4 bg-pink-50 border border-pink-100 rounded-lg flex items-center justify-between">
            <div>
              <p className="text-sm font-bold text-pink-700">Instagram Content</p>
              <p className="text-xs text-pink-500 mt-1">Reels & Short Stories</p>
            </div>
            <span className="text-3xl font-black text-pink-700">{instagramCount}</span>
          </div>

          {/* YouTube Widget */}
          <div className="p-4 bg-red-50 border border-red-100 rounded-lg flex items-center justify-between">
            <div>
              <p className="text-sm font-bold text-red-700">YouTube Content</p>
              <p className="text-xs text-red-500 mt-1">Main Videos & Shorts</p>
            </div>
            <span className="text-3xl font-black text-red-700">{youtubeCount}</span>
          </div>

        </div>
      </div>
    </div>
  );
}