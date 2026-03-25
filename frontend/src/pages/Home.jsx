import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function Home() {
  // Animation variants for staggered loading
  const containerFade = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.2 } }
  };
  const itemFade = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
  };

  return (
    <div className="min-h-screen bg-slate-950 font-sans text-slate-300 selection:bg-indigo-500 selection:text-white overflow-hidden">
      
      {/* NAVIGATION */}
      <nav className="max-w-7xl mx-auto px-6 py-6 flex justify-between items-center relative z-10">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="text-2xl font-extrabold tracking-tighter text-white flex items-center gap-2">
          <span className="text-indigo-500">✦</span> ImpactGolf
        </motion.div>
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="flex gap-4 items-center">
          <Link to="/login" className="text-slate-400 font-medium hover:text-white transition-colors px-2 md:px-4 py-2 text-sm md:text-base">Log In</Link>
          <Link to="/signup" className="bg-indigo-600 text-white font-medium px-4 md:px-6 py-2 rounded-full hover:bg-indigo-500 transition-all shadow-[0_0_15px_rgba(79,70,229,0.4)] text-sm md:text-base">
            Join Now
          </Link>
        </motion.div>
      </nav>

      {/* HERO SECTION */}
      <header className="max-w-7xl mx-auto px-6 py-16 md:py-32 grid md:grid-cols-2 gap-12 items-center relative z-10">
        {/* Background glow effects */}
        <div className="absolute top-1/4 left-1/4 -z-10 w-96 h-96 bg-indigo-600/20 rounded-full mix-blend-screen filter blur-[100px] animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 -z-10 w-96 h-96 bg-emerald-600/10 rounded-full mix-blend-screen filter blur-[100px]"></div>

        <motion.div variants={containerFade} initial="hidden" animate="show" className="flex flex-col items-start gap-6">
          <motion.div variants={itemFade} className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900 border border-indigo-500/30 text-indigo-400 text-xs md:text-sm font-semibold tracking-wide shadow-[0_0_10px_rgba(79,70,229,0.2)]">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
            </span>
            Monthly Draws Now Live
          </motion.div>
          
          <motion.div variants={itemFade}>
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-extrabold tracking-tight leading-[1.1] text-white">
              Play for <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-emerald-400">Purpose.</span><br/>
              Win for Real.
            </h1>
          </motion.div>
          
          <motion.p variants={itemFade} className="text-lg md:text-xl text-slate-400 leading-relaxed max-w-lg">
            The premium subscription platform where your golf scores enter you into a massive monthly prize pool, all while funding charities that change the world.
          </motion.p>
          
          <motion.div variants={itemFade} className="flex flex-col sm:flex-row gap-4 mt-4 w-full sm:w-auto">
            <Link to="/signup" className="bg-white text-slate-950 text-center font-bold px-8 py-4 rounded-full hover:bg-slate-200 transition-all shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:scale-105 active:scale-95">
              Start Your Journey — $10/mo
            </Link>
          </motion.div>
        </motion.div>

        {/* HERO VISUAL - UPDATED WITH MATCH 3 */}
        <motion.div initial={{ opacity: 0, scale: 0.9, rotate: 2 }} animate={{ opacity: 1, scale: 1, rotate: 0 }} transition={{ duration: 0.8, delay: 0.2 }} className="relative w-full h-auto min-h-[450px] md:h-[550px] bg-slate-900/50 backdrop-blur-xl rounded-3xl shadow-2xl border border-slate-800 p-6 md:p-8 flex flex-col justify-between overflow-hidden">
          <div className="mb-8">
            <h3 className="text-xs md:text-sm font-bold text-slate-500 uppercase tracking-widest mb-2">Current Prize Pool</h3>
            <div className="text-5xl md:text-6xl font-black text-white">$12,450</div>
            <p className="text-emerald-400 font-semibold mt-2 flex items-center gap-1 text-sm md:text-base">
              ↗ Growing daily
            </p>
          </div>

          <div className="bg-slate-950/80 p-5 md:p-6 rounded-2xl border border-slate-800">
            <h4 className="font-bold text-slate-300 mb-5 text-sm md:text-base border-b border-slate-800 pb-2">How the pool splits</h4>
            <div className="space-y-6">
              {/* MATCH 5 */}
              <div>
                <div className="flex justify-between items-center text-xs md:text-sm mb-1.5">
                  <span className="text-slate-400 font-medium">Match 5 Numbers (40%)</span>
                  <span className="font-bold text-indigo-400">$4,980</span>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-2.5 overflow-hidden">
                  <motion.div initial={{ width: 0 }} animate={{ width: "40%" }} transition={{ duration: 1.5, delay: 1 }} className="bg-indigo-500 h-full rounded-full shadow-[0_0_10px_rgba(79,70,229,0.5)]"></motion.div>
                </div>
              </div>
              
              {/* MATCH 4 */}
              <div>
                <div className="flex justify-between items-center text-xs md:text-sm mb-1.5">
                  <span className="text-slate-400 font-medium">Match 4 Numbers (35%)</span>
                  <span className="font-bold text-slate-300">$4,357</span>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-2.5 overflow-hidden">
                  <motion.div initial={{ width: 0 }} animate={{ width: "35%" }} transition={{ duration: 1.5, delay: 1.2 }} className="bg-slate-400 h-full rounded-full shadow-[0_0_10px_rgba(148,163,184,0.3)]"></motion.div>
                </div>
              </div>

              {/* MATCH 3 - NEWLY ADDED */}
              <div>
                <div className="flex justify-between items-center text-xs md:text-sm mb-1.5">
                  <span className="text-slate-400 font-medium">Match 3 Numbers (25%)</span>
                  <span className="font-bold text-emerald-400">$3,113</span>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-2.5 overflow-hidden">
                  <motion.div initial={{ width: 0 }} animate={{ width: "25%" }} transition={{ duration: 1.5, delay: 1.4 }} className="bg-emerald-500 h-full rounded-full shadow-[0_0_10px_rgba(16,185,129,0.5)]"></motion.div>
                </div>
              </div>
            </div>
            <p className="text-[10px] text-slate-500 mt-6 italic text-center uppercase tracking-widest">Global Prize Breakdown</p>
          </div>
        </motion.div>
      </header>

      {/* HOW IT WORKS */}
      <section className="bg-slate-950 py-24 border-t border-slate-900 relative z-10">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-4">How It Works</h2>
            <p className="text-slate-400 max-w-2xl mx-auto text-lg">A seamless experience designed to reward your game and maximize charitable impact.</p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 md:gap-10">
            {[
              { num: 1, color: "indigo", title: "Subscribe & Select", desc: "Join for $10/month. Instantly route a minimum of 10% of your fee to a partnered charity of your choice." },
              { num: 2, color: "emerald", title: "Log Your Scores", desc: "Play your weekend rounds and enter your Stableford scores (1-45). We safely store your rolling history." },
              { num: 3, color: "rose", title: "The Monthly Draw", desc: "Every month, match 3, 4, or 5 of your logged scores to claim your share of the massive prize pool." }
            ].map((step, i) => (
              <motion.div key={step.num} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.2 }} className="p-8 rounded-3xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-colors group">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl font-bold mb-6 bg-${step.color}-500/10 text-${step.color}-400 group-hover:scale-110 transition-transform`}>
                  {step.num}
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{step.title}</h3>
                <p className="text-slate-400 leading-relaxed text-sm md:text-base">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-12 border-t border-slate-900 text-center">
        <p className="text-slate-600 text-sm">© 2026 ImpactGolf. Play with Passion, Win with Purpose.</p>
      </footer>
    </div>
  );
}