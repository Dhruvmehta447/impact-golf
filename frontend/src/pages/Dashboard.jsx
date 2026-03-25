import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';

// This constant automatically switches between Production and Development URLs
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export default function Dashboard() {
  const navigate = useNavigate();
  const location = useLocation();
  
  const [scores, setScores] = useState([]);
  const [scoreValue, setScoreValue] = useState('');
  const [datePlayed, setDatePlayed] = useState('');
  const [charities, setCharities] = useState([]);
  const [selectedCharityId, setSelectedCharityId] = useState('');
  const [contribution, setContribution] = useState(10);
  const [savedMessage, setSavedMessage] = useState('');
  const [paymentMessage, setPaymentMessage] = useState('');
  const [proofImage, setProofImage] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) navigate('/login');
    else { fetchScores(token); fetchCharities(); }

    const queryParams = new URLSearchParams(location.search);
    if (queryParams.get('payment') === 'success') {
      axios.post(`${API_URL}/api/payment/verify`, {}, { headers: { Authorization: `Bearer ${token}` } })
      .then(() => {
        setPaymentMessage('🎉 Payment Successful! Your account is officially upgraded.');
        window.history.replaceState(null, '', '/dashboard'); 
      }).catch(err => console.error(err));
    }
  }, [navigate, location]);

  const fetchScores = async (token) => {
    try { 
      const res = await axios.get(`${API_URL}/api/scores`, { headers: { Authorization: `Bearer ${token}` } }); 
      setScores(res.data); 
    } catch (e) { console.error(e); }
  };
  
  const fetchCharities = async () => {
    try { 
      const res = await axios.get(`${API_URL}/api/charities`); 
      setCharities(res.data); 
    } catch (e) { console.error(e); }
  };

  const handleScoreSubmit = async (e) => {
    e.preventDefault(); 
    const token = localStorage.getItem('token');
    try {
      await axios.post(`${API_URL}/api/scores`, 
        { scoreValue: Number(scoreValue), datePlayed }, 
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setScoreValue(''); setDatePlayed(''); fetchScores(token); 
    } catch (error) { alert('Error: ' + error.response?.data?.message); }
  };

  const handleCharitySubmit = async (e) => {
    e.preventDefault(); 
    const token = localStorage.getItem('token');
    if (!selectedCharityId) return alert('Select a cause first!');
    try {
      await axios.put(`${API_URL}/api/charities/select`, 
        { charityId: selectedCharityId, percentage: Number(contribution) }, 
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSavedMessage(`Pledge of ${contribution}% saved!`);
    } catch (error) { alert('Error: ' + error.response?.data?.message); }
  };

  const handleSubscribe = async (planType) => {
    const token = localStorage.getItem('token');
    try {
      const res = await axios.post(`${API_URL}/api/payment/create-checkout-session`, 
        { plan: planType }, 
        { headers: { Authorization: `Bearer ${token}` } }
      );
      window.location.href = res.data.url; 
    } catch (error) { alert('Gateway Error'); }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) { 
      const reader = new FileReader(); 
      reader.readAsDataURL(file); 
      reader.onloadend = () => setProofImage(reader.result); 
    }
  };

  const handleClaimSubmit = async (e) => {
    e.preventDefault(); 
    if (!proofImage) return alert('Upload a screenshot first.');
    const token = localStorage.getItem('token');
    try {
      await axios.post(`${API_URL}/api/claims/submit`, 
        { proofImage }, 
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert('Claim submitted! Awaiting review.'); setProofImage(null);
    } catch (error) { alert('Error submitting claim.'); }
  };

  const cardVariants = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { duration: 0.5 } } };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-300 font-sans p-4 md:p-8 lg:p-12">
      
      {/* HEADER */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Impact Dashboard</h1>
          <p className="text-slate-500 mt-1 text-sm md:text-base">Manage your performance and charitable giving.</p>
        </div>
        <div className="flex gap-3 w-full md:w-auto mt-4 md:mt-0">
          <button onClick={() => navigate('/profile')} className="bg-slate-900 border border-slate-800 text-slate-300 px-5 py-2 rounded-lg hover:bg-slate-800 transition-colors shadow-sm font-medium flex-1 md:flex-none flex items-center justify-center gap-2">
            ⚙️ Settings
          </button>
          <button onClick={() => { localStorage.removeItem('token'); navigate('/login'); }} className="bg-rose-500/10 border border-rose-500/20 text-rose-400 px-5 py-2 rounded-lg hover:bg-rose-500/20 transition-colors shadow-sm font-medium flex-1 md:flex-none">
            Log Out
          </button>
        </div>
      </motion.div>

      {paymentMessage && (
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="max-w-7xl mx-auto mb-8">
          <div className="p-4 rounded-xl bg-indigo-900/30 border border-indigo-500/30 text-indigo-300">
            <p className="font-semibold text-sm md:text-base">{paymentMessage}</p>
          </div>
        </motion.div>
      )}

      {/* MAIN GRID */}
      <motion.div initial="hidden" animate="show" variants={{ show: { transition: { staggerChildren: 0.1 }}}} className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        
        {/* SCORES CARD */}
        <motion.div variants={cardVariants} className="bg-slate-900 rounded-2xl border border-slate-800 p-6 hover:border-slate-700 transition-colors shadow-lg">
          <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2"><span className="text-indigo-400">📈</span> Performance</h3>
          <form onSubmit={handleScoreSubmit} className="flex flex-col gap-3 mb-6">
            <input type="number" placeholder="Stableford (1-45)" value={scoreValue} onChange={(e) => setScoreValue(e.target.value)} min="1" max="45" required className="p-2.5 text-sm bg-slate-950 border border-slate-800 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-white placeholder-slate-600" />
            <input type="date" value={datePlayed} onChange={(e) => setDatePlayed(e.target.value)} required className="p-2.5 text-sm bg-slate-950 border border-slate-800 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-white color-scheme-dark" />
            <button type="submit" className="bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold py-2.5 rounded-lg transition-colors shadow-md">Log Score</button>
          </form>
          <div>
            <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Rolling History (Last 5)</h4>
            {scores.length === 0 ? <p className="text-slate-600 text-sm">No recorded data.</p> : (
              <ul className="space-y-2">
                {scores.map((score) => (
                  <li key={score._id} className="flex justify-between items-center p-3 bg-slate-950/50 rounded-lg border border-slate-800">
                    <span className="font-bold text-slate-200 text-sm">{score.scoreValue} pts</span>
                    <span className="text-xs text-slate-500">{new Date(score.datePlayed).toLocaleDateString()}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </motion.div>

        {/* CHARITY CARD */}
        <motion.div variants={cardVariants} className="bg-slate-900 rounded-2xl border border-slate-800 p-6 hover:border-slate-700 transition-colors shadow-lg">
          <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2"><span className="text-rose-400">❤️</span> Active Cause</h3>
          <form onSubmit={handleCharitySubmit} className="flex flex-col gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1.5">Select Impact Partner</label>
              <select value={selectedCharityId} onChange={(e) => setSelectedCharityId(e.target.value)} className="w-full p-2.5 text-sm bg-slate-950 border border-slate-800 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-white">
                <option value="">-- Choose Foundation --</option>
                {charities.map((c) => <option key={c._id} value={c._id}>{c.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1.5">Prize Contribution (%)</label>
              <input type="number" value={contribution} onChange={(e) => setContribution(e.target.value)} min="10" max="100" className="w-full p-2.5 text-sm bg-slate-950 border border-slate-800 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none text-white" />
            </div>
            <button type="submit" className="bg-slate-800 hover:bg-slate-700 text-white text-sm font-semibold py-2.5 rounded-lg transition-colors border border-slate-700">Save Impact Settings</button>
            {savedMessage && <p className="text-emerald-400 text-xs font-semibold text-center">{savedMessage}</p>}
          </form>
        </motion.div>

        {/* CLAIM WINNINGS CARD */}
        <motion.div variants={cardVariants} className="bg-slate-900 rounded-2xl border border-slate-800 p-6 hover:border-slate-700 transition-colors shadow-lg">
          <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2"><span className="text-amber-400">🏆</span> Claim Winnings</h3>
          <p className="text-xs text-slate-400 mb-4 leading-relaxed">Matched the draw numbers? Upload your scorecard screenshot as proof to claim your payout.</p>
          <form onSubmit={handleClaimSubmit} className="flex flex-col gap-3">
            <input type="file" accept="image/*" onChange={handleImageUpload} className="p-2 border border-slate-800 bg-slate-950 text-slate-300 rounded-lg text-xs w-full file:mr-4 file:py-1 file:px-3 file:rounded-full file:border-0 file:text-xs file:bg-indigo-900 file:text-indigo-300 hover:file:bg-indigo-800" />
            {proofImage && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="h-24 w-full bg-slate-950 border border-slate-800 rounded-lg flex items-center justify-center overflow-hidden">
                <img src={proofImage} alt="Proof preview" className="object-cover h-full w-full opacity-80" />
              </motion.div>
            )}
            <button type="submit" className="bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-600/30 text-sm font-semibold py-2.5 rounded-lg transition-colors mt-2">Submit Proof</button>
          </form>
        </motion.div>

        {/* SUBSCRIPTION CARD */}
        <motion.div variants={cardVariants} className="bg-gradient-to-br from-indigo-950 to-slate-900 rounded-2xl shadow-[0_0_30px_rgba(79,70,229,0.1)] border border-indigo-500/20 p-6 text-white relative overflow-hidden">
          <div className="absolute -right-10 -top-10 w-40 h-40 bg-indigo-500 opacity-20 rounded-full blur-3xl"></div>
          
          <h3 className="text-lg font-bold mb-2 flex items-center gap-2 relative z-10"><span className="text-yellow-400">⚡</span> Premium</h3>
          <p className="text-indigo-200/70 text-xs mb-6 leading-relaxed relative z-10">
            Upgrade your account to qualify for the Monthly Draw, win real prizes, and support your selected charity.
          </p>
          
          <div className="flex flex-col gap-3 relative z-10">
            <button onClick={() => handleSubscribe('monthly')} className="w-full bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold py-2.5 px-4 rounded-lg transition-all flex justify-between items-center group shadow-lg">
              <span>Monthly Plan</span>
              <span className="bg-indigo-900 text-indigo-200 text-xs px-2 py-1 rounded group-hover:bg-indigo-800">$10/mo</span>
            </button>
            <button onClick={() => handleSubscribe('yearly')} className="w-full bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white text-sm font-semibold py-2.5 px-4 rounded-lg transition-all flex justify-between items-center">
              <span>Annual Plan</span>
              <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs px-2 py-1 rounded">Save 16%</span>
            </button>
          </div>
        </motion.div>

      </motion.div>
    </div>
  );
}