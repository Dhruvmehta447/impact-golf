import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';

export default function Profile() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [status, setStatus] = useState({ message: '', type: '' });
  const navigate = useNavigate();

useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem('token');
      if (!token) return navigate('/login');
      try {
        const { data } = await axios.get('http://localhost:5000/api/auth/profile', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setName(data.name);
        setEmail(data.email);
      } catch (err) {
        console.error("Profile Fetch Error:", err);
        alert("API Error: " + (err.response?.data?.message || err.message) + ". Check your backend terminal!");
        // We removed the navigate('/login') so it stops kicking you out!
      }
    };
    fetchProfile();
  }, [navigate]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    try {
      const { data } = await axios.put('http://localhost:5000/api/auth/profile', 
        { name, email, password }, 
        { headers: { Authorization: `Bearer ${token}` }}
      );
      setStatus({ message: data.message, type: 'success' });
      setPassword(''); // Clear password field after successful update
      
      // Clear success message after 3 seconds
      setTimeout(() => setStatus({ message: '', type: '' }), 3000);
    } catch (err) {
      setStatus({ message: err.response?.data?.message || 'Error updating profile', type: 'error' });
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 relative overflow-hidden font-sans">
      
      {/* Background Glow */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-600/10 rounded-full mix-blend-screen filter blur-[120px]"></div>
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-emerald-600/10 rounded-full mix-blend-screen filter blur-[120px]"></div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-lg bg-slate-900/80 backdrop-blur-xl border border-slate-800 rounded-3xl p-8 shadow-2xl relative z-10">
        
        <div className="flex items-center justify-between mb-8">
          <Link to="/dashboard" className="text-slate-400 hover:text-white transition-colors flex items-center gap-2 text-sm font-semibold">
            <span>←</span> Back to Dashboard
          </Link>
          <div className="w-10 h-10 rounded-full bg-indigo-500/20 flex items-center justify-center text-indigo-400 text-xl border border-indigo-500/30">
            👤
          </div>
        </div>

        <h2 className="text-3xl font-extrabold text-white mb-2 tracking-tight">Profile Settings</h2>
        <p className="text-slate-400 text-sm mb-8">Update your personal information and secure your account.</p>

        {status.message && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className={`p-4 rounded-xl mb-6 text-sm font-semibold border ${status.type === 'success' ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' : 'bg-red-500/10 border-red-500/30 text-red-400'}`}>
            {status.message}
          </motion.div>
        )}

        <form onSubmit={handleUpdate} className="flex flex-col gap-5">
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Full Name</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} required className="w-full p-3.5 bg-slate-950 border border-slate-800 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-white transition-all" />
          </div>
          
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Email Address</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full p-3.5 bg-slate-950 border border-slate-800 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-white transition-all" />
          </div>

          <div className="pt-4 border-t border-slate-800/50 mt-2">
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Change Password</label>
            <p className="text-[10px] text-slate-500 mb-2">Leave blank if you do not want to change your password.</p>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter new password" className="w-full p-3.5 bg-slate-950 border border-slate-800 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-white transition-all placeholder-slate-700" />
          </div>

          <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} type="submit" className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-4 rounded-xl transition-colors shadow-[0_0_20px_rgba(79,70,229,0.3)] mt-4">
            Save Changes
          </motion.button>
        </form>

      </motion.div>
    </div>
  );
}