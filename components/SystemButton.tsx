'use client';

import React from 'react';
import { sound } from '@/lib/sound';

interface SystemButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'danger' | 'violet' | 'gold' | 'subtle' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

export function SystemButton({
  variant = 'primary',
  size = 'md',
  children,
  className = '',
  onClick,
  disabled,
  ...props
}: SystemButtonProps) {
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (disabled) return;
    sound.playClick();
    if (onClick) onClick(e);
  };

  const baseStyles =
    'relative inline-flex items-center justify-center font-head font-bold tracking-[0.16em] uppercase transition-all duration-150 select-none cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed border';

  const sizeStyles = {
    sm: 'text-[11px] px-3 py-1 min-h-[30px]',
    md: 'text-xs sm:text-sm px-4 py-2 min-h-[38px]',
    lg: 'text-sm sm:text-base px-6 py-2.5 min-h-[44px]',
  }[size];

  const variantStyles = {
    primary:
      'bg-[rgba(207,233,255,0.06)] hover:bg-[rgba(207,233,255,0.16)] active:scale-[0.98] text-[#f4faff] border-[var(--line)] shadow-[0_0_10px_rgba(47,155,255,0.25)] hover:shadow-[0_0_16px_var(--glow-hi)]',
    danger:
      'bg-[rgba(255,32,85,0.12)] hover:bg-[rgba(255,32,85,0.25)] active:scale-[0.98] text-[#ffb3c1] border-[var(--bad)] shadow-[0_0_10px_rgba(255,32,85,0.3)] hover:shadow-[0_0_16px_var(--bad)]',
    violet:
      'bg-[rgba(168,85,247,0.12)] hover:bg-[rgba(168,85,247,0.25)] active:scale-[0.98] text-[#e9d5ff] border-[#a855f7] shadow-[0_0_10px_rgba(168,85,247,0.3)] hover:shadow-[0_0_16px_#c084fc]',
    gold:
      'bg-[rgba(234,179,8,0.12)] hover:bg-[rgba(234,179,8,0.25)] active:scale-[0.98] text-[#fef08a] border-[#eab308] shadow-[0_0_10px_rgba(234,179,8,0.3)] hover:shadow-[0_0_16px_#fde047]',
    subtle:
      'bg-[rgba(6,16,31,0.6)] hover:bg-[rgba(47,155,255,0.15)] text-[#9fc4e0] hover:text-[#f4faff] border-transparent hover:border-[var(--line-soft)]',
    outline:
      'bg-transparent hover:bg-[rgba(207,233,255,0.1)] text-[#f4faff] border-[var(--line)] hover:shadow-[0_0_12px_var(--glow)]',
  }[variant];

  return (
    <button
      {...props}
      disabled={disabled}
      onClick={handleClick}
      className={`${baseStyles} ${sizeStyles} ${variantStyles} ${className}`}
    >
      {children}
    </button>
  );
}
