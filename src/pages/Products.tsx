import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { Search, SlidersHorizontal, Grid3X3, List, X } from 'lucide-react';
import { getProducts, getCategories } from '../services/products';
import ProductCard from '../components/ProductCard';
import { METAL_LABELS } from '../lib/utils';

const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest First' },
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
  { value: 'name_asc', label: 'Name: A to Z' },
];

export default function Products() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [category, setCategory] = useState(searchParams.get('category') || '');
  const [metalType, setMetalType] = useState('');
  const [sort, setSort] = useState('newest');
  const [maxFilter, setMaxFilter] = useState(500000);

  const { data: allProducts = [], isLoading } = useQuery({
    queryKey: ['products', 'all'],
    queryFn: () => getProducts(),
  });
  const { data: categories = [] } = useQuery({
    queryKey: ['categories'],
    queryFn: getCategories,
  });

  useEffect(() => {
    setSearch(searchParams.get('search') || '');
    setCategory(searchParams.get('category') || '');
  }, [searchParams]);

  const maxPrice = allProducts.length > 0 ? Math.max(...allProducts.map(p => p.price)) : 500000;

  const filtered = allProducts
    .filter(p => {
      if (category && p.category_slug !== category) return false;
      if (metalType && p.metal_type !== metalType) return false;
      if (p.price > maxFilter) return false;
      if (search) {
        const s = search.toLowerCase();
        return p.title.toLowerCase().includes(s) || p.description?.toLowerCase().includes(s) ||
          p.gemstone?.toLowerCase().includes(s) || p.metal_type?.toLowerCase().includes(s) ||
          p.tags.some(t => t.toLowerCase().includes(s));
      }
      return true;
    })
    .sort((a, b) => {
      if (sort === 'price_asc') return a.price - b.price;
      if (sort === 'price_desc') return b.price - a.price;
      if (sort === 'name_asc') return a.title.localeCompare(b.title);
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    });

  const clearAll = () => {
    setCategory(''); setMetalType(''); setSearch(''); setSort('newest'); setMaxFilter(maxPrice);
    setSearchParams({});
  };

  const activeFilters = [
    ...(category ? [{ label: categories.find(c => c.slug === category)?.name || category, onRemove: () => { setCategory(''); setSearchParams(p => { p.delete('category'); return p; }); } }] : []),
    ...(metalType ? [{ label: METAL_LABELS[metalType], onRemove: () => setMetalType('') }] : []),
    ...(search ? [{ label: `"${search}"`, onRemove: () => { setSearch(''); setSearchParams(p => { p.delete('search'); return p; }); } }] : []),
  ];

  const Sidebar = () => (
    <aside style={{ backgroundColor: '#FFFFFF', border: '1px solid #F7EAF0' }} className="rounded-2xl p-6 h-fit sticky top-24">
      <div className="flex items-center justify-between mb-6">
        <h2 style={{ color: '#2B2B2B' }} className="font-bold text-base">Filters</h2>
        {(metalType || maxFilter < maxPrice) && (
          <button onClick={clearAll} style={{ color: '#B9375E' }} className="text-xs font-medium">Clear All</button>
        )}
      </div>
      <div className="mb-6">
        <h3 style={{ color: '#2B2B2B' }} className="font-semibold text-sm mb-3">Metal Type</h3>
        <select value={metalType} onChange={e => setMetalType(e.target.value)}
          style={{ backgroundColor: '#FFF8FA', border: '1px solid #F7EAF0', color: '#2B2B2B' }}
          className="w-full px-3 py-2.5 rounded-xl text-sm outline-none focus:border-[#B9375E] transition-colors">
          <option value="">All Metals</option>
          {Object.entries(METAL_LABELS).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
        </select>
      </div>
      <div className="mb-6">
        <h3 style={{ color: '#2B2B2B' }} className="font-semibold text-sm mb-3">Price Range</h3>
        <input type="range" min={0} max={maxPrice} value={maxFilter}
          onChange={e => setMaxFilter(+e.target.value)} className="w-full accent-[#B9375E] mb-2" />
        <div className="flex justify-between text-xs" style={{ color: '#6B6B6B' }}>
          <span>₹0</span><span>₹{maxFilter.toLocaleString('en-IN')}</span>
        </div>
      </div>
      <div>
        <h3 style={{ color: '#2B2B2B' }} className="font-semibold text-sm mb-3">Popular Gemstones</h3>
        <div className="space-y-2">
          {['Diamond', 'Ruby', 'Sapphire', 'Emerald', 'Pearl'].map(gem => (
            <label key={gem} className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" className="accent-[#B9375E]" checked={search === gem}
                onChange={e => setSearch(e.target.checked ? gem : '')} />
              <span style={{ color: '#2B2B2B' }} className="text-sm">{gem}</span>
            </label>
          ))}
        </div>
      </div>
    </aside>
  );

  return (
    <div style={{ backgroundColor: '#FFF8FA' }} className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="mb-8">
          <h1 style={{ color: '#2B2B2B' }} className="text-4xl font-bold mb-2">Our Collection</h1>
          <p style={{ color: '#6B6B6B' }} className="text-sm">Discover exquisite jewelry crafted with love and precision</p>
        </div>

        {/* Controls */}
        <div style={{ backgroundColor: '#FFFFFF', border: '1px solid #F7EAF0' }} className="rounded-2xl p-4 mb-6 flex flex-wrap gap-3 items-center">
          <div className="relative flex-1 min-w-[200px]">
            <Search size={16} style={{ color: '#6B6B6B' }} className="absolute left-3 top-1/2 -translate-y-1/2" />
            <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search jewelry, gemstones, metals..."
              style={{ backgroundColor: '#FFF8FA', border: '1px solid #F7EAF0', color: '#2B2B2B' }}
              className="w-full pl-9 pr-4 py-2.5 rounded-xl text-sm outline-none focus:border-[#B9375E] transition-colors" />
          </div>
          <select value={category} onChange={e => { setCategory(e.target.value); setSearchParams(e.target.value ? { category: e.target.value } : {}); }}
            style={{ backgroundColor: '#FFF8FA', border: '1px solid #F7EAF0', color: '#2B2B2B' }}
            className="px-3 py-2.5 rounded-xl text-sm outline-none focus:border-[#B9375E] transition-colors">
            <option value="">All Categories</option>
            {categories.map(c => <option key={c.id} value={c.slug}>{c.name}</option>)}
          </select>
          <select value={sort} onChange={e => setSort(e.target.value)}
            style={{ backgroundColor: '#FFF8FA', border: '1px solid #F7EAF0', color: '#2B2B2B' }}
            className="px-3 py-2.5 rounded-xl text-sm outline-none focus:border-[#B9375E] transition-colors">
            {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
          <button onClick={() => setSidebarOpen(!sidebarOpen)} style={{ backgroundColor: '#FFF8FA', border: '1px solid #F7EAF0', color: '#2B2B2B' }}
            className="lg:hidden flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium">
            <SlidersHorizontal size={16} /> Filters
          </button>
          <div style={{ backgroundColor: '#FFF8FA', border: '1px solid #F7EAF0' }} className="hidden lg:flex rounded-xl overflow-hidden">
            {[{ mode: 'grid', icon: Grid3X3 }, { mode: 'list', icon: List }].map(({ mode, icon: Icon }) => (
              <button key={mode} onClick={() => setViewMode(mode as 'grid' | 'list')}
                style={viewMode === mode ? { background: '#B9375E', color: '#fff' } : { color: '#6B6B6B' }}
                className="p-2.5 transition-colors"><Icon size={16} /></button>
            ))}
          </div>
        </div>

        {/* Active filters */}
        {activeFilters.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {activeFilters.map(f => (
              <span key={f.label} style={{ background: '#FFF8FA', border: '1px solid #F7EAF0', color: '#B9375E' }}
                className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium">
                {f.label}<button onClick={f.onRemove}><X size={12} /></button>
              </span>
            ))}
            <button onClick={clearAll} style={{ color: '#6B6B6B' }} className="text-xs underline">Clear all</button>
          </div>
        )}

        <div className="flex gap-6">
          {/* Desktop sidebar */}
          <div className="hidden lg:block w-64 shrink-0"><Sidebar /></div>

          {/* Mobile sidebar */}
          <AnimatePresence>
            {sidebarOpen && (
              <motion.div initial={{ x: -300, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -300, opacity: 0 }}
                className="fixed inset-y-0 left-0 z-50 w-72 lg:hidden overflow-y-auto pt-16"
                style={{ backgroundColor: '#FFF8FA' }}>
                <div className="p-4">
                  <button onClick={() => setSidebarOpen(false)} className="mb-4 p-2" style={{ color: '#2B2B2B' }}><X size={20} /></button>
                  <Sidebar />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Grid */}
          <div className="flex-1 min-w-0">
            <p style={{ color: '#6B6B6B' }} className="text-sm mb-5">
              Showing <strong style={{ color: '#2B2B2B' }}>{filtered.length}</strong> of <strong style={{ color: '#2B2B2B' }}>{allProducts.length}</strong> products
            </p>
            {isLoading ? (
              <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="animate-pulse rounded-2xl bg-white overflow-hidden">
                    <div className="aspect-square bg-[#F7EAF0]" />
                    <div className="p-4 space-y-2"><div className="h-3 bg-[#F7EAF0] rounded w-3/4" /><div className="h-3 bg-[#F7EAF0] rounded w-1/2" /></div>
                  </div>
                ))}
              </div>
            ) : filtered.length === 0 ? (
              <div className="text-center py-20">
                <Search size={48} style={{ color: '#F7EAF0' }} className="mx-auto mb-4" />
                <h3 style={{ color: '#2B2B2B' }} className="font-bold text-xl mb-2">No products found</h3>
                <p style={{ color: '#6B6B6B' }} className="text-sm mb-4">Try adjusting your filters or search term</p>
                <button onClick={clearAll} style={{ background: '#B9375E', color: '#fff' }}
                  className="px-6 py-2.5 rounded-xl text-sm font-semibold hover:opacity-90 transition-opacity">Clear Filters</button>
              </div>
            ) : (
              <AnimatePresence mode="wait">
                <motion.div key={`${category}-${metalType}-${sort}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}
                  className={`grid gap-6 ${viewMode === 'grid' ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}>
                  {filtered.map(product => (
                    <ProductCard key={product.id} product={product} onAuthRequired={() => navigate('/auth')} />
                  ))}
                </motion.div>
              </AnimatePresence>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
