import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Pencil, Trash2, Search, X, Package, Save, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { getProducts, getCategories, createProduct, updateProduct, deleteProduct } from '../services/products';
import { useAuth } from '../lib/AuthContext';
import { METAL_LABELS, LOCAL_IMGS } from '../lib/utils';

export default function AdminProducts() {
  const { profile } = useAuth();
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [saving, setSaving] = useState(false);

  const { data: products = [], isLoading } = useQuery({
    queryKey: ['products', 'all'],
    queryFn: getProducts,
  });

  const { data: categories = [] } = useQuery({
    queryKey: ['categories'],
    queryFn: getCategories,
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteProduct(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products', 'all'] });
      toast.success('Product deleted');
    },
    onError: () => toast.error('Failed to delete product'),
  });

  const filtered = products.filter(p => {
    if (categoryFilter && p.category_slug !== categoryFilter) return false;
    if (search) {
      const s = search.toLowerCase();
      return p.title.toLowerCase().includes(s) || p.description?.toLowerCase().includes(s);
    }
    return true;
  });

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const formData = new FormData(e.target as HTMLFormElement);
      const data = {
        title: formData.get('title') as string,
        slug: formData.get('slug') as string,
        description: formData.get('description') as string,
        price: parseFloat(formData.get('price') as string),
        original_price: formData.get('original_price') ? parseFloat(formData.get('original_price') as string) : null,
        category_id: formData.get('category_id') as string,
        metal_type: formData.get('metal_type') as string,
        gemstone: formData.get('gemstone') as string,
        weight: formData.get('weight') ? parseFloat(formData.get('weight') as string) : null,
        in_stock: formData.get('in_stock') === 'on',
      };

      if (editingProduct?.id) {
        await updateProduct(editingProduct.id, data);
        toast.success('Product updated');
      } else {
        await createProduct(data);
        toast.success('Product created');
      }
      queryClient.invalidateQueries({ queryKey: ['products', 'all'] });
      setModalOpen(false);
      setEditingProduct(null);
    } catch (err) {
      toast.error('Failed to save product');
    } finally {
      setSaving(false);
    }
  };

  const openEditModal = (product: any) => {
    setEditingProduct(product);
    setModalOpen(true);
  };

  const openNewModal = () => {
    setEditingProduct(null);
    setModalOpen(true);
  };

  return (
    <div style={{ backgroundColor: '#FFF8FA' }} className="min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 style={{ color: '#2B2B2B' }} className="text-3xl font-bold flex items-center gap-3">
              <Package size={28} style={{ color: '#B9375E' }} /> Manage Products
            </h1>
            <p style={{ color: '#6B6B6B' }} className="text-sm mt-1">{products.length} products total</p>
          </motion.div>
          <button onClick={openNewModal}
            style={{ background: 'linear-gradient(135deg, #B9375E, #D4AF37)', color: '#fff' }}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm hover:opacity-90 transition-opacity">
            <Plus size={18} /> Add Product
          </button>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-3 mb-6">
          <div className="relative flex-1 min-w-[200px]">
            <Search size={16} style={{ color: '#6B6B6B' }} className="absolute left-3 top-1/2 -translate-y-1/2" />
            <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search products..."
              style={{ backgroundColor: '#FFFFFF', border: '1px solid #F7EAF0', color: '#2B2B2B' }}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm outline-none focus:border-[#B9375E] transition-colors" />
          </div>
          <select value={categoryFilter} onChange={e => setCategoryFilter(e.target.value)}
            style={{ backgroundColor: '#FFFFFF', border: '1px solid #F7EAF0', color: '#2B2B2B' }}
            className="px-4 py-2.5 rounded-xl text-sm outline-none focus:border-[#B9375E] transition-colors">
            <option value="">All Categories</option>
            {categories.map(c => <option key={c.id} value={c.slug}>{c.name}</option>)}
          </select>
        </div>

        {/* Products Table */}
        {isLoading ? (
          <div className="animate-pulse space-y-4">
            {[...Array(5)].map((_, i) => <div key={i} className="h-16 bg-[#F7EAF0] rounded-xl" />)}
          </div>
        ) : (
          <div style={{ backgroundColor: '#FFFFFF', border: '1px solid #F7EAF0' }} className="rounded-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead style={{ backgroundColor: '#FFF8FA' }}>
                  <tr>
                    <th style={{ color: '#6B6B6B' }} className="text-left py-4 px-4 text-xs font-medium">Product</th>
                    <th style={{ color: '#6B6B6B' }} className="text-left py-4 px-4 text-xs font-medium">Category</th>
                    <th style={{ color: '#6B6B6B' }} className="text-left py-4 px-4 text-xs font-medium">Price</th>
                    <th style={{ color: '#6B6B6B' }} className="text-left py-4 px-4 text-xs font-medium">Stock</th>
                    <th style={{ color: '#6B6B6B' }} className="text-right py-4 px-4 text-xs font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((product, i) => {
                    const img = product.images?.[0] || LOCAL_IMGS[i % LOCAL_IMGS.length];
                    return (
                      <tr key={product.id} style={{ borderTop: '1px solid #F7EAF0' }} className="hover:bg-[#FFF8FA]">
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-lg overflow-hidden shrink-0" style={{ backgroundColor: '#F7EAF0' }}>
                              <img src={img} alt={product.title} className="w-full h-full object-cover" />
                            </div>
                            <div>
                              <p style={{ color: '#2B2B2B' }} className="font-medium text-sm">{product.title}</p>
                              <p style={{ color: '#6B6B6B' }} className="text-xs">{product.metal_type} | {product.gemstone || 'No gemstone'}</p>
                            </div>
                          </div>
                        </td>
                        <td style={{ color: '#2B2B2B' }} className="py-4 px-4 text-sm">{product.category_name}</td>
                        <td className="py-4 px-4">
                          <span style={{ color: '#B9375E' }} className="font-semibold text-sm">₹{product.price?.toLocaleString('en-IN')}</span>
                          {product.original_price && product.original_price > product.price && (
                            <span style={{ color: '#6B6B6B', textDecoration: 'line-through' }} className="text-xs ml-1">
                              ₹{product.original_price?.toLocaleString('en-IN')}
                            </span>
                          )}
                        </td>
                        <td className="py-4 px-4">
                          <span style={{ backgroundColor: product.in_stock ? '#22C55E15' : '#EF444415', color: product.in_stock ? '#22C55E' : '#EF4444' }}
                            className="px-2 py-1 rounded-full text-xs font-medium">
                            {product.in_stock ? 'In Stock' : 'Out of Stock'}
                          </span>
                        </td>
                        <td className="py-4 px-4 text-right">
                          <button onClick={() => openEditModal(product)}
                            style={{ color: '#6B6B6B' }}
                            className="p-2 rounded-lg hover:bg-[#F7EAF0] hover:text-[#B9375E] transition-colors">
                            <Pencil size={16} />
                          </button>
                          <button onClick={() => deleteMutation.mutate(product.id)}
                            style={{ color: '#6B6B6B' }}
                            className="p-2 rounded-lg hover:bg-[#F7EAF0] hover:text-[#EF4444] transition-colors">
                            <Trash2 size={16} />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                  {filtered.length === 0 && (
                    <tr><td colSpan={5} className="py-12 text-center" style={{ color: '#6B6B6B' }}>No products found</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Modal */}
      <AnimatePresence>
        {modalOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
              style={{ backgroundColor: '#FFFFFF' }}
              className="w-full max-w-lg rounded-2xl max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between p-6" style={{ borderBottom: '1px solid #F7EAF0' }}>
                <h2 style={{ color: '#2B2B2B' }} className="font-bold text-lg">
                  {editingProduct ? 'Edit Product' : 'Add New Product'}
                </h2>
                <button onClick={() => setModalOpen(false)} style={{ color: '#6B6B6B' }}
                  className="p-1.5 rounded-lg hover:bg-[#F7EAF0] transition-colors">
                  <X size={20} />
                </button>
              </div>
              <form onSubmit={handleSave} className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label style={{ color: '#2B2B2B' }} className="block text-sm font-medium mb-1.5">Title *</label>
                    <input name="title" defaultValue={editingProduct?.title || ''} required
                      style={{ backgroundColor: '#FFF8FA', border: '1px solid #F7EAF0', color: '#2B2B2B' }}
                      className="w-full px-3 py-2.5 rounded-xl text-sm outline-none focus:border-[#B9375E] transition-colors" />
                  </div>
                  <div>
                    <label style={{ color: '#2B2B2B' }} className="block text-sm font-medium mb-1.5">Slug *</label>
                    <input name="slug" defaultValue={editingProduct?.slug || ''} required
                      style={{ backgroundColor: '#FFF8FA', border: '1px solid #F7EAF0', color: '#2B2B2B' }}
                      className="w-full px-3 py-2.5 rounded-xl text-sm outline-none focus:border-[#B9375E] transition-colors" />
                  </div>
                </div>
                <div>
                  <label style={{ color: '#2B2B2B' }} className="block text-sm font-medium mb-1.5">Description</label>
                  <textarea name="description" rows={3} defaultValue={editingProduct?.description || ''}
                    style={{ backgroundColor: '#FFF8FA', border: '1px solid #F7EAF0', color: '#2B2B2B', resize: 'none' }}
                    className="w-full px-3 py-2.5 rounded-xl text-sm outline-none focus:border-[#B9375E] transition-colors" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label style={{ color: '#2B2B2B' }} className="block text-sm font-medium mb-1.5">Price *</label>
                    <input name="price" type="number" defaultValue={editingProduct?.price || ''} required
                      style={{ backgroundColor: '#FFF8FA', border: '1px solid #F7EAF0', color: '#2B2B2B' }}
                      className="w-full px-3 py-2.5 rounded-xl text-sm outline-none focus:border-[#B9375E] transition-colors" />
                  </div>
                  <div>
                    <label style={{ color: '#2B2B2B' }} className="block text-sm font-medium mb-1.5">Original Price</label>
                    <input name="original_price" type="number" defaultValue={editingProduct?.original_price || ''}
                      style={{ backgroundColor: '#FFF8FA', border: '1px solid #F7EAF0', color: '#2B2B2B' }}
                      className="w-full px-3 py-2.5 rounded-xl text-sm outline-none focus:border-[#B9375E] transition-colors" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label style={{ color: '#2B2B2B' }} className="block text-sm font-medium mb-1.5">Category *</label>
                    <select name="category_id" required defaultValue={editingProduct?.category_id || ''}
                      style={{ backgroundColor: '#FFF8FA', border: '1px solid #F7EAF0', color: '#2B2B2B' }}
                      className="w-full px-3 py-2.5 rounded-xl text-sm outline-none focus:border-[#B9375E] transition-colors">
                      <option value="">Select category</option>
                      {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                  </div>
                  <div>
                    <label style={{ color: '#2B2B2B' }} className="block text-sm font-medium mb-1.5">Metal Type</label>
                    <select name="metal_type" defaultValue={editingProduct?.metal_type || ''}
                      style={{ backgroundColor: '#FFF8FA', border: '1px solid #F7EAF0', color: '#2B2B2B' }}
                      className="w-full px-3 py-2.5 rounded-xl text-sm outline-none focus:border-[#B9375E] transition-colors">
                      <option value="">Select metal</option>
                      {Object.entries(METAL_LABELS).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label style={{ color: '#2B2B2B' }} className="block text-sm font-medium mb-1.5">Gemstone</label>
                    <input name="gemstone" defaultValue={editingProduct?.gemstone || ''}
                      style={{ backgroundColor: '#FFF8FA', border: '1px solid #F7EAF0', color: '#2B2B2B' }}
                      className="w-full px-3 py-2.5 rounded-xl text-sm outline-none focus:border-[#B9375E] transition-colors" />
                  </div>
                  <div>
                    <label style={{ color: '#2B2B2B' }} className="block text-sm font-medium mb-1.5">Weight (g)</label>
                    <input name="weight" type="number" step="0.1" defaultValue={editingProduct?.weight || ''}
                      style={{ backgroundColor: '#FFF8FA', border: '1px solid #F7EAF0', color: '#2B2B2B' }}
                      className="w-full px-3 py-2.5 rounded-xl text-sm outline-none focus:border-[#B9375E] transition-colors" />
                  </div>
                </div>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input name="in_stock" type="checkbox" defaultChecked={editingProduct?.in_stock ?? true} className="accent-[#B9375E]" />
                  <span style={{ color: '#2B2B2B' }} className="text-sm">In Stock</span>
                </label>
                <button type="submit" disabled={saving}
                  style={{ background: 'linear-gradient(135deg, #B9375E, #D4AF37)', color: '#fff' }}
                  className="w-full py-3 rounded-xl font-semibold text-sm hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2">
                  {saving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                  {saving ? 'Saving...' : 'Save Product'}
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
