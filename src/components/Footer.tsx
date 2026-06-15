import { Link } from 'react-router-dom';
import { Gem, Instagram, Facebook, Twitter, Phone, Mail, MapPin } from 'lucide-react';

export default function Footer() {
  return (
    <footer style={{ background: 'linear-gradient(135deg, #1a1a1a, #2B2B2B)' }} className="text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div style={{ background: 'linear-gradient(135deg, #B9375E, #D4AF37)' }} className="w-9 h-9 rounded-lg flex items-center justify-center">
                <Gem size={18} className="text-white" />
              </div>
              <div>
                <div className="font-bold text-xl leading-none">VILAVIE</div>
                <div style={{ color: '#D4AF37', fontSize: '10px' }} className="tracking-widest uppercase">jewel</div>
              </div>
            </div>
            <p style={{ color: 'rgba(255,255,255,0.6)' }} className="text-sm leading-relaxed">
              Crafting timeless elegance with exquisite jewelry pieces that celebrate your unique style and precious moments.
            </p>
            <div className="flex gap-3">
              {[Instagram, Facebook, Twitter].map((Icon, i) => (
                <button key={i} style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.1)' }}
                  className="w-9 h-9 rounded-lg flex items-center justify-center hover:opacity-80 transition-opacity">
                  <Icon size={16} style={{ color: '#D4AF37' }} />
                </button>
              ))}
            </div>
          </div>

          <div>
            <h3 style={{ color: '#D4AF37' }} className="font-semibold mb-5 text-sm tracking-wider uppercase">Quick Links</h3>
            <ul className="space-y-3">
              {[{ label: 'Home', to: '/' }, { label: 'Products', to: '/products' }, { label: 'About Us', to: '/about' }, { label: 'Blog', to: '/blog' }].map(l => (
                <li key={l.to}><Link to={l.to} style={{ color: 'rgba(255,255,255,0.6)' }} className="text-sm hover:text-white transition-colors">{l.label}</Link></li>
              ))}
            </ul>
          </div>

          <div>
            <h3 style={{ color: '#D4AF37' }} className="font-semibold mb-5 text-sm tracking-wider uppercase">Support</h3>
            <ul className="space-y-3">
              {[{ label: 'Contact Us', to: '/contact' }, { label: 'Size Guide', to: '/contact' }, { label: 'Returns & Exchanges', to: '/contact' }, { label: 'My Orders', to: '/my-orders' }].map(l => (
                <li key={l.label}><Link to={l.to} style={{ color: 'rgba(255,255,255,0.6)' }} className="text-sm hover:text-white transition-colors">{l.label}</Link></li>
              ))}
            </ul>
          </div>

          <div>
            <h3 style={{ color: '#D4AF37' }} className="font-semibold mb-5 text-sm tracking-wider uppercase">Get in Touch</h3>
            <ul className="space-y-3">
              {[{ icon: Phone, text: '+91 98765 43210' }, { icon: Mail, text: 'hello@vilaviejewel.com' }, { icon: MapPin, text: 'Mumbai, Maharashtra' }].map(({ icon: Icon, text }) => (
                <li key={text} className="flex items-center gap-3">
                  <Icon size={15} style={{ color: '#D4AF37' }} className="shrink-0" />
                  <span style={{ color: 'rgba(255,255,255,0.6)' }} className="text-sm">{text}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }} className="mt-12 pt-8">
          <div className="grid grid-cols-3 gap-4 mb-8 text-center">
            {[
              { label: 'Lifetime Warranty', sub: 'Premium protection for all jewelry' },
              { label: 'Free Shipping', sub: 'On orders over ₹5000' },
              { label: '30-Day Returns', sub: 'Hassle-free returns' },
            ].map(item => (
              <div key={item.label}>
                <div style={{ color: '#D4AF37' }} className="font-semibold text-sm">{item.label}</div>
                <div style={{ color: 'rgba(255,255,255,0.4)' }} className="text-xs mt-1">{item.sub}</div>
              </div>
            ))}
          </div>
          <div className="flex flex-col sm:flex-row items-center justify-between gap-2">
            <p style={{ color: 'rgba(255,255,255,0.4)' }} className="text-xs">© 2024 VILAVIE jewel. All rights reserved.</p>
            <p style={{ color: 'rgba(255,255,255,0.4)' }} className="text-xs">Crafting timeless elegance since 2010</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
