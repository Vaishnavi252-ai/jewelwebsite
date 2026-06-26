import { useState } from 'react';
import { motion } from 'framer-motion';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { User, Mail, Phone, MapPin, Save, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '../lib/AuthContext';
import { supabase } from '../lib/supabase';

export default function Profile() {
  const { user, profile, loading } = useAuth();
  const queryClient = useQueryClient();
  const [form, setForm] = useState({
    full_name: profile?.full_name || '',
    phone: profile?.phone || '',
    address: profile?.street || '',

    city: profile?.city || '',
    state: profile?.state || '',
    postal_code: profile?.postal_code || '',
  });
  const [saving, setSaving] = useState(false);

  if (loading) {
    return (
      <div style={{ backgroundColor: '#FFF8FA' }} className="min-h-screen flex items-center justify-center">
        <Loader2 size={32} className="animate-spin" style={{ color: '#B9375E' }} />
      </div>
    );
  }

  const handleSave = async () => {
    if (!form.full_name) {
      toast.error('Name is required');
      return;
    }
    setSaving(true);
    try {
      const { error } = await supabase
        .from('user_profiles')
          .update({
          full_name: form.full_name,
          phone: form.phone,
          street: form.address,
          city: form.city,
          state: form.state,
          postal_code: form.postal_code,
        })

        .eq('id', user!.id);

      if (error) throw error;
      queryClient.invalidateQueries({ queryKey: ['profile', user!.id] });
      toast.success('Profile updated successfully');
    } catch {
      toast.error('Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={{ backgroundColor: '#FFF8FA' }} className="min-h-screen py-10">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 style={{ color: '#2B2B2B' }} className="text-3xl font-bold">My Profile</h1>
          <p style={{ color: '#6B6B6B' }} className="text-sm mt-1">Manage your account information</p>
        </motion.div>

        {/* Profile Card */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          style={{ backgroundColor: '#FFFFFF', border: '1px solid #F7EAF0' }}
          className="rounded-3xl p-6 lg:p-8 mb-6">
          <div className="flex items-center gap-4 mb-8 pb-6" style={{ borderBottom: '1px solid #F7EAF0' }}>
            <div style={{ background: 'linear-gradient(135deg, #B9375E, #D4AF37)' }}
              className="w-20 h-20 rounded-full flex items-center justify-center text-white text-2xl font-bold">
              {profile?.full_name?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase() || 'U'}
            </div>
            <div>
              <h2 style={{ color: '#2B2B2B' }} className="text-xl font-bold">{profile?.full_name || 'User'}</h2>
              <p style={{ color: '#6B6B6B' }} className="text-sm">{user?.email}</p>
              <div className="flex items-center gap-2 mt-2">
                <span style={{ backgroundColor: '#22C55E20', color: '#22C55E' }} className="px-2 py-0.5 rounded-full text-xs font-medium">
                  Verified Account
                </span>
                {profile?.is_admin && (
                  <span style={{ backgroundColor: '#B9375E20', color: '#B9375E' }} className="px-2 py-0.5 rounded-full text-xs font-medium">
                    Admin
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="grid lg:grid-cols-2 gap-6">
            <div>
              <label style={{ color: '#2B2B2B' }} className="block text-sm font-medium mb-1.5">Full Name *</label>
              <div className="relative">
                <User size={16} style={{ color: '#6B6B6B' }} className="absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input type="text" value={form.full_name} onChange={e => setForm(f => ({ ...f, full_name: e.target.value }))}
                  placeholder="Your full name" required
                  style={{ backgroundColor: '#FFF8FA', border: '1px solid #F7EAF0', color: '#2B2B2B' }}
                  className="w-full pl-10 pr-4 py-3 rounded-xl text-sm outline-none focus:border-[#B9375E] transition-colors" />
              </div>
            </div>
            <div>
              <label style={{ color: '#2B2B2B' }} className="block text-sm font-medium mb-1.5">Email</label>
              <div className="relative">
                <Mail size={16} style={{ color: '#6B6B6B' }} className="absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input type="email" value={user?.email || ''} disabled
                  style={{ backgroundColor: '#F7EAF0', border: '1px solid #F7EAF0', color: '#6B6B6B' }}
                  className="w-full pl-10 pr-4 py-3 rounded-xl text-sm cursor-not-allowed" />
              </div>
              <p style={{ color: '#6B6B6B' }} className="text-xs mt-1">Email cannot be changed</p>
            </div>
            <div>
              <label style={{ color: '#2B2B2B' }} className="block text-sm font-medium mb-1.5">Phone</label>
              <div className="relative">
                <Phone size={16} style={{ color: '#6B6B6B' }} className="absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input type="tel" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                  placeholder="+91 9876543210"
                  style={{ backgroundColor: '#FFF8FA', border: '1px solid #F7EAF0', color: '#2B2B2B' }}
                  className="w-full pl-10 pr-4 py-3 rounded-xl text-sm outline-none focus:border-[#B9375E] transition-colors" />
              </div>
            </div>
            <div>
              <label style={{ color: '#2B2B2B' }} className="block text-sm font-medium mb-1.5">Postal Code</label>
              <input type="text" value={form.postal_code} onChange={e => setForm(f => ({ ...f, postal_code: e.target.value }))}
                placeholder="PIN Code"
                style={{ backgroundColor: '#FFF8FA', border: '1px solid #F7EAF0', color: '#2B2B2B' }}
                className="w-full px-4 py-3 rounded-xl text-sm outline-none focus:border-[#B9375E] transition-colors" />
            </div>
            <div className="lg:col-span-2">
              <label style={{ color: '#2B2B2B' }} className="block text-sm font-medium mb-1.5">Address</label>
              <div className="relative">
                <MapPin size={16} style={{ color: '#6B6B6B' }} className="absolute left-3.5 top-3" />
                <input type="text" value={form.address} onChange={e => setForm(f => ({ ...f, address: e.target.value }))}
                  placeholder="Street address"
                  style={{ backgroundColor: '#FFF8FA', border: '1px solid #F7EAF0', color: '#2B2B2B' }}
                  className="w-full pl-10 pr-4 py-3 rounded-xl text-sm outline-none focus:border-[#B9375E] transition-colors" />
              </div>
            </div>
            <div>
              <label style={{ color: '#2B2B2B' }} className="block text-sm font-medium mb-1.5">City</label>
              <input type="text" value={form.city} onChange={e => setForm(f => ({ ...f, city: e.target.value }))}
                placeholder="City"
                style={{ backgroundColor: '#FFF8FA', border: '1px solid #F7EAF0', color: '#2B2B2B' }}
                className="w-full px-4 py-3 rounded-xl text-sm outline-none focus:border-[#B9375E] transition-colors" />
            </div>
            <div>
              <label style={{ color: '#2B2B2B' }} className="block text-sm font-medium mb-1.5">State</label>
              <input type="text" value={form.state} onChange={e => setForm(f => ({ ...f, state: e.target.value }))}
                placeholder="State"
                style={{ backgroundColor: '#FFF8FA', border: '1px solid #F7EAF0', color: '#2B2B2B' }}
                className="w-full px-4 py-3 rounded-xl text-sm outline-none focus:border-[#B9375E] transition-colors" />
            </div>
          </div>

          <button onClick={handleSave} disabled={saving}
            style={{ background: 'linear-gradient(135deg, #B9375E, #D4AF37)', color: '#fff' }}
            className="mt-6 px-8 py-3 rounded-xl font-semibold text-sm hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center gap-2">
            <Save size={18} /> {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </motion.div>

        {/* Quick Links */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          style={{ backgroundColor: '#FFFFFF', border: '1px solid #F7EAF0' }}
          className="rounded-2xl p-6">
          <h3 style={{ color: '#2B2B2B' }} className="font-bold mb-4">Quick Links</h3>
          <div className="grid sm:grid-cols-3 gap-3">
            {[
              { label: 'My Orders', path: '/my-orders' },
              { label: 'Wishlist', path: '/wishlist' },
              { label: 'Cart', path: '/cart' },
            ].map(link => (
              <a key={link.path} href={link.path}
                style={{ backgroundColor: '#FFF8FA', border: '1px solid #F7EAF0', color: '#2B2B2B' }}
                className="block p-4 rounded-xl text-sm font-medium hover:border-[#B9375E] hover:text-[#B9375E] transition-colors">
                {link.label}
              </a>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
