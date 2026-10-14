'use client';

import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { HunterRank } from '@/lib/types';
import { RANK_CONFIG } from '@/lib/config';
import { SystemWindow } from './SystemWindow';
import { RankBadge } from './RankBadge';

interface RankUpOverlayProps {
  info: {
    prevRank: HunterRank;
    newRank: HunterRank;
    title: string;
  } | null;
  onClose: () => void;
}

export function RankUpOverlay({ info, onClose }: RankUpOverlayProps) {
  if (!info) return null;

  const targetConfig = RANK_CONFIG[info.newRank] || RANK_CONFIG.E;
  const variant = info.newRank === 'S' ? 'gold' : info.newRank === 'A' ? 'violet' : 'blue';

  const stackedLines = [
    'Rank up!',
    'Rank up!',
    'Rank up!',
    'Rank up!',
  ];

  return (
    <AnimatePresence>
      <div className="sys-overlay">
        <SystemWindow
          title="NOTIFICATION"
          variant={variant}
          withBars={true}
          className="max-w-[420px] w-full"
        >
          <div className="py-2 text-center space-y-6">
            {/* Four stacked, staggered bold italic 'Rank up!' lines */}
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
                  style={{
                    color: '#ffffff',
                    textShadow: `0 0 6px #fff, 0 0 16px ${targetConfig.color}, 0 0 34px ${targetConfig.bgGlow}`,
                  }}
                >
                  {line}
                </motion.div>
              ))}
            </div>

            {/* Badge display */}
            <div className="flex justify-center my-2">
              <RankBadge rank={info.newRank} size="lg" showLabel={true} />
            </div>

            {/* Details */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.55, duration: 0.3 }}
              className="space-y-2 font-body text-sm text-[#9fc4e0] border-t border-[rgba(183,227,255,0.2)] pt-4"
            >
              <div className="font-head font-bold text-white text-base tracking-wider">
                Rank {info.prevRank} &gt; Rank {info.newRank}
              </div>
              <div className="text-xs text-[#b7e3ff]">
                Cleared [ {info.title} ] • +10 Ability Points Awarded
              </div>
            </motion.div>

            {/* Confirm button */}
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
                ACCEPT PROMOTION
              </button>
            </motion.div>
          </div>
        </SystemWindow>
      </div>
    </AnimatePresence>
  );
}
