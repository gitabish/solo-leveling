'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  SystemState,
  HunterRank,
  PlayerStats,
  ExerciseProgress,
  InventoryItem,
  TrialState,
  BonusQuest,
  EmergencyQuest,
} from './types';
import {
  loadSystemState,
  saveSystemState,
  createDailyQuest,
  createInitialBonusQuests,
  createDefaultState,
  getTodayDateString,
} from './storage';
import { RANK_CONFIG, TRIALS_CONFIG, getExpNeeded } from './config';
import { sound } from './sound';
import confetti from 'canvas-confetti';

interface LevelUpInfo {
  prevLevel: number;
  newLevel: number;
  pointsAdded: number;
}

interface RankUpInfo {
  prevRank: HunterRank;
  newRank: HunterRank;
  title: string;
}

interface SystemContextType {
  state: SystemState;
  levelUpModal: LevelUpInfo | null;
  rankUpModal: RankUpInfo | null;
  closeLevelUpModal: () => void;
  closeRankUpModal: () => void;
  notificationMessage: string | null;
  showNotification: (msg: string) => void;
  closeNotification: () => void;
  onboardPlayer: (name: string, height?: string, weight?: string) => void;
  spendAbilityPoint: (stat: keyof PlayerStats) => void;
  updateDailyExercise: (key: keyof ExerciseProgress, delta: number) => void;
  setDailyExercise: (key: keyof ExerciseProgress, value: number) => void;
  claimDailyQuest: () => void;
  updatePenaltyExercise: (key: 'pushups' | 'situps' | 'squats' | 'runKm', delta: number) => void;
  clearPenalty: () => void;
  startTrial: (targetRank: HunterRank) => void;
  updateTrialExercise: (key: keyof ExerciseProgress, delta: number) => void;
  completeTrial: () => void;
  cancelTrial: () => void;
  consumeInventoryItem: (itemId: string) => void;
  equipTitle: (titleName: string) => void;
  updateBonusQuest: (id: string, delta: number) => void;
  triggerEmergencyQuest: () => void;
  updateEmergencyQuest: (seconds: number) => void;
  completeEmergencyQuest: () => void;
  updateSettings: (newSettings: Partial<SystemState['settings']>) => void;
  updatePlayerName: (name: string) => void;
  resetProgress: () => void;
  // Test/Demo controls
  addExp: (amount: number) => void;
  triggerPenaltyTest: () => void;
  simulateNextDay: () => void;
  chooseJob: (jobName: string) => void;
}

const SystemContext = createContext<SystemContextType | null>(null);

export function SystemProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<SystemState>(() => loadSystemState());
  const [levelUpModal, setLevelUpModal] = useState<LevelUpInfo | null>(null);
  const [rankUpModal, setRankUpModal] = useState<RankUpInfo | null>(null);
  const [notificationMessage, setNotificationMessage] = useState<string | null>(null);

  // Sync settings and storage on state change
  useEffect(() => {
    saveSystemState(state);
    sound.setSoundEnabled(state.settings.soundEnabled);
    sound.setHapticEnabled(state.settings.hapticEnabled);
  }, [state]);

  const showNotification = useCallback((msg: string) => {
    setNotificationMessage(msg);
    sound.playSystemDing();
  }, []);

  const closeNotification = useCallback(() => {
    setNotificationMessage(null);
  }, []);

  const closeLevelUpModal = useCallback(() => {
    setLevelUpModal(null);
  }, []);

  const closeRankUpModal = useCallback(() => {
    setRankUpModal(null);
  }, []);

  const onboardPlayer = useCallback((name: string) => {
    setState((prev) => {
      const next: SystemState = {
        ...prev,
        onboarded: true,
        playerName: name.trim() || 'Sung',
        level: 1,
        exp: 0,
        rank: 'E',
        abilityPoints: 5,
        dailyQuest: createDailyQuest('E'),
      };
      return next;
    });
    sound.playQuestComplete();
    showNotification('Player registration confirmed. The Daily Quest has arrived.');
  }, [showNotification]);

  // Spend Ability Point
  const spendAbilityPoint = useCallback((stat: keyof PlayerStats) => {
    setState((prev) => {
      if (prev.abilityPoints <= 0) return prev;

      sound.playStatAdd();
      return {
        ...prev,
        abilityPoints: prev.abilityPoints - 1,
        stats: {
          ...prev.stats,
          [stat]: prev.stats[stat] + 1,
        },
        maxHp: stat === 'vitality' ? prev.maxHp + 10 : prev.maxHp,
        hp: stat === 'vitality' ? prev.hp + 10 : prev.hp,
        maxMp: stat === 'intelligence' ? prev.maxMp + 5 : prev.maxMp,
      };
    });
  }, []);

  // Internal EXP addition and level checking
  const applyExpAndCheckLevel = useCallback((amount: number, currentState: SystemState): SystemState => {
    let currentLvl = currentState.level;
    let currentExp = currentState.exp + amount;
    let pointsGained = 0;
    let didLevelUp = false;

    while (currentExp >= getExpNeeded(currentLvl)) {
      currentExp -= getExpNeeded(currentLvl);
      currentLvl += 1;
      pointsGained += 5;
      didLevelUp = true;
    }

    if (didLevelUp) {
      sound.playLevelUp();
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#2F8CFF', '#7DF9FF', '#FFFFFF', '#4DB8FF'],
        });
      } catch {}

      setLevelUpModal({
        prevLevel: currentState.level,
        newLevel: currentLvl,
        pointsAdded: pointsGained,
      });

      return {
        ...currentState,
        level: currentLvl,
        exp: currentExp,
        abilityPoints: currentState.abilityPoints + pointsGained,
        hp: currentState.maxHp, // Full HP refill on level up
        mp: currentState.maxMp,
        fatigue: 0, // Fatigue reset on level up
      };
    }

    return {
      ...currentState,
      exp: currentExp,
    };
  }, []);

  // Update Daily Exercise
  const updateDailyExercise = useCallback((key: keyof ExerciseProgress, delta: number) => {
    setState((prev) => {
      const current = prev.dailyQuest.progress[key];
      const target = prev.dailyQuest.targets[key];
      const newVal = Math.max(0, current + delta);

      sound.playClick();
      if (current < target && newVal >= target) {
        sound.playSystemDing();
      }

      const updatedProgress = {
        ...prev.dailyQuest.progress,
        [key]: newVal,
      };

      // Check if all objectives are completed
      const allDone =
        updatedProgress.pushups >= prev.dailyQuest.targets.pushups &&
        updatedProgress.situps >= prev.dailyQuest.targets.situps &&
        updatedProgress.squats >= prev.dailyQuest.targets.squats &&
        updatedProgress.pullups >= prev.dailyQuest.targets.pullups &&
        updatedProgress.runKm >= prev.dailyQuest.targets.runKm;

      // Small natural stat progression from exercise
      const stats = { ...prev.stats };
      if (key === 'pushups' || key === 'pullups') {
        if (newVal > 0 && newVal % 50 === 0) stats.strength += 1;
      } else if (key === 'squats') {
        if (newVal > 0 && newVal % 50 === 0) stats.vitality += 1;
      } else if (key === 'runKm') {
        if (newVal > 0 && newVal % 5 === 0) stats.agility += 1;
      }

      return {
        ...prev,
        stats,
        fatigue: Math.min(prev.maxFatigue, prev.fatigue + (delta > 0 ? 1 : 0)),
        dailyQuest: {
          ...prev.dailyQuest,
          progress: updatedProgress,
          isCompleted: allDone,
        },
      };
    });
  }, []);

  const setDailyExercise = useCallback((key: keyof ExerciseProgress, value: number) => {
    setState((prev) => {
      const val = Math.max(0, value);
      const updatedProgress = {
        ...prev.dailyQuest.progress,
        [key]: val,
      };

      const allDone =
        updatedProgress.pushups >= prev.dailyQuest.targets.pushups &&
        updatedProgress.situps >= prev.dailyQuest.targets.situps &&
        updatedProgress.squats >= prev.dailyQuest.targets.squats &&
        updatedProgress.pullups >= prev.dailyQuest.targets.pullups &&
        updatedProgress.runKm >= prev.dailyQuest.targets.runKm;

      return {
        ...prev,
        dailyQuest: {
          ...prev.dailyQuest,
          progress: updatedProgress,
          isCompleted: allDone,
        },
      };
    });
  }, []);

  // Claim Daily Quest Rewards
  const claimDailyQuest = useCallback(() => {
    setState((prev) => {
      if (!prev.dailyQuest.isCompleted || prev.dailyQuest.isClaimed) return prev;

      sound.playQuestComplete();

      const rankInfo = RANK_CONFIG[prev.rank] || RANK_CONFIG.E;
      let expGained = 100 + rankInfo.expBonus;
      if (prev.expBoostActive) {
        expGained = Math.round(expGained * 1.5);
      }

      const newStreak = prev.streak + 1;
      const bestStreak = Math.max(prev.bestStreak, newStreak);

      // Check title unlocks
      const updatedTitles = prev.titles.map((t) => {
        if (t.id === 'wolf_slayer' && newStreak >= 7) return { ...t, unlocked: true };
        if (t.id === 'iron_will' && newStreak >= 30) return { ...t, unlocked: true };
        return t;
      });

      // Item drop system
      const dropRoll = Math.random();
      const updatedInventory = [...prev.inventory];
      let droppedItemName = '';

      if (dropRoll < 0.4) {
        // Potion of Recovery
        const item = updatedInventory.find((i) => i.id === 'potion_recovery');
        if (item) item.quantity += 1;
        droppedItemName = 'Potion of Recovery';
      } else if (dropRoll < 0.65) {
        // Streak Shield
        const item = updatedInventory.find((i) => i.id === 'streak_shield');
        if (item) item.quantity += 1;
        droppedItemName = 'Streak Shield';
      } else if (dropRoll < 0.85) {
        // EXP Boost
        const existing = updatedInventory.find((i) => i.id === 'exp_boost');
        if (existing) {
          existing.quantity += 1;
        } else {
          updatedInventory.push({
            id: 'exp_boost',
            name: 'EXP Boost Token (x1.5)',
            description: 'Amplifies all quest EXP by 50% for 1 day.',
            rarity: 'rare',
            quantity: 1,
            icon: 'Zap',
            effectType: 'exp_boost',
          });
        }
        droppedItemName = 'EXP Boost Token';
      }

      const baseUpdated: SystemState = {
        ...prev,
        streak: newStreak,
        bestStreak,
        titles: updatedTitles,
        inventory: updatedInventory,
        expBoostActive: false,
        dailyQuest: {
          ...prev.dailyQuest,
          isClaimed: true,
        },
      };

      const finalState = applyExpAndCheckLevel(expGained, baseUpdated);

      const msg = droppedItemName
        ? `Daily Quest rewards claimed! Earned ${expGained} EXP. Item acquired: [ ${droppedItemName} ]`
        : `Daily Quest rewards claimed! Earned ${expGained} EXP. Current streak: ${newStreak} days.`;
      showNotification(msg);

      return finalState;
    });
  }, [applyExpAndCheckLevel, showNotification]);

  // Penalty Zone Exercise update
  const updatePenaltyExercise = useCallback((key: 'pushups' | 'situps' | 'squats' | 'runKm', delta: number) => {
    setState((prev) => {
      if (!prev.penaltyState.isActive) return prev;
      sound.playClick();

      const newVal = Math.max(0, prev.penaltyState.progressReps[key] + delta);
      return {
        ...prev,
        penaltyState: {
          ...prev.penaltyState,
          progressReps: {
            ...prev.penaltyState.progressReps,
            [key]: newVal,
          },
        },
      };
    });
  }, []);

  // Clear Penalty Zone
  const clearPenalty = useCallback(() => {
    setState((prev) => {
      if (!prev.penaltyState.isActive) return prev;

      sound.playQuestComplete();

      // Unlock "The One Who Overcame Adversity" title
      const updatedTitles = prev.titles.map((t) =>
        t.id === 'overcame_adversity' ? { ...t, unlocked: true } : t
      );

      return {
        ...prev,
        titles: updatedTitles,
        hp: Math.max(50, prev.hp),
        fatigue: 20,
        penaltyState: {
          isActive: false,
          reason: '',
          startedAt: 0,
          expiresAt: 0,
          targetReps: { pushups: 0, situps: 0, squats: 0, runKm: 0 },
          progressReps: { pushups: 0, situps: 0, squats: 0, runKm: 0 },
        },
      };
    });
    showNotification('Penalty Zone survived and cleared. Title acquired: [ The One Who Overcame Adversity ].');
  }, [showNotification]);

  // Start Rank Promotion Trial
  const startTrial = useCallback((targetRank: HunterRank) => {
    const trialCfg = TRIALS_CONFIG.find((t) => t.toRank === targetRank);
    if (!trialCfg) return;

    setState((prev) => {
      sound.playSystemDing();
      return {
        ...prev,
        activeTrial: {
          targetRank,
          inProgress: true,
          startedAt: Date.now(),
          progress: {
            pushups: 0,
            situps: 0,
            squats: 0,
            pullups: 0,
            runKm: 0,
          },
        },
      };
    });
    showNotification(`[ ${trialCfg.title} ] initiated. Complete all required trial reps to awaken.`);
  }, [showNotification]);

  const updateTrialExercise = useCallback((key: keyof ExerciseProgress, delta: number) => {
    setState((prev) => {
      if (!prev.activeTrial || !prev.activeTrial.inProgress) return prev;
      sound.playClick();
      const current = prev.activeTrial.progress[key];
      const newVal = Math.max(0, current + delta);
      return {
        ...prev,
        activeTrial: {
          ...prev.activeTrial,
          progress: {
            ...prev.activeTrial.progress,
            [key]: newVal,
          },
        },
      };
    });
  }, []);

  const completeTrial = useCallback(() => {
    setState((prev) => {
      if (!prev.activeTrial) return prev;
      const trialCfg = TRIALS_CONFIG.find((t) => t.toRank === prev.activeTrial?.targetRank);
      if (!trialCfg) return prev;

      const newRank = trialCfg.toRank;
      const prevRank = prev.rank;

      sound.playLevelUp();
      try {
        confetti({
          particleCount: 150,
          spread: 100,
          origin: { y: 0.5 },
          colors: ['#FFC857', '#3DE0C0', '#2F8CFF', '#8B5CFF'],
        });
      } catch {}

      setRankUpModal({
        prevRank,
        newRank,
        title: trialCfg.title,
      });

      // Unlock monarch titles if high rank
      const updatedTitles = prev.titles.map((t) => {
        if (newRank === 'A' && t.id === 'monarch_candidate') return { ...t, unlocked: true };
        if (newRank === 'S' && t.id === 'shadow_sovereign') return { ...t, unlocked: true };
        return t;
      });

      return {
        ...prev,
        rank: newRank,
        activeTrial: undefined,
        titles: updatedTitles,
        dailyQuest: createDailyQuest(newRank),
        abilityPoints: prev.abilityPoints + 10, // Generous promotion bonus
        fatigue: 0,
        hp: prev.maxHp,
        mp: prev.maxMp,
      };
    });
  }, []);

  const cancelTrial = useCallback(() => {
    setState((prev) => ({
      ...prev,
      activeTrial: undefined,
    }));
    showNotification('Trial aborted. No penalties sustained.');
  }, [showNotification]);

  // Inventory Item Consumption
  const consumeInventoryItem = useCallback((itemId: string) => {
    setState((prev) => {
      const itemIndex = prev.inventory.findIndex((i) => i.id === itemId);
      if (itemIndex === -1 || prev.inventory[itemIndex].quantity <= 0) return prev;

      const item = prev.inventory[itemIndex];
      const updatedInventory = [...prev.inventory];
      updatedInventory[itemIndex] = {
        ...item,
        quantity: item.quantity - 1,
      };

      sound.playQuestComplete();

      let hp = prev.hp;
      let fatigue = prev.fatigue;
      let expBoostActive = prev.expBoostActive;
      let abilityPoints = prev.abilityPoints;
      let stats = { ...prev.stats };
      let streakShieldCount = prev.streakShieldCount;

      if (item.effectType === 'fatigue_recovery') {
        fatigue = 0;
        hp = prev.maxHp;
        showNotification('Potion of Recovery consumed. Fatigue reset to 0%. HP fully replenished.');
      } else if (item.effectType === 'exp_boost') {
        expBoostActive = true;
        showNotification('EXP Boost Token activated. Next quest awards 1.5x EXP.');
      } else if (item.effectType === 'streak_shield') {
        streakShieldCount += 1;
        showNotification('Streak Shield stored. Protects from your next missed daily quest.');
      } else if (item.effectType === 'stat_reset') {
        // Refund all points spent above baseline 10
        const spent = (stats.strength - 10) + (stats.agility - 10) + (stats.vitality - 10) + (stats.intelligence - 10) + (stats.sense - 10);
        stats = { strength: 10, agility: 10, vitality: 10, intelligence: 10, sense: 10 };
        abilityPoints += spent;
        showNotification(`Stat Reset Ticket used. ${spent} Ability Points refunded for reallocation.`);
      }

      return {
        ...prev,
        hp,
        fatigue,
        expBoostActive,
        abilityPoints,
        stats,
        streakShieldCount,
        inventory: updatedInventory,
      };
    });
  }, [showNotification]);

  // Equip Title
  const equipTitle = useCallback((titleName: string) => {
    setState((prev) => {
      sound.playClick();
      return {
        ...prev,
        activeTitle: titleName,
      };
    });
    showNotification(`Title equipped: [ ${titleName} ]`);
  }, [showNotification]);

  // Bonus Quests
  const updateBonusQuest = useCallback((id: string, delta: number) => {
    setState((prev) => {
      const list = prev.bonusQuests.map((bq) => {
        if (bq.id !== id || bq.completed) return bq;
        const currentVal = Math.min(bq.targetValue, bq.currentValue + delta);
        const completed = currentVal >= bq.targetValue;
        return {
          ...bq,
          currentValue: currentVal,
          completed,
        };
      });

      const targetQuest = list.find((q) => q.id === id);
      if (targetQuest && targetQuest.completed) {
        sound.playQuestComplete();
        const statReward = targetQuest.statReward;
        const exp = targetQuest.expReward;

        const updatedStats = {
          ...prev.stats,
          [statReward]: prev.stats[statReward] + 1,
        };

        const stateWithStats = {
          ...prev,
          bonusQuests: list,
          stats: updatedStats,
        };

        showNotification(`Bonus Quest completed! +1 ${statReward.toUpperCase()} and +${exp} EXP.`);
        return applyExpAndCheckLevel(exp, stateWithStats);
      }

      sound.playClick();
      return {
        ...prev,
        bonusQuests: list,
      };
    });
  }, [applyExpAndCheckLevel, showNotification]);

  // Emergency Quests
  const triggerEmergencyQuest = useCallback(() => {
    setState((prev) => {
      sound.playPenaltyWarning();
      return {
        ...prev,
        emergencyQuest: {
          id: 'emergency_plank',
          title: 'EMERGENCY QUEST: CORE FORTITUDE',
          description: 'Surprise Gate detected. Maintain a plank hold for 120 seconds.',
          active: true,
          expiresAt: Date.now() + 15 * 60 * 1000, // 15 mins
          targetSeconds: 120,
          currentSeconds: 0,
          rewardExp: 80,
        },
      };
    });
    showNotification('[ EMERGENCY QUEST DETECTED ] High-priority tactical exercise deployed.');
  }, [showNotification]);

  const updateEmergencyQuest = useCallback((seconds: number) => {
    setState((prev) => {
      if (!prev.emergencyQuest) return prev;
      return {
        ...prev,
        emergencyQuest: {
          ...prev.emergencyQuest,
          currentSeconds: Math.min(prev.emergencyQuest.targetSeconds, prev.emergencyQuest.currentSeconds + seconds),
        },
      };
    });
  }, []);

  const completeEmergencyQuest = useCallback(() => {
    setState((prev) => {
      if (!prev.emergencyQuest) return prev;
      sound.playQuestComplete();
      const exp = prev.emergencyQuest.rewardExp;
      const stateWithout = {
        ...prev,
        emergencyQuest: undefined,
      };
      showNotification(`Emergency Quest cleared! Earned +${exp} EXP.`);
      return applyExpAndCheckLevel(exp, stateWithout);
    });
  }, [applyExpAndCheckLevel, showNotification]);

  // Settings
  const updateSettings = useCallback((newSettings: Partial<SystemState['settings']>) => {
    setState((prev) => {
      const updated = {
        ...prev,
        settings: {
          ...prev.settings,
          ...newSettings,
        },
      };
      if (newSettings.soundEnabled !== undefined) sound.setSoundEnabled(newSettings.soundEnabled);
      if (newSettings.hapticEnabled !== undefined) sound.setHapticEnabled(newSettings.hapticEnabled);
      return updated;
    });
    showNotification('System settings updated.');
  }, [showNotification]);

  const updatePlayerName = useCallback((name: string) => {
    setState((prev) => ({
      ...prev,
      playerName: name.trim() || 'Sung',
    }));
    showNotification(`Player designation updated to: [ ${name.trim() || 'Sung'} ]`);
  }, [showNotification]);

  const resetProgress = useCallback(() => {
    const def = createDefaultState();
    setState(def);
    saveSystemState(def);
    showNotification('All Player data reset. System re-initialized.');
  }, [showNotification]);

  // Testing / Demo Helpers
  const addExp = useCallback((amount: number) => {
    setState((prev) => applyExpAndCheckLevel(amount, prev));
    showNotification(`Simulated combat outcome: +${amount} EXP.`);
  }, [applyExpAndCheckLevel, showNotification]);

  const triggerPenaltyTest = useCallback(() => {
    setState((prev) => {
      sound.playPenaltyWarning();
      return {
        ...prev,
        penaltyState: {
          isActive: true,
          reason: 'Daily Quest incomplete within designated 24-hour cycle.',
          startedAt: Date.now(),
          expiresAt: Date.now() + 4 * 60 * 60 * 1000,
          targetReps: { pushups: 20, situps: 20, squats: 20, runKm: 2 },
          progressReps: { pushups: 0, situps: 0, squats: 0, runKm: 0 },
        },
      };
    });
  }, []);

  const simulateNextDay = useCallback(() => {
    setState((prev) => {
      sound.playSystemDing();
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const tomorrowStr = `${tomorrow.getFullYear()}-${String(tomorrow.getMonth() + 1).padStart(2, '0')}-${String(tomorrow.getDate()).padStart(2, '0')}`;
      return {
        ...prev,
        dailyQuest: createDailyQuest(prev.rank, tomorrowStr),
        bonusQuests: createInitialBonusQuests(),
        fatigue: Math.max(0, prev.fatigue - 20),
      };
    });
    showNotification('Simulated 24-hour cycle progression: New Daily Quest generated.');
  }, [showNotification]);

  const chooseJob = useCallback((jobName: string) => {
    setState((prev) => {
      sound.playLevelUp();
      return {
        ...prev,
        job: jobName,
        settings: {
          ...prev.settings,
          themeAura: 'violet',
        },
      };
    });
    showNotification(`Job Change Accepted: [ ${jobName} ]. System resonance shifted to Monarch Violet.`);
  }, [showNotification]);

  return (
    <SystemContext.Provider
      value={{
        state,
        levelUpModal,
        rankUpModal,
        closeLevelUpModal,
        closeRankUpModal,
        notificationMessage,
        showNotification,
        closeNotification,
        onboardPlayer,
        spendAbilityPoint,
        updateDailyExercise,
        setDailyExercise,
        claimDailyQuest,
        updatePenaltyExercise,
        clearPenalty,
        startTrial,
        updateTrialExercise,
        completeTrial,
        cancelTrial,
        consumeInventoryItem,
        equipTitle,
        updateBonusQuest,
        triggerEmergencyQuest,
        updateEmergencyQuest,
        completeEmergencyQuest,
        updateSettings,
        updatePlayerName,
        resetProgress,
        addExp,
        triggerPenaltyTest,
        simulateNextDay,
        chooseJob,
      }}
    >
      {children}
    </SystemContext.Provider>
  );
}

export function useSystem() {
  const ctx = useContext(SystemContext);
  if (!ctx) throw new Error('useSystem must be used within SystemProvider');
  return ctx;
}
