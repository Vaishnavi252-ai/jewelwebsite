import { supabase } from '../lib/supabase';
import { CartItem } from '../types';

export async function getCartItems(userId: string): Promise<CartItem[]> {
  const { data, error } = await supabase
    .from('cart_items')
    .select('*, product:products(*)')
    .eq('user_id', userId);
  if (error) throw error;
  return (data as CartItem[]) || [];
}

export async function countCartItems(userId: string): Promise<number> {
  const { count, error } = await supabase
    .from('cart_items')
    .select('id', { count: 'exact', head: true })
    .eq('user_id', userId);

  if (error) throw error;
  return count ?? 0;
}


export async function addToCart(userId: string, productId: string, unitPrice: number, qty = 1): Promise<CartItem> {
  const { data: existing } = await supabase
    .from('cart_items')
    .select('*')
    .eq('user_id', userId)
    .eq('product_id', productId)
    .maybeSingle();

  if (existing) {
    const { data, error } = await supabase
      .from('cart_items')
      .update({ quantity: (existing as CartItem).quantity + qty })
      .eq('id', (existing as CartItem).id)
      .select('*, product:products(*)')
      .single();
    if (error) throw error;
    return data as CartItem;
  }

  const { data, error } = await supabase
    .from('cart_items')
    .insert({ user_id: userId, product_id: productId, unit_price: unitPrice, quantity: qty })
    .select('*, product:products(*)')
    .single();
  if (error) throw error;
  return data as CartItem;
}

export async function updateCartItem(id: string, quantity: number): Promise<void> {
  const { error } = await supabase.from('cart_items').update({ quantity }).eq('id', id);
  if (error) throw error;
}

export async function removeCartItem(id: string): Promise<void> {
  const { error } = await supabase.from('cart_items').delete().eq('id', id);
  if (error) throw error;
}

export async function clearCart(userId: string): Promise<void> {
  const { error } = await supabase.from('cart_items').delete().eq('user_id', userId);
  if (error) throw error;
}
