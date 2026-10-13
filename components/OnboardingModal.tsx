'use client';

import React, { useState } from 'react';
import { useSystem } from '@/lib/systemContext';
import { SystemWindow } from './SystemWindow';
import { SystemButton } from './SystemButton';
import { motion, AnimatePresence } from 'motion/react';
import { Shield, Sparkles } from 'lucide-react';
import { sound } from '@/lib/sound';
import { themeMusic } from '@/src/audio/themeMusic';

export function OnboardingModal() {
  const { state, onboardPlayer } = useSystem();
  const [step, setStep] = useState<'prompt' | 'form'>('prompt');
  const [name, setName] = useState('');
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [refusalCount, setRefusalCount] = useState(0);

  if (state.onboarded) return null;

  const handleRefusal = () => {
    sound.playPenaltyWarning();
    setRefusalCount((prev) => prev + 1);
  };

  const handleAccept = () => {
    sound.playSystemDing();
    themeMusic.startThemeOnYesAccept();
    setStep('form');
  };

  const handleCompleteRegistration = (e: React.FormEvent) => {
    e.preventDefault();
    themeMusic.unlockAndPlay();
    onboardPlayer(name, height, weight);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black select-none">
      {/* Background cyber grid */}
      <div className="fixed inset-0 cyber-grid opacity-20 pointer-events-none" />

      <AnimatePresence mode="wait">
        {step === 'prompt' ? (
          <motion.div
            key="prompt"
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.94 }}
            transition={{ duration: 0.25 }}
            className="w-full max-w-sm"
          >
            <SystemWindow title="NOTIFICATION" variant="blue">
              <div className="py-6 px-2 text-center space-y-4">
                <div className="flex justify-center text-[#7DF9FF]">
                  <Shield className="w-10 h-10 drop-shadow-[0_0_10px_#2F8CFF]" />
                </div>

                <div className="font-cyber text-sm sm:text-base text-[#E8F4FF] leading-relaxed">
                  You have acquired the qualifications to become a Player.
                </div>

                <div className="font-cyber text-xs text-[#7DF9FF] tracking-wider font-semibold">
                  Will you accept?
                </div>

                {refusalCount > 0 && (
                  <p className="font-cyber text-[11px] text-[#FF9EAA] italic">
                    [ Caution: The System does not take no for an answer. Your heart beats in resonance. ]
                  </p>
                )}

                <div className="pt-4 flex items-center justify-center gap-4">
                  <SystemButton
                    variant="primary"
                    size="lg"
                    onClick={handleAccept}
                    className="w-28 text-glow-cyan"
                  >
                    YES
                  </SystemButton>
                  <SystemButton
                    variant="danger"
                    size="lg"
                    onClick={handleRefusal}
                    className="w-28"
                  >
                    NO
                  </SystemButton>
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
            className="w-full max-w-sm"
          >
            <SystemWindow title="PLAYER REGISTRATION" variant="blue">
              <form onSubmit={handleCompleteRegistration} className="space-y-4 py-2">
                <p className="font-cyber text-xs text-[#7FA6C9] leading-relaxed">
                  Register your biological identifier into the System network.
                </p>

                <div>
                  <label className="block font-cyber text-xs text-[#7DF9FF] uppercase tracking-wider mb-1">
                    Player Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter name (e.g. Sung Jin-Woo)"
                    className="w-full bg-[#03060D] border border-[#2F8CFF]/60 px-3 py-2 font-cyber text-sm text-[#E8F4FF] rounded-xs focus:outline-none focus:border-[#7DF9FF] focus:shadow-[0_0_10px_rgba(77,184,255,0.4)]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-cyber text-[11px] text-[#7FA6C9] uppercase tracking-wider mb-1">
                      Height (cm)
                    </label>
                    <input
                      type="number"
                      value={height}
                      onChange={(e) => setHeight(e.target.value)}
                      placeholder="e.g. 178"
                      className="w-full bg-[#03060D] border border-[#2F8CFF]/40 px-3 py-1.5 font-cyber text-xs text-[#E8F4FF] rounded-xs focus:outline-none focus:border-[#7DF9FF]"
                    />
                  </div>

                  <div>
                    <label className="block font-cyber text-[11px] text-[#7FA6C9] uppercase tracking-wider mb-1">
                      Weight (kg)
                    </label>
                    <input
                      type="number"
                      value={weight}
                      onChange={(e) => setWeight(e.target.value)}
                      placeholder="e.g. 70"
                      className="w-full bg-[#03060D] border border-[#2F8CFF]/40 px-3 py-1.5 font-cyber text-xs text-[#E8F4FF] rounded-xs focus:outline-none focus:border-[#7DF9FF]"
                    />
                  </div>
                </div>

                <div className="p-2.5 rounded-xs bg-[#07101F] border border-[#2F8CFF]/30 font-cyber text-[11px] text-[#7FA6C9] space-y-1">
                  <div className="flex items-center gap-1.5 text-[#3DFFA2]">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Initial Rank: E-Rank (Level 1)</span>
                  </div>
                  <div>Starting Ability Points: 5 Points</div>
                </div>

                <div className="pt-2">
                  <SystemButton type="submit" variant="primary" size="lg" className="w-full">
                    AWAKEN AS PLAYER
                  </SystemButton>
                </div>
              </form>
            </SystemWindow>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
