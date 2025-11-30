import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getMatchColor(score: number): string {
  if (score >= 85) return 'text-green-600';
  if (score >= 75) return 'text-blue-600';
  return 'text-yellow-600';
}

export function getMatchBgColor(score: number): string {
  if (score >= 85) return 'bg-green-100';
  if (score >= 75) return 'bg-blue-100';
  return 'bg-yellow-100';
}
