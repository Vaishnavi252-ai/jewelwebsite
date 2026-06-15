import { supabase } from '../lib/supabase';
import { ContactMessage } from '../types';

export async function sendContactMessage(msg: Omit<ContactMessage, 'id' | 'is_read' | 'created_at'>): Promise<void> {
  const { error } = await supabase.from('contact_messages').insert(msg);
  if (error) throw error;
}

export async function submitContactForm(form: { name: string; email: string; phone?: string; subject?: string; message: string }): Promise<void> {
  const { error } = await supabase.from('contact_messages').insert({
    name: form.name,
    email: form.email,
    phone: form.phone || null,
    subject: form.subject || null,
    message: form.message,
  });
  if (error) throw error;
}
