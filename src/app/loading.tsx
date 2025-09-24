'use client';
import { useEffect } from 'react';

export default function Loading() {
  useEffect(() => {
    document.documentElement.classList.add('loading-cursor');
    return () => {
      document.documentElement.classList.remove('loading-cursor');
    };
  }, []);

  return null;
}
