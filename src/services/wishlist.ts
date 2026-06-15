import { supabase } from '../lib/supabase';
import { WishlistItem, Product } from '../types';

export async function getWishlist(userId: string): Promise<WishlistItem[]> {
  const { data, error } = await supabase
    .from('wishlist_items')
    .select('*, product:products(*)')
    .eq('user_id', userId);
  if (error) throw error;
  return (data as WishlistItem[]) || [];
}

export async function getWishlistItems(userId: string): Promise<Product[]> {
  const { data, error } = await supabase
    .from('wishlist_items')
    .select('*, product:products(*)')
    .eq('user_id', userId);
  if (error) throw error;
  return (data || []).map((item: any) => ({ ...item.product, wishlist_id: item.id })) as Product[];
}

export async function addToWishlist(userId: string, productId: string): Promise<void> {
  const { error } = await supabase
    .from('wishlist_items')
    .upsert({ user_id: userId, product_id: productId });
  if (error) throw error;
}

export async function removeFromWishlist(userId: string, productId: string): Promise<void> {
  const { error } = await supabase
    .from('wishlist_items')
    .delete()
    .eq('user_id', userId)
    .eq('product_id', productId);
  if (error) throw error;
}

export async function clearWishlist(userId: string): Promise<void> {
  const { error } = await supabase.from('wishlist_items').delete().eq('user_id', userId);
  if (error) throw error;
}

export async function isInWishlist(userId: string, productId: string): Promise<boolean> {
  const { data, error } = await supabase
    .from('wishlist_items')
    .select('id')
    .eq('user_id', userId)
    .eq('product_id', productId)
    .maybeSingle();
  if (error) throw error;
  return !!data;
}
