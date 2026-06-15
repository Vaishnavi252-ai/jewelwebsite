import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Trash2, Minus, Plus, ShoppingBag, ChevronRight } from 'lucide-react';
import { toast } from 'sonner';
import { getCartItems, updateCartItem, removeCartItem, clearCart } from '../services/cart';
import { useAuth } from '../lib/AuthContext';
import { LOCAL_IMGS } from '../lib/utils';

export default function Cart() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [updating, setUpdating] = useState<string | null>(null);

  const { data: items = [], isLoading } = useQuery({
    queryKey: ['cart', user?.id],
    queryFn: () => getCartItems(user!.id),
    enabled: !!user,
  });

  const clearMutation = useMutation({
    mutationFn: () => clearCart(user!.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart', user!.id] });
      toast.success('Cart cleared');
    },
  });

  const handleQty = async (id: string, qty: number) => {
    if (qty < 1) return;
    setUpdating(id);
    try {
      await updateCartItem(id, qty);
      queryClient.invalidateQueries({ queryKey: ['cart', user!.id] });
    } finally {
      setUpdating(null);
    }
  };

  const handleRemove = async (id: string) => {
    try {
      await removeCartItem(id);
      queryClient.invalidateQueries({ queryKey: ['cart', user!.id] });
      toast.success('Item removed');
    } catch {
      toast.error('Failed to remove');
    }
  };

  const subtotal = items.reduce((s, i) => s + i.price * i.quantity, 0);
  const shipping = subtotal >= 5000 ? 0 : 99;
  const total = subtotal + shipping;

  if (isLoading) {
    return (
      <div style={{ backgroundColor: '#FFF8FA' }} className="min-h-screen py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="h-8 bg-[#F7EAF0] rounded w-48 mb-8" />
            <div className="grid lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-4">
                {[...Array(3)].map((_, i) => <div key={i} className="h-32 bg-[#F7EAF0] rounded-2xl" />)}
              </div>
              <div className="h-80 bg-[#F7EAF0] rounded-2xl" />
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
          <div>
            <h1 style={{ color: '#2B2B2B' }} className="text-3xl font-bold flex items-center gap-3">
              <ShoppingBag size={28} style={{ color: '#B9375E' }} /> Shopping Cart
            </h1>
            <p style={{ color: '#6B6B6B' }} className="text-sm mt-1">{items.length} item{items.length !== 1 ? 's' : ''}</p>
          </div>
          {items.length > 0 && (
            <button onClick={() => clearMutation.mutate()} disabled={clearMutation.isPending}
              style={{ color: '#B9375E' }} className="text-sm font-medium hover:underline disabled:opacity-50">
              Clear Cart
            </button>
          )}
        </div>

        {items.length === 0 ? (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center py-20">
            <div style={{ backgroundColor: '#FFF8FA', border: '1px solid #F7EAF0' }} className="w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
              <ShoppingBag size={40} style={{ color: '#B9375E' }} />
            </div>
            <h2 style={{ color: '#2B2B2B' }} className="text-xl font-bold mb-2">Your cart is empty</h2>
            <p style={{ color: '#6B6B6B' }} className="text-sm mb-6">Looks like you haven't added anything yet</p>
            <button onClick={() => navigate('/products')}
              style={{ background: 'linear-gradient(135deg, #B9375E, #D4AF37)', color: '#fff' }}
              className="px-8 py-3 rounded-xl font-semibold text-sm hover:opacity-90 transition-opacity">
              Start Shopping
            </button>
          </motion.div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Items */}
            <div className="lg:col-span-2 space-y-4">
              {items.map(item => {
                const img = item.images?.[0] || LOCAL_IMGS[item.id.charCodeAt(0) % LOCAL_IMGS.length];
                return (
                  <motion.div key={item.id} layout
                    style={{ backgroundColor: '#FFFFFF', border: '1px solid #F7EAF0' }}
                    className="flex gap-4 p-4 rounded-2xl">
                    <div className="w-24 h-24 rounded-xl overflow-hidden shrink-0" style={{ backgroundColor: '#FFF8FA' }}>
                      <img src={img} alt={item.title} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 style={{ color: '#2B2B2B' }} className="font-semibold text-sm mb-1 truncate">{item.title}</h3>
                      <p style={{ color: '#6B6B6B' }} className="text-xs mb-2">{item.metal_type} | {item.gemstone || 'No gemstone'}</p>
                      <p style={{ color: '#B9375E' }} className="font-bold text-sm">₹{item.price.toLocaleString('en-IN')}</p>
                    </div>
                    <div className="flex flex-col items-end justify-between">
                      <button onClick={() => handleRemove(item.id)} style={{ color: '#6B6B6B' }}
                        className="p-1.5 hover:text-[#B9375E] hover:bg-[#F7EAF0] rounded-lg transition-colors">
                        <Trash2 size={16} />
                      </button>
                      <div style={{ backgroundColor: '#FFF8FA', border: '1px solid #F7EAF0' }} className="flex items-center rounded-lg overflow-hidden">
                        <button onClick={() => handleQty(item.id, item.quantity - 1)} style={{ color: '#6B6B6B' }}
                          className="px-2 py-1 hover:bg-[#F7EAF0] transition-colors"><Minus size={14} /></button>
                        <span style={{ color: '#2B2B2B' }} className="px-3 text-sm font-semibold min-w-[2rem] text-center">
                          {updating === item.id ? '...' : item.quantity}
                        </span>
                        <button onClick={() => handleQty(item.id, item.quantity + 1)} style={{ color: '#6B6B6B' }}
                          className="px-2 py-1 hover:bg-[#F7EAF0] transition-colors"><Plus size={14} /></button>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Summary */}
            <div className="lg:sticky lg:top-24 h-fit">
              <div style={{ backgroundColor: '#FFFFFF', border: '1px solid #F7EAF0' }} className="rounded-2xl p-6">
                <h2 style={{ color: '#2B2B2B' }} className="font-bold text-lg mb-6">Order Summary</h2>
                <div className="space-y-4 mb-6">
                  <div className="flex justify-between text-sm">
                    <span style={{ color: '#6B6B6B' }}>Subtotal</span>
                    <span style={{ color: '#2B2B2B' }} className="font-medium">₹{subtotal.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span style={{ color: '#6B6B6B' }}>Shipping</span>
                    <span style={{ color: shipping === 0 ? '#22C55E' : '#2B2B2B' }} className="font-medium">
                      {shipping === 0 ? 'FREE' : `₹${shipping}`}
                    </span>
                  </div>
                  {subtotal < 5000 && (
                    <p style={{ color: '#B9375E' }} className="text-xs bg-[#B9375E]/10 p-3 rounded-xl">
                      Add ₹{(5000 - subtotal).toLocaleString('en-IN')} more for free shipping!
                    </p>
                  )}
                  <div style={{ borderTop: '1px solid #F7EAF0' }} className="pt-4 flex justify-between">
                    <span style={{ color: '#2B2B2B' }} className="font-bold">Total</span>
                    <span style={{ color: '#B9375E' }} className="font-bold text-lg">₹{total.toLocaleString('en-IN')}</span>
                  </div>
                </div>
                <button onClick={() => navigate('/checkout')}
                  style={{ background: 'linear-gradient(135deg, #B9375E, #D4AF37)', color: '#fff' }}
                  className="w-full py-3.5 rounded-xl font-semibold text-sm hover:opacity-90 transition-opacity flex items-center justify-center gap-2">
                  Proceed to Checkout <ChevronRight size={18} />
                </button>
                <button onClick={() => navigate('/products')}
                  style={{ color: '#6B6B6B' }}
                  className="w-full py-3 text-sm font-medium hover:text-[#B9375E] transition-colors mt-3">
                  Continue Shopping
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
