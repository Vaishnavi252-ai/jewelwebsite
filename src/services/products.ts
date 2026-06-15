import { supabase } from '../lib/supabase';
import { Product, Category } from '../types';

export async function getProducts(filters?: {
  category?: string;
  search?: string;
  featured?: boolean;
  metalType?: string;
  minPrice?: number;
  maxPrice?: number;
  limit?: number;
}): Promise<Product[]> {
  let query = supabase.from('products').select('*').eq('is_active', true);

  if (filters?.featured) query = query.eq('is_featured', true);
  if (filters?.category) query = query.eq('category_slug', filters.category);
  if (filters?.metalType) query = query.eq('metal_type', filters.metalType);
  if (filters?.minPrice !== undefined) query = query.gte('price', filters.minPrice);
  if (filters?.maxPrice !== undefined) query = query.lte('price', filters.maxPrice);
  if (filters?.limit) query = query.limit(filters.limit);

  query = query.order('created_at', { ascending: false });

  const { data, error } = await query;
  if (error) throw error;

  let products = (data as Product[]) || [];

  if (filters?.search) {
    const s = filters.search.toLowerCase();
    products = products.filter(p =>
      p.title.toLowerCase().includes(s) ||
      p.description?.toLowerCase().includes(s) ||
      p.gemstone?.toLowerCase().includes(s) ||
      p.metal_type?.toLowerCase().includes(s) ||
      p.tags.some(t => t.toLowerCase().includes(s))
    );
  }

  return products;
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('slug', slug)
    .maybeSingle();
  if (error) throw error;
  return data as Product | null;
}

export async function getCategories(): Promise<Category[]> {
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .order('sort_order', { ascending: true });
  if (error) throw error;
  return (data as Category[]) || [];
}

export async function createProduct(product: Omit<Product, 'id' | 'created_at'>): Promise<Product> {
  const { data, error } = await supabase.from('products').insert(product).select().single();
  if (error) throw error;
  return data as Product;
}

export async function updateProduct(id: string, updates: Partial<Product>): Promise<Product> {
  const { data, error } = await supabase.from('products').update(updates).eq('id', id).select().single();
  if (error) throw error;
  return data as Product;
}

export async function deleteProduct(id: string): Promise<void> {
  const { error } = await supabase.from('products').delete().eq('id', id);
  if (error) throw error;
}
