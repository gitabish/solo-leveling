'use client';

import React, { useState, useEffect } from 'react';
import { useSystem } from '@/lib/systemContext';
import { RankBadge } from './RankBadge';
import { Volume2, VolumeX, ShieldAlert, Sparkles, Music } from 'lucide-react';
import { RANK_CONFIG } from '@/lib/config';
import { useThemeMusic } from '@/src/audio/useThemeMusic';

export function Header() {
  const { state, updateSettings } = useSystem();
  const music = useThemeMusic();
  const [timeStr, setTimeStr] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeStr(
        now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false })
      );
    };
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  const rankInfo = RANK_CONFIG[state.rank] || RANK_CONFIG.E;

  return (
    <header className="relative w-full border-b border-[var(--line-soft)] bg-[var(--bg-1)]/90 backdrop-blur-md px-3 py-2 sm:px-4 sm:py-2.5 z-30">
      <div className="max-w-xl md:max-w-2xl mx-auto flex items-center justify-between">
        {/* Left: Rank Badge & Player Identification */}
        <div className="flex items-center gap-2.5">
          <RankBadge rank={state.rank} size="sm" />
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="font-head text-xs sm:text-sm font-bold tracking-wider text-white truncate max-w-[140px] sm:max-w-[220px]">
                {state.playerName}
              </span>
              <span className="text-[10px] sm:text-[11px] font-head font-bold text-[var(--glow-hi)] px-1.5 py-0.5 bg-[var(--glow)]/15 border border-[var(--line-soft)] rounded-xs shrink-0">
                LV.{state.level}
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-[10px] font-head text-[#9fc4e0]">
              <span style={{ color: rankInfo.color }}>{state.rank}-RANK</span>
              {state.activeTitle !== 'None' && (
                <>
                  <span>•</span>
                  <span className="text-[#FFC857] truncate max-w-[110px]">[{state.activeTitle}]</span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Right: System Clock, Audio & Hazard indicators */}
        <div className="flex items-center gap-2.5">
          {state.penaltyState.isActive && (
            <div className="flex items-center gap-1 px-1.5 py-0.5 bg-[var(--bad)]/20 border border-[var(--bad)] rounded-xs text-[var(--bad)] text-[10px] font-head font-bold animate-pulse">
              <ShieldAlert className="w-3 h-3" />
              <span>PENALTY</span>
            </div>
          )}

          {state.streak > 0 && (
            <div className="hidden sm:flex items-center gap-1 px-1.5 py-0.5 bg-[#FFC857]/15 border border-[#FFC857]/40 rounded-xs text-[#FFC857] text-[10px] font-head font-semibold">
              <Sparkles className="w-3 h-3" />
              <span>{state.streak}D STREAK</span>
            </div>
          )}

          <div className="font-head text-[11px] text-[var(--glow-hi)]/90 tracking-wider hidden xs:block">
            {timeStr}
          </div>

          {/* Music Quick Toggle */}
          <button
            onClick={music.togglePlay}
            title={music.isPlaying ? `Theme Music: Playing (${Math.round(music.volume * 100)}%)` : 'Theme Music: Paused / Muted'}
            className={`p-1.5 rounded-xs border transition-colors flex items-center gap-1 cursor-pointer ${
              music.isPlaying
                ? 'border-[var(--glow-hi)] bg-[var(--bg-0)] text-[var(--glow-hi)] shadow-[0_0_8px_var(--glow)]'
                : 'border-[var(--line-soft)] bg-[var(--bg-0)] text-[#9fc4e0]'
            }`}
          >
            <Music className="w-3.5 h-3.5" />
            {music.isPlaying && (
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--ok)] animate-pulse hidden xs:inline-block" />
            )}
          </button>

          {/* Sound FX Toggle */}
          <button
            onClick={() => updateSettings({ soundEnabled: !state.settings.soundEnabled })}
            title={state.settings.soundEnabled ? 'Mute System SFX' : 'Enable System SFX'}
            className="p-1.5 rounded-xs border border-[var(--line-soft)] bg-[var(--bg-0)] text-[var(--glow-hi)] hover:border-[var(--line)] transition-colors cursor-pointer"
          >
            {state.settings.soundEnabled ? (
              <Volume2 className="w-3.5 h-3.5" />
            ) : (
              <VolumeX className="w-3.5 h-3.5 text-[#9fc4e0]" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
