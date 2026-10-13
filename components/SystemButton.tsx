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

  const baseStyles = 'relative inline-flex items-center justify-center font-cyber font-semibold tracking-wider uppercase transition-all duration-150 select-none cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed';

  const sizeStyles = {
    sm: 'text-xs px-2.5 py-1 min-h-[28px]',
    md: 'text-xs sm:text-sm px-4 py-2 min-h-[36px]',
    lg: 'text-sm sm:text-base px-6 py-3 min-h-[44px]',
  }[size];

  const variantStyles = {
    primary:
      'bg-[rgba(47,140,255,0.18)] hover:bg-[rgba(47,140,255,0.32)] active:scale-[0.98] text-[#7DF9FF] border border-[#2F8CFF] shadow-[0_0_12px_rgba(47,140,255,0.3)] hover:shadow-[0_0_18px_rgba(77,184,255,0.5)]',
    danger:
      'bg-[rgba(255,59,78,0.22)] hover:bg-[rgba(255,59,78,0.35)] active:scale-[0.98] text-[#FF9EAA] border border-[#FF3B4E] shadow-[0_0_12px_rgba(255,59,78,0.35)] hover:shadow-[0_0_20px_rgba(255,59,78,0.6)]',
    violet:
      'bg-[rgba(139,92,255,0.22)] hover:bg-[rgba(139,92,255,0.35)] active:scale-[0.98] text-[#D8B4FE] border border-[#8B5CFF] shadow-[0_0_12px_rgba(139,92,255,0.35)] hover:shadow-[0_0_20px_rgba(139,92,255,0.6)]',
    gold:
      'bg-[rgba(255,200,87,0.22)] hover:bg-[rgba(255,200,87,0.35)] active:scale-[0.98] text-[#FFE799] border border-[#FFC857] shadow-[0_0_14px_rgba(255,200,87,0.4)] hover:shadow-[0_0_24px_rgba(255,200,87,0.7)]',
    subtle:
      'bg-[rgba(7,16,31,0.6)] hover:bg-[rgba(47,140,255,0.15)] text-[#7FA6C9] hover:text-[#E8F4FF] border border-transparent hover:border-[#2F8CFF]/50',
    outline:
      'bg-transparent hover:bg-[rgba(47,140,255,0.12)] text-[#E8F4FF] border border-[#2F8CFF]/60 hover:border-[#7DF9FF]',
  }[variant];

  return (
    <button
      {...props}
      disabled={disabled}
      onClick={handleClick}
      className={`${baseStyles} ${sizeStyles} ${variantStyles} ${className}`}
    >
      {/* Subtle corner ticks */}
      <span className="pointer-events-none absolute -top-0.5 -left-0.5 h-1.5 w-1.5 border-t border-l border-current opacity-80" />
      <span className="pointer-events-none absolute -bottom-0.5 -right-0.5 h-1.5 w-1.5 border-b border-r border-current opacity-80" />
      {children}
    </button>
  );
}
