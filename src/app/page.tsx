'use client';

import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';

type Project = {
  id: number;
  title: string;
  stage: string;
};

export default function Home() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [title, setTitle] = useState('');
  const [stage, setStage] = useState('Planning'); // Default stage
  const [loading, setLoading] = useState(false);

  // 1. Data Fetch karne ka function (Backend se Read karna)
  async function fetchProjects() {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .order('id', { ascending: false }); // Naye projects sabse upar dikhenge

    if (error) {
      console.error('Error fetching:', error);
    } else {
      setProjects(data || []);
    }
  }

  useEffect(() => {
    fetchProjects();
  }, []);

  // 2. Naya Project Add karne ka function (Backend me Write karna)
  async function handleAddProject(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) return alert('Project title zaroori hai!');

    setLoading(true);

    const { data, error } = await supabase
      .from('projects')
      .insert([{ title, stage }])
      .select();

    setLoading(false);

    if (error) {
      alert('Error adding project: ' + error.message);
    } else {
      setTitle(''); // Form khali karne ke liye
      fetchProjects(); // List ko refresh karne ke liye
    }
  }

  return (
    // Is line ko dhoodho aur aise poori badal do:
<div style={{ padding: '40px', fontFamily: 'sans-serif', maxWidth: '600px', margin: '0 auto', backgroundColor: '#ffffff', color: '#000000', minHeight: '100vh', borderRadius: '8px' }}>
      {/* --- FRONTEND FORM (Backend me data bhejne ke liye) --- */}
      <form onSubmit={handleAddProject} style={{ marginBottom: '30px', display: 'flex', gap: '10px', flexDirection: 'column' }}>
        <h3>Naya Project Jodein</h3>
        <input
          type="text"
          placeholder="Project ka naam (e.g., New Comedy Reel)"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          style={{ padding: '10px', fontSize: '16px', borderRadius: '5px', border: '1px solid #ccc' }}
        />
        
        <select 
          value={stage} 
          onChange={(e) => setStage(e.target.value)}
          style={{ padding: '10px', fontSize: '16px', borderRadius: '5px', border: '1px solid #ccc' }}
        >
          <option value="Planning">📝 Planning</option>
          <option value="Filming">🎥 Filming</option>
          <option value="Editing">💻 Editing</option>
          <option value="Uploaded">🚀 Uploaded</option>
        </select>

        <button 
          type="submit" 
          disabled={loading}
          style={{ padding: '10px', backgroundColor: '#0070f3', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontSize: '16px' }}
        >
          {loading ? 'Adding...' : 'Add Project'}
        </button>
      </form>

      <hr />

      {/* --- FRONTEND DISPLAY LIST --- */}
      <h3 style={{ marginTop: '20px' }}>Mere Projects</h3>
      {projects.length === 0 ? (
        <p>No projects found. Upar form se naya project add karein!</p>
      ) : (
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {projects.map((project) => (
            <li 
              key={project.id} 
              style={{ 
                padding: '15px', 
                border: '1px solid #eaeaea', 
                borderRadius: '5px', 
                marginBottom: '10px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                backgroundColor: '#fafafa',
                color: '#333'
              }}
            >
              <strong>{project.title}</strong>
              <span style={{ 
                padding: '5px 10px', 
                borderRadius: '15px', 
                fontSize: '12px', 
                backgroundColor: project.stage === 'Uploaded' ? '#e6fffa' : '#feebc8',
                color: project.stage === 'Uploaded' ? '#234e52' : '#744210'
              }}>
                {project.stage}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}