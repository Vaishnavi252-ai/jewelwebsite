import { useSearchParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { CheckCircle, Package, Truck, Home, MapPin, CreditCard } from 'lucide-react';
import { getOrderById } from '../services/orders';
import { LOCAL_IMGS } from '../lib/utils';

export default function OrderConfirmation() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const orderId = params.get('id');

  const { data: order, isLoading } = useQuery({
    queryKey: ['order', orderId],
    queryFn: () => getOrderById(orderId!),
    enabled: !!orderId,
  });

  if (isLoading || !order) {
    return (
      <div style={{ backgroundColor: '#FFF8FA' }} className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-center">
          <div className="w-24 h-24 bg-[#F7EAF0] rounded-full mx-auto mb-4" />
          <div className="h-6 bg-[#F7EAF0] rounded w-48 mx-auto" />
        </div>
      </div>
    );
  }

  const steps = [
    { icon: CheckCircle, label: 'Order Placed', done: true },
    { icon: Package, label: 'Processing', done: false },
    { icon: Truck, label: 'Shipped', done: false },
    { icon: Home, label: 'Delivered', done: false },
  ];

  return (
    <div style={{ backgroundColor: '#FFF8FA' }} className="min-h-screen py-10">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', duration: 0.5, delay: 0.2 }}
            style={{ background: 'linear-gradient(135deg, #B9375E, #D4AF37)' }}
            className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
            <CheckCircle size={40} className="text-white" />
          </motion.div>
          <h1 style={{ color: '#2B2B2B' }} className="text-3xl font-bold mb-2">Order Confirmed!</h1>
          <p style={{ color: '#6B6B6B' }} className="text-sm">Thank you for your purchase. Your order has been placed successfully.</p>
          <div style={{ backgroundColor: '#FFFFFF', border: '1px solid #F7EAF0' }} className="inline-block px-4 py-2 rounded-xl mt-4">
            <span style={{ color: '#6B6B6B' }} className="text-xs">Order Number</span>
            <p style={{ color: '#B9375E' }} className="font-bold text-sm">{order.order_number}</p>
          </div>
        </motion.div>

        {/* Order Steps */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          style={{ backgroundColor: '#FFFFFF', border: '1px solid #F7EAF0' }} className="rounded-2xl p-6 mb-6">
          <h2 style={{ color: '#2B2B2B' }} className="font-bold mb-6">Order Status</h2>
          <div className="flex items-center justify-between relative">
            <div className="absolute top-5 left-5 right-5 h-0.5 bg-[#F7EAF0]" style={{ zIndex: 0 }} />
            {steps.map((step, i) => (
              <div key={step.label} className="relative z-10 flex flex-col items-center" style={{ width: '25%' }}>
                <div style={{ backgroundColor: step.done ? '#B9375E' : '#F7EAF0' }}
                  className="w-10 h-10 rounded-full flex items-center justify-center mb-2">
                  <step.icon size={18} style={{ color: step.done ? '#fff' : '#6B6B6B' }} />
                </div>
                <p style={{ color: step.done ? '#2B2B2B' : '#6B6B6B' }} className="text-xs font-medium text-center">{step.label}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Order Details */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
          style={{ backgroundColor: '#FFFFFF', border: '1px solid #F7EAF0' }} className="rounded-2xl p-6 mb-6">
          <h2 style={{ color: '#2B2B2B' }} className="font-bold mb-4">Order Details</h2>
          <div className="space-y-4">
            {(order.order_items || []).map((item: any, i: number) => {
              const img = item.product_image || LOCAL_IMGS[i % LOCAL_IMGS.length];
              return (
                <div key={i} className="flex gap-4 items-center">
                  <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0" style={{ backgroundColor: '#FFF8FA' }}>
                    <img src={img} alt={item.product_title} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1">
                    <p style={{ color: '#2B2B2B' }} className="font-medium text-sm">{item.product_title}</p>
                    <p style={{ color: '#6B6B6B' }} className="text-xs">Qty: {item.quantity}</p>
                  </div>
                  <p style={{ color: '#B9375E' }} className="font-semibold text-sm">₹{item.total_price?.toLocaleString('en-IN')}</p>
                </div>
              );
            })}
          </div>
          <div className="mt-6 pt-4" style={{ borderTop: '1px solid #F7EAF0' }}>
            <div className="flex justify-between text-sm mb-1">
              <span style={{ color: '#6B6B6B' }}>Subtotal</span>
              <span style={{ color: '#2B2B2B' }}>₹{order.subtotal?.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between text-sm mb-1">
              <span style={{ color: '#6B6B6B' }}>Shipping</span>
              <span style={{ color: order.shipping_cost === 0 ? '#22C55E' : '#2B2B2B' }}>{order.shipping_cost === 0 ? 'FREE' : `₹${order.shipping_cost}`}</span>
            </div>
            <div className="flex justify-between text-sm mb-3">
              <span style={{ color: '#6B6B6B' }}>Tax</span>
              <span style={{ color: '#2B2B2B' }}>₹{order.tax_amount?.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between pt-3" style={{ borderTop: '1px solid #F7EAF0' }}>
              <span style={{ color: '#2B2B2B' }} className="font-bold">Total</span>
              <span style={{ color: '#B9375E' }} className="font-bold text-lg">₹{order.total_amount?.toLocaleString('en-IN')}</span>
            </div>
          </div>
        </motion.div>

        {/* Shipping & Payment Info */}
        <div className="grid sm:grid-cols-2 gap-4 mb-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
            style={{ backgroundColor: '#FFFFFF', border: '1px solid #F7EAF0' }} className="rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-4">
              <MapPin size={18} style={{ color: '#B9375E' }} />
              <h3 style={{ color: '#2B2B2B' }} className="font-bold text-sm">Shipping Address</h3>
            </div>
            <p style={{ color: '#2B2B2B' }} className="text-sm font-medium">{order.customer_name}</p>
            <p style={{ color: '#6B6B6B' }} className="text-sm">{order.shipping_street}</p>
            <p style={{ color: '#6B6B6B' }} className="text-sm">{order.shipping_city}, {order.shipping_state} - {order.shipping_postal_code}</p>
            <p style={{ color: '#6B6B6B' }} className="text-sm">{order.shipping_country}</p>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}
            style={{ backgroundColor: '#FFFFFF', border: '1px solid #F7EAF0' }} className="rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-4">
              <CreditCard size={18} style={{ color: '#B9375E' }} />
              <h3 style={{ color: '#2B2B2B' }} className="font-bold text-sm">Payment Method</h3>
            </div>
            <p style={{ color: '#2B2B2B' }} className="text-sm font-medium capitalize">{order.payment_method?.replace('_', ' ')}</p>
            <p style={{ color: '#6B6B6B' }} className="text-sm">{order.payment_status === 'paid' ? 'Payment Received' : 'Pending'}</p>
          </motion.div>
        </div>

        {/* Actions */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }} className="text-center space-x-4">
          <button onClick={() => navigate('/my-orders')}
            style={{ background: 'linear-gradient(135deg, #B9375E, #D4AF37)', color: '#fff' }}
            className="px-8 py-3 rounded-xl font-semibold text-sm hover:opacity-90 transition-opacity">
            View All Orders
          </button>
          <button onClick={() => navigate('/products')}
            style={{ backgroundColor: '#FFFFFF', border: '1px solid #F7EAF0', color: '#2B2B2B' }}
            className="px-8 py-3 rounded-xl font-semibold text-sm hover:bg-[#F7EAF0] transition-colors">
            Continue Shopping
          </button>
        </motion.div>
      </div>
    </div>
  );
}
