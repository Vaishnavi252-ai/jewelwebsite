import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, User, Eye, EyeOff, Gem } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '../lib/AuthContext';

export default function Auth() {
  const { user, signIn, signUp, loading } = useAuth();
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [showPass, setShowPass] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', password: '' });

  if (!loading && user) return <Navigate to="/" replace />;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (mode === 'login') {
        const { error } = await signIn(form.email, form.password);
        if (error) throw error;
        toast.success('Welcome back!');
      } else {
        if (!form.name.trim()) { toast.error('Please enter your name'); setSubmitting(false); return; }
        const { error } = await signUp(form.email, form.password, form.name);
        if (error) throw error;
        toast.success('Account created! Welcome to VILAVIE jewel.');
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Authentication failed';
      toast.error(msg);
    } finally { setSubmitting(false); }
  };

  return (
    <div style={{ backgroundColor: '#FFF8FA' }} className="min-h-screen flex items-center justify-center px-4 py-12">
      <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="w-full max-w-md">
        <div className="text-center mb-8">
          <div style={{ background: 'linear-gradient(135deg, #B9375E, #D4AF37)' }} className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
            <Gem size={28} className="text-white" />
          </div>
          <h1 style={{ color: '#2B2B2B' }} className="text-2xl font-bold">VILAVIE jewel</h1>
          <p style={{ color: '#6B6B6B' }} className="text-sm mt-1">Crafting timeless elegance</p>
        </div>

        <div style={{ backgroundColor: '#FFFFFF', border: '1px solid #F7EAF0' }} className="rounded-3xl p-8 shadow-sm">
          <div style={{ backgroundColor: '#FFF8FA', border: '1px solid #F7EAF0' }} className="flex rounded-xl p-1 mb-8">
            {(['login', 'register'] as const).map(m => (
              <button key={m} onClick={() => setMode(m)}
                style={mode === m ? { background: 'linear-gradient(135deg, #B9375E, #D4AF37)', color: '#fff' } : { color: '#6B6B6B' }}
                className="flex-1 py-2.5 text-sm font-semibold rounded-lg transition-all duration-200 capitalize">
                {m === 'login' ? 'Sign In' : 'Create Account'}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'register' && (
              <div>
                <label style={{ color: '#2B2B2B' }} className="block text-sm font-medium mb-1.5">Full Name</label>
                <div className="relative">
                  <User size={16} style={{ color: '#6B6B6B' }} className="absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input type="text" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                    placeholder="Your full name" required
                    style={{ backgroundColor: '#FFF8FA', border: '1px solid #F7EAF0', color: '#2B2B2B' }}
                    className="w-full pl-10 pr-4 py-3 rounded-xl text-sm outline-none focus:border-[#B9375E] transition-colors placeholder:text-[#6B6B6B]" />
                </div>
              </div>
            )}
            <div>
              <label style={{ color: '#2B2B2B' }} className="block text-sm font-medium mb-1.5">Email</label>
              <div className="relative">
                <Mail size={16} style={{ color: '#6B6B6B' }} className="absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                  placeholder="your@email.com" required
                  style={{ backgroundColor: '#FFF8FA', border: '1px solid #F7EAF0', color: '#2B2B2B' }}
                  className="w-full pl-10 pr-4 py-3 rounded-xl text-sm outline-none focus:border-[#B9375E] transition-colors placeholder:text-[#6B6B6B]" />
              </div>
            </div>
            <div>
              <label style={{ color: '#2B2B2B' }} className="block text-sm font-medium mb-1.5">Password</label>
              <div className="relative">
                <Lock size={16} style={{ color: '#6B6B6B' }} className="absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input type={showPass ? 'text' : 'password'} value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                  placeholder={mode === 'register' ? 'Min. 6 characters' : '••••••••'} required minLength={6}
                  style={{ backgroundColor: '#FFF8FA', border: '1px solid #F7EAF0', color: '#2B2B2B' }}
                  className="w-full pl-10 pr-12 py-3 rounded-xl text-sm outline-none focus:border-[#B9375E] transition-colors placeholder:text-[#6B6B6B]" />
                <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3.5 top-1/2 -translate-y-1/2" style={{ color: '#6B6B6B' }}>
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
            <button type="submit" disabled={submitting}
              style={{ background: 'linear-gradient(135deg, #B9375E, #D4AF37)', color: '#fff' }}
              className="w-full py-3.5 rounded-xl font-semibold text-sm hover:opacity-90 transition-opacity disabled:opacity-60 mt-2">
              {submitting ? 'Please wait...' : mode === 'login' ? 'Sign In' : 'Create Account'}
            </button>
          </form>
        </div>
      </motion.div>
    </div>
  );
}
