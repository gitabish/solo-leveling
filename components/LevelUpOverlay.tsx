'use client';

import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { SystemWindow } from './SystemWindow';

interface LevelUpOverlayProps {
  info: {
    prevLevel: number;
    newLevel: number;
    pointsAdded: number;
  } | null;
  onClose: () => void;
}

export function LevelUpOverlay({ info, onClose }: LevelUpOverlayProps) {
  if (!info) return null;

  const stackedLines = [
    'Leveled up!',
    'Leveled up!',
    'Leveled up!',
    'Leveled up!',
  ];

  return (
    <AnimatePresence>
      <div className="sys-overlay">
        {/* Glowing bars sit above and below the box */}
        <SystemWindow
          title="NOTIFICATION"
          withBars={true}
          className="max-w-[420px] w-full"
        >
          <div className="py-2 text-center space-y-6">
            {/* Four stacked, staggered bold italic 'Leveled up!' lines with glowing blue aura */}
            <div className="space-y-1 my-3">
              {stackedLines.map((line, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    delay: idx * 0.12,
                    duration: 0.35,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  className="leveled-line"
                >
                  {line}
                </motion.div>
              ))}
            </div>

            {/* Smaller body details */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.55, duration: 0.3 }}
              className="space-y-2 font-body text-sm text-[#9fc4e0] border-t border-[rgba(183,227,255,0.2)] pt-4"
            >
              <div className="font-head font-bold text-white text-base tracking-wider">
                Level {info.prevLevel} &gt; Level {info.newLevel}
              </div>
              <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-xs text-[#b7e3ff]">
                <span>Ability Points +{info.pointsAdded}</span>
                <span>•</span>
                <span>Fatigue reset</span>
                <span>•</span>
                <span>HP / MP restored</span>
              </div>
            </motion.div>

            {/* OK Button */}
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.65, duration: 0.25 }}
              className="pt-2 flex justify-center"
            >
              <button
                type="button"
                onClick={onClose}
                className="sys-btn px-10 py-2.5 text-sm"
              >
                CONFIRM
              </button>
            </motion.div>
          </div>
        </SystemWindow>
      </div>
    </AnimatePresence>
  );
}
