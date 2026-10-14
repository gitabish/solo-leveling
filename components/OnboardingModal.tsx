'use client';

import React, { useState } from 'react';
import { useSystem } from '@/lib/systemContext';
import { SystemWindow } from './SystemWindow';
import { motion, AnimatePresence } from 'motion/react';
import { sound } from '@/lib/sound';
import { themeMusic } from '@/src/audio/themeMusic';

export function OnboardingModal() {
  const { state, onboardPlayer } = useSystem();
  const [step, setStep] = useState<'prompt' | 'form'>('prompt');
  const [name, setName] = useState('');
  const [countdown, setCountdown] = useState<number | null>(null);

  const handleAccept = React.useCallback(() => {
    sound.playSystemDing();
    themeMusic.startThemeOnYesAccept();
    setStep('form');
  }, []);

  const handleRefusal = () => {
    sound.playPenaltyWarning();
    setCountdown((prev) => (prev === null ? 9 : Math.max(1, prev - 1)));
  };

  // Real-time reverse countdown timer; automatically clicks YES when hitting 0s
  React.useEffect(() => {
    if (countdown === null || step !== 'prompt') return;

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev === null) return null;
        if (prev <= 1) {
          clearInterval(timer);
          handleAccept();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [countdown, step, handleAccept]);

  if (state.onboarded) return null;

  const handleCompleteRegistration = (e: React.FormEvent) => {
    e.preventDefault();
    themeMusic.unlockAndPlay();
    onboardPlayer(name);
  };

  return (
    <div className="sys-overlay">
      <AnimatePresence mode="wait">
        {step === 'prompt' ? (
          <motion.div
            key="prompt"
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.94 }}
            transition={{ duration: 0.25 }}
            className="w-full flex justify-center"
          >
            {/* Screenshot 4: Holographic notification framed by top and bottom glowing neon bars */}
            <SystemWindow
              title="NOTIFICATION"
              withBars={true}
              className="max-w-[460px] w-full"
            >
              <div className="py-6 px-4 text-center space-y-6">
                {/* Body text matches Screenshot 4: 15px, line-height 2.5, letter-spaced, Player bold italic white glow */}
                <div
                  className="font-body text-[15px] text-[#f4faff] tracking-wider"
                  style={{ lineHeight: 2.5 }}
                >
                  You have acquired the qualifications<br />
                  to be a <em className="not-italic font-bold italic text-white text-shadow-[0_0_8px_#ffffff,0_0_16px_var(--glow-hi)]">Player</em>. Will you accept?
                </div>

                {countdown !== null && (
                  <p className="font-body text-xs text-[var(--bad)] italic text-shadow-[0_0_8px_var(--bad)] animate-pulse font-semibold tracking-wide">
                    [ Caution: The System does not take no for an answer. Time remaining: {countdown}s ]
                  </p>
                )}

                {/* YES and NO sys-btn */}
                <div className="pt-2 flex items-center justify-center gap-6">
                  <button
                    type="button"
                    onClick={handleAccept}
                    className="sys-btn px-10 py-2.5 text-sm"
                  >
                    YES
                  </button>
                  <button
                    type="button"
                    onClick={handleRefusal}
                    className="sys-btn px-10 py-2.5 text-sm"
                  >
                    NO
                  </button>
                </div>
              </div>
            </SystemWindow>
          </motion.div>
        ) : (
          <motion.div
            key="form"
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.94 }}
            transition={{ duration: 0.25 }}
            className="w-full flex justify-center"
          >
            <SystemWindow
              title="HUNTER REGISTRATION"
              withBars={true}
              className="max-w-[460px] w-full"
            >
              <form onSubmit={handleCompleteRegistration} className="py-4 px-2 space-y-4">
                <div className="text-center font-body text-sm text-[#9fc4e0]">
                  Register your biological parameters with the System to begin awakening.
                </div>

                <div className="space-y-3 font-head">
                  <div>
                    <label className="text-xs uppercase text-[#9fc4e0] tracking-wider block mb-1">
                      Hunter Designation (Name)
                    </label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Sung Jin-Woo"
                      className="w-full bg-[#01050d] border border-[var(--line)] px-3.5 h-10 text-sm text-white focus:outline-none focus:shadow-[0_0_12px_var(--glow)] rounded-xs"
                    />
                  </div>
                </div>

                <div className="pt-3 flex justify-center">
                  <button
                    type="submit"
                    className="sys-btn w-full py-2.5 text-sm"
                  >
                    CONFIRM AWAKENING
                  </button>
                </div>
              </form>
            </SystemWindow>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
