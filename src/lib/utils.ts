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
  '/IMG_20260615_204547.jpg',
  '/IMG_20260615_204615.jpg',
  '/IMG_20260615_204634.jpg',
  '/IMG_20260615_204652.jpg',
  '/IMG_20260615_204715.jpg',
];
