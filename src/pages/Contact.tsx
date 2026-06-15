import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Clock, Send, MessageSquare } from 'lucide-react';
import { toast } from 'sonner';
import { submitContactForm } from '../services/contact';

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', subject: '', message: '' });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      toast.error('Please fill required fields');
      return;
    }
    setSubmitting(true);
    try {
      await submitContactForm(form);
      toast.success('Message sent successfully!');
      setForm({ name: '', email: '', phone: '', subject: '', message: '' });
    } catch {
      toast.error('Failed to send message');
    } finally {
      setSubmitting(false);
    }
  };

  const contactInfo = [
    { icon: Mail, label: 'Email', value: 'hello@vilaviejewel.com', href: 'mailto:hello@vilaviejewel.com' },
    { icon: Phone, label: 'Phone', value: '+91 98765 43210', href: 'tel:+919876543210' },
    { icon: MapPin, label: 'Address', value: '123 Jewelry Lane, Mumbai, MH 400001', href: '#' },
    { icon: Clock, label: 'Hours', value: 'Mon-Sat: 10AM - 8PM', href: '#' },
  ];

  const faqs = [
    { q: 'How do I track my order?', a: 'Once your order ships, you\'ll receive an email with tracking details.' },
    { q: 'What is your return policy?', a: 'We offer 7-day easy returns on all unworn items in original packaging.' },
    { q: 'Is the jewelry hallmarked?', a: 'Yes, all our gold jewelry is BIS hallmarked for purity assurance.' },
  ];

  return (
    <div style={{ backgroundColor: '#FFF8FA' }} className="min-h-screen">
      {/* Header */}
      <section style={{ background: 'linear-gradient(135deg, rgba(185,55,94,0.1), rgba(212,175,55,0.1))' }} className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center max-w-2xl mx-auto">
            <div style={{ background: 'linear-gradient(135deg, #B9375E, #D4AF37)' }} className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <MessageSquare size={28} className="text-white" />
            </div>
            <h1 style={{ color: '#2B2B2B' }} className="text-4xl font-bold mb-4">Get in Touch</h1>
            <p style={{ color: '#6B6B6B' }} className="text-sm">
              Have a question about our jewelry or need assistance? We'd love to hear from you. Our team is here to help.
            </p>
          </motion.div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Contact Info */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
            <h2 style={{ color: '#2B2B2B' }} className="text-xl font-bold mb-6">Contact Information</h2>
            <div className="space-y-4">
              {contactInfo.map(info => (
                <a key={info.label} href={info.href}
                  style={{ backgroundColor: '#FFFFFF', border: '1px solid #F7EAF0' }}
                  className="flex items-start gap-4 p-4 rounded-xl hover:border-[#B9375E] transition-colors block">
                  <div style={{ background: 'linear-gradient(135deg, #B9375E, #D4AF37)' }}
                    className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0">
                    <info.icon size={18} className="text-white" />
                  </div>
                  <div>
                    <p style={{ color: '#6B6B6B' }} className="text-xs mb-0.5">{info.label}</p>
                    <p style={{ color: '#2B2B2B' }} className="text-sm font-medium">{info.value}</p>
                  </div>
                </a>
              ))}
            </div>

            {/* FAQs */}
            <div className="mt-10">
              <h2 style={{ color: '#2B2B2B' }} className="text-xl font-bold mb-4">Quick Answers</h2>
              <div className="space-y-3">
                {faqs.map(faq => (
                  <div key={faq.q} style={{ backgroundColor: '#FFFFFF', border: '1px solid #F7EAF0' }} className="p-4 rounded-xl">
                    <p style={{ color: '#2B2B2B' }} className="font-medium text-sm mb-1">{faq.q}</p>
                    <p style={{ color: '#6B6B6B' }} className="text-xs">{faq.a}</p>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
            className="lg:col-span-2">
            <div style={{ backgroundColor: '#FFFFFF', border: '1px solid #F7EAF0' }} className="rounded-3xl p-6 lg:p-10">
              <h2 style={{ color: '#2B2B2B' }} className="text-xl font-bold mb-6">Send us a Message</h2>
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid sm:grid-cols-2 gap-5">
                  <div>
                    <label style={{ color: '#2B2B2B' }} className="block text-sm font-medium mb-1.5">Full Name *</label>
                    <input type="text" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                      placeholder="Your name" required
                      style={{ backgroundColor: '#FFF8FA', border: '1px solid #F7EAF0', color: '#2B2B2B' }}
                      className="w-full px-4 py-3 rounded-xl text-sm outline-none focus:border-[#B9375E] transition-colors" />
                  </div>
                  <div>
                    <label style={{ color: '#2B2B2B' }} className="block text-sm font-medium mb-1.5">Email *</label>
                    <input type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                      placeholder="your@email.com" required
                      style={{ backgroundColor: '#FFF8FA', border: '1px solid #F7EAF0', color: '#2B2B2B' }}
                      className="w-full px-4 py-3 rounded-xl text-sm outline-none focus:border-[#B9375E] transition-colors" />
                  </div>
                </div>
                <div className="grid sm:grid-cols-2 gap-5">
                  <div>
                    <label style={{ color: '#2B2B2B' }} className="block text-sm font-medium mb-1.5">Phone</label>
                    <input type="tel" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                      placeholder="+91 9876543210"
                      style={{ backgroundColor: '#FFF8FA', border: '1px solid #F7EAF0', color: '#2B2B2B' }}
                      className="w-full px-4 py-3 rounded-xl text-sm outline-none focus:border-[#B9375E] transition-colors" />
                  </div>
                  <div>
                    <label style={{ color: '#2B2B2B' }} className="block text-sm font-medium mb-1.5">Subject</label>
                    <select value={form.subject} onChange={e => setForm(f => ({ ...f, subject: e.target.value }))}
                      style={{ backgroundColor: '#FFF8FA', border: '1px solid #F7EAF0', color: '#2B2B2B' }}
                      className="w-full px-4 py-3 rounded-xl text-sm outline-none focus:border-[#B9375E] transition-colors">
                      <option value="">Select a topic</option>
                      <option>Product Inquiry</option>
                      <option>Order Support</option>
                      <option>Returns & Refunds</option>
                      <option>General Question</option>
                      <option>Other</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label style={{ color: '#2B2B2B' }} className="block text-sm font-medium mb-1.5">Message *</label>
                  <textarea value={form.message} onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                    placeholder="How can we help you?" required rows={5}
                    style={{ backgroundColor: '#FFF8FA', border: '1px solid #F7EAF0', color: '#2B2B2B', resize: 'none' }}
                    className="w-full px-4 py-3 rounded-xl text-sm outline-none focus:border-[#B9375E] transition-colors" />
                </div>
                <button type="submit" disabled={submitting}
                  style={{ background: 'linear-gradient(135deg, #B9375E, #D4AF37)', color: '#fff' }}
                  className="w-full py-3.5 rounded-xl font-semibold text-sm hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2">
                  <Send size={18} /> {submitting ? 'Sending...' : 'Send Message'}
                </button>
              </form>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Map placeholder */}
      <div style={{ backgroundColor: '#FFFFFF', borderTop: '1px solid #F7EAF0' }} className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 style={{ color: '#2B2B2B' }} className="text-2xl font-bold mb-2">Visit Our Showroom</h2>
            <p style={{ color: '#6B6B6B' }} className="text-sm mb-6">Experience our jewelry in person at our flagship store</p>
            <div style={{ backgroundColor: '#F7EAF0' }} className="h-64 rounded-2xl flex items-center justify-center">
              <div className="text-center">
                <MapPin size={32} style={{ color: '#B9375E' }} className="mx-auto mb-2" />
                <p style={{ color: '#6B6B6B' }} className="text-sm">123 Jewelry Lane, Mumbai, MH 400001</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
