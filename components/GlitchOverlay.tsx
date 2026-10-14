'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Key, Skull, AlertOctagon } from 'lucide-react';
import { sound } from '@/lib/sound';

export interface GlitchOverlayProps {
  isOpen: boolean;
  type?: 'reset' | 'penalty';
  title?: string;
  targetKeyword?: string;
  onComplete: () => void;
}

export function GlitchOverlay({
  isOpen,
  type = 'reset',
  title,
  targetKeyword,
  onComplete,
}: GlitchOverlayProps) {
  const [glitchPhase, setGlitchPhase] = useState<'initial' | 'forming' | 'peaking' | 'dissolving'>('initial');

  useEffect(() => {
    if (!isOpen) return;

    sound.playPenaltyWarning();

    const t0 = setTimeout(() => {
      setGlitchPhase('forming');
    }, 20);

    const t1 = setTimeout(() => {
      setGlitchPhase('peaking');
    }, 450);

    const t2 = setTimeout(() => {
      setGlitchPhase('dissolving');
    }, 1300);

    const t3 = setTimeout(() => {
      onComplete();
    }, 1750);

    return () => {
      clearTimeout(t0);
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [isOpen, onComplete]);

  if (!isOpen) return null;

  const headerTitle =
    title ||
    (type === 'penalty'
      ? 'DIRECTIVE: PENALTY ENFORCEMENT'
      : 'ITEM: Cartenon Temple Protocol');

  const keywordText =
    targetKeyword ||
    (type === 'penalty' ? 'the Penalty Zone' : 'the Cartenon Temple');

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/85 backdrop-blur-md select-none overflow-hidden">
        {/* Rapid Glitch Slicing Bars across viewport */}
        <div className="pointer-events-none absolute inset-0 z-20 overflow-hidden mix-blend-screen opacity-90">
          <div className="absolute top-[18%] left-0 right-0 h-1 bg-[#7DF9FF]/60 shadow-[0_0_12px_#7DF9FF] animate-pulse" />
          <div className="absolute top-[38%] left-0 right-0 h-2 bg-[#FF0038]/50 shadow-[0_0_15px_#FF0038]" />
          <div className="absolute top-[62%] left-0 right-0 h-1.5 bg-[#7DF9FF]/70" />
          <div className="absolute top-[82%] left-0 right-0 h-2.5 bg-[#FF0038]/40 shadow-[0_0_10px_#FF0038]" />
        </div>

        {/* Holographic Popup Window matching reference image */}
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 15 }}
          animate={{
            opacity: glitchPhase === 'dissolving' ? [1, 0.4, 0] : 1,
            scale: glitchPhase === 'peaking' ? [1, 1.02, 0.99, 1.01] : 1,
            x: glitchPhase === 'peaking' ? [-5, 6, -4, 4, -2, 0] : 0,
            y: glitchPhase === 'peaking' ? [2, -3, 2, -1, 0] : 0,
          }}
          transition={{ duration: 0.3 }}
          className={`relative w-full max-w-lg rounded-xs border-2 border-[#2F8CFF] bg-[#020717]/95 p-5 sm:p-7 shadow-[0_0_35px_rgba(47,140,255,0.45),inset_0_0_25px_rgba(47,140,255,0.2)] backdrop-blur-2xl ${
            glitchPhase === 'peaking' ? 'skew-x-[-1.5deg] filter hue-rotate-15' : ''
          }`}
        >
          {/* Tech Circuit Corner Brackets */}
          <div className="pointer-events-none absolute -top-1 -left-1 w-4 h-4 border-t-2 border-l-2 border-[#7DF9FF] shadow-[0_0_10px_#7DF9FF]" />
          <div className="pointer-events-none absolute -top-1 -right-1 w-4 h-4 border-t-2 border-r-2 border-[#7DF9FF] shadow-[0_0_10px_#7DF9FF]" />
          <div className="pointer-events-none absolute -bottom-1 -left-1 w-4 h-4 border-b-2 border-l-2 border-[#7DF9FF] shadow-[0_0_10px_#7DF9FF]" />
          <div className="pointer-events-none absolute -bottom-1 -right-1 w-4 h-4 border-b-2 border-r-2 border-[#7DF9FF] shadow-[0_0_10px_#7DF9FF]" />

          {/* Stepped edge notches */}
          <div className="pointer-events-none absolute -left-[3px] top-1/3 h-10 w-[4px] bg-[#2F8CFF] shadow-[0_0_8px_#2F8CFF]" />
          <div className="pointer-events-none absolute -right-[3px] top-1/3 h-10 w-[4px] bg-[#2F8CFF] shadow-[0_0_8px_#2F8CFF]" />

          {/* Top Row: Key Item Box + Header matching image.png */}
          <div className="flex items-start gap-3 sm:gap-4 mb-4">
            {/* Left: Key / Emblem Box */}
            <div className="w-16 h-16 sm:w-20 sm:h-20 shrink-0 border border-[#2F8CFF]/80 bg-[#030B1E]/90 flex items-center justify-center p-2 rounded-xs shadow-[0_0_15px_rgba(47,140,255,0.3)] relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-[#7DF9FF]/10 to-transparent" />
              {type === 'penalty' ? (
                <Skull className="w-8 h-8 sm:w-10 sm:h-10 text-[#FF0038] drop-shadow-[0_0_10px_#FF0038] glitch-font" />
              ) : (
                <Key className="w-8 h-8 sm:w-10 sm:h-10 text-[#7DF9FF] drop-shadow-[0_0_10px_#7DF9FF] -rotate-45 glitch-font" />
              )}
              {/* Horizontal tear slice on key box */}
              <div className="absolute top-1/2 left-0 right-0 h-[1.5px] bg-[#7DF9FF]/60 shadow-[0_0_6px_#7DF9FF]" />
            </div>

            {/* Right: Item Header Box + Specs matching image.png */}
            <div className="flex-1 space-y-2">
              <div className="border border-[#2F8CFF]/80 bg-[#030B1E]/90 py-2 px-3 rounded-xs shadow-[0_0_12px_rgba(47,140,255,0.25)]">
                <span className="font-cyber text-xs sm:text-sm font-black text-[#7DF9FF] tracking-wider glitch-font">
                  {headerTitle}
                </span>
              </div>

              {/* Sub-parameters like ACQUISITION DIFFICULTY: ?? */}
              <div className="flex items-center justify-between text-[10px] sm:text-[11px] font-cyber text-[#7FA6C9] px-1">
                <div>
                  <span className="text-[#7FA6C9] uppercase">ACQUISITION DIFFICULTY: </span>
                  <span className="text-[#7DF9FF] font-black glitch-slice" data-text="??">
                    ??
                  </span>
                </div>
                <div>
                  <span className="text-[#7FA6C9] uppercase">CATEGORY: </span>
                  <span className="text-[#7DF9FF] font-black glitch-slice" data-text="SANCTION">
                    SANCTION
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Description Section with Glitch Effect on Font and Red Keyword */}
          <div className="space-y-2.5 font-cyber text-xs sm:text-sm text-[#E8F4FF] pt-2 border-t border-[#2F8CFF]/30 leading-relaxed">
            <p className="glitch-font">
              This protocol allows the System to override data for{' '}
              <span
                className="red-corrupt-font glitch-slice font-black inline-block px-1"
                data-text={keywordText}
              >
                {keywordText}
              </span>
              .
            </p>

            <p className="text-[11px] text-[#7FA6C9] glitch-font">
              This command can only be executed by an authorized Monarch Player.
            </p>

            {/* Status Glitch Bar */}
            <div className="mt-4 p-2 rounded-xs border border-[#FF0038]/50 bg-[#1A0307]/80 flex items-center justify-between text-[10px] font-cyber text-[#FFB3BA]">
              <span className="flex items-center gap-1 text-[#FF0038] font-bold">
                <AlertOctagon className="w-3.5 h-3.5 animate-pulse" />
                STATUS: DIMENSIONAL GLITCH IN PROGRESS
              </span>
              <span className="animate-pulse text-[#FF0038]">CALIBRATING...</span>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
