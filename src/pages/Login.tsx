import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Mail, Lock, Shield, ArrowRight, User } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { GlassCard } from '../components/ui/GlassCard';
import { useAuthStore } from '../store/useAuthStore';

export default function Login() {
  const { login, enableDemo } = useAuthStore();
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      login(email, name || 'Focus Guardian User');
    }
  };

  return (
    <div className="min-h-[85vh] w-full flex items-center justify-center relative overflow-hidden px-4">
      {/* Decorative background glow blobs */}
      <div className="absolute top-1/4 left-1/4 h-[350px] w-[350px] rounded-full bg-purple-600/10 blur-3xl pointer-events-none animate-pulse-slow" />
      <div className="absolute bottom-1/4 right-1/4 h-[300px] w-[300px] rounded-full bg-cyan-600/10 blur-3xl pointer-events-none" />

      {/* Main card container with entrance transition */}
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ type: 'spring', damping: 25, stiffness: 120 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', delay: 0.1, stiffness: 200 }}
            className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-tr from-purple-600 to-cyan-500 shadow-xl shadow-purple-500/20 text-white text-3xl mb-5 font-bold"
          >
            🎯
          </motion.div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight leading-none">Focus Guardian</h1>
          <p className="text-zinc-500 text-xs mt-2.5 font-semibold uppercase tracking-widest">AI-Powered Attention Shield</p>
        </div>

        <GlassCard 
          className="p-8 border border-white/5 shadow-2xl relative overflow-hidden group"
          style={{ background: '#121215' }}
        >
          {/* Top colored accent line */}
          <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-purple-600 to-cyan-500" />

          <form onSubmit={handleSubmit} className="space-y-5">
            {isRegistering && (
              <div>
                <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1.5 ml-1">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-650" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter name"
                    className="w-full bg-zinc-950 border border-white/5 rounded-xl pl-10 pr-4 py-3 text-sm text-white focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1.5 ml-1">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-650" />
                <input
                  required
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.com"
                  className="w-full bg-zinc-950 border border-white/5 rounded-xl pl-10 pr-4 py-3 text-sm text-white focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1.5 ml-1">Secure Password</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-650" />
                <input
                  required
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-zinc-950 border border-white/5 rounded-xl pl-10 pr-4 py-3 text-sm text-white focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all"
                />
              </div>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full justify-center py-3.5 mt-2 shadow-lg shadow-purple-500/10"
              icon={<ArrowRight size={16} />}
            >
              {isRegistering ? 'Create Account' : 'Authenticate Shield'}
            </Button>
          </form>

          {/* Toggle register option */}
          <div className="text-center mt-5">
            <button
              onClick={() => setIsRegistering(!isRegistering)}
              className="text-xs text-zinc-400 hover:text-purple-400 font-semibold transition-colors"
            >
              {isRegistering ? 'Already have an account? Sign in' : "Don't have an account? Sign up"}
            </button>
          </div>

          <div className="relative my-6 text-center">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/5"></div></div>
            <span className="relative bg-[#121215] px-3 text-[10px] font-bold text-zinc-600 uppercase tracking-wider">Alternative</span>
          </div>

          {/* Explore Web Demo Option (The New Option) */}
          <Button
            onClick={enableDemo}
            type="button"
            variant="secondary"
            size="lg"
            className="w-full justify-center border-white/5 bg-white/3 hover:bg-white/10 py-3.5"
            icon={<Sparkles size={15} className="text-cyan-400" />}
          >
            Explore Live Demo (Preview Mode)
          </Button>

          <p className="text-[10px] text-zinc-550 text-center mt-5 leading-relaxed font-medium">
            Demo Mode simulates active window tracking and imports seed sessions to preview charts directly in the browser.
          </p>
        </GlassCard>
      </motion.div>
    </div>
  );
}
