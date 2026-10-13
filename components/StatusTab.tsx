'use client';

import React, { useState } from 'react';
import { useSystem } from '@/lib/systemContext';
import { SystemWindow } from './SystemWindow';
import { RankBadge } from './RankBadge';
import { StatRadar } from './StatRadar';
import { SystemButton } from './SystemButton';
import { getExpNeeded, calculatePower, RANK_CONFIG } from '@/lib/config';
import { PlayerStats } from '@/lib/types';
import { Plus, Shield, Activity, Zap, Heart, BatteryCharging, Trophy } from 'lucide-react';

export function StatusTab() {
  const { state, spendAbilityPoint } = useSystem();
  const [selectedStatForConfirm, setSelectedStatForConfirm] = useState<keyof PlayerStats | null>(null);

  const expNeeded = getExpNeeded(state.level);
  const expPercent = Math.min(100, Math.round((state.exp / expNeeded) * 100));
  const hpPercent = Math.min(100, Math.round((state.hp / state.maxHp) * 100));
  const mpPercent = Math.min(100, Math.round((state.mp / state.maxMp) * 100));
  const fatiguePercent = Math.min(100, Math.round((state.fatigue / state.maxFatigue) * 100));
  const totalPower = Math.round(calculatePower(state.stats));
  const rankInfo = RANK_CONFIG[state.rank] || RANK_CONFIG.E;

  const statList: { key: keyof PlayerStats; label: string; desc: string }[] = [
    { key: 'strength', label: 'STRENGTH', desc: 'Increases muscular force & raw power output' },
    { key: 'agility', label: 'AGILITY', desc: 'Enhances speed, reflex & cardiovascular stamina' },
    { key: 'vitality', label: 'VITALITY', desc: 'Amplifies maximum HP, endurance & recovery rate' },
    { key: 'intelligence', label: 'INTELLIGENCE', desc: 'Boosts mental fortitude, MP capacity & focus' },
    { key: 'sense', label: 'SENSE', desc: 'Sharpens environmental awareness & reflex instincts' },
  ];

  const handleStatClick = (statKey: keyof PlayerStats) => {
    if (state.abilityPoints <= 0) return;
    spendAbilityPoint(statKey);
  };

  return (
    <div className="space-y-4 pb-20 select-none">
      {/* Anime Status Primary Window */}
      <SystemWindow title="STATUS" variant={state.settings.themeAura === 'violet' ? 'violet' : 'blue'}>
        <div className="space-y-4">
          {/* Top Profile Summary: Name, Level, Rank Badge, Job, Title */}
          <div className="flex items-start justify-between border-b border-[#2F8CFF]/25 pb-3">
            <div className="space-y-1">
              <div className="text-[10px] font-cyber text-[#7FA6C9] uppercase tracking-wider">
                HUNTER PROFILE
              </div>
              <h2 className="text-xl sm:text-2xl font-black font-cyber text-[#E8F4FF] tracking-wide">
                {state.playerName}
              </h2>

              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs font-cyber pt-1">
                <div>
                  <span className="text-[#7FA6C9]">JOB: </span>
                  <span className="text-[#7DF9FF] font-semibold">
                    {state.job === 'None' ? 'None' : `[ ${state.job} ]`}
                  </span>
                </div>
                <div>
                  <span className="text-[#7FA6C9]">TITLE: </span>
                  <span className="text-[#FFC857] font-semibold">
                    {state.activeTitle === 'None' ? 'None' : `[ ${state.activeTitle} ]`}
                  </span>
                </div>
              </div>
            </div>

            {/* Large Level & Rank Badge */}
            <div className="flex flex-col items-center">
              <RankBadge rank={state.rank} size="lg" />
              <div className="mt-1 flex items-baseline gap-1">
                <span className="text-[10px] font-cyber text-[#7FA6C9]">LEVEL</span>
                <span className="text-2xl font-black font-cyber text-[#7DF9FF] text-glow-cyan leading-none">
                  {state.level}
                </span>
              </div>
            </div>
          </div>

          {/* Vitals Grid: HP, MP, Fatigue */}
          <div className="space-y-2 pt-1 font-cyber text-xs">
            {/* HP Bar */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="flex items-center gap-1.5 text-[#FF6B7A] font-bold">
                  <Heart className="w-3.5 h-3.5 fill-[#FF3B4E]/30" /> HP
                </span>
                <span className="text-[#E8F4FF]">
                  {state.hp} / {state.maxHp}
                </span>
              </div>
              <div className="w-full h-2 bg-[#03060D] border border-[#2F8CFF]/30 rounded-xs overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-[#FF3B4E] to-[#FF6B7A] shadow-[0_0_8px_#FF3B4E] transition-all duration-300"
                  style={{ width: `${hpPercent}%` }}
                />
              </div>
            </div>

            {/* MP Bar */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="flex items-center gap-1.5 text-[#3FA9FF] font-bold">
                  <Zap className="w-3.5 h-3.5 fill-[#3FA9FF]/30" /> MP
                </span>
                <span className="text-[#E8F4FF]">
                  {state.mp} / {state.maxMp}
                </span>
              </div>
              <div className="w-full h-2 bg-[#03060D] border border-[#2F8CFF]/30 rounded-xs overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-[#2F8CFF] to-[#7DF9FF] shadow-[0_0_8px_#2F8CFF] transition-all duration-300"
                  style={{ width: `${mpPercent}%` }}
                />
              </div>
            </div>

            {/* FATIGUE Bar */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="flex items-center gap-1.5 text-[#E5A84B] font-bold">
                  <BatteryCharging className="w-3.5 h-3.5" /> FATIGUE
                </span>
                <span className={state.fatigue > 70 ? 'text-[#FF3B4E] font-bold' : 'text-[#E8F4FF]'}>
                  {state.fatigue} / {state.maxFatigue}%
                </span>
              </div>
              <div className="w-full h-2 bg-[#03060D] border border-[#2F8CFF]/30 rounded-xs overflow-hidden">
                <div
                  className={`h-full transition-all duration-300 ${
                    state.fatigue > 70
                      ? 'bg-[#FF3B4E] shadow-[0_0_8px_#FF3B4E]'
                      : 'bg-gradient-to-r from-[#FFC857] to-[#FF9E40]'
                  }`}
                  style={{ width: `${fatiguePercent}%` }}
                />
              </div>
            </div>

            {/* EXP Bar */}
            <div className="pt-1">
              <div className="flex justify-between items-center mb-1">
                <span className="text-[#7DF9FF] font-bold text-[11px]">EXP TO NEXT LEVEL</span>
                <span className="text-[11px] text-[#7DF9FF]">
                  {state.exp} / {expNeeded} ({expPercent}%)
                </span>
              </div>
              <div className="w-full h-2 bg-[#03060D] border border-[#7DF9FF]/40 rounded-xs overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-[#2F8CFF] via-[#7DF9FF] to-[#3DFFA2] shadow-[0_0_10px_#7DF9FF] transition-all duration-300"
                  style={{ width: `${expPercent}%` }}
                />
              </div>
            </div>
          </div>

          {/* Radar Chart Visualizer */}
          <div className="py-2 flex justify-center bg-[#051124]/40 border border-[#2F8CFF]/20 rounded-xs">
            <StatRadar stats={state.stats} size={220} />
          </div>

          {/* Stat Allocation Grid */}
          <div className="space-y-2 pt-1">
            <div className="flex items-center justify-between border-b border-[#2F8CFF]/25 pb-1 font-cyber">
              <span className="text-xs text-[#7FA6C9] uppercase">ABILITY PARAMETERS</span>
              <div className="flex items-center gap-1.5">
                <span className="text-xs text-[#7FA6C9]">POWER:</span>
                <span className="text-xs font-bold text-[#FFC857]">{totalPower}</span>
              </div>
            </div>

            <div className="space-y-1.5 font-cyber">
              {statList.map((item) => {
                const val = state.stats[item.key];
                const canAdd = state.abilityPoints > 0;

                return (
                  <div
                    key={item.key}
                    className="flex items-center justify-between p-2 rounded-xs bg-[#071329]/70 border border-[#2F8CFF]/25 hover:border-[#2F8CFF]/60 transition-all"
                  >
                    <div className="flex flex-col">
                      <span className="text-xs font-bold tracking-wider text-[#E8F4FF]">
                        {item.label}
                      </span>
                      <span className="text-[10px] text-[#7FA6C9]">{item.desc}</span>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="text-sm font-bold text-[#7DF9FF] text-glow-cyan w-8 text-right">
                        {val}
                      </span>

                      <button
                        disabled={!canAdd}
                        onClick={() => handleStatClick(item.key)}
                        title={canAdd ? `Allocate 1 point to ${item.label}` : 'No ability points available'}
                        className={`w-7 h-7 rounded-xs flex items-center justify-center transition-all ${
                          canAdd
                            ? 'bg-[#2F8CFF]/25 border border-[#7DF9FF] text-[#7DF9FF] hover:bg-[#2F8CFF]/50 shadow-[0_0_8px_#2F8CFF] active:scale-95 cursor-pointer'
                            : 'bg-transparent border border-[#2F8CFF]/20 text-[#7FA6C9]/40 cursor-not-allowed'
                        }`}
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Available Ability Points Footer */}
            <div className="pt-2 flex items-center justify-between p-3 rounded-xs bg-[#091C3E] border border-[#2F8CFF]/60 shadow-[inset_0_0_12px_rgba(47,140,255,0.2)] font-cyber">
              <span className="text-xs text-[#E8F4FF]">AVAILABLE ABILITY POINTS:</span>
              <span
                className={`text-base font-black ${
                  state.abilityPoints > 0
                    ? 'text-[#FFC857] text-glow-gold animate-pulse'
                    : 'text-[#7FA6C9]'
                }`}
              >
                {state.abilityPoints} POINTS
              </span>
            </div>
          </div>
        </div>
      </SystemWindow>
    </div>
  );
}
