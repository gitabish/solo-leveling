'use client';

import React from 'react';
import { motion } from 'motion/react';

interface SystemWindowProps {
  title?: string;
  showIcon?: boolean;
  icon?: React.ReactNode;
  variant?: 'blue' | 'violet' | 'danger' | 'gold';
  tilt?: boolean;
  withBars?: boolean;
  children: React.ReactNode;
  className?: string;
  headerRight?: React.ReactNode;
}

export function SystemWindow({
  title,
  showIcon,
  icon,
  variant = 'blue',
  tilt = false,
  withBars = false,
  children,
  className = '',
  headerRight,
}: SystemWindowProps) {
  // Determine if title should include the authentic exclamation icon box
  // By default: STATUS has no icon; QUEST INFO, NOTIFICATION, etc. have icon box
  const hasIconBox =
    showIcon !== undefined
      ? showIcon
      : title
      ? title.toUpperCase() !== 'STATUS'
      : false;

  const themeClass = {
    blue: '',
    violet: 'theme-violet',
    danger: 'theme-danger',
    gold: 'theme-gold',
  }[variant];

  return (
    <div className={`relative ${themeClass} ${withBars ? 'w-full flex justify-center' : ''}`}>
      {/* Main Authentic System Window Box with 8px double outer frame & scratches */}
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.96 }}
        transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
        className={`sys-window ${tilt ? 'tilt' : ''} ${className}`}
      >
        {/* Glowing Top & Bottom Circuit Bars pushed to the outer perimeter of the box */}
        {withBars && (
          <>
            <div className="sys-bar-wrap top pointer-events-none">
              <div className="sys-bar" />
            </div>
            <div className="sys-bar-wrap bottom pointer-events-none">
              <div className="sys-bar" />
            </div>
          </>
        )}

        {/* Title Bar (STATUS, QUEST INFO, NOTIFICATION) */}
        {title && (
          <div className="sys-title-row">
            {hasIconBox && (
              <div className="sys-icon-box">
                {icon ? (
                  icon
                ) : (
                  <div className="w-5 h-5 rounded-full border-[1.5px] border-[var(--line)] flex items-center justify-center text-[var(--line)] font-head font-bold text-xs shadow-[0_0_8px_var(--glow)]">
                    !
                  </div>
                )}
              </div>
            )}
            <div className="sys-title">
              {title}
            </div>
            {headerRight && <div className="self-center ml-2">{headerRight}</div>}
          </div>
        )}

        {/* Content */}
        <div className="relative z-10">{children}</div>
      </motion.div>
    </div>
  );
}
