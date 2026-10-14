'use client';

import React from 'react';
import { motion } from 'motion/react';

interface SoloNotificationWindowProps {
  title?: string;
  children: React.ReactNode;
  className?: string;
  isGlitching?: boolean;
}

export function SoloNotificationWindow({
  title = 'NOTIFICATION',
  children,
  className = '',
  isGlitching = false,
}: SoloNotificationWindowProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{
        opacity: 1,
        scale: 1,
        x: isGlitching ? [-4, 5, -3, 4, -2, 3, 0] : 0,
        y: isGlitching ? [2, -3, 3, -2, 1, 0] : 0,
      }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{
        duration: isGlitching ? 0.4 : 0.2,
        repeat: isGlitching ? 3 : 0,
      }}
      className={`relative rounded-xs border-2 border-[#2F8CFF] bg-[#020714]/95 p-4 sm:p-6 shadow-[0_0_30px_rgba(47,140,255,0.35),inset_0_0_24px_rgba(47,140,255,0.15)] backdrop-blur-xl ${
        isGlitching ? 'skew-x-[-1deg] filter hue-rotate-15' : ''
      } ${className}`}
    >
      {/* Anime Circuit Corner Brackets & Stepped Edges */}
      <div className="pointer-events-none absolute -top-1 -left-1 w-4 h-4 border-t-2 border-l-2 border-[#7DF9FF] shadow-[0_0_8px_#7DF9FF]" />
      <div className="pointer-events-none absolute -top-1 -right-1 w-4 h-4 border-t-2 border-r-2 border-[#7DF9FF] shadow-[0_0_8px_#7DF9FF]" />
      <div className="pointer-events-none absolute -bottom-1 -left-1 w-4 h-4 border-b-2 border-l-2 border-[#7DF9FF] shadow-[0_0_8px_#7DF9FF]" />
      <div className="pointer-events-none absolute -bottom-1 -right-1 w-4 h-4 border-b-2 border-r-2 border-[#7DF9FF] shadow-[0_0_8px_#7DF9FF]" />

      {/* Stepped edge notches (Solo Leveling anime style) */}
      <div className="pointer-events-none absolute top-0 left-8 right-8 h-[1px] bg-gradient-to-r from-transparent via-[#7DF9FF] to-transparent opacity-80" />
      <div className="pointer-events-none absolute bottom-0 left-8 right-8 h-[1px] bg-gradient-to-r from-transparent via-[#7DF9FF] to-transparent opacity-80" />
      <div className="pointer-events-none absolute -left-[3px] top-1/4 h-8 w-[4px] bg-[#2F8CFF] shadow-[0_0_6px_#2F8CFF]" />
      <div className="pointer-events-none absolute -right-[3px] top-1/4 h-8 w-[4px] bg-[#2F8CFF] shadow-[0_0_6px_#2F8CFF]" />

      {/* Glitch Scanlines & Chromatic Jitter Overlay */}
      {isGlitching && (
        <div className="pointer-events-none absolute inset-0 z-30 overflow-hidden rounded-xs mix-blend-screen opacity-90">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#7DF9FF]/20 to-[#FF3B4E]/20 animate-pulse" />
          <div className="absolute top-1/4 left-0 right-0 h-2 bg-[#7DF9FF]/40 shadow-[0_0_10px_#7DF9FF]" />
          <div className="absolute top-2/3 left-0 right-0 h-3 bg-[#FF3B4E]/30 shadow-[0_0_10px_#FF3B4E]" />
        </div>
      )}

      {/* Dual-Box Header matching exact design from image.png */}
      <div className="relative z-10 mb-5 flex items-stretch gap-2.5 sm:gap-3.5">
        {/* Left: Framed (!) Circular Badge Box */}
        <div className="flex shrink-0 items-center justify-center rounded-xs border border-[#2F8CFF]/80 bg-[#030A1A]/85 px-2.5 py-2 sm:px-3 sm:py-2.5 shadow-[0_0_12px_rgba(47,140,255,0.3)]">
          <div className="flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-full border-2 border-[#7DF9FF] shadow-[0_0_12px_#7DF9FF,inset_0_0_6px_#7DF9FF] bg-[#020B1E]">
            <span className="font-cyber text-lg sm:text-xl font-black text-[#7DF9FF] drop-shadow-[0_0_8px_#7DF9FF] leading-none select-none">
              !
            </span>
          </div>
        </div>

        {/* Right/Center: Framed Title Box */}
        <div className="flex flex-1 items-center justify-center rounded-xs border border-[#2F8CFF]/80 bg-[#030A1A]/85 px-4 py-2 sm:py-2.5 shadow-[0_0_12px_rgba(47,140,255,0.3)]">
          <h2 className="font-cyber text-base sm:text-xl font-black tracking-[0.25em] text-[#7DF9FF] drop-shadow-[0_0_12px_rgba(125,249,255,0.95)] uppercase text-center">
            {title}
          </h2>
        </div>
      </div>

      {/* Window Body */}
      <div className="relative z-10">{children}</div>
    </motion.div>
  );
}
