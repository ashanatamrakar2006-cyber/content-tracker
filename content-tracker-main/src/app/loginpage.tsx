"use client"; // Ye zaruri hai kyunki hum hooks use kar rahe hain
import { useState } from 'react';
import { supabase } from '../../lib/supabase'; // Tumhari supabase file ka path
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      alert(error.message); // Agar password galat hai toh error dikhayega
    } else {
      router.push('/'); // Login hone par home page par bhej dega
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <form onSubmit={handleLogin} className="p-8 border rounded-lg shadow-md">
        <h1 className="text-2xl mb-4">Login</h1>
        <input 
          type="email" 
          placeholder="Email" 
          className="block w-full p-2 mb-4 border"
          onChange={(e) => setEmail(e.target.value)}
        />
        <input 
          type="password" 
          placeholder="Password" 
          className="block w-full p-2 mb-4 border"
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit" className="w-full bg-blue-500 text-white p-2">
          Login
        </button>
      </form>
    </div>
  );
}