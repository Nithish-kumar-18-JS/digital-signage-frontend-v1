'use client'
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getCookies(name: string) {
  if (typeof document === 'undefined') return null;
  const value = document.cookie.split('; ').find((cookie) => cookie.startsWith(`${name}=`));
  return value ? value.split('=')[1] : null;
}

export function setCookie(name: string, value: string) {
  if (typeof document === 'undefined') return;
  document.cookie = `${name}=${value}; path=/; expires=Fri, 31 Dec 9999 23:59:59 GMT`;
}

export function clearAllCookies() {
  if (typeof document === 'undefined') return;
  document.cookie.split(';').forEach((cookie) => {
    document.cookie = cookie
      .replace(/^ +/, '')
      .replace(/=.*/, `=;expires=${new Date().toUTCString()};path=/`);
  });
}

export function formatDate(date: Date) {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}