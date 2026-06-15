import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { LayoutDashboard, ShoppingBag, Package, Users, DollarSign, TrendingUp, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { getAllOrders } from '../services/orders';
import { getProducts } from '../services/products';
import { supabase } from '../lib/supabase';

export default function AdminDashboard() {
  const { data: orders = [], isLoading: ordersLoading } = useQuery({
    queryKey: ['admin-orders'],
    queryFn: getAllOrders,
  });

  const { data: products = [], isLoading: productsLoading } = useQuery({
    queryKey: ['products', 'all'],
    queryFn: getProducts,
  });

  const { data: users = [] } = useQuery({
    queryKey: ['admin-users'],
    queryFn: async () => {
      const { data, error } = await supabase.from('user_profiles').select('*').limit(10);
      if (error) throw error;
      return data;
    },
  });

  const totalRevenue = orders.reduce((sum, o) => sum + (o.total_amount || 0), 0);
  const totalOrders = orders.length;
  const pendingOrders = orders.filter(o => o.status === 'pending' || o.status === 'processing').length;
  const deliveredOrders = orders.filter(o => o.status === 'delivered').length;
  const totalProducts = products.length;
  const lowStockProducts = products.filter(p => !p.in_stock).length;

  const stats = [
    { label: 'Total Revenue', value: `₹${totalRevenue.toLocaleString('en-IN')}`, icon: DollarSign, color: '#B9375E', change: '+12.5%', up: true },
    { label: 'Total Orders', value: totalOrders.toString(), icon: ShoppingBag, color: '#D4AF37', change: '+8.2%', up: true },
    { label: 'Total Products', value: totalProducts.toString(), icon: Package, color: '#3B82F6', change: `${lowStockProducts} low stock`, up: false },
    { label: 'Total Users', value: users.length.toString(), icon: Users, color: '#22C55E', change: '+15.1%', up: true },
  ];

  const recentOrders = orders.slice(0, 5);

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

  if (ordersLoading || productsLoading) {
    return (
      <div style={{ backgroundColor: '#FFF8FA' }} className="min-h-screen py-10">
        <div className="max-w-7xl mx-auto px-4">
          <div className="animate-pulse">
            <div className="h-8 bg-[#F7EAF0] rounded w-48 mb-8" />
            <div className="grid lg:grid-cols-4 gap-4 mb-8">
              {[...Array(4)].map((_, i) => <div key={i} className="h-32 bg-[#F7EAF0] rounded-2xl" />)}
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
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div style={{ background: 'linear-gradient(135deg, #B9375E, #D4AF37)' }}
              className="w-10 h-10 rounded-xl flex items-center justify-center">
              <LayoutDashboard size={20} className="text-white" />
            </div>
            <h1 style={{ color: '#2B2B2B' }} className="text-3xl font-bold">Admin Dashboard</h1>
          </div>
          <p style={{ color: '#6B6B6B' }} className="text-sm">Overview of your store performance</p>
        </motion.div>

        {/* Stats */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((stat, i) => (
            <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
              style={{ backgroundColor: '#FFFFFF', border: '1px solid #F7EAF0' }}
              className="rounded-2xl p-5">
              <div className="flex items-start justify-between mb-4">
                <div style={{ backgroundColor: `${stat.color}15` }} className="w-12 h-12 rounded-xl flex items-center justify-center">
                  <stat.icon size={22} style={{ color: stat.color }} />
                </div>
                <span className={`flex items-center gap-1 text-xs font-medium ${stat.up ? 'text-green-600' : 'text-amber-600'}`}>
                  {stat.up ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />} {stat.change}
                </span>
              </div>
              <p style={{ color: '#2B2B2B' }} className="text-2xl font-bold mb-1">{stat.value}</p>
              <p style={{ color: '#6B6B6B' }} className="text-sm">{stat.label}</p>
            </motion.div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Orders Overview */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
            style={{ backgroundColor: '#FFFFFF', border: '1px solid #F7EAF0' }}
            className="rounded-2xl p-6">
            <h2 style={{ color: '#2B2B2B' }} className="font-bold mb-4 flex items-center gap-2">
              <TrendingUp size={18} style={{ color: '#B9375E' }} /> Orders Overview
            </h2>
            <div className="space-y-4">
              {[
                { label: 'Pending', value: pendingOrders, color: '#F59E0B' },
                { label: 'Delivered', value: deliveredOrders, color: '#22C55E' },
              ].map(item => (
                <div key={item.label}>
                  <div className="flex justify-between mb-1">
                    <span style={{ color: '#6B6B6B' }} className="text-sm">{item.label}</span>
                    <span style={{ color: '#2B2B2B' }} className="text-sm font-medium">{item.value}</span>
                  </div>
                  <div style={{ backgroundColor: '#F7EAF0' }} className="h-2 rounded-full overflow-hidden">
                    <div style={{ backgroundColor: item.color, width: `${totalOrders > 0 ? (item.value / totalOrders) * 100 : 0}%` }}
                      className="h-full rounded-full transition-all" />
                  </div>
                </div>
              ))}
            </div>
            <Link to="/admin/orders" style={{ color: '#B9375E' }}
              className="block text-center text-sm font-medium mt-6 hover:underline">View All Orders</Link>
          </motion.div>

          {/* Recent Orders */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
            style={{ backgroundColor: '#FFFFFF', border: '1px solid #F7EAF0' }}
            className="lg:col-span-2 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 style={{ color: '#2B2B2B' }} className="font-bold flex items-center gap-2">
                <ShoppingBag size={18} style={{ color: '#B9375E' }} /> Recent Orders
              </h2>
              <Link to="/admin/orders" style={{ color: '#B9375E' }} className="text-sm font-medium hover:underline">View All</Link>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr style={{ borderBottom: '1px solid #F7EAF0' }}>
                    <th style={{ color: '#6B6B6B' }} className="text-left py-3 px-2 text-xs font-medium">Order</th>
                    <th style={{ color: '#6B6B6B' }} className="text-left py-3 px-2 text-xs font-medium">Customer</th>
                    <th style={{ color: '#6B6B6B' }} className="text-left py-3 px-2 text-xs font-medium">Status</th>
                    <th style={{ color: '#6B6B6B' }} className="text-right py-3 px-2 text-xs font-medium">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {recentOrders.map(order => (
                    <tr key={order.id} style={{ borderBottom: '1px solid #F7EAF0' }} className="hover:bg-[#FFF8FA]">
                      <td style={{ color: '#2B2B2B' }} className="py-3 px-2 text-sm font-medium">{order.order_number}</td>
                      <td style={{ color: '#2B2B2B' }} className="py-3 px-2 text-sm">{order.customer_name}</td>
                      <td className="py-3 px-2">
                        <span style={{ backgroundColor: `${getStatusColor(order.status)}15`, color: getStatusColor(order.status) }}
                          className="px-2 py-1 rounded-full text-xs font-medium capitalize">{order.status}</span>
                      </td>
                      <td style={{ color: '#B9375E' }} className="py-3 px-2 text-sm font-bold text-right">₹{order.total_amount?.toLocaleString('en-IN')}</td>
                    </tr>
                  ))}
                  {recentOrders.length === 0 && (
                    <tr><td colSpan={4} className="py-8 text-center text-sm" style={{ color: '#6B6B6B' }}>No orders yet</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </motion.div>
        </div>

        {/* Quick Actions */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
          style={{ backgroundColor: '#FFFFFF', border: '1px solid #F7EAF0' }}
          className="rounded-2xl p-6 mt-6">
          <h2 style={{ color: '#2B2B2B' }} className="font-bold mb-4">Quick Actions</h2>
          <div className="grid sm:grid-cols-3 gap-4">
            {[
              { label: 'Manage Products', desc: 'Add, edit, or remove products', path: '/admin/products', icon: Package, color: '#B9375E' },
              { label: 'View Orders', desc: 'Process and track orders', path: '/admin/orders', icon: ShoppingBag, color: '#D4AF37' },
              { label: 'Back to Store', desc: 'View customer storefront', path: '/', icon: LayoutDashboard, color: '#3B82F6' },
            ].map(action => (
              <Link key={action.path} to={action.path}
                style={{ backgroundColor: '#FFF8FA', border: '1px solid #F7EAF0' }}
                className="flex items-center gap-4 p-4 rounded-xl hover:border-[#B9375E] transition-colors group">
                <div style={{ backgroundColor: `${action.color}15` }}
                  className="w-12 h-12 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <action.icon size={22} style={{ color: action.color }} />
                </div>
                <div>
                  <p style={{ color: '#2B2B2B' }} className="font-semibold text-sm group-hover:text-[#B9375E]">{action.label}</p>
                  <p style={{ color: '#6B6B6B' }} className="text-xs">{action.desc}</p>
                </div>
              </Link>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
