import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, Heart, User, Search, Menu, X, ChevronDown, LogOut, Package, LayoutDashboard, Gem } from 'lucide-react';
import { useAuth } from '../lib/AuthContext';
import { useQuery } from '@tanstack/react-query';
import { getCartItems } from '../services/cart';



export default function Navbar() {
  const { user, profile, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [shopMenuOpen, setShopMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const { data: cartItems } = useQuery({
    queryKey: ['cart', user?.id],
    queryFn: () => getCartItems(user!.id),
    enabled: !!user,
  });
  const cartCount = cartItems?.reduce((s, i) => s + i.quantity, 0) || 0;



  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handler);
    return () => window.removeEventListener('scroll', handler);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setUserMenuOpen(false);
    setShopMenuOpen(false);
    setSearchOpen(false);
  }, [location.pathname]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery('');
    }
  };

  const shopCategories = [
    { label: 'Rings', to: '/products?category=rings' },
    { label: 'Necklaces', to: '/products?category=necklaces' },
    { label: 'Earrings', to: '/products?category=earrings' },
    { label: 'Bracelets', to: '/products?category=bracelets' },
    { label: 'All Products', to: '/products' },
  ];

  const isActive = (to: string) => location.pathname === to;

  return (
    <>
      <nav
        style={{
          backgroundColor: scrolled ? 'rgba(255,248,250,0.96)' : 'rgba(255,248,250,0.98)',
          borderBottom: `1px solid ${scrolled ? '#F7EAF0' : 'transparent'}`,
          backdropFilter: 'blur(12px)',
        }}
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2">
              <div style={{ background: 'linear-gradient(135deg, #B9375E, #D4AF37)' }} className="w-8 h-8 rounded-lg flex items-center justify-center shadow-sm">
                <Gem size={16} className="text-white" />
              </div>
              <div className="flex flex-col">
                <span style={{ color: '#2B2B2B' }} className="font-bold text-lg leading-none tracking-tight">VILAVIE</span>
                <span style={{ color: '#B9375E', fontSize: '10px' }} className="font-medium tracking-widest uppercase leading-none">jewel</span>
              </div>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden lg:flex items-center gap-1">
              {[{ label: 'Home', to: '/' }, { label: 'Blog', to: '/blog' }, { label: 'About', to: '/about' }, { label: 'Contact', to: '/contact' }].slice(0, 1).map(link => (
                <Link key={link.to} to={link.to} style={{ color: isActive(link.to) ? '#B9375E' : '#2B2B2B' }}
                  className="px-4 py-2 text-sm font-medium hover:text-[#B9375E] transition-colors duration-200 rounded-lg hover:bg-[#F7EAF0]">
                  {link.label}
                </Link>
              ))}

              <div className="relative"
                onMouseEnter={() => setShopMenuOpen(true)}
                onMouseLeave={() => setShopMenuOpen(false)}
              >
                <button style={{ color: location.pathname === '/products' ? '#B9375E' : '#2B2B2B' }}
                  className="flex items-center gap-1 px-4 py-2 text-sm font-medium hover:text-[#B9375E] transition-colors duration-200 rounded-lg hover:bg-[#F7EAF0]">
                  Shop <ChevronDown size={14} />
                </button>
                <AnimatePresence>
                  {shopMenuOpen && (
                    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 8 }} transition={{ duration: 0.15 }}
                      style={{ backgroundColor: '#FFFFFF', border: '1px solid #F7EAF0' }}
                      className="absolute top-full left-0 w-48 rounded-xl shadow-lg py-2 mt-1">
                      {shopCategories.map(cat => (
                        <Link key={cat.to} to={cat.to} style={{ color: '#2B2B2B' }}
                          className="block px-4 py-2 text-sm hover:bg-[#FFF8FA] hover:text-[#B9375E] transition-colors">
                          {cat.label}
                        </Link>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {[{ label: 'Blog', to: '/blog' }, { label: 'About', to: '/about' }, { label: 'Contact', to: '/contact' }].map(link => (
                <Link key={link.to} to={link.to} style={{ color: isActive(link.to) ? '#B9375E' : '#2B2B2B' }}
                  className="px-4 py-2 text-sm font-medium hover:text-[#B9375E] transition-colors duration-200 rounded-lg hover:bg-[#F7EAF0]">
                  {link.label}
                </Link>
              ))}
            </div>

            {/* Right icons */}
            <div className="flex items-center gap-2">
              <button onClick={() => setSearchOpen(!searchOpen)} style={{ color: '#2B2B2B' }} className="p-2 rounded-lg hover:bg-[#F7EAF0] transition-colors">
                <Search size={20} />
              </button>
              <Link to="/wishlist" style={{ color: '#2B2B2B' }} className="p-2 rounded-lg hover:bg-[#F7EAF0] transition-colors hidden sm:flex">
                <Heart size={20} />
              </Link>
              <Link to="/cart" className="relative p-2 rounded-lg hover:bg-[#F7EAF0] transition-colors">
                <ShoppingBag size={20} style={{ color: '#2B2B2B' }} />
                {cartCount > 0 && (
                  <span style={{ background: '#B9375E' }} className="absolute -top-0.5 -right-0.5 w-5 h-5 rounded-full text-white text-xs flex items-center justify-center font-bold">
                    {cartCount}
                  </span>
                )}
              </Link>

              {user ? (
                <div className="relative">
                  <button onClick={() => setUserMenuOpen(!userMenuOpen)}
                    style={{ background: 'linear-gradient(135deg, #B9375E, #D4AF37)', color: '#fff' }}
                    className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold">
                    {profile?.full_name?.[0]?.toUpperCase() || user.email?.[0]?.toUpperCase() || 'U'}
                  </button>
                  <AnimatePresence>
                    {userMenuOpen && (
                      <motion.div initial={{ opacity: 0, y: 8, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 8, scale: 0.95 }} transition={{ duration: 0.15 }}
                        style={{ backgroundColor: '#FFFFFF', border: '1px solid #F7EAF0' }}
                        className="absolute right-0 top-full mt-2 w-52 rounded-xl shadow-xl py-2">
                        <div className="px-4 py-2 border-b border-[#F7EAF0]">
                          <p style={{ color: '#2B2B2B' }} className="font-semibold text-sm truncate">{profile?.full_name || 'User'}</p>
                          <p style={{ color: '#6B6B6B' }} className="text-xs truncate">{user.email}</p>
                        </div>
                        {[
                          { icon: User, label: 'Profile', to: '/profile' },
                          { icon: Package, label: 'My Orders', to: '/my-orders' },
                          { icon: Heart, label: 'Wishlist', to: '/wishlist' },
                          ...(profile?.is_admin ? [{ icon: LayoutDashboard, label: 'Admin Panel', to: '/admin' }] : []),
                        ].map(item => (
                          <Link key={item.to} to={item.to} style={{ color: '#2B2B2B' }}
                            className="flex items-center gap-3 px-4 py-2 text-sm hover:bg-[#FFF8FA] hover:text-[#B9375E] transition-colors">
                            <item.icon size={16} /> {item.label}
                          </Link>
                        ))}
                        <button onClick={() => signOut()} style={{ color: '#B9375E' }}
                          className="flex items-center gap-3 px-4 py-2 text-sm hover:bg-[#FFF8FA] w-full text-left transition-colors border-t border-[#F7EAF0] mt-1">
                          <LogOut size={16} /> Sign Out
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <Link to="/auth" style={{ background: '#B9375E', color: '#fff' }}
                  className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium hover:opacity-90 transition-opacity">
                  <User size={16} /> Sign In
                </Link>
              )}

              <button onClick={() => setMobileOpen(!mobileOpen)} style={{ color: '#2B2B2B' }} className="lg:hidden p-2 rounded-lg hover:bg-[#F7EAF0] transition-colors">
                {mobileOpen ? <X size={22} /> : <Menu size={22} />}
              </button>
            </div>
          </div>
        </div>

        {/* Search bar */}
        <AnimatePresence>
          {searchOpen && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
              style={{ backgroundColor: '#FFF8FA', borderTop: '1px solid #F7EAF0' }} className="overflow-hidden">
              <form onSubmit={handleSearch} className="max-w-2xl mx-auto px-4 py-3 flex gap-3">
                <input autoFocus value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Search jewelry, gemstones, metals..."
                  style={{ backgroundColor: '#FFFFFF', border: '1px solid #F7EAF0', color: '#2B2B2B' }}
                  className="flex-1 px-4 py-2 rounded-xl text-sm outline-none focus:border-[#B9375E] transition-colors" />
                <button type="submit" style={{ background: 'linear-gradient(135deg, #B9375E, #D4AF37)', color: '#fff' }}
                  className="px-5 py-2 rounded-xl text-sm font-medium hover:opacity-90 transition-opacity">
                  Search
                </button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Mobile menu */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
              style={{ backgroundColor: '#FFF8FA', borderTop: '1px solid #F7EAF0' }} className="overflow-hidden lg:hidden">
              <div className="px-4 py-4 space-y-1">
                <Link to="/" className="block px-4 py-2.5 text-sm font-medium text-[#2B2B2B] hover:text-[#B9375E] hover:bg-[#F7EAF0] rounded-lg transition-colors">Home</Link>
                <Link to="/products" className="block px-4 py-2.5 text-sm font-medium text-[#2B2B2B] hover:text-[#B9375E] hover:bg-[#F7EAF0] rounded-lg transition-colors">Shop All</Link>
                <div className="pl-4 space-y-1">
                  {shopCategories.slice(0, 4).map(cat => (
                    <Link key={cat.to} to={cat.to} className="block px-4 py-2 text-sm text-[#6B6B6B] hover:text-[#B9375E] hover:bg-[#F7EAF0] rounded-lg transition-colors">{cat.label}</Link>
                  ))}
                </div>
                <Link to="/blog" className="block px-4 py-2.5 text-sm font-medium text-[#2B2B2B] hover:text-[#B9375E] hover:bg-[#F7EAF0] rounded-lg transition-colors">Blog</Link>
                <Link to="/about" className="block px-4 py-2.5 text-sm font-medium text-[#2B2B2B] hover:text-[#B9375E] hover:bg-[#F7EAF0] rounded-lg transition-colors">About</Link>
                <Link to="/contact" className="block px-4 py-2.5 text-sm font-medium text-[#2B2B2B] hover:text-[#B9375E] hover:bg-[#F7EAF0] rounded-lg transition-colors">Contact</Link>
                {!user && <Link to="/auth" style={{ background: '#B9375E', color: '#fff' }} className="block px-4 py-2.5 text-sm font-medium rounded-xl text-center mt-2">Sign In</Link>}
                {user && <button onClick={() => signOut()} style={{ color: '#B9375E' }} className="block w-full text-left px-4 py-2.5 text-sm font-medium hover:bg-[#F7EAF0] rounded-lg transition-colors">Sign Out</button>}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
      <div className="h-16" />
    </>
  );
}
