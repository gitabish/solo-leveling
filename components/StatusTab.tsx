'use client';

import React from 'react';
import { useSystem } from '@/lib/systemContext';
import { SystemWindow } from './SystemWindow';
import { PlayerStats } from '@/lib/types';

export function StatusTab() {
  const { state, spendAbilityPoint } = useSystem();

  const hpPercent = Math.min(100, Math.round((state.hp / state.maxHp) * 100));
  const mpPercent = Math.min(100, Math.round((state.mp / state.maxMp) * 100));

  const handleStatClick = (statKey: keyof PlayerStats) => {
    if (state.abilityPoints <= 0) return;
    spendAbilityPoint(statKey);
  };

  const activeTitleDisplay =
    state.activeTitle && state.activeTitle !== 'None'
      ? state.activeTitle
      : 'Wolf Assassin';

  return (
    <div className="space-y-4 pb-20 select-none flex justify-center">
      <SystemWindow title="STATUS" showIcon={false}>
        <div className="space-y-6 pt-1">
          {/* Header Profile: Level on Left, Job & Title on Right */}
          <div className="flex items-center justify-between px-2">
            {/* Level */}
            <div className="flex flex-col items-center">
              <div className="level-num">{state.level}</div>
              <div className="font-head text-[11px] font-semibold tracking-[0.2em] text-[#9fc4e0] uppercase -mt-1">
                LEVEL
              </div>
            </div>

            {/* Job & Title */}
            <div className="space-y-1.5 text-right font-head">
              <div className="text-sm tracking-wide">
                <span className="text-[#9fc4e0] font-medium text-xs mr-2">JOB:</span>
                <span className="text-[#f4faff] font-bold">
                  {state.job === 'None' ? 'None' : state.job}
                </span>
              </div>
              <div className="text-sm tracking-wide">
                <span className="text-[#9fc4e0] font-medium text-xs mr-2">TITLE:</span>
                <span className="text-[#f4faff] font-bold">{activeTitleDisplay}</span>
              </div>
            </div>
          </div>

          {/* Box 1 (HP, MP, Fatigue) */}
          <div className="sys-inner-box">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
              {/* HP */}
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <svg viewBox="0 0 24 24" className="w-4 h-4 icon-glow fill-none stroke-white stroke-[2.5]">
                    <line x1="12" y1="5" x2="12" y2="19" />
                    <line x1="5" y1="12" x2="19" y2="12" />
                  </svg>
                  <span className="font-head font-bold text-xs tracking-wider text-white">HP</span>
                  <div className="gauge">
                    <span className="gauge-fill" style={{ width: `${hpPercent}%` }} />
                  </div>
                </div>
                <div className="gauge-num">
                  {state.hp}/{state.maxHp}
                </div>
              </div>

              {/* MP */}
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <svg viewBox="0 0 24 24" className="w-4 h-4 icon-glow fill-none stroke-white stroke-[2.5]">
                    <path d="M10 2v4l-6 10a3 3 0 0 0 2.5 5h11a3 3 0 0 0 2.5-5L14 6V2" />
                    <line x1="8" y1="2" x2="16" y2="2" />
                  </svg>
                  <span className="font-head font-bold text-xs tracking-wider text-white">MP</span>
                  <div className="gauge">
                    <span className="gauge-fill" style={{ width: `${mpPercent}%` }} />
                  </div>
                </div>
                <div className="gauge-num">
                  {state.mp}/{state.maxMp}
                </div>
              </div>

              {/* FATIGUE */}
              <div className="flex items-center justify-end gap-2 font-head">
                <svg viewBox="0 0 24 24" className="w-4 h-4 icon-glow fill-none stroke-white stroke-2 shrink-0">
                  <circle cx="12" cy="12" r="3" />
                  <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
                </svg>
                <span className="text-xs font-semibold text-[#9fc4e0] tracking-wider">
                  FATIGUE:
                </span>
                <span className={`text-base font-bold ${state.fatigue > 70 ? 'text-[#ff2055]' : 'text-white'}`}>
                  {state.fatigue}
                </span>
              </div>
            </div>
          </div>

          {/* Box 2 (Stat Grid 2-columns + Available Ability Points) */}
          <div className="sys-inner-box">
            <div className="stat-grid">
              {/* Left Column: STR, AGI, PER (renamed from SENSE) */}
              <div className="space-y-4">
                {/* STR */}
                <div className="stat-row">
                  <svg viewBox="0 0 24 24" className="w-5 h-5 icon-glow fill-none stroke-white stroke-2 shrink-0">
                    <path d="M6 5v14M18 5v14M2 9v6M22 9v6M6 12h12" />
                  </svg>
                  <span className="stat-name">STR:</span>
                  <span className="stat-val">{state.stats.strength}</span>
                  {state.abilityPoints > 0 && (
                    <button
                      onClick={() => handleStatClick('strength')}
                      className="w-5 h-5 border border-[var(--line)] bg-[var(--line)]/20 hover:bg-[var(--line)]/40 rounded-xs flex items-center justify-center text-xs text-white shadow-[0_0_8px_var(--glow)] cursor-pointer"
                    >
                      +
                    </button>
                  )}
                </div>

                {/* AGI */}
                <div className="stat-row">
                  <svg viewBox="0 0 24 24" className="w-5 h-5 icon-glow fill-none stroke-white stroke-2 shrink-0">
                    <path d="M4 16v-6a2 2 0 0 1 2-2h4v8l8 2a2 2 0 0 1 1 2v1a1 1 0 0 1-1 1H5a2 2 0 0 1-2-2v-4z" />
                  </svg>
                  <span className="stat-name">AGI:</span>
                  <span className="stat-val">{state.stats.agility}</span>
                  {state.abilityPoints > 0 && (
                    <button
                      onClick={() => handleStatClick('agility')}
                      className="w-5 h-5 border border-[var(--line)] bg-[var(--line)]/20 hover:bg-[var(--line)]/40 rounded-xs flex items-center justify-center text-xs text-white shadow-[0_0_8px_var(--glow)] cursor-pointer"
                    >
                      +
                    </button>
                  )}
                </div>

                {/* PER (Perception, formerly SENSE) */}
                <div className="stat-row">
                  <svg viewBox="0 0 24 24" className="w-5 h-5 icon-glow fill-none stroke-white stroke-2 shrink-0">
                    <path d="M6 9a6 6 0 0 1 12 0c0 4-3 6-3 8a3 3 0 0 1-6 0c0-2-3-4-3-8z" />
                    <path d="M12 9v4" />
                  </svg>
                  <span className="stat-name">PER:</span>
                  <span className="stat-val">{state.stats.sense}</span>
                  {state.abilityPoints > 0 && (
                    <button
                      onClick={() => handleStatClick('sense')}
                      className="w-5 h-5 border border-[var(--line)] bg-[var(--line)]/20 hover:bg-[var(--line)]/40 rounded-xs flex items-center justify-center text-xs text-white shadow-[0_0_8px_var(--glow)] cursor-pointer"
                    >
                      +
                    </button>
                  )}
                </div>
              </div>

              {/* Right Column: VIT, INT, Available Ability Points */}
              <div className="space-y-4">
                {/* VIT */}
                <div className="stat-row">
                  <svg viewBox="0 0 24 24" className="w-5 h-5 icon-glow fill-none stroke-white stroke-2 shrink-0">
                    <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
                  </svg>
                  <span className="stat-name">VIT:</span>
                  <span className="stat-val">{state.stats.vitality}</span>
                  {state.abilityPoints > 0 && (
                    <button
                      onClick={() => handleStatClick('vitality')}
                      className="w-5 h-5 border border-[var(--line)] bg-[var(--line)]/20 hover:bg-[var(--line)]/40 rounded-xs flex items-center justify-center text-xs text-white shadow-[0_0_8px_var(--glow)] cursor-pointer"
                    >
                      +
                    </button>
                  )}
                </div>

                {/* INT */}
                <div className="stat-row">
                  <svg viewBox="0 0 24 24" className="w-5 h-5 icon-glow fill-none stroke-white stroke-2 shrink-0">
                    <path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96.44 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 4.44-5.04z" />
                    <path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96.44 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-4.44-5.04z" />
                  </svg>
                  <span className="stat-name">INT:</span>
                  <span className="stat-val">{state.stats.intelligence}</span>
                  {state.abilityPoints > 0 && (
                    <button
                      onClick={() => handleStatClick('intelligence')}
                      className="w-5 h-5 border border-[var(--line)] bg-[var(--line)]/20 hover:bg-[var(--line)]/40 rounded-xs flex items-center justify-center text-xs text-white shadow-[0_0_8px_var(--glow)] cursor-pointer"
                    >
                      +
                    </button>
                  )}
                </div>

                {/* Available Ability Points */}
                <div className="flex items-center justify-end gap-2 pt-1 font-head">
                  <div className="text-[9px] leading-tight text-[#9fc4e0] text-right font-medium">
                    Available<br />Ability<br />Points:
                  </div>
                  <div
                    className={`text-2xl font-bold ${
                      state.abilityPoints > 0
                        ? 'text-white text-shadow-[0_0_12px_var(--glow-hi)]'
                        : 'text-[#9fc4e0]'
                    }`}
                  >
                    {state.abilityPoints}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </SystemWindow>
    </div>
  );
}
