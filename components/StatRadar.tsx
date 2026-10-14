'use client';

import React from 'react';
import { PlayerStats } from '@/lib/types';

interface StatRadarProps {
  stats: PlayerStats;
  size?: number;
}

export function StatRadar({ stats, size = 200 }: StatRadarProps) {
  // 5 vertices for a pentagon
  // Labels: STR (top), AGI (top-right), VIT (bottom-right), INT (bottom-left), SEN (top-left)
  const statKeys: { key: keyof PlayerStats; label: string }[] = [
    { key: 'strength', label: 'STR' },
    { key: 'agility', label: 'AGI' },
    { key: 'vitality', label: 'VIT' },
    { key: 'intelligence', label: 'INT' },
    { key: 'sense', label: 'PER' },
  ];

  const center = size / 2;
  const radius = (size / 2) * 0.72;

  // Find max stat to scale decently, minimum scale ceiling of 30
  const maxStatVal = Math.max(
    30,
    stats.strength,
    stats.agility,
    stats.vitality,
    stats.intelligence,
    stats.sense
  );

  // Helper to get coordinates at angle
  const getCoordinates = (index: number, valNorm: number) => {
    // 5 vertices: 0 is top (-PI/2)
    const angle = (index * (2 * Math.PI)) / 5 - Math.PI / 2;
    const r = radius * valNorm;
    const x = center + r * Math.cos(angle);
    const y = center + r * Math.sin(angle);
    return { x, y };
  };

  // Grid steps (0.25, 0.5, 0.75, 1.0)
  const steps = [0.25, 0.5, 0.75, 1.0];

  // Polygon points for stats
  const statPoints = statKeys
    .map((item, idx) => {
      const val = stats[item.key];
      const norm = Math.min(1, Math.max(0.15, val / maxStatVal));
      const { x, y } = getCoordinates(idx, norm);
      return `${x},${y}`;
    })
    .join(' ');

  return (
    <div className="relative flex flex-col items-center justify-center select-none">
      <svg width={size} height={size} className="overflow-visible">
        {/* Background Grids */}
        {steps.map((step) => {
          const gridPoints = [0, 1, 2, 3, 4]
            .map((i) => {
              const { x, y } = getCoordinates(i, step);
              return `${x},${y}`;
            })
            .join(' ');
          return (
            <polygon
              key={step}
              points={gridPoints}
              fill={step === 1 ? 'rgba(7, 20, 44, 0.4)' : 'none'}
              stroke="#2F8CFF"
              strokeWidth={step === 1 ? '1.2' : '0.6'}
              strokeOpacity={step === 1 ? '0.45' : '0.2'}
              strokeDasharray={step < 1 ? '3 3' : undefined}
            />
          );
        })}

        {/* Spokes connecting center to vertices */}
        {[0, 1, 2, 3, 4].map((i) => {
          const { x, y } = getCoordinates(i, 1);
          return (
            <line
              key={i}
              x1={center}
              y1={center}
              x2={x}
              y2={y}
              stroke="#2F8CFF"
              strokeWidth="0.8"
              strokeOpacity="0.3"
            />
          );
        })}

        {/* Dynamic Player Stat Shape */}
        <polygon
          points={statPoints}
          fill="rgba(47, 140, 255, 0.22)"
          stroke="#7DF9FF"
          strokeWidth="1.8"
          style={{
            filter: 'drop-shadow(0 0 6px rgba(125, 249, 255, 0.5))',
          }}
        />

        {/* Vertices dots */}
        {statKeys.map((item, idx) => {
          const val = stats[item.key];
          const norm = Math.min(1, Math.max(0.15, val / maxStatVal));
          const { x, y } = getCoordinates(idx, norm);
          return (
            <circle
              key={item.key}
              cx={x}
              cy={y}
              r="3"
              fill="#7DF9FF"
              stroke="#03060D"
              strokeWidth="1"
            />
          );
        })}

        {/* Stat Labels */}
        {statKeys.map((item, idx) => {
          const { x, y } = getCoordinates(idx, 1.22);
          const val = stats[item.key];
          return (
            <g key={item.key}>
              <text
                x={x}
                y={y - 4}
                textAnchor="middle"
                dominantBaseline="central"
                className="fill-[#7FA6C9] font-cyber text-[10px] font-bold tracking-wider"
              >
                {item.label}
              </text>
              <text
                x={x}
                y={y + 8}
                textAnchor="middle"
                dominantBaseline="central"
                className="fill-[#7DF9FF] font-cyber text-[11px] font-bold"
              >
                {val}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
