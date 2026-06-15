import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { Heart, ShoppingBag, Truck, Shield, RotateCcw, ChevronRight, Star, Minus, Plus, Share2 } from 'lucide-react';
import { toast } from 'sonner';
import { getProductBySlug, getProducts } from '../services/products';
import { addToCart } from '../services/cart';
import { addToWishlist, removeFromWishlist, isInWishlist } from '../services/wishlist';
import { useAuth } from '../lib/AuthContext';
import ProductCard from '../components/ProductCard';
import { METAL_LABELS, LOCAL_IMGS } from '../lib/utils';

export default function ProductDetail() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [qty, setQty] = useState(1);
  const [activeImg, setActiveImg] = useState(0);
  const [addingCart, setAddingCart] = useState(false);

  const { data: product, isLoading } = useQuery({
    queryKey: ['product', slug],
    queryFn: () => getProductBySlug(slug!),
    enabled: !!slug,
  });

  const { data: allProducts = [] } = useQuery({
    queryKey: ['products', 'all'],
    queryFn: () => getProducts(),
  });

  const { data: inWishlist, refetch: refetchWishlist } = useQuery({
    queryKey: ['wishlist-check', product?.id, user?.id],
    queryFn: () => isInWishlist(user!.id, product!.id),
    enabled: !!user && !!product,
  });

  const related = allProducts.filter(p => p.category_slug === product?.category_slug && p.id !== product?.id).slice(0, 4);

  const handleCart = async () => {
    if (!user) { navigate('/auth'); return; }
    if (!product) return;
    setAddingCart(true);
    try {
      await addToCart(user.id, product.id, product.price, qty);
      toast.success('Added to cart');
    } catch (e) {
      toast.error('Failed to add to cart');
    } finally {
      setAddingCart(false);
    }
  };

  const handleWishlist = async () => {
    if (!user) { navigate('/auth'); return; }
    if (!product) return;
    try {
      if (inWishlist) {
        await removeFromWishlist(user.id, product.id);
        toast.success('Removed from wishlist');
      } else {
        await addToWishlist(user.id, product.id);
        toast.success('Added to wishlist');
      }
      refetchWishlist();
    } catch (e) {
      toast.error('Failed to update wishlist');
    }
  };

  const images = product?.images?.length ? product.images : [LOCAL_IMGS[product?.id ? (product.id.charCodeAt(0) % LOCAL_IMGS.length) : 0]];

  if (isLoading) {
    return (
      <div style={{ backgroundColor: '#FFF8FA' }} className="min-h-screen py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse grid lg:grid-cols-2 gap-10">
            <div className="aspect-square bg-[#F7EAF0] rounded-2xl" />
            <div className="space-y-4"><div className="h-8 bg-[#F7EAF0] rounded w-3/4" /><div className="h-4 bg-[#F7EAF0] rounded w-1/2" /></div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div style={{ backgroundColor: '#FFF8FA' }} className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 style={{ color: '#2B2B2B' }} className="text-2xl font-bold mb-4">Product not found</h1>
          <button onClick={() => navigate('/products')} style={{ background: '#B9375E', color: '#fff' }} className="px-6 py-3 rounded-xl font-semibold hover:opacity-90 transition-opacity">Browse Products</button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: '#FFF8FA' }} className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm mb-8">
          <button onClick={() => navigate('/')} style={{ color: '#6B6B6B' }} className="hover:text-[#B9375E] transition-colors">Home</button>
          <ChevronRight size={14} style={{ color: '#6B6B6B' }} />
          <button onClick={() => navigate('/products')} style={{ color: '#6B6B6B' }} className="hover:text-[#B9375E] transition-colors">Products</button>
          <ChevronRight size={14} style={{ color: '#6B6B6B' }} />
          <span style={{ color: '#2B2B2B' }} className="font-medium">{product.title}</span>
        </nav>

        {/* Main content */}
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16">
          {/* Images */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4 }}>
            <div style={{ backgroundColor: '#FFFFFF', border: '1px solid #F7EAF0' }} className="aspect-square rounded-3xl overflow-hidden mb-4 shadow-sm">
              <img src={images[activeImg]} alt={product.title} className="w-full h-full object-cover" />
            </div>
            {images.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2">
                {images.map((img, i) => (
                  <button key={i} onClick={() => setActiveImg(i)}
                    style={{ border: activeImg === i ? '2px solid #B9375E' : '1px solid #F7EAF0', backgroundColor: '#FFFFFF' }}
                    className="w-20 h-20 rounded-xl overflow-hidden shrink-0 transition-all">
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </motion.div>

          {/* Details */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4 }} className="flex flex-col">
            <div className="flex items-start justify-between gap-4 mb-4">
              <div>
                <p style={{ color: '#B9375E' }} className="text-xs font-semibold uppercase tracking-wider mb-2">{product.category_name}</p>
                <h1 style={{ color: '#2B2B2B' }} className="text-3xl lg:text-4xl font-bold">{product.title}</h1>
              </div>
              <button onClick={handleWishlist} style={{ backgroundColor: '#FFF8FA', border: '1px solid #F7EAF0' }}
                className="p-3 rounded-xl hover:bg-[#F7EAF0] transition-colors shrink-0">
                <Heart size={22} fill={inWishlist ? '#B9375E' : 'none'} style={{ color: inWishlist ? '#B9375E' : '#6B6B6B' }} />
              </button>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-3 mb-6">
              <span style={{ color: '#B9375E' }} className="text-3xl font-bold">₹{product.price.toLocaleString('en-IN')}</span>
              {product.original_price && product.original_price > product.price && (
                <>
                  <span style={{ color: '#6B6B6B', textDecoration: 'line-through' }} className="text-lg">₹{product.original_price.toLocaleString('en-IN')}</span>
                  <span style={{ color: '#D4AF37' }} className="text-sm font-semibold bg-[#D4AF37]/10 px-2 py-0.5 rounded-full">
                    {Math.round((1 - product.price / product.original_price) * 100)}% OFF
                  </span>
                </>
              )}
            </div>

            {/* Rating */}
            <div className="flex items-center gap-2 mb-6">
              <div className="flex gap-0.5">{[...Array(5)].map((_, i) => <Star key={i} size={16} fill={i < 4 ? '#D4AF37' : 'none'} style={{ color: '#D4AF37' }} />)}</div>
              <span style={{ color: '#6B6B6B' }} className="text-sm">4.8 (124 reviews)</span>
            </div>

            {/* Description */}
            <p style={{ color: '#6B6B6B' }} className="text-sm leading-relaxed mb-6">{product.description}</p>

            {/* Specs */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              {product.metal_type && (
                <div style={{ backgroundColor: '#FFFFFF', border: '1px solid #F7EAF0' }} className="p-4 rounded-xl">
                  <p style={{ color: '#6B6B6B' }} className="text-xs mb-1">Metal Type</p>
                  <p style={{ color: '#2B2B2B' }} className="font-semibold text-sm">{METAL_LABELS[product.metal_type] || product.metal_type}</p>
                </div>
              )}
              {product.gemstone && (
                <div style={{ backgroundColor: '#FFFFFF', border: '1px solid #F7EAF0' }} className="p-4 rounded-xl">
                  <p style={{ color: '#6B6B6B' }} className="text-xs mb-1">Gemstone</p>
                  <p style={{ color: '#2B2B2B' }} className="font-semibold text-sm">{product.gemstone}</p>
                </div>
              )}
              {product.weight && (
                <div style={{ backgroundColor: '#FFFFFF', border: '1px solid #F7EAF0' }} className="p-4 rounded-xl">
                  <p style={{ color: '#6B6B6B' }} className="text-xs mb-1">Weight</p>
                  <p style={{ color: '#2B2B2B' }} className="font-semibold text-sm">{product.weight}g</p>
                </div>
              )}
              {product.in_stock && (
                <div style={{ backgroundColor: '#FFFFFF', border: '1px solid #F7EAF0' }} className="p-4 rounded-xl">
                  <p style={{ color: '#6B6B6B' }} className="text-xs mb-1">Availability</p>
                  <p style={{ color: product.in_stock ? '#2B2B2B' : '#B9375E' }} className="font-semibold text-sm">{product.in_stock ? 'In Stock' : 'Out of Stock'}</p>
                </div>
              )}
            </div>

            {/* Quantity */}
            <div className="flex items-center gap-6 mb-6">
              <p style={{ color: '#2B2B2B' }} className="font-medium text-sm">Quantity:</p>
              <div style={{ backgroundColor: '#FFF8FA', border: '1px solid #F7EAF0' }} className="flex items-center rounded-xl overflow-hidden">
                <button onClick={() => setQty(Math.max(1, qty - 1))} style={{ color: '#6B6B6B' }} className="p-3 hover:bg-[#F7EAF0] transition-colors"><Minus size={16} /></button>
                <span style={{ color: '#2B2B2B' }} className="w-12 text-center font-semibold text-sm">{qty}</span>
                <button onClick={() => setQty(qty + 1)} style={{ color: '#6B6B6B' }} className="p-3 hover:bg-[#F7EAF0] transition-colors"><Plus size={16} /></button>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-4 mb-8">
              <button onClick={handleCart} disabled={addingCart || !product.in_stock}
                style={{ background: 'linear-gradient(135deg, #B9375E, #D4AF37)', color: '#fff' }}
                className="flex-1 py-4 rounded-xl font-semibold text-sm hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2">
                <ShoppingBag size={18} /> {addingCart ? 'Adding...' : 'Add to Cart'}
              </button>
              <button style={{ backgroundColor: '#2B2B2B', color: '#fff' }}
                className="p-4 rounded-xl hover:opacity-90 transition-opacity">
                <Share2 size={18} />
              </button>
            </div>

            {/* Trust badges */}
            <div className="grid grid-cols-3 gap-4 pt-6" style={{ borderTop: '1px solid #F7EAF0' }}>
              {[
                { icon: Truck, label: 'Free Shipping', sub: 'Orders over ₹5,000' },
                { icon: Shield, label: 'Certified', sub: 'Hallmarked jewelry' },
                { icon: RotateCcw, label: '7-Day Returns', sub: 'Easy returns policy' },
              ].map(item => (
                <div key={item.label} className="text-center">
                  <item.icon size={24} style={{ color: '#B9375E' }} className="mx-auto mb-2" />
                  <p style={{ color: '#2B2B2B' }} className="text-xs font-semibold">{item.label}</p>
                  <p style={{ color: '#6B6B6B' }} className="text-xs">{item.sub}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Related products */}
        {related.length > 0 && (
          <section className="mt-20">
            <h2 style={{ color: '#2B2B2B' }} className="text-2xl font-bold mb-8">You May Also Like</h2>
            <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
              {related.map(p => <ProductCard key={p.id} product={p} onAuthRequired={() => navigate('/auth')} />)}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
