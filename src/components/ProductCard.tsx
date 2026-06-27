import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, ShoppingCart, Star } from 'lucide-react';
import { toast } from 'sonner';
import { Product } from '../types';
import { useAuth } from '../lib/AuthContext';
import { addToCart } from '../services/cart';
import { addToWishlist } from '../services/wishlist';
import { useQueryClient } from '@tanstack/react-query';
import { METAL_LABELS } from '../lib/utils';

interface Props {
  product: Product;
  onAuthRequired?: () => void;
}

export default function ProductCard({ product, onAuthRequired }: Props) {
  const { user } = useAuth();
  const qc = useQueryClient();
  const [adding, setAdding] = useState(false);
  const [wishlisted, setWishlisted] = useState(false);

  const image = product.images?.[0] || '/IMG_20260615_204547.jpg';
  const discount = product.original_price
    ? Math.round(((product.original_price - product.price) / product.original_price) * 100)
    : 0;

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!user) { onAuthRequired?.(); return; }
    if (product.stock_quantity === 0) { toast.error('Out of stock'); return; }
    setAdding(true);
    try {
      await addToCart(user.id, product.id, product.price);
      qc.invalidateQueries({ queryKey: ['cart', user.id] });
      qc.invalidateQueries({ queryKey: ['cart'] });
      toast.success(`${product.title} added to cart`);
    } catch { toast.error('Failed to add to cart'); }
    finally { setAdding(false); }
  };

  const handleWishlist = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!user) { onAuthRequired?.(); return; }
    try {
      await addToWishlist(user.id, product.id);
      setWishlisted(true);
      qc.invalidateQueries({ queryKey: ['wishlist'] });
      toast.success('Added to wishlist');
    } catch { toast.error('Failed to add to wishlist'); }
  };

  return (
    <motion.div whileHover={{ y: -4 }} transition={{ duration: 0.2 }} className="group relative">
      <Link to={`/product/${product.slug}`}>
        <div style={{ backgroundColor: '#FFFFFF', border: '1px solid #F7EAF0' }} className="rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300">
          <div className="relative aspect-square overflow-hidden bg-[#FFF8FA]">
            <img
              src={image} alt={product.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              onError={e => { (e.target as HTMLImageElement).src = '/IMG_20260615_204547.jpg'; }}
            />
            <div className="absolute top-3 left-3 flex flex-col gap-1.5">
              {product.is_featured && (
                <span style={{ background: 'linear-gradient(135deg, #B9375E, #D4AF37)', color: '#fff' }} className="text-xs font-semibold px-2.5 py-1 rounded-full">Featured</span>
              )}
              {discount > 0 && (
                <span style={{ background: '#B9375E', color: '#fff' }} className="text-xs font-semibold px-2.5 py-1 rounded-full">-{discount}%</span>
              )}
              {product.stock_quantity === 0 && (
                <span style={{ background: '#6B6B6B', color: '#fff' }} className="text-xs font-semibold px-2.5 py-1 rounded-full">Sold Out</span>
              )}
            </div>
            <button onClick={handleWishlist}
              style={{ background: wishlisted ? '#B9375E' : 'rgba(255,255,255,0.9)', color: wishlisted ? '#fff' : '#B9375E', border: '1px solid #F7EAF0' }}
              className="absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center shadow-sm opacity-0 group-hover:opacity-100 transition-all duration-200">
              <Heart size={14} fill={wishlisted ? 'currentColor' : 'none'} />
            </button>
            <div className="absolute bottom-0 left-0 right-0 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
              <button onClick={handleAddToCart} disabled={adding || product.stock_quantity === 0}
                style={{ background: 'linear-gradient(135deg, #B9375E, #D4AF37)', color: '#fff' }}
                className="w-full py-3 text-sm font-semibold flex items-center justify-center gap-2 disabled:opacity-70">
                <ShoppingCart size={16} />
                {adding ? 'Adding...' : product.stock_quantity === 0 ? 'Out of Stock' : 'Quick Add'}
              </button>
            </div>
          </div>

          <div className="p-4">
            {product.metal_type && (
              <span style={{ color: '#B9375E', backgroundColor: '#FFF8FA', border: '1px solid #F7EAF0' }} className="text-xs font-medium px-2 py-0.5 rounded-full">
                {METAL_LABELS[product.metal_type]}{product.gemstone && ` · ${product.gemstone}`}
              </span>
            )}
            <h3 style={{ color: '#2B2B2B' }} className="font-semibold text-sm mt-2 mb-1 line-clamp-2 leading-snug">{product.title}</h3>
            <div className="flex items-center gap-1 mb-2">
              {[1,2,3,4,5].map(s => <Star key={s} size={11} style={{ color: '#D4AF37' }} fill="#D4AF37" />)}
              <span style={{ color: '#6B6B6B' }} className="text-xs ml-1">(24)</span>
            </div>
            <div className="flex items-center gap-2">
              <span style={{ color: '#B9375E' }} className="font-bold text-base">₹{product.price.toLocaleString('en-IN')}</span>
              {product.original_price && (
                <span style={{ color: '#6B6B6B' }} className="text-sm line-through">₹{product.original_price.toLocaleString('en-IN')}</span>
              )}
            </div>
            <div className="flex items-center gap-1.5 mt-1.5">
              <div style={{ background: product.stock_quantity > 0 ? '#22c55e' : '#ef4444' }} className="w-1.5 h-1.5 rounded-full" />
              <span style={{ color: product.stock_quantity > 0 ? '#22c55e' : '#ef4444' }} className="text-xs font-medium">
                {product.stock_quantity > 0 ? 'In Stock' : 'Out of Stock'}
              </span>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
