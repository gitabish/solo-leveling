'use client';

import React from 'react';
import { HunterRank } from '@/lib/types';
import { RANK_CONFIG } from '@/lib/config';

interface RankBadgeProps {
  rank: HunterRank;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showLabel?: boolean;
}

export function RankBadge({ rank, size = 'md', showLabel = false }: RankBadgeProps) {
  const config = RANK_CONFIG[rank] || RANK_CONFIG.E;

  const sizeDims = {
    sm: 'w-7 h-7 text-xs',
    md: 'w-10 h-10 text-sm font-bold',
    lg: 'w-14 h-14 text-xl font-bold',
    xl: 'w-20 h-20 text-3xl font-black',
  }[size];

  return (
    <div className="inline-flex flex-col items-center gap-1 select-none">
      <div
        className={`relative flex items-center justify-center font-cyber tracking-wider transition-all duration-300 ${sizeDims}`}
        style={{
          color: config.color,
          filter: `drop-shadow(0 0 8px ${config.bgGlow})`,
        }}
      >
        {/* Outer Hexagon Shield SVG */}
        <svg
          viewBox="0 0 100 100"
          className="absolute inset-0 w-full h-full"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Background fill */}
          <polygon
            points="50,4 92,26 92,74 50,96 8,74 8,26"
            fill="rgba(5, 14, 30, 0.9)"
            stroke={config.badgeBorder}
            strokeWidth="3"
          />
          {/* Inner Accent Line */}
          <polygon
            points="50,12 84,30 84,70 50,88 16,70 16,30"
            fill="none"
            stroke={config.color}
            strokeWidth="1.2"
            strokeDasharray="4 2"
            opacity="0.65"
          />
        </svg>

        {/* Rank Letter */}
        <span
          className="relative z-10"
          style={{
            textShadow: `0 0 10px ${config.color}`,
          }}
        >
          {rank}
        </span>
      </div>

      {showLabel && (
        <span
          className="text-[10px] font-cyber tracking-widest uppercase font-semibold"
          style={{ color: config.color }}
        >
          {config.name}
        </span>
      )}
    </div>
  );
}
