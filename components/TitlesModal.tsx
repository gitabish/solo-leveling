'use client';

import React from 'react';
import { useSystem } from '@/lib/systemContext';
import { SystemWindow } from './SystemWindow';
import { TITLES_LIST, getTitleUnlockHint } from '@/src/config/progression';
import { Award, Lock, Check } from 'lucide-react';
import { sound } from '@/lib/sound';

interface TitlesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function TitlesModal({ isOpen, onClose }: TitlesModalProps) {
  const { state, equipTitle } = useSystem();

  if (!isOpen) return null;

  const unlockedMap = new Map(state.titles.map((t) => [t.id, t.unlocked]));

  const rarityBadgeStyles = {
    Common: 'bg-[#6C8CA8]/20 border-[#6C8CA8] text-[#84A7C7]',
    Rare: 'bg-[#3FA9FF]/20 border-[#3FA9FF] text-[#7DF9FF]',
    Epic: 'bg-[#8B5CFF]/20 border-[#8B5CFF] text-[#D8B4FE]',
    Legendary: 'bg-[#FFC857]/20 border-[#FFC857] text-[#FFE799]',
  };

  const handleEquip = (titleName: string) => {
    sound.playClick();
    equipTitle(titleName);
  };

  return (
    <div className="sys-overlay">
      <div className="w-full flex justify-center max-h-[90vh] overflow-y-auto py-6">
        <SystemWindow
          title="TITLES ARCHIVE"
          className="max-w-[540px] w-full"
        >
          <div className="space-y-4 pt-1 font-body">
            {/* Header Description */}
            <div className="flex items-center justify-between border-b border-[var(--line-soft)] pb-2.5">
              <div className="text-xs text-[#9fc4e0]">
                Equipped titles confer passive Daily Quest EXP resonance.
              </div>
              <button
                onClick={onClose}
                className="text-xs font-head font-bold text-[#b7e3ff] hover:text-white px-2 py-1 rounded-xs border border-[var(--line-soft)] cursor-pointer"
              >
                CLOSE [X]
              </button>
            </div>

            {/* List of Titles */}
            <div className="space-y-2.5 max-h-[60vh] overflow-y-auto pr-1">
              {TITLES_LIST.map((def) => {
                const isUnlocked = unlockedMap.get(def.id) || false;
                const isEquipped = state.activeTitle === def.name;

                return (
                  <div
                    key={def.id}
                    className={`p-3 rounded-xs border transition-all ${
                      isEquipped
                        ? 'bg-[rgba(47,155,255,0.15)] border-[var(--line)] shadow-[0_0_12px_rgba(47,155,255,0.3)]'
                        : isUnlocked
                        ? 'bg-[var(--bg-1)]/80 border-[var(--line-soft)] hover:border-[var(--line)]'
                        : 'bg-[var(--bg-0)]/60 border-gray-800/60 opacity-60'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-2">
                        {isUnlocked ? (
                          <Award className="w-4 h-4 text-[var(--glow-hi)] shrink-0" />
                        ) : (
                          <Lock className="w-4 h-4 text-gray-500 shrink-0" />
                        )}
                        <span
                          className={`font-head font-bold text-sm tracking-wide ${
                            isUnlocked ? 'text-white' : 'text-gray-400'
                          }`}
                        >
                          {isUnlocked ? def.name : '???'}
                        </span>
                        <span
                          className={`text-[9px] font-head font-bold uppercase px-1.5 py-0.2 rounded-xs border ${
                            rarityBadgeStyles[def.rarity]
                          }`}
                        >
                          {def.rarity}
                        </span>
                      </div>

                      {/* Action / State */}
                      <div>
                        {isUnlocked ? (
                          isEquipped ? (
                            <span className="flex items-center gap-1 font-head text-[10px] font-bold text-[var(--ok)]">
                              <Check className="w-3 h-3" /> EQUIPPED
                            </span>
                          ) : (
                            <button
                              onClick={() => handleEquip(def.name)}
                              className="font-head text-[10px] font-bold px-3 py-1 rounded-xs border border-[var(--line)] text-[var(--glow-hi)] hover:bg-[var(--line)]/20 cursor-pointer shadow-[0_0_8px_rgba(47,155,255,0.2)]"
                            >
                              EQUIP
                            </button>
                          )
                        ) : (
                          <span className="font-head text-[10px] text-gray-500 tracking-wider">
                            LOCKED
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Effect and Unlock hint */}
                    <div className="space-y-1 text-xs">
                      <div className="flex items-center gap-2">
                        <span className="text-[#3dffa2] font-semibold text-[11px]">
                          Effect: +{def.bonusPct}% Daily Quest EXP
                        </span>
                      </div>

                      {isUnlocked ? (
                        <p className="text-[11px] text-[#9fc4e0] italic">
                          Canon note: {def.canonNote}
                        </p>
                      ) : (
                        <p className="text-[11px] text-[#ffb3ba]">
                          Unlock requirement: {getTitleUnlockHint(def)}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </SystemWindow>
      </div>
    </div>
  );
}
