import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { Sparkles, ArrowRight, Shield, Truck, Award, Star, Gem } from 'lucide-react';
import { getProducts, getCategories } from '../services/products';
import ProductCard from '../components/ProductCard';
import { toast } from 'sonner';
import { homeHeroBackground, homeJewelleryCardPhotos } from '../lib/unsplashHome';

const IMGS = [
  '/jewel1.avif',
  '/jewel2.avif',
  '/jewel3.avif',
  '/jewel4.avif',
  '/jewel5.avif',
];

const TESTIMONIALS = [
  { name: 'Priya Sharma', loc: 'Mumbai', text: 'Absolutely stunning quality! The rose gold necklace exceeded my expectations. Perfect for my wedding day.' },
  { name: 'Anita Rodrigues', loc: 'Goa', text: 'Fast shipping and beautiful packaging. The earrings are exactly as pictured — so elegant!' },
  { name: 'Jessica Taylor', loc: 'Pune', text: 'Love my diamond ring! The craftsmanship is exceptional and the customer service was amazing.' },
];

const CAT_IMGS: Record<string, string> = {
  rings: 'https://images.unsplash.com/photo-1631982690223-8aa4be0a2497?q=80&w=764&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  necklaces: 'https://images.unsplash.com/photo-1705326454924-f6777522b030?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
  earrings: 'https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MzB8fGpld2VsbGVyeXxlbnwwfHwwfHx8MA%3D%3D',
  bracelets: 'https://images.unsplash.com/photo-1586878341523-7acb55eb8c12?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTV8fGJyYWNlbGV0cyUyMGpld2Vscnl8ZW58MHx8MHx8fDA%3D',
};

const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  visible: (i: number = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.5, delay: i * 0.1 } }),
};

export default function Home() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');

  const { data: featuredProducts = [] } = useQuery({
    queryKey: ['products', 'featured'],
    queryFn: () => getProducts({ featured: true, limit: 6 }),
  });

  const { data: categories = [] } = useQuery({
    queryKey: ['categories'],
    queryFn: getCategories,
  });

  return (
    <div>
      {/* HERO */}
      <section style={{ background: 'linear-gradient(135deg, #9a9a9a 0%, #6d6d6d 50%, rgba(185,55,94,0.15) 100%)' }}
        className="relative overflow-hidden min-h-[90vh] flex items-center">
        <div style={{ background: 'rgba(212,175,55,0.07)', width: 500, height: 500, borderRadius: '50%', filter: 'blur(80px)' }} className="absolute -top-20 -right-20 pointer-events-none" />
        <div style={{ background: 'rgba(185,55,94,0.07)', width: 400, height: 400, borderRadius: '50%', filter: 'blur(80px)' }} className="absolute -bottom-20 -left-20 pointer-events-none" />
        <div className="absolute inset-0">
          <img
            src={homeHeroBackground.src}
            alt={homeHeroBackground.alt}
            className="w-full h-full object-cover opacity-35"
          />
          {/* jewellery vignette */}
          <div className="absolute inset-0" style={{ background: 'linear-gradient(90deg, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.15) 50%, rgba(0,0,0,0.55) 100%)' }} />
        </div>


        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
              style={{ background: 'rgba(212,175,55,0.15)', border: '1px solid rgba(212,175,55,0.3)', color: '#D4AF37' }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Sparkles size={14} /> Exquisite Craftsmanship Since 2010
            </motion.div>
            <motion.h1 initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }}
              className="text-5xl md:text-7xl font-bold text-white leading-tight mb-4">
              Timeless<br />
              <span style={{ background: 'linear-gradient(90deg, #B9375E, #D4AF37)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                Elegance
              </span>
            </motion.h1>
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6, delay: 0.2 }}
              className="text-white/70 text-lg max-w-lg mb-8 leading-relaxed">
              Discover our handcrafted collection of rings, necklaces, bracelets and earrings — each piece a celebration of artistry and timeless beauty.
            </motion.p>
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 }} className="flex flex-wrap gap-4 mb-10">
              <Link to="/products" style={{ background: 'linear-gradient(135deg, #B9375E, #D4AF37)', color: '#fff' }}
                className="flex items-center gap-2 px-8 py-4 rounded-xl font-semibold text-sm hover:opacity-90 transition-opacity shadow-lg">
                Shop Collection <ArrowRight size={16} />
              </Link>
              <Link to="/about" style={{ border: '2px solid rgba(255,255,255,0.4)', color: '#fff' }}
                className="flex items-center gap-2 px-8 py-4 rounded-xl font-semibold text-sm hover:bg-white/10 transition-colors">
                Our Story
              </Link>
            </motion.div>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5, delay: 0.4 }} className="flex flex-wrap gap-6">
              {[{ icon: Truck, text: 'Free Shipping' }, { icon: Shield, text: 'Secure Payment' }, { icon: Award, text: 'Lifetime Warranty' }].map(({ icon: Icon, text }) => (
                <div key={text} className="flex items-center gap-2">
                  <Icon size={16} style={{ color: '#D4AF37' }} />
                  <span className="text-white/70 text-sm">{text}</span>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Image collage */}
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.7, delay: 0.2 }} className="hidden lg:grid grid-cols-2 gap-4">
            <div className="rounded-2xl overflow-hidden row-span-2" style={{ aspectRatio: '3/4' }}>
              <img src={IMGS[0]} alt="" className="w-full h-full object-cover" />
            </div>
            {IMGS.slice(1, 4).map((src, i) => (
              <div key={i} className="rounded-2xl overflow-hidden" style={{ aspectRatio: '1/1' }}>
                <img src={src} alt="" className="w-full h-full object-cover" />
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* QUICK ACTIONS (jewellery image cards) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Rings', sub: 'Elegant rings for every occasion', to: '/products?category=rings', color: '#B9375E' },
            { label: 'Necklaces', sub: 'Beautiful necklaces to complement any outfit', to: '/products?category=necklaces', color: '#D4AF37' },
            { label: 'Earrings', sub: 'Stunning earrings that make a statement', to: '/products?category=earrings', color: '#B9375E' },
            { label: 'Bracelets', sub: 'Elegant bracelets for sophisticated style', to: '/products?category=bracelets', color: '#D4AF37' },
          ].map((item, i) => {
            const photo = homeJewelleryCardPhotos[i % homeJewelleryCardPhotos.length];
            return (
              <motion.div key={item.label} variants={fadeUp} initial="hidden" whileInView="visible" custom={i} viewport={{ once: true }}>
                <Link to={item.to}
                  style={{ border: '1px solid #F7EAF0' }}
                  className="group relative block rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 group hover:-translate-y-1">
                  <div className="relative">
                    <img
                      src={photo.src}
                      alt={photo.alt}
                      className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-110"
                      loading="lazy"
                    />
                    <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.25) 55%, rgba(0,0,0,0.05) 100%)' }} />
                    <div className="absolute bottom-0 left-0 right-0 p-4">
                      <h3 className="font-bold text-white text-sm mb-1">{item.label}</h3>
                      <p className="text-white/70 text-xs leading-snug">{item.sub}</p>
                      <div className="text-xs font-semibold mt-3 flex items-center gap-1" style={{ color: item.color }}>
                        Shop Now <ArrowRight size={12} />
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </section>


      {/* SHOP BY CATEGORY */}
      {categories.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} className="text-center mb-12">
            <h2 style={{ color: '#2B2B2B' }} className="text-3xl font-bold mb-3">Shop by Category</h2>
            <div style={{ background: 'linear-gradient(90deg, #B9375E, #D4AF37)', height: 3, width: 60, margin: '0 auto 12px', borderRadius: 999 }} />
            <p style={{ color: '#6B6B6B' }} className="text-sm">From elegant rings to stunning necklaces, find the perfect piece for every occasion</p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((cat, i) => (
              <motion.div key={cat.id} variants={fadeUp} initial="hidden" whileInView="visible" custom={i} viewport={{ once: true }}>
                <Link to={`/products?category=${cat.slug}`} className="block group relative overflow-hidden rounded-2xl" style={{ aspectRatio: '3/4' }}>
                  <img
                    src={CAT_IMGS[cat.slug] || cat.image_url || IMGS[i % IMGS.length]}
                    alt={cat.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(27,27,27,0.8) 0%, transparent 60%)' }} />
                  <div className="absolute bottom-0 left-0 right-0 p-5">
                    <h3 className="text-white font-bold text-lg">{cat.name}</h3>
                    <p style={{ color: 'rgba(255,255,255,0.7)' }} className="text-sm mt-0.5">{cat.description}</p>
                    <div style={{ color: '#D4AF37' }} className="text-sm font-semibold mt-2 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      Explore <ArrowRight size={14} />
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </section>
      )}

      {/* OUR SERVICES */}
      <section style={{ backgroundColor: '#FFF8FA' }} className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 style={{ color: '#2B2B2B' }} className="text-3xl font-bold mb-3">Our Services</h2>
            <div style={{ background: 'linear-gradient(90deg, #B9375E, #D4AF37)', height: 3, width: 60, margin: '0 auto 12px', borderRadius: 999 }} />
            <p style={{ color: '#6B6B6B' }} className="text-sm">Free delivery, exclusive offers, and premium customer care—every step of the way.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                title: 'Free Delivery',
                desc: 'Free shipping on orders above ₹5000.',
                icon: Truck,
              },
              {
                title: 'Exclusive Offers',
                desc: 'Members get early access to new arrivals & deals.',
                icon: Award,
              },
              {
                title: 'Secure Payments',
                desc: 'Shop with confidence using trusted payment methods.',
                icon: Shield,
              },
            ].map((item, i) => (
              <motion.div
                key={item.title}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                custom={i}
                viewport={{ once: true }}
                className="rounded-2xl bg-white border border-[#F7EAF0] p-6 shadow-sm"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div
                    style={{ background: 'linear-gradient(135deg, #B9375E, #D4AF37)' }}
                    className="w-10 h-10 rounded-xl flex items-center justify-center"
                  >
                    <item.icon size={18} className="text-white" />
                  </div>
                  <h3 style={{ color: '#2B2B2B' }} className="font-bold text-lg">
                    {item.title}
                  </h3>
                </div>
                <p style={{ color: '#6B6B6B' }} className="text-sm leading-relaxed">
                  {item.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURED PRODUCTS */}
      <section style={{ backgroundColor: '#FFFFFF' }} className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} className="flex items-end justify-between mb-12">
            <div>
              <h2 style={{ color: '#2B2B2B' }} className="text-3xl font-bold mb-2">Featured Pieces</h2>
              <div style={{ background: 'linear-gradient(90deg, #B9375E, #D4AF37)', height: 3, width: 60, borderRadius: 999 }} />
            </div>
            <Link to="/products" style={{ color: '#B9375E' }} className="text-sm font-semibold flex items-center gap-1 hover:gap-2 transition-all">
              View All <ArrowRight size={14} />
            </Link>
          </motion.div>

          {featuredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredProducts.map((product, i) => (
                <motion.div key={product.id} variants={fadeUp} initial="hidden" whileInView="visible" custom={i % 3} viewport={{ once: true }}>
                  <ProductCard product={product} onAuthRequired={() => navigate('/auth')} />
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <Gem size={48} style={{ color: '#F7EAF0' }} className="mx-auto mb-4" />
              <p style={{ color: '#6B6B6B' }} className="text-sm">Our featured collection is being curated. Check back soon!</p>
              <Link to="/products" style={{ color: '#B9375E' }} className="text-sm font-semibold mt-3 inline-flex items-center gap-1">
                Browse All Products <ArrowRight size={14} />
              </Link>
            </div>
          )}

          {featuredProducts.length > 0 && (
            <div className="text-center mt-10">
              <Link to="/products" style={{ border: '2px solid #B9375E', color: '#B9375E' }}
                className="inline-flex items-center gap-2 px-8 py-3 rounded-xl text-sm font-semibold hover:bg-[#B9375E] hover:text-white transition-all duration-200">
                View All Products <ArrowRight size={16} />
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* CRAFTSMANSHIP */}
      <section style={{ background: 'linear-gradient(135deg, #1a1a1a, #2B2B2B)' }} className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
              <div className="relative rounded-3xl overflow-hidden" style={{ aspectRatio: '4/3' }}>
                <img src={IMGS[1]} alt="Craftsmanship" className="w-full h-full object-cover" />
                <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, rgba(185,55,94,0.3), transparent)' }} />
              </div>
            </motion.div>
            <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-50px' }}>
              <div style={{ color: '#D4AF37' }} className="text-sm font-semibold tracking-widest uppercase mb-4">Our Craft</div>
              <h2 className="text-4xl font-bold text-white mb-6 leading-tight">
                Crafted With<br />
                <span style={{ background: 'linear-gradient(90deg, #B9375E, #D4AF37)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>Passion</span>
              </h2>
              <p style={{ color: 'rgba(255,255,255,0.7)' }} className="text-base leading-relaxed mb-8">
                Each VILAVIE jewel is handcrafted by master artisans with over 25 years of experience, using ethically sourced materials and time-honored techniques.
              </p>
              <div className="grid grid-cols-3 gap-6 mb-8">
                {[{ value: '25+', label: 'Years' }, { value: '10K+', label: 'Pieces' }, { value: '50+', label: 'Artisans' }].map(stat => (
                  <div key={stat.label} className="text-center">
                    <div style={{ background: 'linear-gradient(135deg, #B9375E, #D4AF37)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }} className="text-3xl font-bold">{stat.value}</div>
                    <div style={{ color: 'rgba(255,255,255,0.5)' }} className="text-xs mt-1">{stat.label}</div>
                  </div>
                ))}
              </div>
              <Link to="/about" style={{ background: 'linear-gradient(135deg, #B9375E, #D4AF37)', color: '#fff' }}
                className="inline-flex items-center gap-2 px-8 py-4 rounded-xl font-semibold text-sm hover:opacity-90 transition-opacity">
                Learn Our Story <ArrowRight size={16} />
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section style={{ backgroundColor: '#FFF8FA' }} className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} className="text-center mb-12">
            <h2 style={{ color: '#2B2B2B' }} className="text-3xl font-bold mb-2">What Our Customers Say</h2>
            <div style={{ background: 'linear-gradient(90deg, #B9375E, #D4AF37)', height: 3, width: 60, margin: '0 auto 12px', borderRadius: 999 }} />
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t, i) => (
              <motion.div key={t.name} variants={fadeUp} initial="hidden" whileInView="visible" custom={i} viewport={{ once: true }}
                style={{ backgroundColor: '#FFFFFF', border: '1px solid #F7EAF0' }} className="rounded-2xl p-6 shadow-sm">
                <div className="flex gap-0.5 mb-4">{[1,2,3,4,5].map(s => <Star key={s} size={14} style={{ color: '#D4AF37' }} fill="#D4AF37" />)}</div>
                <p style={{ color: '#2B2B2B' }} className="text-sm leading-relaxed mb-4 italic">"{t.text}"</p>
                <div className="flex items-center gap-3">
                  <div style={{ background: 'linear-gradient(135deg, #B9375E, #D4AF37)', color: '#fff' }} className="w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm">
                    {t.name[0]}
                  </div>
                  <div>
                    <div style={{ color: '#2B2B2B' }} className="font-semibold text-sm">{t.name}</div>
                    <div style={{ color: '#6B6B6B' }} className="text-xs">{t.loc}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* NEWSLETTER */}
      <section style={{ background: 'linear-gradient(135deg, #B9375E, #1a1a1a)' }} className="py-20">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <Gem size={40} style={{ color: '#D4AF37' }} className="mx-auto mb-6" />
            <h2 className="text-3xl font-bold text-white mb-3">Join the VILAVIE Circle</h2>
            <p style={{ color: 'rgba(255,255,255,0.7)' }} className="text-sm mb-8">Get exclusive access to new arrivals, style guides, and special member discounts.</p>
            <form onSubmit={e => { e.preventDefault(); toast.success('Thank you for subscribing!'); setEmail(''); }} className="flex gap-3 max-w-md mx-auto">
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Your email address" required
                style={{ backgroundColor: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.3)', color: '#fff' }}
                className="flex-1 px-5 py-3.5 rounded-xl text-sm outline-none placeholder:text-white/50 focus:border-[#D4AF37] transition-colors" />
              <button type="submit" style={{ background: '#D4AF37', color: '#2B2B2B' }}
                className="px-6 py-3.5 rounded-xl font-bold text-sm hover:opacity-90 transition-opacity whitespace-nowrap">
                Subscribe
              </button>
            </form>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
