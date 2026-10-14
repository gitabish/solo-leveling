import { SystemState, DailyQuest, PenaltyState, BonusQuest, HunterRank } from './types';
import { INITIAL_ITEMS, ALL_TITLES } from './config';
import { dailyQuestFor, penaltyQuestFor, TITLES_LIST, RANK_BANDS } from '@/src/config/progression';

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

export function createDailyQuest(
  levelOrRank: number | HunterRank = 1,
  dateStr: string = getTodayDateString()
): DailyQuest {
  const level =
    typeof levelOrRank === 'number'
      ? Number.isFinite(levelOrRank) && levelOrRank > 0
        ? levelOrRank
        : 1
      : RANK_BANDS[levelOrRank]?.minLevel || 1;
  const targets = dailyQuestFor(level);
  return {
    date: dateStr,
    targets,
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
      expReward: 20, // Section 3: Bonus quests give +20 EXP each
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
      expReward: 20,
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
      expReward: 20,
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
    activeTitle: 'Player',
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
    totalQuestsCompleted: 0,
    penaltyQuestsCleared: 0,
    lastActiveDate: today,
    dailyQuest: createDailyQuest(1, today),
    penaltyState: {
      isActive: false,
      reason: '',
      startedAt: 0,
      expiresAt: 0,
      targetReps: penaltyQuestFor(1),
      progressReps: { pushups: 0, situps: 0, squats: 0, runKm: 0 },
    },
    bonusQuests: createInitialBonusQuests(),
    inventory: [...INITIAL_ITEMS],
    titles: ALL_TITLES.map((t) => ({ ...t })),
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

    // Merge titles and ensure all 16 titles exist
    const existingTitleMap = new Map((parsed.titles || []).map((t) => [t.id, t]));
    const mergedTitles = ALL_TITLES.map((baseTitle) => {
      const existing = existingTitleMap.get(baseTitle.id);
      return {
        ...baseTitle,
        unlocked: existing?.unlocked ?? baseTitle.unlocked,
        unlockedAt: existing?.unlockedAt,
      };
    });

    const totalQuests = parsed.totalQuestsCompleted ?? 0;
    const penaltyCleared = parsed.penaltyQuestsCleared ?? 0;

    // Retroactively unlock any titles earned by existing stats
    mergedTitles.forEach((t) => {
      const def = TITLES_LIST.find((d) => d.id === t.id);
      if (!def) return;
      if (t.unlocked) return;

      if (def.unlock.type === 'onboarding' && parsed.onboarded) {
        t.unlocked = true;
      } else if (def.unlock.type === 'quests' && totalQuests >= (def.unlock.value as number)) {
        t.unlocked = true;
      } else if (def.unlock.type === 'streak' && parsed.streak >= (def.unlock.value as number)) {
        t.unlocked = true;
      } else if (def.unlock.type === 'penalty' && penaltyCleared >= (def.unlock.value as number)) {
        t.unlocked = true;
      } else if (def.unlock.type === 'job' && (parsed.job === def.unlock.value || (def.unlock.value === 'Necromancer' && (parsed.job === 'Necromancer' || parsed.job === 'Shadow Monarch')))) {
        t.unlocked = true;
      } else if (def.unlock.type === 'rank') {
        const ranks = ['E', 'D', 'C', 'B', 'A', 'S'];
        if (ranks.indexOf(parsed.rank) >= ranks.indexOf(def.unlock.value as string)) {
          t.unlocked = true;
        }
      }
    });

    const hydrated: SystemState = {
      ...parsed,
      totalQuestsCompleted: totalQuests,
      penaltyQuestsCleared: penaltyCleared,
      titles: mergedTitles,
      activeTitle: parsed.activeTitle && parsed.activeTitle !== 'None' ? parsed.activeTitle : 'Player',
    };

    // Validate and check daily reset
    return processDailyTransition(hydrated);
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
  let newExp = state.exp;

  if (missedQuest && state.onboarded) {
    // If player has a streak shield, consume it to negate penalty
    if (newShieldCount > 0) {
      newShieldCount -= 1;
      // Streak saved
    } else {
      // Trigger penalty zone!
      newStreak = 0;
      // Missing a day costs 100 EXP; never drops below start of current level (exp = 0)
      newExp = Math.max(0, state.exp - 100);
      const penaltyTargets = penaltyQuestFor(state.level);
      newPenaltyState = {
        isActive: true,
        reason: 'Daily Quest incomplete within designated 24-hour cycle.',
        startedAt: Date.now(),
        expiresAt: Date.now() + 4 * 60 * 60 * 1000, // 4 hours
        targetReps: penaltyTargets,
        progressReps: { pushups: 0, situps: 0, squats: 0, runKm: 0 },
      };
    }
  }

  const newState: SystemState = {
    ...state,
    streak: newStreak,
    exp: newExp,
    streakShieldCount: newShieldCount,
    // Recalculate daily quest numbers from the new formulas starting the next day
    dailyQuest: createDailyQuest(state.level, today),
    penaltyState: newPenaltyState,
    bonusQuests: createInitialBonusQuests(),
    lastActiveDate: today,
    hp: missedQuest ? Math.max(20, state.hp - 40) : state.hp,
    fatigue: missedQuest ? Math.min(state.maxFatigue, state.fatigue + 35) : Math.max(0, state.fatigue - 20),
  };

  saveSystemState(newState);
  return newState;
}
