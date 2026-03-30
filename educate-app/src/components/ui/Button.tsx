'use client';

import { ButtonHTMLAttributes } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost';
  accentColor?: string;
}

export function Button({ variant = 'primary', accentColor, className = '', children, ...props }: ButtonProps) {
  const base = 'rounded-xl font-bold text-sm cursor-pointer transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed';

  const variants = {
    primary: 'border-none text-white py-3 px-6',
    secondary: 'bg-neutral-800 border border-neutral-700 text-neutral-400 py-3 px-6 hover:bg-neutral-700',
    ghost: 'bg-transparent border border-neutral-700 text-neutral-400 py-1.5 px-3.5 text-xs hover:bg-neutral-800',
  };

  const style = accentColor && variant === 'primary' ? { backgroundColor: accentColor } : undefined;

  return (
    <button className={`${base} ${variants[variant]} ${className}`} style={style} {...props}>
      {children}
    </button>
  );
}
