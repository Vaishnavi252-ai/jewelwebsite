import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';

import { Lock, CreditCard, Truck, MapPin, User, Phone, ChevronRight } from 'lucide-react';
import { toast } from 'sonner';
import { getCartItems } from '../services/cart';
import { placeOrder } from '../services/orders';
import { createRazorpayOrder, verifyRazorpayPayment } from '../services/razorpay';

// Razorpay Checkout script loader (client-side)
function ensureRazorpaySdkLoaded() {
  const w = window as any;
  if (w?.Razorpay) return;
  const id = 'razorpay-sdk';
  const existing = document.getElementById(id);
  if (existing) return;
  const script = document.createElement('script');
  script.id = id;
  script.src = 'https://checkout.razorpay.com/v1/checkout.js';
  script.async = true;
  document.body.appendChild(script);
}
import { useAuth } from '../lib/AuthContext';
import { LOCAL_IMGS } from '../lib/utils';


export default function Checkout() {
  const navigate = useNavigate();
  const { user, profile } = useAuth();
  const [submitting, setSubmitting] = useState(false);
  // prevents Razorpay modal dismiss from overwriting paid/captured orders
  const paymentSucceededRef = useRef(false);
  const [form, setForm] = useState({
    name: profile?.full_name || '',
    phone: '',
    street: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'India',
    paymentMethod: 'card',
  });

  const { data: items = [], isLoading } = useQuery({
    queryKey: ['cart', user?.id],
    queryFn: () => getCartItems(user!.id),
    enabled: !!user,
  });

  const subtotal = items.reduce((s, i) => s + Number((i as any).price ?? (i as any).unit_price ?? 0) * i.quantity, 0);
  const shipping = subtotal >= 5000 ? 0 : 99;
  const tax = Math.round(subtotal * 0.03);
  const total = subtotal + shipping + tax;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.phone || !form.street || !form.city || !form.state || !form.postalCode) {
      toast.error('Please fill all fields');
      return;
    }
    setSubmitting(true);

    try {
      // 1) Create local pending order in Supabase
      const order = await placeOrder({
        userId: user!.id,
        customerName: form.name,
        customerPhone: form.phone,
        shippingStreet: form.street,
        shippingCity: form.city,
        shippingState: form.state,
        shippingPostalCode: form.postalCode,
        shippingCountry: form.country,
        cartItems: items.map(i => ({
          ...(i as any),
          // extra fields to satisfy CartItem type
          user_id: user!.id,
          created_at: (i as any).created_at || new Date().toISOString(),
        })) as any,
        paymentMethod: form.paymentMethod,
      });

      // 2) If COD, do NOT open Razorpay.
      // Mark order as paid/confirmed immediately for COD flow.
      if (form.paymentMethod === 'cod') {
        const { supabase } = await import('../lib/supabase');
        await supabase
          .from('orders')
          .update({
            payment_status: 'paid',
            payment_verified: false,
            paid_at: new Date().toISOString(),
          })
          .eq('id', order.id);

        // Clear cart for COD too
        await supabase.from('cart_items').delete().eq('user_id', user!.id);

        toast.success('Order confirmed (Cash on Delivery)');
        navigate(`/order-confirmation?id=${order.id}`);
        return;
      }

      // 3) Create Razorpay order on server
      const amountPaise = Math.round(total * 100);
      const { razorpayOrderId } = await createRazorpayOrder({
        localOrderId: order.id,
        amountPaise,
        currency: 'INR',
        notes: {
          user_id: user!.id,
          payment_method: form.paymentMethod,
        },
      });

      // 4) Open Razorpay Checkout (UPI supported by Razorpay methods)
      ensureRazorpaySdkLoaded();
      const w = window as any;
      if (!w.Razorpay) {
        throw new Error('Razorpay SDK not loaded (script failed to load)');
      }

      const options: any = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: amountPaise,
        currency: 'INR',
        name: 'VILAVIE Jewel',
        description: `Order ${order.order_number}`,
        order_id: razorpayOrderId,
        prefill: {
          name: form.name,
          contact: form.phone,
        },
        notes: {
          local_order_id: order.id,
        },
        handler: async function (response: any) {
          try {
            await verifyRazorpayPayment({
              localOrderId: order.id,
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
              paymentMethod: form.paymentMethod,
            });

            // Update order after successful payment
            const { supabase } = await import('../lib/supabase');

            await supabase
              .from('orders')
              .update({
                payment_status: 'paid',
                payment_verified: true,
                paid_at: new Date().toISOString(),
                razorpay_order_id: response.razorpay_order_id ?? response.razorpayOrderId,
                razorpay_payment_id: response.razorpay_payment_id,
              })
              .eq('id', order.id);

            // Clear cart only after paid
            await supabase.from('cart_items').delete().eq('user_id', user!.id);

            paymentSucceededRef.current = true;
            toast.success('Payment successful!');
            navigate(`/order-confirmation?id=${order.id}`);
          } catch (err) {
            toast.error('Payment verification failed');
            navigate('/cart');
          }
        },
        modal: {
          ondismiss: async () => {
            // User closed/cancelled payment UI
            try {
              const { supabase } = await import('../lib/supabase');

              await supabase
                .from('orders')
                .update({
                  payment_status: 'cancelled',
                  payment_verified: false,
                  paid_at: null,
                  razorpay_payment_id: null,
                })
                .eq('id', order.id);
            } catch {
              // Don’t block navigation if update fails
            } finally {
              if (!paymentSucceededRef.current) {
                toast.error('Payment cancelled');
                navigate('/cart');
              }
            }
          },
        },
        theme: {
          color: '#B9375E',
        },
      };

      const rzp = new w.Razorpay(options);
      rzp.open();
    } catch (err) {
      toast.error((err as any)?.message || 'Failed to start payment');
    } finally {
      setSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div style={{ backgroundColor: '#FFF8FA' }} className="min-h-screen py-10">
        <div className="max-w-7xl mx-auto px-4">
          <div className="animate-pulse grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 h-96 bg-[#F7EAF0] rounded-2xl" />
            <div className="h-96 bg-[#F7EAF0] rounded-2xl" />
          </div>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    navigate('/cart');
    return null;
  }

  return (
    <div style={{ backgroundColor: '#FFF8FA' }} className="min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 style={{ color: '#2B2B2B' }} className="text-3xl font-bold">Checkout</h1>
          <div className="flex items-center gap-2 mt-2">
            {[
              { label: 'Cart', path: '/cart' },
              { label: 'Checkout', path: '/checkout' },
            ].map((step, i) => (
              <span key={step.label} className="flex items-center gap-2">
                {i > 0 && <ChevronRight size={14} style={{ color: '#6B6B6B' }} />}
                <button
                  onClick={() => step.path && navigate(step.path)}
                  style={{ color: i === 1 ? '#B9375E' : '#6B6B6B' }}
                  className={`text-sm font-medium ${i === 0 ? 'hover:text-[#B9375E]' : ''}`}
                  disabled={i === 1}
                >
                  {step.label}
                </button>
              </span>
            ))}
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Form */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Contact */}
              <div style={{ backgroundColor: '#FFFFFF', border: '1px solid #F7EAF0' }} className="rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div style={{ background: 'linear-gradient(135deg, #B9375E, #D4AF37)' }} className="w-10 h-10 rounded-xl flex items-center justify-center">
                    <User size={18} className="text-white" />
                  </div>
                  <div>
                    <h2 style={{ color: '#2B2B2B' }} className="font-bold">Contact Information</h2>
                    <p style={{ color: '#6B6B6B' }} className="text-xs">We'll use this to send order updates</p>
                  </div>
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label style={{ color: '#2B2B2B' }} className="block text-sm font-medium mb-1.5">Full Name</label>
                    <input type="text" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                      placeholder="Your name" required
                      style={{ backgroundColor: '#FFF8FA', border: '1px solid #F7EAF0', color: '#2B2B2B' }}
                      className="w-full px-4 py-3 rounded-xl text-sm outline-none focus:border-[#B9375E] transition-colors" />
                  </div>
                  <div>
                    <label style={{ color: '#2B2B2B' }} className="block text-sm font-medium mb-1.5">Phone</label>
                    <div className="relative">
                      <Phone size={16} style={{ color: '#6B6B6B' }} className="absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input type="tel" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                        placeholder="+91 9876543210" required
                        style={{ backgroundColor: '#FFF8FA', border: '1px solid #F7EAF0', color: '#2B2B2B' }}
                        className="w-full pl-10 pr-4 py-3 rounded-xl text-sm outline-none focus:border-[#B9375E] transition-colors" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Shipping */}
              <div style={{ backgroundColor: '#FFFFFF', border: '1px solid #F7EAF0' }} className="rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div style={{ background: 'linear-gradient(135deg, #B9375E, #D4AF37)' }} className="w-10 h-10 rounded-xl flex items-center justify-center">
                    <MapPin size={18} className="text-white" />
                  </div>
                  <div>
                    <h2 style={{ color: '#2B2B2B' }} className="font-bold">Shipping Address</h2>
                    <p style={{ color: '#6B6B6B' }} className="text-xs">Where should we deliver your order?</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <label style={{ color: '#2B2B2B' }} className="block text-sm font-medium mb-1.5">Street Address</label>
                    <input type="text" value={form.street} onChange={e => setForm(f => ({ ...f, street: e.target.value }))}
                      placeholder="Address line" required
                      style={{ backgroundColor: '#FFF8FA', border: '1px solid #F7EAF0', color: '#2B2B2B' }}
                      className="w-full px-4 py-3 rounded-xl text-sm outline-none focus:border-[#B9375E] transition-colors" />
                  </div>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label style={{ color: '#2B2B2B' }} className="block text-sm font-medium mb-1.5">City</label>
                      <input type="text" value={form.city} onChange={e => setForm(f => ({ ...f, city: e.target.value }))}
                        placeholder="City" required
                        style={{ backgroundColor: '#FFF8FA', border: '1px solid #F7EAF0', color: '#2B2B2B' }}
                        className="w-full px-4 py-3 rounded-xl text-sm outline-none focus:border-[#B9375E] transition-colors" />
                    </div>
                    <div>
                      <label style={{ color: '#2B2B2B' }} className="block text-sm font-medium mb-1.5">State</label>
                      <input type="text" value={form.state} onChange={e => setForm(f => ({ ...f, state: e.target.value }))}
                        placeholder="State" required
                        style={{ backgroundColor: '#FFF8FA', border: '1px solid #F7EAF0', color: '#2B2B2B' }}
                        className="w-full px-4 py-3 rounded-xl text-sm outline-none focus:border-[#B9375E] transition-colors" />
                    </div>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label style={{ color: '#2B2B2B' }} className="block text-sm font-medium mb-1.5">Postal Code</label>
                      <input type="text" value={form.postalCode} onChange={e => setForm(f => ({ ...f, postalCode: e.target.value }))}
                        placeholder="PIN Code" required
                        style={{ backgroundColor: '#FFF8FA', border: '1px solid #F7EAF0', color: '#2B2B2B' }}
                        className="w-full px-4 py-3 rounded-xl text-sm outline-none focus:border-[#B9375E] transition-colors" />
                    </div>
                    <div>
                      <label style={{ color: '#2B2B2B' }} className="block text-sm font-medium mb-1.5">Country</label>
                      <select value={form.country} onChange={e => setForm(f => ({ ...f, country: e.target.value }))}
                        style={{ backgroundColor: '#FFF8FA', border: '1px solid #F7EAF0', color: '#2B2B2B' }}
                        className="w-full px-4 py-3 rounded-xl text-sm outline-none focus:border-[#B9375E] transition-colors">
                        <option>India</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment */}
              <div style={{ backgroundColor: '#FFFFFF', border: '1px solid #F7EAF0' }} className="rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div style={{ background: 'linear-gradient(135deg, #B9375E, #D4AF37)' }} className="w-10 h-10 rounded-xl flex items-center justify-center">
                    <CreditCard size={18} className="text-white" />
                  </div>
                  <div>
                    <h2 style={{ color: '#2B2B2B' }} className="font-bold">Payment Method</h2>
                    <p style={{ color: '#6B6B6B' }} className="text-xs">Choose how you want to pay</p>
                  </div>
                </div>
                <div className="space-y-3">
                  {[
                    { id: 'card', label: 'Credit/Debit Card', desc: 'Visa, Mastercard, RuPay' },
                    { id: 'upi', label: 'UPI', desc: 'Google Pay, PhonePe, Paytm' },
                    { id: 'cod', label: 'Cash on Delivery', desc: 'Pay when you receive' },
                  ].map(method => (
                    <label key={method.id}
                      style={{ backgroundColor: form.paymentMethod === method.id ? '#FFF8FA' : 'transparent', border: `1px solid ${form.paymentMethod === method.id ? '#B9375E' : '#F7EAF0'}` }}
                      className="flex items-center gap-4 p-4 rounded-xl cursor-pointer transition-all">
                      <input type="radio" name="payment" value={method.id} checked={form.paymentMethod === method.id}
                        onChange={e => setForm(f => ({ ...f, paymentMethod: e.target.value }))}
                        className="accent-[#B9375E]" />
                      <div>
                        <p style={{ color: '#2B2B2B' }} className="font-medium text-sm">{method.label}</p>
                        <p style={{ color: '#6B6B6B' }} className="text-xs">{method.desc}</p>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              <button type="submit" disabled={submitting}
                style={{ background: 'linear-gradient(135deg, #B9375E, #D4AF37)', color: '#fff' }}
                className="w-full py-4 rounded-xl font-semibold text-sm hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2">
                <Lock size={18} /> {submitting ? 'Processing...' : `Pay ₹${total.toLocaleString('en-IN')}`}
              </button>
            </form>
          </motion.div>

          {/* Order Summary */}
          <div className="lg:sticky lg:top-24 h-fit">
            <div style={{ backgroundColor: '#FFFFFF', border: '1px solid #F7EAF0' }} className="rounded-2xl p-6">
              <h2 style={{ color: '#2B2B2B' }} className="font-bold text-lg mb-6">Order Summary</h2>
              <div className="space-y-4 mb-6">
                {items.slice(0, 3).map(item => {
                  const img =
                    item.product?.images?.[0] ||
                    LOCAL_IMGS[
                      (item.product_id || item.id).charCodeAt(0) % LOCAL_IMGS.length
                    ];

                  return (
                    <div key={item.id} className="flex gap-3">
                      <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0" style={{ backgroundColor: '#FFF8FA' }}>
                        <img
                          src={img}
                          alt={item.product?.title ?? (item as any).title ?? 'Cart item'}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p style={{ color: '#2B2B2B' }} className="text-sm font-medium truncate">
                          {item.product?.title ?? (item as any).title}
                        </p>
                        <p style={{ color: '#6B6B6B' }} className="text-xs">Qty: {item.quantity}</p>
                        <p style={{ color: '#B9375E' }} className="text-sm font-semibold">₹{(Number((item as any).price ?? (item as any).unit_price ?? 0) * item.quantity).toLocaleString('en-IN')}</p>
                      </div>
                    </div>
                  );
                })}
                {items.length > 3 && (
                  <p style={{ color: '#6B6B6B' }} className="text-xs text-center">+{items.length - 3} more items</p>
                )}
              </div>
              <div className="space-y-3 mb-6" style={{ borderTop: '1px solid #F7EAF0', paddingTop: '1rem' }}>
                <div className="flex justify-between text-sm">
                  <span style={{ color: '#6B6B6B' }}>Subtotal</span>
                  <span style={{ color: '#2B2B2B' }}>₹{subtotal.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span style={{ color: '#6B6B6B' }}>Shipping</span>
                  <span style={{ color: shipping === 0 ? '#22C55E' : '#2B2B2B' }} className="font-medium">{shipping === 0 ? 'FREE' : `₹${shipping}`}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span style={{ color: '#6B6B6B' }}>Tax (GST)</span>
                  <span style={{ color: '#2B2B2B' }}>₹{tax.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between pt-3" style={{ borderTop: '1px solid #F7EAF0' }}>
                  <span style={{ color: '#2B2B2B' }} className="font-bold">Total</span>
                  <span style={{ color: '#B9375E' }} className="font-bold text-lg">₹{total.toLocaleString('en-IN')}</span>
                </div>
              </div>
              <div style={{ backgroundColor: '#FFF8FA' }} className="flex items-center gap-2 p-3 rounded-xl">
                <Truck size={18} style={{ color: '#B9375E' }} />
                <p style={{ color: '#6B6B6B' }} className="text-xs">Free delivery in 5-7 business days</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
