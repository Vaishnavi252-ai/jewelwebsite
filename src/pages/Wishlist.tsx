import { motion, AnimatePresence } from 'framer-motion';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Heart, Trash2, ShoppingBag, ChevronRight } from 'lucide-react';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { getWishlistItems, removeFromWishlist, clearWishlist } from '../services/wishlist';
import { addToCart } from '../services/cart';
import { useAuth } from '../lib/AuthContext';
import { LOCAL_IMGS, METAL_LABELS } from '../lib/utils';

export default function Wishlist() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: items = [], isLoading } = useQuery({
    queryKey: ['wishlist', user?.id],
    queryFn: () => getWishlistItems(user!.id),
    enabled: !!user,
  });

  const removeMutation = useMutation({
    mutationFn: (productId: string) => removeFromWishlist(user!.id, productId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wishlist', user!.id] });
      toast.success('Removed from wishlist');
    },
  });

  const clearMutation = useMutation({
    mutationFn: () => clearWishlist(user!.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wishlist', user!.id] });
      toast.success('Wishlist cleared');
    },
  });

  const handleAddToCart = async (productId: string, price: number) => {
    if (!user) { navigate('/auth'); return; }
    try {
      await addToCart(user.id, productId, price, 1);
      toast.success('Added to cart');
    } catch {
      toast.error('Failed to add to cart');
    }
  };

  if (isLoading) {
    return (
      <div style={{ backgroundColor: '#FFF8FA' }} className="min-h-screen py-10">
        <div className="max-w-7xl mx-auto px-4">
          <div className="animate-pulse">
            <div className="h-8 bg-[#F7EAF0] rounded w-48 mb-8" />
            <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
              {[...Array(6)].map((_, i) => <div key={i} className="h-64 bg-[#F7EAF0] rounded-2xl" />)}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: '#FFF8FA' }} className="min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 style={{ color: '#2B2B2B' }} className="text-3xl font-bold flex items-center gap-3">
              <Heart size={28} style={{ color: '#B9375E' }} fill="#B9375E" /> My Wishlist
            </h1>
            <p style={{ color: '#6B6B6B' }} className="text-sm mt-1">{items.length} item{items.length !== 1 ? 's' : ''} saved</p>
          </motion.div>
          {items.length > 0 && (
            <button onClick={() => clearMutation.mutate()} disabled={clearMutation.isPending}
              style={{ color: '#B9375E' }} className="text-sm font-medium hover:underline disabled:opacity-50">
              Clear All
            </button>
          )}
        </div>

        {items.length === 0 ? (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center py-20">
            <div style={{ backgroundColor: '#FFF8FA', border: '1px solid #F7EAF0' }} className="w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
              <Heart size={40} style={{ color: '#B9375E' }} />
            </div>
            <h2 style={{ color: '#2B2B2B' }} className="text-xl font-bold mb-2">Your wishlist is empty</h2>
            <p style={{ color: '#6B6B6B' }} className="text-sm mb-6">Save items you love by clicking the heart icon</p>
            <button onClick={() => navigate('/products')}
              style={{ background: 'linear-gradient(135deg, #B9375E, #D4AF37)', color: '#fff' }}
              className="px-8 py-3 rounded-xl font-semibold text-sm hover:opacity-90 transition-opacity">
              Explore Collection
            </button>
          </motion.div>
        ) : (
          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            <AnimatePresence>
              {items.map((item, i) => {
                const img = item.images?.[0] || LOCAL_IMGS[i % LOCAL_IMGS.length];
                return (
                  <motion.div key={item.id} layout initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}
                    style={{ backgroundColor: '#FFFFFF', border: '1px solid #F7EAF0' }}
                    className="rounded-2xl overflow-hidden hover:shadow-lg transition-shadow group">
                    <div className="relative aspect-square">
                      <img src={img} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      <button onClick={() => removeMutation.mutate(item.id)}
                        style={{ backgroundColor: '#FFFFFF', border: '1px solid #F7EAF0' }}
                        className="absolute top-3 right-3 p-2 rounded-full shadow-md hover:bg-[#F7EAF0] transition-colors">
                        <Trash2 size={16} style={{ color: '#B9375E' }} />
                      </button>
                      {item.original_price && item.original_price > item.price && (
                        <span style={{ backgroundColor: '#B9375E', color: '#fff' }}
                          className="absolute top-3 left-3 px-2 py-1 rounded-full text-xs font-medium">
                          Sale
                        </span>
                      )}
                    </div>
                    <div className="p-4">
                      <p style={{ color: '#6B6B6B' }} className="text-xs mb-1">{item.category_name}</p>
                      <h3 style={{ color: '#2B2B2B' }} className="font-semibold text-sm mb-2 truncate cursor-pointer hover:text-[#B9375E]"
                        onClick={() => navigate(`/product/${item.slug}`)}>
                        {item.title}
                      </h3>
                      <div className="flex items-center gap-2 mb-3">
                        {item.metal_type && (
                          <span style={{ backgroundColor: '#FFF8FA', border: '1px solid #F7EAF0' }} className="px-2 py-0.5 rounded text-xs">
                            {METAL_LABELS[item.metal_type] || item.metal_type}
                          </span>
                        )}
                        {item.gemstone && (
                          <span style={{ backgroundColor: '#FFF8FA', border: '1px solid #F7EAF0' }} className="px-2 py-0.5 rounded text-xs">
                            {item.gemstone}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <span style={{ color: '#B9375E' }} className="font-bold text-sm">₹{item.price?.toLocaleString('en-IN')}</span>
                          {item.original_price && item.original_price > item.price && (
                            <span style={{ color: '#6B6B6B', textDecoration: 'line-through' }} className="text-xs ml-2">
                              ₹{item.original_price?.toLocaleString('en-IN')}
                            </span>
                          )}
                        </div>
                        <button onClick={() => handleAddToCart(item.id, item.price)}
                          style={{ backgroundColor: '#B9375E', color: '#fff' }}
                          className="p-2 rounded-lg hover:opacity-90 transition-opacity">
                          <ShoppingBag size={16} />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}

        {items.length > 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="mt-8 text-center">
            <button onClick={() => navigate('/products')}
              style={{ border: '1px solid #F7EAF0', color: '#2B2B2B' }}
              className="px-8 py-3 rounded-xl font-semibold text-sm hover:bg-[#F7EAF0] transition-colors inline-flex items-center gap-2">
              Continue Shopping <ChevronRight size={18} />
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
}
