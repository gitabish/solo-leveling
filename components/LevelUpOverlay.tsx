'use client';

import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { SystemButton } from './SystemButton';
import { Sparkles, Zap, Heart, BatteryCharging } from 'lucide-react';

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

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md overflow-hidden select-none">
        {/* Blue Light Pillar Rising Effect */}
        <motion.div
          initial={{ opacity: 0, scaleY: 0 }}
          animate={{ opacity: 0.6, scaleY: 1 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="absolute inset-x-0 h-full w-48 sm:w-80 mx-auto pointer-events-none bg-gradient-to-t from-transparent via-[#2F8CFF]/30 to-transparent blur-2xl origin-bottom"
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.85, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.35, ease: 'easeOut' }}
          className="relative w-full max-w-sm rounded-sm bg-[#081630]/90 border border-[#2F8CFF] shadow-[0_0_35px_rgba(47,140,255,0.6)] p-6 text-center"
        >
          {/* Corner highlights */}
          <div className="corner-bracket-tl" />
          <div className="corner-bracket-tr" />
          <div className="corner-bracket-bl" />
          <div className="corner-bracket-br" />

          {/* Subtitle */}
          <div className="text-[11px] font-cyber tracking-widest text-[#7DF9FF] uppercase mb-1">
            [ SYSTEM NOTIFICATION ]
          </div>

          {/* Glowing LEVEL UP title */}
          <motion.h1
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: [1, 1.08, 1], opacity: 1 }}
            transition={{ duration: 0.6, repeat: Infinity, repeatDelay: 2 }}
            className="text-3xl sm:text-4xl font-black font-cyber text-[#E8F4FF] tracking-wider text-glow-cyan my-3"
          >
            LEVEL UP!
          </motion.h1>

          {/* Level Transition Badge */}
          <div className="my-4 inline-flex items-center gap-3 px-4 py-2 rounded-xs bg-[#03060D]/80 border border-[#2F8CFF]/50 shadow-[0_0_15px_rgba(47,140,255,0.25)]">
            <span className="font-cyber text-lg text-[#7FA6C9]">LV. {info.prevLevel}</span>
            <span className="text-[#7DF9FF] font-black text-xl">→</span>
            <span className="font-cyber text-2xl font-black text-[#7DF9FF] text-glow-cyan">
              LV. {info.newLevel}
            </span>
          </div>

          {/* Stat Boosts breakdown */}
          <div className="my-5 space-y-2.5 text-left font-cyber text-xs">
            <div className="flex items-center justify-between p-2 rounded-xs bg-[#07101F]/80 border border-[#2F8CFF]/20">
              <span className="flex items-center gap-2 text-[#7FA6C9]">
                <Sparkles className="w-4 h-4 text-[#FFC857]" />
                Ability Points
              </span>
              <span className="font-bold text-[#FFC857]">+{info.pointsAdded} Points</span>
            </div>

            <div className="flex items-center justify-between p-2 rounded-xs bg-[#07101F]/80 border border-[#2F8CFF]/20">
              <span className="flex items-center gap-2 text-[#7FA6C9]">
                <BatteryCharging className="w-4 h-4 text-[#3DFFA2]" />
                Fatigue
              </span>
              <span className="font-bold text-[#3DFFA2]">Reset to 0%</span>
            </div>

            <div className="flex items-center justify-between p-2 rounded-xs bg-[#07101F]/80 border border-[#2F8CFF]/20">
              <span className="flex items-center gap-2 text-[#7FA6C9]">
                <Heart className="w-4 h-4 text-[#FF3B4E]" />
                HP / MP
              </span>
              <span className="font-bold text-[#7DF9FF]">Fully Restored</span>
            </div>
          </div>

          {/* Cold affirmative action button */}
          <div className="mt-6">
            <SystemButton variant="primary" size="lg" onClick={onClose} className="w-full">
              CONTINUE
            </SystemButton>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
