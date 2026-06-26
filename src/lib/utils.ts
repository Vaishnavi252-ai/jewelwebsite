import { clsx, type ClassValue } from 'clsx';

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export function generateOrderNumber(): string {
  return 'VL-' + Date.now().toString().slice(-8);
}

export const METAL_LABELS: Record<string, string> = {
  gold: 'Gold',
  silver: 'Silver',
  platinum: 'Platinum',
  rose_gold: 'Rose Gold',
  white_gold: 'White Gold',
};

export const LOCAL_IMGS = [
  'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQnDeI8e4AeGOcb5i1wB24d97V3VjHPMvbJ9OHhjMtufA&s=10',
  'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQt4ejNG2ZWQ1-izApJeK8VhbScki9f58xy-tgkT6LZbZ750rcIRCFEdW8&s=10',
  'https://www.lavanajewellery.com.au/cdn/shop/collections/lavana-gold-jewellery.jpg?v=1763907019',
  'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTIMAnUjB2zTfh_l3vX481Cyx1_VkLjAWD5GEhJYmGNNA&s=10',
  'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT73fIy6LjssBRyVR_uvbuvFir4ZmJDYzfIUa-8n1Ingtv5v25NdG7hEXPE&s=10',
];
