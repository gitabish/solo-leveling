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
    <header className="relative w-full border-b border-[#2F8CFF]/30 bg-[#03060D]/90 backdrop-blur-md px-3 py-2 sm:px-4 sm:py-2.5 z-30">
      <div className="max-w-xl md:max-w-2xl mx-auto flex items-center justify-between">
        {/* Left: Rank Badge & Player Identification */}
        <div className="flex items-center gap-2.5">
          <RankBadge rank={state.rank} size="sm" />
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="font-cyber text-xs sm:text-sm font-bold tracking-wider text-[#E8F4FF] truncate max-w-[140px] sm:max-w-[220px]">
                {state.playerName}
              </span>
              <span className="text-[10px] sm:text-[11px] font-cyber font-semibold text-[#7DF9FF] px-1.5 py-0.5 bg-[#2F8CFF]/20 border border-[#2F8CFF]/50 rounded-xs shrink-0">
                LV.{state.level}
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-[10px] font-cyber text-[#7FA6C9]">
              <span style={{ color: rankInfo.color }}>{state.rank}-RANK</span>
              {state.activeTitle !== 'None' && (
                <>
                  <span>•</span>
                  <span className="text-[#FFC857] truncate max-w-[100px]">[{state.activeTitle}]</span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Right: System Clock, Audio & Hazard indicators */}
        <div className="flex items-center gap-2.5">
          {state.penaltyState.isActive && (
            <div className="flex items-center gap-1 px-1.5 py-0.5 bg-[#FF3B4E]/20 border border-[#FF3B4E] rounded-xs text-[#FF3B4E] text-[10px] font-cyber animate-pulse">
              <ShieldAlert className="w-3 h-3" />
              <span>PENALTY</span>
            </div>
          )}

          {state.streak > 0 && (
            <div className="hidden sm:flex items-center gap-1 px-1.5 py-0.5 bg-[#FFC857]/15 border border-[#FFC857]/40 rounded-xs text-[#FFC857] text-[10px] font-cyber">
              <Sparkles className="w-3 h-3" />
              <span>{state.streak}D STREAK</span>
            </div>
          )}

          <div className="font-cyber text-[11px] text-[#7DF9FF]/80 tracking-wider hidden xs:block">
            {timeStr}
          </div>

          {/* Music Quick Toggle */}
          <button
            onClick={music.togglePlay}
            title={music.isPlaying ? `Theme Music: Playing (${Math.round(music.volume * 100)}%)` : 'Theme Music: Paused / Muted'}
            className={`p-1.5 rounded-xs border transition-colors flex items-center gap-1 cursor-pointer ${
              music.isPlaying
                ? 'border-[#7DF9FF]/60 bg-[#07101F] text-[#7DF9FF] shadow-[0_0_8px_rgba(125,249,255,0.3)]'
                : 'border-[#2F8CFF]/30 bg-[#07101F] text-[#7FA6C9]'
            }`}
          >
            <Music className="w-3.5 h-3.5" />
            {music.isPlaying && (
              <span className="w-1.5 h-1.5 rounded-full bg-[#3DFFA2] animate-pulse hidden xs:inline-block" />
            )}
          </button>

          {/* Sound FX Toggle */}
          <button
            onClick={() => updateSettings({ soundEnabled: !state.settings.soundEnabled })}
            title={state.settings.soundEnabled ? 'Mute System SFX' : 'Enable System SFX'}
            className="p-1.5 rounded-xs border border-[#2F8CFF]/40 bg-[#07101F] text-[#7DF9FF] hover:border-[#7DF9FF] transition-colors"
          >
            {state.settings.soundEnabled ? (
              <Volume2 className="w-3.5 h-3.5" />
            ) : (
              <VolumeX className="w-3.5 h-3.5 text-[#7FA6C9]" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
