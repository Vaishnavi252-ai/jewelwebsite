import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ShoppingBag, Search, Filter, Eye, X, Clock, Package, Truck, CheckCircle, XCircle } from 'lucide-react';
import { toast } from 'sonner';
import { getAllOrders, updateOrderStatus } from '../services/orders';
import { LOCAL_IMGS } from '../lib/utils';

export default function AdminOrders() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<any>(null);

  const { data: orders = [], isLoading } = useQuery({
    queryKey: ['admin-orders'],
    queryFn: getAllOrders,
  });

  const notifyOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      await fetch("http://localhost:5000/notify-order-status", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId, newStatus }),
      });
    } catch {
      // ignore email errors
    }
  };

  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) => updateOrderStatus(id, status as any),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['admin-orders'] });
      toast.success('Order status updated');

      // Notify backend to send email about status update
      // (don't await inside React Query callback)
      if (variables?.id && variables?.status) {
        void notifyOrderStatus(variables.id, variables.status);
      }

      // done
    },
    onError: () => toast.error('Failed to update status'),
  });

  const filtered = orders.filter(o => {
    // Only show orders that were actually paid (paid) to admin.
    // Prevents cancelled/unpaid Razorpay orders from showing up.
    if (o.payment_status !== 'paid') return false;

    if (statusFilter && o.status !== statusFilter) return false;
    if (search) {
      const s = search.toLowerCase();
      return o.order_number.toLowerCase().includes(s) || o.customer_name.toLowerCase().includes(s);
    }
    return true;
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return Clock;
      case 'processing': return Package;
      case 'shipped': return Truck;
      case 'delivered': return CheckCircle;
      case 'cancelled': return XCircle;
      default: return Package;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return '#F59E0B';
      case 'processing': return '#3B82F6';
      case 'shipped': return '#8B5CF6';
      case 'delivered': return '#22C55E';
      case 'cancelled': return '#EF4444';
      default: return '#6B6B6B';
    }
  };

  const statuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];

  if (isLoading) {
    return (
      <div style={{ backgroundColor: '#FFF8FA' }} className="min-h-screen py-10">
        <div className="max-w-7xl mx-auto px-4">
          <div className="animate-pulse">
            <div className="h-8 bg-[#F7EAF0] rounded w-48 mb-8" />
            <div className="h-96 bg-[#F7EAF0] rounded-2xl" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: '#FFF8FA' }} className="min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 style={{ color: '#2B2B2B' }} className="text-3xl font-bold flex items-center gap-3">
            <ShoppingBag size={28} style={{ color: '#B9375E' }} /> Manage Orders
          </h1>
          <p style={{ color: '#6B6B6B' }} className="text-sm mt-1">{orders.length} orders total</p>
        </motion.div>

        {/* Filters */}
        <div className="flex flex-wrap gap-3 mb-6">
          <div className="relative flex-1 min-w-[200px]">
            <Search size={16} style={{ color: '#6B6B6B' }} className="absolute left-3 top-1/2 -translate-y-1/2" />
            <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by order # or customer..."
              style={{ backgroundColor: '#FFFFFF', border: '1px solid #F7EAF0', color: '#2B2B2B' }}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm outline-none focus:border-[#B9375E] transition-colors" />
          </div>
          <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
            style={{ backgroundColor: '#FFFFFF', border: '1px solid #F7EAF0', color: '#2B2B2B' }}
            className="px-4 py-2.5 rounded-xl text-sm outline-none focus:border-[#B9375E] transition-colors">
            <option value="">All Statuses</option>
            {statuses.map(s => <option key={s} value={s} className="capitalize">{s}</option>)}
          </select>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-6">
          {statuses.map(status => {
            const count = orders.filter(o => o.status === status).length;
            const StatusIcon = getStatusIcon(status);
            return (
              <button key={status} onClick={() => setStatusFilter(statusFilter === status ? '' : status)}
                style={{ backgroundColor: statusFilter === status ? getStatusColor(status) : '#FFFFFF', border: '1px solid #F7EAF0' }}
                className="p-3 rounded-xl transition-all hover:shadow-md">
                <div className="flex items-center gap-2 mb-1">
                  <StatusIcon size={16} style={{ color: statusFilter === status ? '#fff' : getStatusColor(status) }} />
                  <span style={{ color: statusFilter === status ? '#fff' : '#6B6B6B' }} className="text-xs capitalize">{status}</span>
                </div>
                <p style={{ color: statusFilter === status ? '#fff' : '#2B2B2B' }} className="text-xl font-bold">{count}</p>
              </button>
            );
          })}
        </div>

        {/* Orders Table */}
        <div style={{ backgroundColor: '#FFFFFF', border: '1px solid #F7EAF0' }} className="rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead style={{ backgroundColor: '#FFF8FA' }}>
                <tr>
                  <th style={{ color: '#6B6B6B' }} className="text-left py-4 px-4 text-xs font-medium">Order</th>
                  <th style={{ color: '#6B6B6B' }} className="text-left py-4 px-4 text-xs font-medium">Customer</th>
                  <th style={{ color: '#6B6B6B' }} className="text-left py-4 px-4 text-xs font-medium">Date</th>
                  <th style={{ color: '#6B6B6B' }} className="text-left py-4 px-4 text-xs font-medium">Status</th>
                  <th style={{ color: '#6B6B6B' }} className="text-right py-4 px-4 text-xs font-medium">Amount</th>
                  <th style={{ color: '#6B6B6B' }} className="text-center py-4 px-4 text-xs font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(order => {
                  const StatusIcon = getStatusIcon(order.status);
                  return (
                    <tr key={order.id} style={{ borderTop: '1px solid #F7EAF0' }} className="hover:bg-[#FFF8FA]">
                      <td className="py-4 px-4">
                        <p style={{ color: '#2B2B2B' }} className="font-semibold text-sm">{order.order_number}</p>
                        <p style={{ color: '#6B6B6B' }} className="text-xs">{order.order_items?.length || 0} items</p>
                      </td>
                      <td className="py-4 px-4">
                        <p style={{ color: '#2B2B2B' }} className="text-sm font-medium">{order.customer_name}</p>
                        <p style={{ color: '#6B6B6B' }} className="text-xs">{order.customer_phone}</p>
                      </td>
                      <td style={{ color: '#2B2B2B' }} className="py-4 px-4 text-sm">
                        {new Date(order.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-2">
                          <StatusIcon size={14} style={{ color: getStatusColor(order.status) }} />
                          <select value={order.status} onChange={e => updateStatusMutation.mutate({ id: order.id, status: e.target.value })}
                            style={{ backgroundColor: `${getStatusColor(order.status)}15`, color: getStatusColor(order.status), border: 'none' }}
                            className="px-2 py-1 rounded-full text-xs font-medium capitalize outline-none cursor-pointer hover:opacity-80">
                            {statuses.map(s => <option key={s} value={s} className="capitalize">{s}</option>)}
                          </select>
                        </div>
                      </td>
                      <td style={{ color: '#B9375E' }} className="py-4 px-4 text-right font-bold text-sm">
                        ₹{order.total_amount?.toLocaleString('en-IN')}
                      </td>
                      <td className="py-4 px-4 text-center">
                        <button onClick={() => setSelectedOrder(order)}
                          style={{ color: '#6B6B6B' }}
                          className="p-2 rounded-lg hover:bg-[#F7EAF0] hover:text-[#B9375E] transition-colors">
                          <Eye size={18} />
                        </button>
                      </td>
                    </tr>
                  );
                })}
                {filtered.length === 0 && (
                  <tr><td colSpan={6} className="py-12 text-center" style={{ color: '#6B6B6B' }}>No orders found</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Order Detail Modal */}
      <AnimatePresence>
        {selectedOrder && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
              style={{ backgroundColor: '#FFFFFF' }}
              className="w-full max-w-2xl rounded-2xl max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between p-6" style={{ borderBottom: '1px solid #F7EAF0' }}>
                <div>
                  <h2 style={{ color: '#2B2B2B' }} className="font-bold text-lg">Order #{selectedOrder.order_number}</h2>
                  <p style={{ color: '#6B6B6B' }} className="text-sm">
                    {new Date(selectedOrder.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                  </p>
                </div>
                <button onClick={() => setSelectedOrder(null)} style={{ color: '#6B6B6B' }}
                  className="p-1.5 rounded-lg hover:bg-[#F7EAF0] transition-colors">
                  <X size={20} />
                </button>
              </div>
              <div className="p-6 space-y-6">
                {/* Status */}
                <div>
                  <h3 style={{ color: '#2B2B2B' }} className="font-semibold mb-3">Status</h3>
                  <div className="flex flex-wrap gap-2">
                    {statuses.map(s => {
                      const StatusIcon = getStatusIcon(s);
                      return (
                        <button key={s} onClick={() => updateStatusMutation.mutate({ id: selectedOrder.id, status: s })}
                          style={{ backgroundColor: selectedOrder.status === s ? getStatusColor(s) : '#FFF8FA', border: '1px solid #F7EAF0' }}
                          className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium transition-all hover:opacity-80">
                          <StatusIcon size={14} style={{ color: selectedOrder.status === s ? '#fff' : getStatusColor(s) }} />
                          <span style={{ color: selectedOrder.status === s ? '#fff' : '#2B2B2B' }} className="capitalize">{s}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Customer */}
                <div style={{ backgroundColor: '#FFF8FA', border: '1px solid #F7EAF0' }} className="rounded-xl p-4">
                  <h3 style={{ color: '#2B2B2B' }} className="font-semibold mb-2">Customer Details</h3>
                  <p style={{ color: '#2B2B2B' }} className="text-sm font-medium">{selectedOrder.customer_name}</p>
                  <p style={{ color: '#6B6B6B' }} className="text-sm">{selectedOrder.customer_phone}</p>
                </div>

                {/* Shipping */}
                <div style={{ backgroundColor: '#FFF8FA', border: '1px solid #F7EAF0' }} className="rounded-xl p-4">
                  <h3 style={{ color: '#2B2B2B' }} className="font-semibold mb-2">Shipping Address</h3>
                  <p style={{ color: '#6B6B6B' }} className="text-sm">{selectedOrder.shipping_street}</p>
                  <p style={{ color: '#6B6B6B' }} className="text-sm">
                    {selectedOrder.shipping_city}, {selectedOrder.shipping_state} - {selectedOrder.shipping_postal_code}
                  </p>
                </div>

                {/* Items */}
                <div>
                  <h3 style={{ color: '#2B2B2B' }} className="font-semibold mb-3">Items</h3>
                  <div className="space-y-3">
                    {(selectedOrder.order_items || []).map((item: any, i: number) => (
                      <div key={i} className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-lg overflow-hidden shrink-0" style={{ backgroundColor: '#F7EAF0' }}>
                          <img src={item.product_image || LOCAL_IMGS[i % LOCAL_IMGS.length]} alt="" className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1">
                          <p style={{ color: '#2B2B2B' }} className="text-sm font-medium">{item.product_title}</p>
                          <p style={{ color: '#6B6B6B' }} className="text-xs">Qty: {item.quantity}</p>
                        </div>
                        <p style={{ color: '#B9375E' }} className="font-semibold text-sm">₹{item.total_price?.toLocaleString('en-IN')}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Totals */}
                <div style={{ borderTop: '1px solid #F7EAF0' }} className="pt-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span style={{ color: '#6B6B6B' }}>Subtotal</span>
                    <span style={{ color: '#2B2B2B' }}>₹{selectedOrder.subtotal?.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span style={{ color: '#6B6B6B' }}>Shipping</span>
                    <span style={{ color: '#2B2B2B' }}>₹{selectedOrder.shipping_cost?.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span style={{ color: '#6B6B6B' }}>Tax</span>
                    <span style={{ color: '#2B2B2B' }}>₹{selectedOrder.tax_amount?.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between pt-2" style={{ borderTop: '1px solid #F7EAF0' }}>
                    <span style={{ color: '#2B2B2B' }} className="font-bold">Total</span>
                    <span style={{ color: '#B9375E' }} className="font-bold text-lg">₹{selectedOrder.total_amount?.toLocaleString('en-IN')}</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
