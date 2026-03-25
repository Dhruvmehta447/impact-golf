import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
// Vite uses import.meta.env to grab the variables you set in Vercel
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
const { data } = await axios.post(`${API_URL}/api/auth/login`, { email, password });
      // 1. Save the token
      localStorage.setItem('token', data.token);
      
      // 2. Decode the token to check the role
      // JWT is 3 parts: Header.Payload.Signature. We want the Payload (index 1).
      const tokenPayload = JSON.parse(atob(data.token.split('.')[1]));
      const userRole = tokenPayload.role;

      // 3. Traffic Control: Redirect based on role
      if (userRole === 'Admin') {
        navigate('/admin');
      } else {
        navigate('/dashboard');
      }

    } catch (error) {
      alert(error.response?.data?.message || 'Login failed. Please check your credentials.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6 relative overflow-hidden font-sans">
      <div className="absolute top-1/4 -right-20 w-96 h-96 bg-indigo-600/20 rounded-full mix-blend-screen filter blur-[100px]"></div>
      <div className="absolute bottom-1/4 -left-20 w-96 h-96 bg-rose-600/10 rounded-full mix-blend-screen filter blur-[100px]"></div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="w-full max-w-md bg-slate-900/80 backdrop-blur-xl border border-slate-800 rounded-3xl p-8 shadow-2xl relative z-10">
        <div className="text-center mb-8">
          <Link to="/" className="text-2xl font-extrabold tracking-tighter text-white flex items-center justify-center gap-2 mb-6">
            <span className="text-indigo-500">✦</span> ImpactGolf
          </Link>
          <h2 className="text-2xl font-bold text-white mb-2">Welcome Back</h2>
          <p className="text-slate-400 text-sm">Sign in to manage your scores and impact.</p>
        </div>

        <form onSubmit={handleLogin} className="flex flex-col gap-5">
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Email Address</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none text-white placeholder-slate-600 transition-all" placeholder="john@example.com" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Password</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none text-white placeholder-slate-600 transition-all" placeholder="••••••••" />
          </div>
          <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} type="submit" className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3.5 rounded-xl transition-colors shadow-[0_0_20px_rgba(79,70,229,0.3)] mt-2">
            Log In
          </motion.button>
        </form>

        <p className="text-center text-slate-400 text-sm mt-8">
          Don't have an account? <Link to="/signup" className="text-indigo-400 font-semibold hover:text-indigo-300 transition-colors">Sign Up</Link>
        </p>
      </motion.div>
    </div>
  );
}