import { SystemState, ExerciseProgress, HunterRank, DailyQuest, PenaltyState, BonusQuest, EmergencyQuest } from './types';
import { RANK_CONFIG, INITIAL_ITEMS, ALL_TITLES, getExpNeeded } from './config';

const STORAGE_KEY = 'SOLO_LEVELING_SYSTEM_STATE_V1';

export function getTodayDateString(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

export function getTomorrowMidnightTimestamp(): number {
  const d = new Date();
  d.setHours(23, 59, 59, 999);
  return d.getTime();
}

export function createDailyQuest(rank: HunterRank, dateStr: string = getTodayDateString()): DailyQuest {
  const rankInfo = RANK_CONFIG[rank] || RANK_CONFIG.E;
  return {
    date: dateStr,
    targets: { ...rankInfo.dailyQuest },
    progress: {
      pushups: 0,
      situps: 0,
      squats: 0,
      pullups: 0,
      runKm: 0,
    },
    isCompleted: false,
    isClaimed: false,
    expiresAt: getTomorrowMidnightTimestamp(),
  };
}

export function createInitialBonusQuests(): BonusQuest[] {
  return [
    {
      id: 'water_hydration',
      title: 'Optimal Hydration',
      description: 'Drink 2.5 Liters of water to maintain cellular performance.',
      statReward: 'vitality',
      expReward: 25,
      completed: false,
      type: 'water',
      targetValue: 2500,
      currentValue: 0,
      unit: 'ml',
    },
    {
      id: 'meditation_focus',
      title: 'Mental Acuity & Sensory Calibration',
      description: 'Meditate or practice sensory breathing for 10 minutes.',
      statReward: 'sense',
      expReward: 30,
      completed: false,
      type: 'meditation',
      targetValue: 10,
      currentValue: 0,
      unit: 'min',
    },
    {
      id: 'intellect_study',
      title: 'Tactical Study & Skill Acquisition',
      description: 'Read or dedicate 30 minutes to focused intellectual growth.',
      statReward: 'intelligence',
      expReward: 35,
      completed: false,
      type: 'study',
      targetValue: 30,
      currentValue: 0,
      unit: 'min',
    },
  ];
}

export function createDefaultState(): SystemState {
  const today = getTodayDateString();
  return {
    onboarded: false,
    playerName: 'Sung',
    job: 'None',
    activeTitle: 'None',
    rank: 'E',
    level: 1,
    exp: 0,
    hp: 100,
    maxHp: 100,
    mp: 50,
    maxMp: 50,
    fatigue: 0,
    maxFatigue: 100,
    abilityPoints: 0,
    stats: {
      strength: 10,
      agility: 10,
      vitality: 10,
      intelligence: 10,
      sense: 10,
    },
    streak: 0,
    bestStreak: 0,
    lastActiveDate: today,
    dailyQuest: createDailyQuest('E', today),
    penaltyState: {
      isActive: false,
      reason: '',
      startedAt: 0,
      expiresAt: 0,
      targetReps: { pushups: 15, situps: 15, squats: 15, runKm: 1 },
      progressReps: { pushups: 0, situps: 0, squats: 0, runKm: 0 },
    },
    bonusQuests: createInitialBonusQuests(),
    inventory: [...INITIAL_ITEMS],
    titles: [...ALL_TITLES],
    settings: {
      soundEnabled: true,
      hapticEnabled: true,
      units: 'metric',
      themeAura: 'blue',
    },
    expBoostActive: false,
    streakShieldCount: 1,
  };
}

export function loadSystemState(): SystemState {
  if (typeof window === 'undefined') return createDefaultState();

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return createDefaultState();

    const parsed: SystemState = JSON.parse(raw);

    // Validate and check daily reset
    return processDailyTransition(parsed);
  } catch (err) {
    console.error('Failed to load system state', err);
    return createDefaultState();
  }
}

export function saveSystemState(state: SystemState): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (err) {
    console.error('Failed to save system state', err);
  }
}

export function processDailyTransition(state: SystemState): SystemState {
  const today = getTodayDateString();
  if (state.dailyQuest.date === today) {
    return state;
  }

  // A new day has dawned!
  const prevQuest = state.dailyQuest;
  const missedQuest = !prevQuest.isClaimed && !prevQuest.isCompleted;

  let newStreak = state.streak;
  let newPenaltyState = { ...state.penaltyState };
  let newShieldCount = state.streakShieldCount;

  if (missedQuest && state.onboarded) {
    // If player has a streak shield, consume it to negate penalty
    if (newShieldCount > 0) {
      newShieldCount -= 1;
      // Streak saved
    } else {
      // Trigger penalty zone!
      newStreak = 0;
      const rankInfo = RANK_CONFIG[state.rank] || RANK_CONFIG.E;
      newPenaltyState = {
        isActive: true,
        reason: 'Daily Quest incomplete within designated 24-hour cycle.',
        startedAt: Date.now(),
        expiresAt: Date.now() + 4 * 60 * 60 * 1000, // 4 hours
        targetReps: {
          pushups: Math.max(15, Math.round(rankInfo.dailyQuest.pushups * 0.5)),
          situps: Math.max(15, Math.round(rankInfo.dailyQuest.situps * 0.5)),
          squats: Math.max(15, Math.round(rankInfo.dailyQuest.squats * 0.5)),
          runKm: Math.max(1, Math.round(rankInfo.dailyQuest.runKm * 0.5)),
        },
        progressReps: { pushups: 0, situps: 0, squats: 0, runKm: 0 },
      };
    }
  }

  const newState: SystemState = {
    ...state,
    streak: newStreak,
    streakShieldCount: newShieldCount,
    dailyQuest: createDailyQuest(state.rank, today),
    penaltyState: newPenaltyState,
    bonusQuests: createInitialBonusQuests(),
    lastActiveDate: today,
    hp: missedQuest ? Math.max(20, state.hp - 40) : state.hp,
    fatigue: missedQuest ? Math.min(state.maxFatigue, state.fatigue + 35) : Math.max(0, state.fatigue - 20),
  };

  saveSystemState(newState);
  return newState;
}
