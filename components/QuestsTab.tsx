'use client';

import React, { useState, useEffect } from 'react';
import { useSystem } from '@/lib/systemContext';
import { SystemWindow } from './SystemWindow';
import { SystemButton } from './SystemButton';
import { ExerciseProgress } from '@/lib/types';
import { RANK_CONFIG } from '@/lib/config';
import {
  Clock,
  CheckCircle2,
  AlertTriangle,
  Plus,
  Gift,
  Flame,
  Zap,
  Droplets,
  BookOpen,
  Brain,
  Timer,
} from 'lucide-react';

export function QuestsTab() {
  const {
    state,
    updateDailyExercise,
    setDailyExercise,
    claimDailyQuest,
    updateBonusQuest,
    triggerEmergencyQuest,
    updateEmergencyQuest,
    completeEmergencyQuest,
  } = useSystem();

  const [timeRemaining, setTimeRemaining] = useState('24:00:00');
  const [editingKey, setEditingKey] = useState<keyof ExerciseProgress | null>(null);
  const [manualInputVal, setManualInputVal] = useState('');
  const [emergencyTimerActive, setEmergencyTimerActive] = useState(false);

  const quest = state.dailyQuest;
  const rankInfo = RANK_CONFIG[state.rank] || RANK_CONFIG.E;

  // 24-hour midnight countdown
  useEffect(() => {
    const updateTimer = () => {
      const now = new Date();
      const midnight = new Date();
      midnight.setHours(24, 0, 0, 0);
      const diff = Math.max(0, midnight.getTime() - now.getTime());

      const hours = Math.floor(diff / (1000 * 60 * 60));
      const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const secs = Math.floor((diff % (1000 * 60)) / 1000);

      setTimeRemaining(
        `${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`
      );
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, []);

  // Emergency plank timer tick
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (emergencyTimerActive && state.emergencyQuest && state.emergencyQuest.currentSeconds < state.emergencyQuest.targetSeconds) {
      interval = setInterval(() => {
        updateEmergencyQuest(1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [emergencyTimerActive, state.emergencyQuest, updateEmergencyQuest]);

  const exercises = [
    { key: 'pushups' as const, label: 'Push-ups', target: quest.targets.pushups, current: quest.progress.pushups, unit: 'reps' },
    { key: 'situps' as const, label: 'Sit-ups', target: quest.targets.situps, current: quest.progress.situps, unit: 'reps' },
    { key: 'squats' as const, label: 'Squats', target: quest.targets.squats, current: quest.progress.squats, unit: 'reps' },
    { key: 'pullups' as const, label: 'Pull-ups', target: quest.targets.pullups, current: quest.progress.pullups, unit: 'reps' },
    { key: 'runKm' as const, label: 'Running', target: quest.targets.runKm, current: quest.progress.runKm, unit: 'km' },
  ];

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingKey) return;
    const parsed = parseFloat(manualInputVal);
    if (!isNaN(parsed)) {
      setDailyExercise(editingKey, parsed);
    }
    setEditingKey(null);
    setManualInputVal('');
  };

  return (
    <div className="space-y-4 pb-20 select-none">
      {/* Primary Anime Daily Quest Window */}
      <SystemWindow title="QUEST INFO" variant="blue">
        <div className="space-y-4 font-cyber">
          {/* Header info */}
          <div className="border-b border-[#2F8CFF]/25 pb-2">
            <div className="text-[10px] text-[#7FA6C9] tracking-widest uppercase">
              {state.rank}-RANK MANDATORY DIRECTIVE
            </div>
            <h3 className="text-base sm:text-lg font-black text-[#E8F4FF] tracking-wider text-glow-cyan">
              DAILY QUEST: STRENGTH TRAINING
            </h3>

            <div className="mt-2 flex items-center justify-between text-xs">
              <span className="text-[#7FA6C9] flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-[#7DF9FF]" />
                Time remaining:
              </span>
              <span className="font-bold text-[#7DF9FF] tracking-widest text-glow-cyan">
                {timeRemaining}
              </span>
            </div>
          </div>

          {/* Goal objectives list */}
          <div className="space-y-3">
            <div className="text-xs text-[#7FA6C9] uppercase tracking-wider flex items-center justify-between">
              <span>Goal Objectives</span>
              {state.streak > 0 && (
                <span className="text-[#FFC857] flex items-center gap-1">
                  <Flame className="w-3.5 h-3.5 fill-[#FFC857]" />
                  Streak: {state.streak} Days
                </span>
              )}
            </div>

            {exercises.map((item) => {
              const isDone = item.current >= item.target;
              const percent = Math.min(100, Math.round((item.current / item.target) * 100));

              return (
                <div
                  key={item.key}
                  className={`p-3 rounded-xs border transition-all ${
                    isDone
                      ? 'bg-[#092B28]/60 border-[#3DFFA2]/60'
                      : 'bg-[#06142E]/80 border-[#2F8CFF]/30'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className="font-bold text-[#E8F4FF]">{item.label}</span>

                    <div className="flex items-center gap-2">
                      <span className="text-[#7FA6C9]">
                        ({item.current}/{item.target} {item.unit})
                      </span>
                      <span
                        className={`text-[11px] font-bold px-1.5 py-0.5 rounded-xs ${
                          isDone
                            ? 'bg-[#3DFFA2]/20 text-[#3DFFA2] border border-[#3DFFA2]/50'
                            : 'bg-[#FF3B4E]/15 text-[#FF9EAA] border border-[#FF3B4E]/30'
                        }`}
                      >
                        [ {isDone ? 'Complete' : 'Incomplete'} ]
                      </span>
                    </div>
                  </div>

                  {/* Progress bar */}
                  <div className="w-full h-1.5 bg-[#03060D] rounded-full overflow-hidden mb-2.5">
                    <div
                      className={`h-full transition-all duration-300 ${
                        isDone ? 'bg-[#3DFFA2] shadow-[0_0_8px_#3DFFA2]' : 'bg-[#2F8CFF]'
                      }`}
                      style={{ width: `${percent}%` }}
                    />
                  </div>

                  {/* Action buttons */}
                  {!quest.isClaimed && (
                    <div className="flex items-center justify-between pt-1">
                      <button
                        onClick={() => {
                          setEditingKey(item.key);
                          setManualInputVal(String(item.current));
                        }}
                        className="text-[10px] text-[#7FA6C9] hover:text-[#7DF9FF] underline cursor-pointer"
                      >
                        Manual entry
                      </button>

                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => updateDailyExercise(item.key, item.key === 'runKm' ? 0.5 : 1)}
                          className="px-2 py-0.5 rounded-xs bg-[#0F2852] border border-[#2F8CFF]/50 text-[#7DF9FF] text-[10px] hover:bg-[#1E4380] active:scale-95 flex items-center gap-0.5 cursor-pointer"
                        >
                          <Plus className="w-2.5 h-2.5" />
                          {item.key === 'runKm' ? '0.5' : '1'}
                        </button>
                        <button
                          onClick={() => updateDailyExercise(item.key, item.key === 'runKm' ? 1 : 5)}
                          className="px-2 py-0.5 rounded-xs bg-[#0F2852] border border-[#2F8CFF]/50 text-[#7DF9FF] text-[10px] hover:bg-[#1E4380] active:scale-95 flex items-center gap-0.5 cursor-pointer"
                        >
                          <Plus className="w-2.5 h-2.5" />
                          {item.key === 'runKm' ? '1' : '5'}
                        </button>
                        <button
                          onClick={() => updateDailyExercise(item.key, item.key === 'runKm' ? 2 : 10)}
                          className="px-2 py-0.5 rounded-xs bg-[#0F2852] border border-[#2F8CFF]/50 text-[#7DF9FF] text-[10px] hover:bg-[#1E4380] active:scale-95 flex items-center gap-0.5 cursor-pointer"
                        >
                          <Plus className="w-2.5 h-2.5" />
                          {item.key === 'runKm' ? '2' : '10'}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Caution prompt mirroring anime */}
          <div className="p-2.5 rounded-xs bg-[#170509]/80 border border-[#FF3B4E]/40 text-[11px] text-[#FFB3BA] leading-relaxed flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 text-[#FF3B4E] shrink-0 mt-0.5" />
            <span>
              Caution: Failure to complete the Daily Quest will result in an appropriate penalty.
            </span>
          </div>

          {/* Claim Rewards button */}
          <div className="pt-2">
            {quest.isClaimed ? (
              <div className="p-3 text-center rounded-xs bg-[#092B28]/60 border border-[#3DFFA2]/60 text-[#3DFFA2] text-xs font-bold">
                [ Daily Quest Rewards Claimed For Today ]
              </div>
            ) : (
              <SystemButton
                variant={quest.isCompleted ? 'gold' : 'subtle'}
                size="lg"
                disabled={!quest.isCompleted}
                onClick={claimDailyQuest}
                className="w-full flex items-center justify-center gap-2"
              >
                <Gift className="w-4 h-4" />
                {quest.isCompleted ? 'CLAIM REWARDS' : 'COMPLETE ALL OBJECTIVES TO CLAIM'}
              </SystemButton>
            )}
          </div>
        </div>
      </SystemWindow>

      {/* Manual Input Dialog if open */}
      {editingKey && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-xs">
            <SystemWindow title="INPUT EXERCISE REPS">
              <form onSubmit={handleManualSubmit} className="space-y-4 font-cyber">
                <div className="text-xs text-[#7FA6C9]">
                  Enter completed total value for {editingKey}:
                </div>
                <input
                  type="number"
                  step="any"
                  autoFocus
                  required
                  value={manualInputVal}
                  onChange={(e) => setManualInputVal(e.target.value)}
                  className="w-full bg-[#03060D] border border-[#2F8CFF] px-3 py-2 text-base text-[#7DF9FF] rounded-xs focus:outline-none"
                />
                <div className="flex gap-2">
                  <SystemButton type="submit" variant="primary" size="md" className="flex-1">
                    SET
                  </SystemButton>
                  <SystemButton
                    type="button"
                    variant="subtle"
                    size="md"
                    onClick={() => setEditingKey(null)}
                    className="flex-1"
                  >
                    CANCEL
                  </SystemButton>
                </div>
              </form>
            </SystemWindow>
          </div>
        </div>
      )}

      {/* Emergency Quest Window */}
      {state.emergencyQuest ? (
        <SystemWindow title="EMERGENCY QUEST" variant="danger">
          <div className="space-y-3 font-cyber text-xs">
            <div className="flex justify-between items-center text-[#FF9EAA]">
              <span className="font-bold">{state.emergencyQuest.title}</span>
              <span className="text-[11px] text-[#FF3B4E] animate-pulse">GATE ACTIVE</span>
            </div>
            <p className="text-[#FFCCD1]">{state.emergencyQuest.description}</p>

            <div className="p-3 bg-[#22070B] border border-[#FF3B4E]/40 rounded-xs flex items-center justify-between">
              <span className="text-[#FFE8EA]">Plank Hold Timer:</span>
              <span className="text-sm font-bold text-[#FF3B4E]">
                {state.emergencyQuest.currentSeconds} / {state.emergencyQuest.targetSeconds}s
              </span>
            </div>

            <div className="flex gap-2">
              <SystemButton
                variant={emergencyTimerActive ? 'danger' : 'primary'}
                size="md"
                onClick={() => setEmergencyTimerActive(!emergencyTimerActive)}
                className="flex-1 flex items-center justify-center gap-1.5"
              >
                <Timer className="w-3.5 h-3.5" />
                {emergencyTimerActive ? 'PAUSE TIMER' : 'START TIMER'}
              </SystemButton>

              <SystemButton
                variant="gold"
                size="md"
                disabled={state.emergencyQuest.currentSeconds < state.emergencyQuest.targetSeconds}
                onClick={completeEmergencyQuest}
                className="flex-1"
              >
                CLAIM +{state.emergencyQuest.rewardExp} EXP
              </SystemButton>
            </div>
          </div>
        </SystemWindow>
      ) : (
        <div className="flex justify-end">
          <button
            onClick={triggerEmergencyQuest}
            className="text-[11px] font-cyber text-[#7FA6C9] hover:text-[#7DF9FF] underline cursor-pointer"
          >
            [ Scan For Surprise Emergency Quest ]
          </button>
        </div>
      )}

      {/* Bonus Quests for INT & SENSE Window */}
      <SystemWindow title="TACTICAL BONUS QUESTS" variant="blue">
        <div className="space-y-3 font-cyber text-xs">
          <p className="text-[11px] text-[#7FA6C9] leading-relaxed">
            Optional cognitive and sensory directives that permanently develop INTELLIGENCE and SENSE parameters.
          </p>

          <div className="space-y-2.5">
            {state.bonusQuests.map((bq) => {
              const iconMap = {
                water: Droplets,
                meditation: Brain,
                study: BookOpen,
                sleep: Brain,
              };
              const Icon = iconMap[bq.type] || Brain;
              const percent = Math.min(100, Math.round((bq.currentValue / bq.targetValue) * 100));

              return (
                <div
                  key={bq.id}
                  className={`p-3 rounded-xs border transition-all ${
                    bq.completed
                      ? 'bg-[#092B28]/60 border-[#3DFFA2]/60'
                      : 'bg-[#071329]/70 border-[#2F8CFF]/25'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-[#E8F4FF] flex items-center gap-1.5">
                      <Icon className="w-3.5 h-3.5 text-[#7DF9FF]" />
                      {bq.title}
                    </span>
                    <span className="text-[10px] text-[#FFC857]">
                      +{bq.expReward} EXP • +1 {bq.statReward.toUpperCase()}
                    </span>
                  </div>

                  <p className="text-[10px] text-[#7FA6C9] mb-2">{bq.description}</p>

                  <div className="flex items-center justify-between text-[11px] mb-1">
                    <span className="text-[#7FA6C9]">Progress:</span>
                    <span className={bq.completed ? 'text-[#3DFFA2] font-bold' : 'text-[#7DF9FF]'}>
                      {bq.currentValue} / {bq.targetValue} {bq.unit}
                    </span>
                  </div>

                  <div className="w-full h-1.5 bg-[#03060D] rounded-full overflow-hidden mb-2">
                    <div
                      className={`h-full ${bq.completed ? 'bg-[#3DFFA2]' : 'bg-[#7DF9FF]'}`}
                      style={{ width: `${percent}%` }}
                    />
                  </div>

                  {!bq.completed && (
                    <div className="flex justify-end gap-1.5 pt-1">
                      <button
                        onClick={() => updateBonusQuest(bq.id, bq.type === 'water' ? 250 : 5)}
                        className="px-2 py-0.5 rounded-xs bg-[#0F2852] border border-[#2F8CFF]/50 text-[#7DF9FF] text-[10px] hover:bg-[#1E4380] active:scale-95 cursor-pointer"
                      >
                        +{bq.type === 'water' ? '250ml' : '5m'}
                      </button>
                      <button
                        onClick={() => updateBonusQuest(bq.id, bq.type === 'water' ? 500 : 15)}
                        className="px-2 py-0.5 rounded-xs bg-[#0F2852] border border-[#2F8CFF]/50 text-[#7DF9FF] text-[10px] hover:bg-[#1E4380] active:scale-95 cursor-pointer"
                      >
                        +{bq.type === 'water' ? '500ml' : '15m'}
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </SystemWindow>
    </div>
  );
}
