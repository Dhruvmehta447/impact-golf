import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';

// Use production URL if available, otherwise fallback to local dev server
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export default function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [claims, setClaims] = useState([]);
  const [draws, setDraws] = useState([]);
  const [charities, setCharities] = useState([]);
  const [newCharityName, setNewCharityName] = useState('');
  const [stats, setStats] = useState({ totalUsers: 0, activeSubscribers: 0, totalCharities: 0, totalPrizePool: 0 });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return navigate('/login');

    const fetchData = async () => {
      try {
        const userRes = await axios.get(`${API_URL}/api/admin/users`, { headers: { Authorization: `Bearer ${token}` }});
        setUsers(userRes.data);
        
        const claimRes = await axios.get(`${API_URL}/api/claims/all`, { headers: { Authorization: `Bearer ${token}` }});
        setClaims(claimRes.data);

        const drawRes = await axios.get(`${API_URL}/api/draws/history`, { headers: { Authorization: `Bearer ${token}` }});
        setDraws(drawRes.data);

        const charityRes = await axios.get(`${API_URL}/api/charities`);
        setCharities(charityRes.data);

        const statsRes = await axios.get(`${API_URL}/api/admin/stats`, { headers: { Authorization: `Bearer ${token}` }});
        setStats(statsRes.data);

      } catch (err) { setError('Access denied. Admin privileges required.'); }
    };
    fetchData();
  }, [navigate]);

  const updateClaim = async (claimId, newStatus, newPaymentStatus) => {
    const token = localStorage.getItem('token');
    try {
      await axios.put(`${API_URL}/api/claims/${claimId}/update`, 
        { status: newStatus, paymentStatus: newPaymentStatus }, 
        { headers: { Authorization: `Bearer ${token}` }}
      );
      const claimRes = await axios.get(`${API_URL}/api/claims/all`, { headers: { Authorization: `Bearer ${token}` }});
      setClaims(claimRes.data);
    } catch (err) { alert('Error updating claim.'); }
  };

  const executeDraw = async () => {
    if(!window.confirm("Are you sure? This will generate official winning numbers and update the global prize pool.")) return;
    const token = localStorage.getItem('token');
    try {
      await axios.post(`${API_URL}/api/draws/run`, {}, { headers: { Authorization: `Bearer ${token}` }});
      alert('Draw executed successfully!');
      window.location.reload(); 
    } catch (err) { alert('Error executing draw.'); }
  };

  const handleAddCharity = async (e) => {
    e.preventDefault();
    if (!newCharityName) return;
    const token = localStorage.getItem('token');
    try {
      await axios.post(`${API_URL}/api/charities/add`, { name: newCharityName }, { headers: { Authorization: `Bearer ${token}` }});
      setNewCharityName('');
      const charityRes = await axios.get(`${API_URL}/api/charities`);
      setCharities(charityRes.data);
    } catch (err) { alert('Error adding charity.'); }
  };

  const handleDeleteCharity = async (id) => {
    if(!window.confirm("Remove this charity from the platform?")) return;
    const token = localStorage.getItem('token');
    try {
      await axios.delete(`${API_URL}/api/charities/${id}`, { headers: { Authorization: `Bearer ${token}` }});
      setCharities(charities.filter(c => c._id !== id));
    } catch (err) { alert('Error deleting charity.'); }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  if (error) return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center">
      <div className="p-10 text-center bg-red-500/10 border border-red-500/30 rounded-2xl text-red-400 font-bold text-2xl shadow-[0_0_30px_rgba(239,68,68,0.1)]">{error}</div>
    </div>
  );

  const containerFade = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.1 } } };
  const itemFade = { hidden: { opacity: 0, y: 15 }, show: { opacity: 1, y: 0, transition: { duration: 0.4 } } };

  return (
    <div className="min-h-screen bg-slate-950 p-6 md:p-12 font-sans text-slate-300">
      
      {/* HEADER */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">⚙️ Admin Control Center</h1>
          <p className="text-slate-500 mt-1 text-sm md:text-base">Manage users, draws, charities, and verify winners.</p>
        </div>
        <button onClick={handleLogout} className="bg-slate-900 border border-slate-800 text-slate-300 px-5 py-2 rounded-lg hover:bg-slate-800 transition-colors shadow-sm font-medium w-full md:w-auto">
          Log Out
        </button>
      </motion.div>

      {/* STATS ROW */}
      <motion.div variants={containerFade} initial="hidden" animate="show" className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-8">
        <motion.div variants={itemFade} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-lg">
          <p className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">Total Users</p>
          <h4 className="text-3xl font-black text-white">{stats.totalUsers}</h4>
        </motion.div>
        
        <motion.div variants={itemFade} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-lg relative overflow-hidden">
          <div className="absolute -right-4 -bottom-4 w-16 h-16 bg-indigo-500/20 rounded-full blur-xl"></div>
          <p className="text-indigo-400 text-xs font-bold uppercase tracking-wider mb-1 relative z-10">Pro Subscribers</p>
          <h4 className="text-3xl font-black text-white relative z-10">{stats.activeSubscribers}</h4>
        </motion.div>

        <motion.div variants={itemFade} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-lg relative overflow-hidden">
          <div className="absolute -right-4 -bottom-4 w-16 h-16 bg-emerald-500/20 rounded-full blur-xl"></div>
          <p className="text-emerald-400 text-xs font-bold uppercase tracking-wider mb-1 relative z-10">Total Prize Pool</p>
          <h4 className="text-3xl font-black text-white relative z-10">${stats.totalPrizePool.toLocaleString()}</h4>
        </motion.div>

        <motion.div variants={itemFade} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-lg">
          <p className="text-rose-400 text-xs font-bold uppercase tracking-wider mb-1">Impact Partners</p>
          <h4 className="text-3xl font-black text-white">{stats.totalCharities}</h4>
        </motion.div>
      </motion.div>

      {/* MAIN GRID */}
      <motion.div variants={containerFade} initial="hidden" animate="show" className="max-w-7xl mx-auto grid grid-cols-1 xl:grid-cols-3 gap-8">
        
        {/* DRAW ENGINE */}
        <motion.div variants={itemFade} className="bg-gradient-to-br from-indigo-950 to-slate-900 rounded-2xl shadow-lg border border-indigo-500/20 p-6 md:p-8 relative overflow-hidden xl:col-span-3">
          <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl"></div>
          
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 relative z-10 gap-4">
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <span className="text-indigo-400">🎲</span> The Draw Engine
            </h3>
            <button onClick={executeDraw} className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 px-6 rounded-xl transition-all shadow-[0_0_20px_rgba(79,70,229,0.4)] flex items-center gap-2 group">
              <span className="group-hover:animate-spin">⚙️</span> Execute Monthly Draw
            </button>
          </div>

          <div className="bg-slate-950/50 border border-slate-800 rounded-xl p-5 relative z-10">
            <h4 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4">Draw History</h4>
            {draws.length === 0 ? <p className="text-slate-500 italic">No draws have been executed yet.</p> : (
              <div className="space-y-3">
                {draws.map((draw) => (
                  <div key={draw._id} className="flex flex-col md:flex-row justify-between items-start md:items-center p-4 bg-slate-900 rounded-lg border border-slate-800 gap-4">
                    <div>
                      <span className="text-xs text-slate-500 font-bold uppercase">{new Date(draw.dateRun).toLocaleDateString()}</span>
                      <div className="text-emerald-400 font-black text-xl mt-1">${draw.totalPrizePool.toLocaleString()} Pool</div>
                    </div>
                    <div className="flex gap-2">
                      {draw.winningNumbers.map((num, idx) => (
                        <div key={idx} className="w-10 h-10 rounded-full bg-slate-800 border border-indigo-500/30 flex items-center justify-center text-white font-bold shadow-inner">
                          {num}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </motion.div>

        {/* CHARITY MANAGEMENT */}
        <motion.div variants={itemFade} className="bg-slate-900 rounded-2xl shadow-lg border border-slate-800 p-6 md:p-8 xl:col-span-1">
          <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
            <span className="text-rose-400">❤️</span> Impact Partners
          </h3>
          
          <form onSubmit={handleAddCharity} className="flex gap-2 mb-6">
            <input type="text" placeholder="New Charity Name" value={newCharityName} onChange={(e) => setNewCharityName(e.target.value)} required className="w-full p-2.5 text-sm bg-slate-950 border border-slate-800 rounded-lg focus:ring-2 focus:ring-rose-500 outline-none text-white placeholder-slate-600" />
            <button type="submit" className="bg-rose-600 hover:bg-rose-500 text-white font-bold px-4 rounded-lg transition-colors">+</button>
          </form>

          <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
            {charities.length === 0 ? <p className="text-slate-500 text-sm">No charities added yet.</p> : (
              charities.map((charity) => (
                <div key={charity._id} className="flex justify-between items-center p-3 bg-slate-950 rounded-lg border border-slate-800 group">
                  <span className="text-sm font-medium text-slate-300">{charity.name}</span>
                  <button onClick={() => handleDeleteCharity(charity._id)} className="text-slate-600 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all">
                    ✖
                  </button>
                </div>
              ))
            )}
          </div>
        </motion.div>

        {/* WINNER VERIFICATION */}
        <motion.div variants={itemFade} className="bg-slate-900 rounded-2xl shadow-lg border border-slate-800 p-6 md:p-8 xl:col-span-1">
          <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
            <span className="text-emerald-400">🏆</span> Verification
          </h3>
          
          {claims.length === 0 ? <p className="text-slate-500 italic">No pending claims.</p> : (
            <div className="space-y-5 max-h-[300px] overflow-y-auto pr-2">
              {claims.map(claim => (
                <div key={claim._id} className="border border-slate-800 p-4 rounded-xl bg-slate-950/50">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <p className="font-bold text-slate-200 text-sm">{claim.userName}</p>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <span className={`text-[9px] uppercase font-bold px-2 py-0.5 rounded ${claim.status === 'Approved' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'}`}>{claim.status}</span>
                    </div>
                  </div>
                  
                  <div className="mb-3 h-24 overflow-hidden rounded border border-slate-800 bg-slate-950 flex justify-center">
                    {claim.proofImage && <img src={claim.proofImage} alt="Proof" className="object-cover h-full w-full opacity-80" />}
                  </div>

                  <div className="flex gap-2">
                    {claim.status !== 'Approved' && <button onClick={() => updateClaim(claim._id, 'Approved', claim.paymentStatus)} className="flex-1 bg-emerald-600/20 text-emerald-400 text-xs py-2 rounded border border-emerald-500/30">Approve</button>}
                    {claim.status === 'Approved' && claim.paymentStatus !== 'Paid' && <button onClick={() => updateClaim(claim._id, claim.status, 'Paid')} className="flex-1 bg-indigo-600 text-white text-xs py-2 rounded shadow-[0_0_10px_rgba(79,70,229,0.3)]">Mark Paid</button>}
                  </div>
                </div>
              ))}
            </div>
          )}
        </motion.div>

        {/* USERS PANEL */}
        <motion.div variants={itemFade} className="bg-slate-900 rounded-2xl shadow-lg border border-slate-800 p-6 md:p-8 xl:col-span-1">
          <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
            <span className="text-indigo-400">👥</span> Users
          </h3>
          <div className="overflow-x-auto rounded-xl border border-slate-800 max-h-[300px] overflow-y-auto custom-scrollbar">
            <table className="w-full text-left border-collapse whitespace-nowrap">
              <tbody className="divide-y divide-slate-800 bg-slate-900">
                {users.map((user) => (
                  <tr key={user._id} className="hover:bg-slate-800/50 transition-colors">
                    <td className="p-3 font-medium text-slate-200 text-sm">
                      {user.name}<br/>
                      <span className="text-xs text-slate-500 font-normal">{user.email}</span>
                    </td>
                    <td className="p-3 text-right">
                      {user.isSubscribed ? <span className="text-[10px] uppercase font-bold bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 px-2 py-1 rounded">Pro</span> : <span className="text-[10px] uppercase font-bold bg-slate-800 text-slate-400 border border-slate-700 px-2 py-1 rounded">Free</span>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

      </motion.div>
    </div>
  );
}