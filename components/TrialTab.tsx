'use client';

import React from 'react';
import { useSystem } from '@/lib/systemContext';
import { SystemWindow } from './SystemWindow';
import { SystemButton } from './SystemButton';
import { RankBadge } from './RankBadge';
import { TRIALS_CONFIG, RANK_CONFIG } from '@/lib/config';
import { HunterRank, ExerciseProgress } from '@/lib/types';
import { Lock, Unlock, CheckCircle2, Plus, AlertCircle, Sparkles, Award } from 'lucide-react';

export function TrialTab() {
  const {
    state,
    startTrial,
    updateTrialExercise,
    completeTrial,
    cancelTrial,
  } = useSystem();

  // Find the next trial for player's current rank
  const nextTrialIndex = TRIALS_CONFIG.findIndex((t) => t.fromRank === state.rank);
  const currentAvailableTrial = nextTrialIndex !== -1 ? TRIALS_CONFIG[nextTrialIndex] : null;

  const isLevelQualified = currentAvailableTrial
    ? state.level >= currentAvailableTrial.minLevel
    : false;

  const activeTrial = state.activeTrial;
  const isTrialInProgress = !!activeTrial && activeTrial.inProgress;

  const exercises = activeTrial
    ? [
        { key: 'pushups' as const, label: 'Push-ups', target: currentAvailableTrial?.targets.pushups || 0, current: activeTrial.progress.pushups, unit: 'reps' },
        { key: 'pullups' as const, label: 'Pull-ups', target: currentAvailableTrial?.targets.pullups || 0, current: activeTrial.progress.pullups, unit: 'reps' },
        { key: 'squats' as const, label: 'Squats', target: currentAvailableTrial?.targets.squats || 0, current: activeTrial.progress.squats, unit: 'reps' },
        { key: 'situps' as const, label: 'Sit-ups', target: currentAvailableTrial?.targets.situps || 0, current: activeTrial.progress.situps, unit: 'reps' },
        { key: 'runKm' as const, label: 'Running', target: currentAvailableTrial?.targets.runKm || 0, current: activeTrial.progress.runKm, unit: 'km' },
      ].filter((e) => e.target > 0)
    : [];

  const allTrialRequirementsMet =
    exercises.length > 0 && exercises.every((e) => e.current >= e.target);

  const isSRankCandidate = state.rank === 'A';

  return (
    <div className="space-y-4 pb-20 select-none">
      {/* Current Rank & Next Target Header */}
      <SystemWindow
        title="RANK PROMOTION STATUS"
        variant={isSRankCandidate ? 'gold' : 'blue'}
      >
        <div className="space-y-4 font-cyber">
          <div className="flex items-center justify-between p-3 rounded-xs bg-[#071329]/80 border border-[#2F8CFF]/30">
            <div className="flex items-center gap-3">
              <RankBadge rank={state.rank} size="md" />
              <div>
                <div className="text-[10px] text-[#7FA6C9]">CURRENT STATUS</div>
                <div className="text-sm font-bold text-[#E8F4FF]">
                  {RANK_CONFIG[state.rank].name}
                </div>
              </div>
            </div>

            <span className="text-[#7DF9FF] text-xl font-bold">→</span>

            {currentAvailableTrial ? (
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <div className="text-[10px] text-[#7FA6C9]">NEXT THRESHOLD</div>
                  <div className="text-sm font-bold" style={{ color: RANK_CONFIG[currentAvailableTrial.toRank].color }}>
                    {RANK_CONFIG[currentAvailableTrial.toRank].name}
                  </div>
                </div>
                <RankBadge rank={currentAvailableTrial.toRank} size="md" />
              </div>
            ) : (
              <div className="text-xs font-bold text-[#FFC857]">MAXIMUM RANK REACHED</div>
            )}
          </div>

          {currentAvailableTrial ? (
            <div className="p-3 rounded-xs bg-[#03060D] border border-[#2F8CFF]/20 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-[#7FA6C9] flex items-center gap-1.5">
                  {isLevelQualified ? (
                    <Unlock className="w-3.5 h-3.5 text-[#3DFFA2]" />
                  ) : (
                    <Lock className="w-3.5 h-3.5 text-[#FF3B4E]" />
                  )}
                  Qualification Requirement:
                </span>
                <span className={isLevelQualified ? 'text-[#3DFFA2] font-bold' : 'text-[#FF9EAA]'}>
                  Level {currentAvailableTrial.minLevel}+ (Current: Lvl {state.level})
                </span>
              </div>
            </div>
          ) : (
            <div className="p-4 text-center text-xs text-[#FFC857]">
              You have attained the apex of the System. Supreme Shadow Sovereign Rank S.
            </div>
          )}
        </div>
      </SystemWindow>

      {/* Active Trial or Trial Initiation Card */}
      {currentAvailableTrial && (
        <SystemWindow
          title={isTrialInProgress ? 'ACTIVE TRIAL IN PROGRESS' : 'RANK PROMOTION TRIAL'}
          variant={currentAvailableTrial.toRank === 'S' ? 'gold' : isTrialInProgress ? 'violet' : 'blue'}
        >
          <div className="space-y-4 font-cyber">
            <div className="border-b border-[#2F8CFF]/20 pb-2">
              <h3 className="text-sm sm:text-base font-bold text-[#E8F4FF] tracking-wide">
                [ {currentAvailableTrial.title} ]
              </h3>
              <p className="text-xs text-[#7FA6C9] mt-1 leading-relaxed">
                {currentAvailableTrial.description}
              </p>
            </div>

            {/* If Trial is Not Active, show requirements preview and start button */}
            {!isTrialInProgress ? (
              <div className="space-y-3">
                <div className="text-xs text-[#7FA6C9] uppercase">Trial Volume Protocol</div>
                <div className="space-y-1.5">
                  {Object.entries(currentAvailableTrial.targets)
                    .filter(([_, val]) => val > 0)
                    .map(([key, val]) => (
                      <div
                        key={key}
                        className="flex justify-between items-center p-2 rounded-xs bg-[#07101F] border border-[#2F8CFF]/20 text-xs"
                      >
                        <span className="text-[#E8F4FF] capitalize">{key.replace('runKm', 'Run (km)')}</span>
                        <span className="text-[#7DF9FF] font-bold">
                          {val} {key === 'runKm' ? 'km' : 'total reps'}
                        </span>
                      </div>
                    ))}
                </div>

                <div className="pt-2">
                  <SystemButton
                    variant={isLevelQualified ? (currentAvailableTrial.toRank === 'S' ? 'gold' : 'primary') : 'subtle'}
                    size="lg"
                    disabled={!isLevelQualified}
                    onClick={() => startTrial(currentAvailableTrial.toRank)}
                    className="w-full flex items-center justify-center gap-2"
                  >
                    <Award className="w-4 h-4" />
                    {isLevelQualified ? 'COMMENCE PROMOTION TRIAL' : `LEVEL ${currentAvailableTrial.minLevel} REQUIRED TO UNLOCK`}
                  </SystemButton>
                </div>
              </div>
            ) : (
              /* Active Trial Live Tracker */
              <div className="space-y-3">
                <div className="p-2.5 rounded-xs bg-[#1F0A3D]/60 border border-[#8B5CFF]/40 text-xs text-[#D8B4FE] flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#8B5CFF]" />
                  <span>Trial in progress. Complete all quota within today to claim promotion.</span>
                </div>

                <div className="space-y-2.5">
                  {exercises.map((item) => {
                    const done = item.current >= item.target;
                    const percent = Math.min(100, Math.round((item.current / item.target) * 100));

                    return (
                      <div
                        key={item.key}
                        className={`p-3 rounded-xs border transition-all ${
                          done ? 'bg-[#092B28]/60 border-[#3DFFA2]/60' : 'bg-[#06142E] border-[#2F8CFF]/30'
                        }`}
                      >
                        <div className="flex items-center justify-between text-xs mb-1">
                          <span className="font-bold text-[#E8F4FF]">{item.label}</span>
                          <span className={done ? 'text-[#3DFFA2] font-bold' : 'text-[#7DF9FF]'}>
                            {item.current} / {item.target} {item.unit}
                          </span>
                        </div>

                        <div className="w-full h-1.5 bg-[#03060D] rounded-full overflow-hidden mb-2">
                          <div
                            className={`h-full ${done ? 'bg-[#3DFFA2]' : 'bg-[#8B5CFF]'}`}
                            style={{ width: `${percent}%` }}
                          />
                        </div>

                        <div className="flex justify-end gap-1.5">
                          <button
                            onClick={() => updateTrialExercise(item.key, item.key === 'runKm' ? 0.5 : 5)}
                            className="px-2 py-0.5 rounded-xs bg-[#0F2852] border border-[#2F8CFF]/50 text-[#7DF9FF] text-[10px] hover:bg-[#1E4380] active:scale-95 cursor-pointer"
                          >
                            +{item.key === 'runKm' ? '0.5' : '5'}
                          </button>
                          <button
                            onClick={() => updateTrialExercise(item.key, item.key === 'runKm' ? 1 : 15)}
                            className="px-2 py-0.5 rounded-xs bg-[#0F2852] border border-[#2F8CFF]/50 text-[#7DF9FF] text-[10px] hover:bg-[#1E4380] active:scale-95 cursor-pointer"
                          >
                            +{item.key === 'runKm' ? '1' : '15'}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="pt-2 flex gap-2">
                  <SystemButton
                    variant="primary"
                    size="lg"
                    disabled={!allTrialRequirementsMet}
                    onClick={completeTrial}
                    className="flex-1"
                  >
                    {allTrialRequirementsMet ? 'COMPLETE & RE-AWAKEN' : 'TARGETS INCOMPLETE'}
                  </SystemButton>

                  <SystemButton
                    variant="subtle"
                    size="lg"
                    onClick={cancelTrial}
                    className="w-24"
                  >
                    ABORT
                  </SystemButton>
                </div>
              </div>
            )}
          </div>
        </SystemWindow>
      )}

      {/* Historical Trials Breakdown */}
      <SystemWindow title="ALL HUNTER PROMOTION TRIALS" variant="blue">
        <div className="space-y-2 font-cyber text-xs">
          {TRIALS_CONFIG.map((trial) => {
            const isCompleted = ['E', 'D', 'C', 'B', 'A', 'S'].indexOf(state.rank) >= ['E', 'D', 'C', 'B', 'A', 'S'].indexOf(trial.toRank);

            return (
              <div
                key={trial.toRank}
                className={`p-2.5 rounded-xs border flex items-center justify-between ${
                  isCompleted
                    ? 'bg-[#092B28]/40 border-[#3DFFA2]/30 text-[#A2E6D1]'
                    : 'bg-[#07101F]/60 border-[#2F8CFF]/20 text-[#7FA6C9]'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <span className="font-bold text-[#E8F4FF]">
                    {trial.fromRank} → {trial.toRank}
                  </span>
                  <span className="text-[11px] truncate max-w-[150px]">{trial.title}</span>
                </div>

                <div>
                  {isCompleted ? (
                    <span className="text-[#3DFFA2] text-[10px] flex items-center gap-1 font-bold">
                      <CheckCircle2 className="w-3 h-3" /> CLEARED
                    </span>
                  ) : (
                    <span className="text-[#7FA6C9] text-[10px]">Lvl {trial.minLevel}+</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </SystemWindow>
    </div>
  );
}
