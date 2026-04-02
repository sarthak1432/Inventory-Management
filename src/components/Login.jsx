import React, { useState } from 'react';
import { Mail, Lock, LogIn, UserPlus, ShieldCheck, AlertCircle, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../hooks/useAuth';
import kitsLogo from '../assets/kits_logo.jpg';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password);
    } catch (err) {
      console.error(err);
      setError(err.message.replace('Firebase: ', '').replace(' (auth/invalid-credential).', ''));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-slate-50 relative overflow-hidden font-['Outfit']">
      {/* Dynamic Background Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-200/30 blur-[120px] rounded-full animate-pulse" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-200/20 blur-[120px] rounded-full" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 w-full max-w-md px-6"
      >
        <div className="glass-panel p-8 sm:p-10 rounded-[2.5rem] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] border border-white/60">
          
          {/* Logo & Branding */}
          <div className="flex flex-col items-center mb-10 text-center">
            <motion.div 
               whileHover={{ scale: 1.05, rotate: 5 }}
               className="w-20 h-20 bg-white rounded-3xl p-3 shadow-xl shadow-indigo-100 border border-slate-100 mb-6 flex items-center justify-center overflow-hidden"
            >
              <img src={kitsLogo} alt="KITS Logo" className="w-full h-full object-contain" />
            </motion.div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight leading-none uppercase">
                KITS <span className="gradient-text">Inventory</span>
            </h1>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mt-3">
                Secure Gateway Access (Admin Only)
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2 group">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1 group-focus-within:text-indigo-600 transition-colors">
                Admin Email
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" size={18} />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="kitspremium@gmail.com"
                  className="w-full glass-input rounded-2xl pl-12 pr-6 py-4 focus:outline-none font-semibold text-sm placeholder:text-slate-300 shadow-sm"
                />
              </div>
            </div>

            <div className="space-y-2 group">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1 group-focus-within:text-indigo-600 transition-colors">
                Access Key
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" size={18} />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full glass-input rounded-2xl pl-12 pr-6 py-4 focus:outline-none font-semibold text-sm placeholder:text-slate-300 shadow-sm"
                />
              </div>
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-3 p-4 bg-red-50/50 border border-red-100 rounded-2xl text-red-600"
              >
                <AlertCircle size={18} className="shrink-0" />
                <p className="text-xs font-bold leading-tight">{error}</p>
              </motion.div>
            )}

            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              disabled={loading}
              className="w-full py-4 gradient-bg text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] shadow-xl shadow-indigo-200 flex items-center justify-center gap-3 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? (
                <Loader2 size={18} className="animate-spin" />
              ) : (
                <>
                  <LogIn size={18} />
                  Initiate Session
                </>
              )}
            </motion.button>
          </form>

          <div className="mt-8 flex items-center justify-center gap-2 opacity-30">
            <ShieldCheck size={14} className="text-slate-400" />
            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">End-to-End Encrypted Tunnel</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
