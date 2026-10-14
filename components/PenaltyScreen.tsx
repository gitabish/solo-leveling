'use client';

import React, { useState, useEffect } from 'react';
import { useSystem } from '@/lib/systemContext';
import { SystemWindow } from './SystemWindow';
import { SystemButton } from './SystemButton';
import { ShieldAlert, Skull, CheckCircle2, Plus } from 'lucide-react';

export function PenaltyScreen() {
  const { state, updatePenaltyExercise, clearPenalty } = useSystem();
  const [timeLeftStr, setTimeLeftStr] = useState('04:00:00');

  const { penaltyState } = state;

  useEffect(() => {
    if (!penaltyState.isActive) return;
    const updateCountdown = () => {
      const now = Date.now();
      const diff = Math.max(0, penaltyState.expiresAt - now);
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const secs = Math.floor((diff % (1000 * 60)) / 1000);

      setTimeLeftStr(
        `${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`
      );
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, [penaltyState.isActive, penaltyState.expiresAt]);

  if (!penaltyState.isActive) return null;

  const exercises = [
    { key: 'pushups', label: 'Push-ups', target: penaltyState.targetReps.pushups, current: penaltyState.progressReps.pushups, unit: 'reps' },
    { key: 'situps', label: 'Sit-ups', target: penaltyState.targetReps.situps, current: penaltyState.progressReps.situps, unit: 'reps' },
    { key: 'squats', label: 'Squats', target: penaltyState.targetReps.squats, current: penaltyState.progressReps.squats, unit: 'reps' },
    { key: 'runKm', label: 'Running / Marching', target: penaltyState.targetReps.runKm, current: penaltyState.progressReps.runKm, unit: 'km' },
  ] as const;

  const allCompleted = exercises.every((e) => e.current >= e.target);

  return (
    <div data-theme="danger" className="fixed inset-0 z-50 flex flex-col bg-[#140205] text-[#FFE8EA] overflow-y-auto p-4 select-none">
      {/* Red cracked aura vignette */}
      <div className="fixed inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_center,_transparent_40%,_rgba(255,20,40,0.25)_100%)]" />
      <div className="fixed inset-0 pointer-events-none bg-[radial-gradient(#ff3b4e_1px,transparent_1px)] [background-size:24px_24px] opacity-10" />

      <div className="relative max-w-md w-full mx-auto my-auto space-y-4 py-6">
        {/* Warning Banner */}
        <div className="p-3 bg-[#2A050A] border border-[#FF3B4E] rounded-sm text-center shadow-[0_0_20px_rgba(255,59,78,0.4)]">
          <div className="flex items-center justify-center gap-2 text-[#FF3B4E] font-cyber text-xs font-bold tracking-widest animate-pulse">
            <ShieldAlert className="w-4 h-4" />
            <span>[ SYSTEM WARNING ]</span>
            <ShieldAlert className="w-4 h-4" />
          </div>
          <p className="font-cyber text-sm text-[#FFB3BA] mt-1">
            The Daily Quest was not completed. A penalty has been applied.
          </p>
        </div>

        {/* Penalty Survival Window */}
        <SystemWindow title="PENALTY QUEST: SURVIVAL" variant="danger">
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-[#FF3B4E]/30 pb-2">
              <span className="font-cyber text-xs text-[#FFA6AF] flex items-center gap-1.5">
                <Skull className="w-4 h-4 text-[#FF3B4E]" />
                ZONE: DESERT OF JUDGMENT
              </span>
              <div className="font-cyber text-sm font-bold text-[#FF3B4E] animate-pulse">
                {timeLeftStr}
              </div>
            </div>

            <p className="font-cyber text-xs text-[#FFCCD1] leading-relaxed">
              Caution: Survive the penalty zone by completing the punishment exercise reps before the survival timer runs out. Failure will result in severe penalty fatigue and HP depletion.
            </p>

            {/* Exercise rows */}
            <div className="space-y-3 pt-2">
              {exercises.map((item) => {
                const done = item.current >= item.target;
                const percent = Math.min(100, (item.current / item.target) * 100);

                return (
                  <div
                    key={item.key}
                    className={`p-3 rounded-xs border transition-all ${
                      done
                        ? 'bg-[#183625]/80 border-[#3DFFA2]/60'
                        : 'bg-[#22070B] border-[#FF3B4E]/40'
                    }`}
                  >
                    <div className="flex items-center justify-between font-cyber text-xs mb-1.5">
                      <span className="font-bold text-[#FFE8EA]">{item.label}</span>
                      <div className="flex items-center gap-2">
                        <span className={done ? 'text-[#3DFFA2] font-bold' : 'text-[#FF9EAA]'}>
                          {item.current} / {item.target} {item.unit}
                        </span>
                        {done && <CheckCircle2 className="w-3.5 h-3.5 text-[#3DFFA2]" />}
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full h-1.5 bg-[#3B0C12] rounded-full overflow-hidden mb-2">
                      <div
                        className={`h-full transition-all duration-300 ${
                          done ? 'bg-[#3DFFA2]' : 'bg-[#FF3B4E]'
                        }`}
                        style={{ width: `${percent}%` }}
                      />
                    </div>

                    {/* Quick increment buttons */}
                    <div className="flex items-center gap-1.5 justify-end">
                      <button
                        onClick={() => updatePenaltyExercise(item.key, 1)}
                        className="px-2 py-0.5 rounded-xs bg-[#3B0C12] border border-[#FF3B4E]/50 text-[#FFCCD1] text-[10px] font-cyber hover:bg-[#5C141C] active:scale-95 flex items-center gap-0.5"
                      >
                        <Plus className="w-2.5 h-2.5" />1
                      </button>
                      <button
                        onClick={() => updatePenaltyExercise(item.key, 5)}
                        className="px-2 py-0.5 rounded-xs bg-[#3B0C12] border border-[#FF3B4E]/50 text-[#FFCCD1] text-[10px] font-cyber hover:bg-[#5C141C] active:scale-95 flex items-center gap-0.5"
                      >
                        <Plus className="w-2.5 h-2.5" />5
                      </button>
                      {item.key !== 'runKm' && (
                        <button
                          onClick={() => updatePenaltyExercise(item.key, 10)}
                          className="px-2 py-0.5 rounded-xs bg-[#3B0C12] border border-[#FF3B4E]/50 text-[#FFCCD1] text-[10px] font-cyber hover:bg-[#5C141C] active:scale-95 flex items-center gap-0.5"
                        >
                          <Plus className="w-2.5 h-2.5" />10
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Clear Penalty button */}
            <div className="pt-2">
              <SystemButton
                variant={allCompleted ? 'primary' : 'danger'}
                size="lg"
                disabled={!allCompleted}
                onClick={clearPenalty}
                className="w-full"
              >
                {allCompleted ? 'SURVIVAL COMPLETE • CLEAR PENALTY' : 'SURVIVE REPS REQUIRED'}
              </SystemButton>
            </div>
          </div>
        </SystemWindow>
      </div>
    </div>
  );
}
