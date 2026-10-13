'use client';

import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { HunterRank } from '@/lib/types';
import { RANK_CONFIG } from '@/lib/config';
import { RankBadge } from './RankBadge';
import { SystemButton } from './SystemButton';
import { Sparkles } from 'lucide-react';

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

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/92 backdrop-blur-md overflow-hidden select-none">
        {/* Glow behind badge */}
        <div
          className="absolute w-72 h-72 rounded-full blur-3xl pointer-events-none opacity-40"
          style={{ backgroundColor: targetConfig.color }}
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ duration: 0.4 }}
          className="relative w-full max-w-sm rounded-sm bg-[#081630]/95 border p-6 text-center"
          style={{ borderColor: targetConfig.color, boxShadow: `0 0 35px ${targetConfig.bgGlow}` }}
        >
          <div className="corner-bracket-tl" />
          <div className="corner-bracket-tr" />
          <div className="corner-bracket-bl" />
          <div className="corner-bracket-br" />

          <div className="text-[11px] font-cyber tracking-widest text-[#7DF9FF] uppercase mb-1">
            [ RANK PROMOTION CONCLUDED ]
          </div>

          <h1
            className="text-2xl sm:text-3xl font-black font-cyber tracking-wider uppercase my-3"
            style={{ color: targetConfig.color, textShadow: `0 0 12px ${targetConfig.color}` }}
          >
            HUNTER RE-EVALUATION
          </h1>

          {/* Animating Rank Badge */}
          <motion.div
            initial={{ rotateY: 180, scale: 0.5 }}
            animate={{ rotateY: 360, scale: 1 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="my-6 flex justify-center"
          >
            <RankBadge rank={info.newRank} size="xl" showLabel={true} />
          </motion.div>

          <div className="p-3 bg-[#03060D]/80 border border-[#2F8CFF]/30 rounded-xs mb-4">
            <p className="font-cyber text-sm text-[#E8F4FF] leading-relaxed">
              You have passed the [ {info.title} ].
            </p>
            <p className="font-cyber text-sm font-bold mt-1" style={{ color: targetConfig.color }}>
              Promoted from Rank {info.prevRank} → Rank {info.newRank}
            </p>
          </div>

          <div className="flex items-center justify-between p-2 rounded-xs bg-[#07101F]/80 border border-[#2F8CFF]/20 text-xs font-cyber mb-5">
            <span className="flex items-center gap-1.5 text-[#7FA6C9]">
              <Sparkles className="w-3.5 h-3.5 text-[#FFC857]" />
              Promotion Reward
            </span>
            <span className="text-[#FFC857] font-bold">+10 Ability Points</span>
          </div>

          <SystemButton variant="primary" size="lg" onClick={onClose} className="w-full">
            ACCEPT PROMOTION
          </SystemButton>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
