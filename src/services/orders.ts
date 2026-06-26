import { supabase } from '../lib/supabase';
import { Order, CartItem } from '../types';
import { generateOrderNumber } from '../lib/utils';

interface PlaceOrderInput {
  userId: string;
  customerName: string;
  customerPhone: string;
  shippingStreet: string;
  shippingCity: string;
  shippingState: string;
  shippingPostalCode: string;
  shippingCountry: string;
  cartItems: CartItem[];
  // paymentMethod values can be 'card' | 'upi' | 'cod'
  paymentMethod: string;
}

export async function placeOrder(input: PlaceOrderInput): Promise<Order> {
  const subtotal = input.cartItems.reduce((s, i) => s + i.unit_price * i.quantity, 0);
  const shippingCost = subtotal > 50000 ? 0 : 500;
  const taxAmount = Math.round(subtotal * 0.18);
  const totalAmount = subtotal + shippingCost + taxAmount;

  const { data: order, error: orderError } = await supabase
    .from('orders')
    .insert({
      order_number: generateOrderNumber(),
      user_id: input.userId,
      customer_name: input.customerName,
      customer_phone: input.customerPhone,
      shipping_street: input.shippingStreet,
      shipping_city: input.shippingCity,
      shipping_state: input.shippingState,
      shipping_postal_code: input.shippingPostalCode,
      shipping_country: input.shippingCountry,
      subtotal,
      shipping_cost: shippingCost,
      tax_amount: taxAmount,
      total_amount: totalAmount,
      payment_status: 'pending',
      payment_method: input.paymentMethod,
      status: 'processing',
    })
    .select()
    .single();

  if (orderError) throw orderError;

  const orderItems = input.cartItems.map(item => ({
    order_id: order.id,
    product_id: item.product_id,
    product_title: item.product?.title || 'Product',
    product_image: item.product?.images?.[0] || null,
    quantity: item.quantity,
    unit_price: item.unit_price,
    total_price: item.unit_price * item.quantity,
  }));

  const { error: itemsError } = await supabase.from('order_items').insert(orderItems);
  if (itemsError) throw itemsError;

  // Cart will be cleared only after payment succeeds (handled by Razorpay backend)
  return order as Order;
}

export async function getUserOrders(userId: string): Promise<Order[]> {
  const { data, error } = await supabase
    .from('orders')
    .select('*, order_items(*)')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return (data as Order[]) || [];
}

export async function getOrderById(id: string): Promise<Order | null> {
  const { data, error } = await supabase
    .from('orders')
    .select('*, order_items(*)')
    .eq('id', id)
    .maybeSingle();
  if (error) throw error;
  return data as Order | null;
}

export async function getAllOrders(): Promise<Order[]> {
  const { data, error } = await supabase
    .from('orders')
    .select('*, order_items(*)')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return (data as Order[]) || [];
}

export async function updateOrderStatus(id: string, status: Order['status']): Promise<void> {
  const { error } = await supabase.from('orders').update({ status }).eq('id', id);
  if (error) throw error;
}
