import { motion } from 'framer-motion';
import { Gem, Award, Users, Heart, Clock, Shield } from 'lucide-react';
import { LOCAL_IMGS } from '../lib/utils';

export default function AboutUs() {
  const values = [
    { icon: Gem, title: 'Craftsmanship', desc: 'Every piece is meticulously handcrafted by skilled artisans with decades of experience.' },
    { icon: Shield, title: 'Quality Assurance', desc: 'We use only the finest materials, ensuring each piece meets the highest standards.' },
    { icon: Heart, title: 'Customer Love', desc: 'Your satisfaction drives us. We go above and beyond to make every experience memorable.' },
    { icon: Clock, title: 'Timeless Design', desc: 'Our designs blend traditional artistry with modern aesthetics for pieces that last generations.' },
  ];

  const team = [
    { name: 'Priya Sharma', role: 'Founder & Creative Director', img: LOCAL_IMGS[0] },
    { name: 'Raj Malhotra', role: 'Master Artisan', img: LOCAL_IMGS[1] },
    { name: 'Ananya Patel', role: 'Design Lead', img: LOCAL_IMGS[2] },
  ];

  const stats = [
    { value: '15+', label: 'Years Experience' },
    { value: '50K+', label: 'Happy Customers' },
    { value: '10K+', label: 'Products Crafted' },
    { value: '100%', label: 'Hallmarked Gold' },
  ];

  return (
    <div style={{ backgroundColor: '#FFF8FA' }} className="min-h-screen">
      {/* Hero */}
      <section style={{ background: 'linear-gradient(135deg, rgba(185,55,94,0.1), rgba(212,175,55,0.1))' }} className="py-20 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="text-center max-w-3xl mx-auto">
            <div style={{ background: 'linear-gradient(135deg, #B9375E, #D4AF37)' }} className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Gem size={32} className="text-white" />
            </div>
            <h1 style={{ color: '#2B2B2B' }} className="text-4xl lg:text-5xl font-bold mb-6">Our Story</h1>
            <p style={{ color: '#6B6B6B' }} className="text-lg leading-relaxed">
              Founded in 2010, VILAVIE jewel began as a small family workshop with a dream to bring luxury jewelry to every Indian home. Today, we've grown into a beloved brand while staying true to our roots of exceptional craftsmanship and personal service.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section style={{ backgroundColor: '#FFFFFF', borderBottom: '1px solid #F7EAF0' }} className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, i) => (
              <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                transition={{ delay: i * 0.1 }} className="text-center">
                <p style={{ color: '#B9375E' }} className="text-4xl font-bold mb-1">{stat.value}</p>
                <p style={{ color: '#6B6B6B' }} className="text-sm">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
              <h2 style={{ color: '#2B2B2B' }} className="text-3xl font-bold mb-6">Our Mission</h2>
              <p style={{ color: '#6B6B6B' }} className="leading-relaxed mb-4">
                At VILAVIE jewel, we believe that everyone deserves to experience the joy of wearing beautiful, well-crafted jewelry. Our mission is to make luxury jewelry accessible without compromising on quality or craftsmanship.
              </p>
              <p style={{ color: '#6B6B6B' }} className="leading-relaxed mb-6">
                Every piece tells a story - of the artisans who crafted it, the traditions it carries, and the memories it will help create. We're not just selling jewelry; we're helping you find pieces that become part of your life's most precious moments.
              </p>
              <div className="flex flex-wrap gap-4">
                {['BIS Hallmarked', 'ISO Certified', 'Gemstone Certified'].map(badge => (
                  <span key={badge} style={{ backgroundColor: '#B9375E', color: '#fff' }}
                    className="px-4 py-2 rounded-full text-xs font-medium">{badge}</span>
                ))}
              </div>
            </motion.div>
            <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}
              className="grid grid-cols-2 gap-4">
              {LOCAL_IMGS.slice(0, 4).map((img, i) => (
                <div key={i} style={{ backgroundColor: '#FFFFFF', border: '1px solid #F7EAF0' }}
                  className={`rounded-2xl overflow-hidden ${i % 2 === 1 ? 'mt-8' : ''}`}>
                  <img src={img} alt="" className="w-full aspect-square object-cover" />
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20" style={{ background: 'linear-gradient(180deg, #FFFFFF, #FFF8FA)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="text-center mb-12">
            <h2 style={{ color: '#2B2B2B' }} className="text-3xl font-bold mb-4">What We Stand For</h2>
            <p style={{ color: '#6B6B6B' }} className="max-w-2xl mx-auto">Our values guide every decision we make, from sourcing materials to crafting each piece.</p>
          </motion.div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, i) => (
              <motion.div key={value.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                style={{ backgroundColor: '#FFFFFF', border: '1px solid #F7EAF0' }}
                className="rounded-2xl p-6 text-center hover:shadow-lg transition-shadow">
                <div style={{ background: 'linear-gradient(135deg, #B9375E, #D4AF37)' }}
                  className="w-14 h-14 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <value.icon size={24} className="text-white" />
                </div>
                <h3 style={{ color: '#2B2B2B' }} className="font-bold mb-2">{value.title}</h3>
                <p style={{ color: '#6B6B6B' }} className="text-sm">{value.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="text-center mb-12">
            <h2 style={{ color: '#2B2B2B' }} className="text-3xl font-bold mb-4">Meet Our Artisans</h2>
            <p style={{ color: '#6B6B6B' }} className="max-w-2xl mx-auto">The talented hands behind every piece of jewelry we create.</p>
          </motion.div>
          <div className="grid sm:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {team.map((member, i) => (
              <motion.div key={member.name} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                transition={{ delay: i * 0.1 }} className="text-center">
                <div style={{ border: '3px solid #B9375E' }} className="w-32 h-32 rounded-full overflow-hidden mx-auto mb-4">
                  <img src={member.img} alt={member.name} className="w-full h-full object-cover" />
                </div>
                <h3 style={{ color: '#2B2B2B' }} className="font-bold">{member.name}</h3>
                <p style={{ color: '#B9375E' }} className="text-sm">{member.role}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}
            style={{ background: 'linear-gradient(135deg, #B9375E, #D4AF37)' }}
            className="rounded-3xl p-10 lg:p-16 text-center text-white">
            <h2 style={{ color: '#fff' }} className="text-3xl lg:text-4xl font-bold mb-4">Ready to Find Your Perfect Piece?</h2>
            <p style={{ color: 'rgba(255,255,255,0.9)' }} className="max-w-2xl mx-auto mb-8">
              Explore our collection and discover jewelry that speaks to your heart. Each piece is waiting to become part of your story.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <button onClick={() => window.location.href = '/products'}
                style={{ backgroundColor: '#FFFFFF', color: '#B9375E' }}
                className="px-8 py-3 rounded-xl font-semibold hover:opacity-90 transition-opacity">
                Shop Collection
              </button>
              <button onClick={() => window.location.href = '/contact'}
                style={{ border: '2px solid #FFFFFF', color: '#fff' }}
                className="px-8 py-3 rounded-xl font-semibold hover:bg-white/10 transition-colors">
                Contact Us
              </button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
