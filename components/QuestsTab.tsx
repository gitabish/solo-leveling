'use client';

import React, { useState } from 'react';
import { useSystem } from '@/lib/systemContext';
import { SystemWindow } from './SystemWindow';
import { ExerciseProgress } from '@/lib/types';
import { Check, Plus, Minus } from 'lucide-react';

export function QuestsTab() {
  const {
    state,
    updateDailyExercise,
    claimDailyQuest,
  } = useSystem();

  const [activeExerciseKey, setActiveExerciseKey] = useState<keyof ExerciseProgress | null>(null);

  const quest = state.dailyQuest;
  const isCompleted = quest.isCompleted;
  const isClaimed = quest.isClaimed;

  const exercises: { key: keyof ExerciseProgress; label: string; unit?: string; step: number }[] = [
    { key: 'pushups', label: 'Push-ups', step: 10 },
    { key: 'situps', label: 'Sit-ups', step: 10 },
    { key: 'squats', label: 'Squats', step: 10 },
    {
      key: 'runKm',
      label: 'Running',
      unit: state.settings.units === 'imperial' ? 'mi' : 'km',
      step: 1,
    },
  ];

  if (quest.targets.pullups && quest.targets.pullups > 0) {
    exercises.splice(3, 0, { key: 'pullups', label: 'Pull-ups', step: 5 });
  }

  const handleClaim = () => {
    if (!isCompleted || isClaimed) return;
    claimDailyQuest();
  };

  return (
    <div className="space-y-6 pb-20 select-none flex flex-col items-center">
      <SystemWindow
        title="QUEST INFO"
        tilt={true}
        className="max-w-[460px] w-full"
      >
        <div className="space-y-6 pt-1">
          {/* Subtitle */}
          <div className="text-center font-head text-[13px] tracking-wide text-[#b7e3ff]">
            [Daily Quest: Strength Training has arrived.]
          </div>

          {/* Goal Heading */}
          <div className="text-center">
            <h3 className="goal-h">GOAL</h3>
          </div>

          {/* Exercise Rows */}
          <div className="space-y-3 px-2 sm:px-4">
            {exercises.map((item) => {
              const cur = quest.progress[item.key] || 0;
              const target = quest.targets[item.key] || 0;
              const isDone = cur >= target;
              const isSelected = activeExerciseKey === item.key;

              return (
                <div key={item.key} className="space-y-1.5">
                  <div
                    onClick={() => setActiveExerciseKey(isSelected ? null : item.key)}
                    className="quest-row cursor-pointer hover:bg-[rgba(207,233,255,0.04)] px-2 rounded-xs transition-colors"
                  >
                    <span className="font-body font-medium text-base text-[#f4faff]">
                      {item.label}
                    </span>
                    <div className="flex items-center gap-3">
                      <span className="font-head font-semibold text-sm tracking-wide text-[#b7e3ff]">
                        [{cur}/{target}{item.unit ? item.unit : ''}]
                      </span>
                      <div className={`quest-check ${isDone ? 'checked' : ''}`}>
                        {isDone && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                      </div>
                    </div>
                  </div>

                  {/* Inline quick logger controls when expanded */}
                  {isSelected && (
                    <div className="flex items-center justify-end gap-1.5 py-1 px-2 border-t border-[rgba(183,227,255,0.2)] bg-[rgba(6,16,31,0.5)] rounded-xs">
                      <span className="text-[10px] font-head text-[#9fc4e0] mr-auto">
                        LOG REPS:
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          updateDailyExercise(item.key, -item.step);
                        }}
                        className="px-2 py-0.5 text-xs font-head border border-[rgba(183,227,255,0.3)] bg-[rgba(6,16,31,0.7)] text-[#9fc4e0] hover:text-white rounded-xs flex items-center gap-1 cursor-pointer"
                      >
                        <Minus className="w-2.5 h-2.5" /> {item.step}
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          updateDailyExercise(item.key, 1);
                        }}
                        className="px-2.5 py-0.5 text-xs font-head border border-[var(--line)] bg-[rgba(47,155,255,0.2)] text-[#f4faff] hover:bg-[rgba(47,155,255,0.35)] rounded-xs flex items-center gap-0.5 cursor-pointer"
                      >
                        <Plus className="w-2.5 h-2.5" /> 1
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          updateDailyExercise(item.key, item.step);
                        }}
                        className="px-2.5 py-0.5 text-xs font-head border border-[var(--line)] bg-[rgba(47,155,255,0.3)] text-[#7df9ff] hover:bg-[rgba(47,155,255,0.45)] rounded-xs flex items-center gap-0.5 cursor-pointer font-bold shadow-[0_0_8px_var(--glow)]"
                      >
                        <Plus className="w-2.5 h-2.5" /> {item.step}
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Warning Box */}
          <div className="warn-box px-2 sm:px-4 text-center">
            <span className="font-semibold text-[#f4faff]">WARNING: Failure to complete</span>
            <br />
            <span>the daily quest will result in</span>
            <br />
            <span>an appropriate </span>
            <span className="warn-bad">penalty.</span>
          </div>

          {/* 58px Square Outlined Confirm / Claim Button */}
          <div className="flex flex-col items-center justify-center pt-2 gap-2">
            <button
              onClick={handleClaim}
              disabled={!isCompleted || isClaimed}
              title={
                isClaimed
                  ? 'Rewards already claimed for today'
                  : isCompleted
                  ? 'Claim Daily Quest Rewards'
                  : 'Complete all goals to claim rewards'
              }
              className={`confirm-btn ${isCompleted && !isClaimed ? 'active' : ''} ${
                !isCompleted ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'
              }`}
            >
              <Check
                className={`w-8 h-8 stroke-[2.5] ${
                  isCompleted && !isClaimed
                    ? 'text-[var(--ok)] drop-shadow-[0_0_8px_var(--ok)]'
                    : isClaimed
                    ? 'text-[#9fc4e0]'
                    : 'text-white/40'
                }`}
              />
            </button>
            <span className="text-[10px] font-head tracking-wider text-[#9fc4e0]">
              {isClaimed
                ? 'REWARDS CLAIMED'
                : isCompleted
                ? 'CLICK TO CLAIM REWARDS'
                : 'STATUS: INCOMPLETE'}
            </span>
          </div>
        </div>
      </SystemWindow>
    </div>
  );
}
