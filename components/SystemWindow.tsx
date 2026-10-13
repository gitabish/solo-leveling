'use client';

import React from 'react';
import { motion } from 'motion/react';

interface SystemWindowProps {
  title?: string;
  variant?: 'blue' | 'violet' | 'danger' | 'gold';
  children: React.ReactNode;
  className?: string;
  headerRight?: React.ReactNode;
}

export function SystemWindow({
  title,
  variant = 'blue',
  children,
  className = '',
  headerRight,
}: SystemWindowProps) {
  const variantClass = {
    blue: 'system-window',
    violet: 'system-window system-window-violet',
    danger: 'system-window system-window-danger',
    gold: 'system-window system-window-gold',
  }[variant];

  const titleColor = {
    blue: 'text-[#7DF9FF] text-glow-cyan',
    violet: 'text-[#C49BFF] text-glow-violet',
    danger: 'text-[#FF3B4E] text-glow-danger',
    gold: 'text-[#FFC857] text-glow-gold',
  }[variant];

  const lineColor = {
    blue: 'from-transparent via-[#2F8CFF] to-transparent',
    violet: 'from-transparent via-[#8B5CFF] to-transparent',
    danger: 'from-transparent via-[#FF3B4E] to-transparent',
    gold: 'from-transparent via-[#FFC857] to-transparent',
  }[variant];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.98 }}
      transition={{ duration: 0.2 }}
      className={`relative rounded-sm p-4 ${variantClass} ${className}`}
    >
      {/* Corner Brackets */}
      <div className="corner-bracket-tl" />
      <div className="corner-bracket-tr" />
      <div className="corner-bracket-bl" />
      <div className="corner-bracket-br" />

      {/* Header if title provided */}
      {title && (
        <div className="relative mb-3 flex items-center justify-between pb-2">
          <div className={`h-[1px] flex-1 bg-gradient-to-r ${lineColor}`} />
          <div className="mx-3 flex items-center gap-2">
            <span className={`font-cyber text-xs sm:text-sm font-bold tracking-widest uppercase ${titleColor}`}>
              [ {title} ]
            </span>
          </div>
          <div className={`h-[1px] flex-1 bg-gradient-to-r ${lineColor}`} />
          {headerRight && <div className="ml-2">{headerRight}</div>}
        </div>
      )}

      {children}
    </motion.div>
  );
}
