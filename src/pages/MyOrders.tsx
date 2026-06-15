import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { Package, Clock, Truck, CheckCircle, ChevronRight, Eye } from 'lucide-react';
import { getUserOrders } from '../services/orders';
import { useAuth } from '../lib/AuthContext';
import { LOCAL_IMGS } from '../lib/utils';

export default function MyOrders() {
  const { user } = useAuth();

  const { data: orders = [], isLoading } = useQuery({
    queryKey: ['orders', user?.id],
    queryFn: () => getUserOrders(user!.id),
    enabled: !!user,
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return Clock;
      case 'processing': return Package;
      case 'shipped': return Truck;
      case 'delivered': return CheckCircle;
      default: return Package;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return '#F59E0B';
      case 'processing': return '#3B82F6';
      case 'shipped': return '#8B5CF6';
      case 'delivered': return '#22C55E';
      default: return '#6B6B6B';
    }
  };

  if (isLoading) {
    return (
      <div style={{ backgroundColor: '#FFF8FA' }} className="min-h-screen py-10">
        <div className="max-w-7xl mx-auto px-4">
          <div className="animate-pulse">
            <div className="h-8 bg-[#F7EAF0] rounded w-48 mb-8" />
            {[...Array(3)].map((_, i) => <div key={i} className="h-32 bg-[#F7EAF0] rounded-2xl mb-4" />)}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: '#FFF8FA' }} className="min-h-screen py-10">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 style={{ color: '#2B2B2B' }} className="text-3xl font-bold flex items-center gap-3">
            <Package size={28} style={{ color: '#B9375E' }} /> My Orders
          </h1>
          <p style={{ color: '#6B6B6B' }} className="text-sm mt-1">{orders.length} order{orders.length !== 1 ? 's' : ''} placed</p>
        </motion.div>

        {orders.length === 0 ? (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center py-20">
            <div style={{ backgroundColor: '#FFF8FA', border: '1px solid #F7EAF0' }} className="w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
              <Package size={40} style={{ color: '#B9375E' }} />
            </div>
            <h2 style={{ color: '#2B2B2B' }} className="text-xl font-bold mb-2">No orders yet</h2>
            <p style={{ color: '#6B6B6B' }} className="text-sm mb-6">Start shopping to see your orders here</p>
            <a href="/products" style={{ background: 'linear-gradient(135deg, #B9375E, #D4AF37)', color: '#fff' }}
              className="inline-block px-8 py-3 rounded-xl font-semibold text-sm hover:opacity-90 transition-opacity">
              Browse Collection
            </a>
          </motion.div>
        ) : (
          <div className="space-y-4">
            {orders.map((order, i) => {
              const StatusIcon = getStatusIcon(order.status);
              const statusColor = getStatusColor(order.status);
              const items = order.order_items || [];
              const firstItem = items[0];
              const img = firstItem?.product_image || LOCAL_IMGS[i % LOCAL_IMGS.length];

              return (
                <motion.div key={order.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
                  style={{ backgroundColor: '#FFFFFF', border: '1px solid #F7EAF0' }}
                  className="rounded-2xl p-5 hover:shadow-md transition-shadow">
                  <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                    <div className="flex items-center gap-4">
                      <div className="w-20 h-20 rounded-xl overflow-hidden shrink-0" style={{ backgroundColor: '#FFF8FA' }}>
                        <img src={img} alt="" className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <p style={{ color: '#2B2B2B' }} className="font-bold text-sm">Order #{order.order_number}</p>
                        <p style={{ color: '#6B6B6B' }} className="text-xs mt-1">
                          {new Date(order.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </p>
                        <p style={{ color: '#6B6B6B' }} className="text-xs mt-0.5">{items.length} item{items.length !== 1 ? 's' : ''}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p style={{ color: '#B9375E' }} className="font-bold">₹{order.total_amount?.toLocaleString('en-IN')}</p>
                      <div className="flex items-center gap-1.5 mt-2 px-3 py-1.5 rounded-full" style={{ backgroundColor: `${statusColor}15` }}>
                        <StatusIcon size={14} style={{ color: statusColor }} />
                        <span style={{ color: statusColor }} className="text-xs font-medium capitalize">{order.status}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 pt-4" style={{ borderTop: '1px solid #F7EAF0' }}>
                    <div className="flex items-center gap-1">
                      {items.slice(0, 4).map((item: any, idx: number) => (
                        <div key={idx}
                          style={{ border: '1px solid #F7EAF0' }}
                          className="w-10 h-10 rounded-lg overflow-hidden bg-[#FFF8FA]">
                          <img src={item.product_image || LOCAL_IMGS[idx % LOCAL_IMGS.length]} alt="" className="w-full h-full object-cover" />
                        </div>
                      ))}
                      {items.length > 4 && (
                        <div style={{ backgroundColor: '#F7EAF0' }} className="w-10 h-10 rounded-lg flex items-center justify-center">
                          <span style={{ color: '#6B6B6B' }} className="text-xs font-medium">+{items.length - 4}</span>
                        </div>
                      )}
                    </div>
                    <div className="flex-1" />
                    <a href={`/order-confirmation?id=${order.id}`}
                      style={{ color: '#B9375E' }}
                      className="flex items-center gap-1 text-sm font-medium hover:underline">
                      <Eye size={16} /> View Details <ChevronRight size={16} />
                    </a>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
