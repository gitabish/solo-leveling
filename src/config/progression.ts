// Pure functions and data tables for Solo Leveling Quest Progression (Level 1 to Rank S), Jobs & Titles
import { HunterRank, ExerciseProgress } from '@/lib/types';

export type TitleRarity = 'Common' | 'Rare' | 'Epic' | 'Legendary';

export interface TitleDefinition {
  id: string;
  name: string;
  rarity: TitleRarity;
  unlock: {
    type: 'quests' | 'streak' | 'penalty' | 'rank' | 'job' | 'onboarding';
    value: number | string;
  };
  canonNote: string;
  bonusPct: number; // e.g. 0, 2, 4, 6
}

export interface RankBand {
  rank: HunterRank;
  minLevel: number;
  maxLevel: number;
  capLevel: number | null;
  trialKey: string | null;
  targetRank: HunterRank | null;
  badgeColor: string;
}

export interface PromotionTrial {
  key: string;
  fromRank: HunterRank;
  toRank: HunterRank;
  title: string;
  unlockLevel: number;
  description: string;
  targets: {
    pushups: number;
    pullups: number;
    squats: number;
    situps: number;
    runKm: number;
  };
  timeLimitMinutes?: number;
}

// 1. Rank bands and level caps
export const RANK_BANDS: Record<HunterRank, RankBand> = {
  E: { rank: 'E', minLevel: 1, maxLevel: 10, capLevel: 10, trialKey: 'E->D', targetRank: 'D', badgeColor: '#6C8CA8' },
  D: { rank: 'D', minLevel: 11, maxLevel: 25, capLevel: 25, trialKey: 'D->C', targetRank: 'C', badgeColor: '#3DE0C0' },
  C: { rank: 'C', minLevel: 26, maxLevel: 45, capLevel: 45, trialKey: 'C->B', targetRank: 'B', badgeColor: '#3FA9FF' },
  B: { rank: 'B', minLevel: 46, maxLevel: 70, capLevel: 70, trialKey: 'B->A', targetRank: 'A', badgeColor: '#8B5CFF' },
  A: { rank: 'A', minLevel: 71, maxLevel: 98, capLevel: 98, trialKey: 'A->S', targetRank: 'S', badgeColor: '#FF7A3D' },
  S: { rank: 'S', minLevel: 99, maxLevel: 9999, capLevel: null, trialKey: null, targetRank: null, badgeColor: '#FFC857' },
};

// 2. Daily Quest rep progression formulas
const r1 = (x: number) => Math.round(x * 10) / 10;

export const runFor = (L: number): number => {
  if (L <= 25) {
    return r1(1 + 0.1 * Math.floor((L - 1) / 2));
  }
  return Math.min(10, r1(2.2 + 0.12 * (L - 25)));
};

export const dailyQuestFor = (L: number): ExerciseProgress => ({
  pushups: Math.min(300, 10 + 2 * (L - 1)),
  situps: Math.min(300, 10 + 2 * (L - 1)),
  squats: Math.min(300, 10 + 2 * (L - 1)),
  pullups: Math.min(80, 10 + Math.floor((L - 1) / 2)),
  runKm: runFor(L),
});

export const formatRunDistance = (km: number): string => {
  if (km % 1 === 0) return `${km}km`;
  return `${km.toFixed(1)}km`;
};

// 2.4 Rank promotion trials
export const PROMOTION_TRIALS: Record<string, PromotionTrial> = {
  'E->D': {
    key: 'E->D',
    fromRank: 'E',
    toRank: 'D',
    title: 'Trial of the Awakened (E → D)',
    unlockLevel: 10,
    description: 'Surpass ordinary human limits. Single day total reps.',
    targets: { pushups: 60, pullups: 25, squats: 60, situps: 60, runKm: 0 },
  },
  'D->C': {
    key: 'D->C',
    fromRank: 'D',
    toRank: 'C',
    title: 'Trial of Steel Endurance (D → C)',
    unlockLevel: 25,
    description: 'Break into the intermediate ranks. Heavy compound volume and cardiovascular stamina.',
    targets: { pushups: 100, pullups: 40, squats: 100, situps: 100, runKm: 3 },
  },
  'C->B': {
    key: 'C->B',
    fromRank: 'C',
    toRank: 'B',
    title: 'Trial of High-Tier Assault (C → B)',
    unlockLevel: 45,
    description: 'B-Rank hunters withstand battlefield-grade exertion. Extreme calisthenic test.',
    targets: { pushups: 150, pullups: 55, squats: 150, situps: 150, runKm: 5 },
  },
  'B->A': {
    key: 'B->A',
    fromRank: 'B',
    toRank: 'A',
    title: 'Trial of the Monarch Candidate (B → A)',
    unlockLevel: 70,
    description: 'A-Rank represents the pinnacle of human capacity. Colossal physical output.',
    targets: { pushups: 200, pullups: 70, squats: 200, situps: 200, runKm: 10 },
  },
  'A->S': {
    key: 'A->S',
    fromRank: 'A',
    toRank: 'S',
    title: 'Trial of Supreme Re-Awakening (A → S)',
    unlockLevel: 98,
    description: 'The S-Rank trial is transcending mortal boundaries. Complete 10km run in under 60 minutes.',
    targets: { pushups: 300, pullups: 100, squats: 300, situps: 300, runKm: 10 },
    timeLimitMinutes: 60,
  },
};

// 2.5 Penalty Zone numbers
export const penaltyQuestFor = (L: number) => {
  const dq = dailyQuestFor(L);
  return {
    pushups: Math.ceil(dq.pushups * 0.5),
    situps: Math.ceil(dq.situps * 0.5),
    squats: Math.ceil(dq.squats * 0.5),
    runKm: Math.max(1, Math.round(dq.runKm * 0.5 * 10) / 10),
  };
};

// 3. Pacing
export const expToNext = (L: number): number => 200 + 4 * (L - 1);

export const dailyQuestExp = (streakDays: number): number =>
  100 + Math.min(50, 10 * Math.floor(streakDays / 7));

export const BONUS_QUEST_EXP = 20;
export const MISSED_DAY_EXP_PENALTY = 100;

// 4. Jobs
export interface JobInfo {
  title: string;
  minLevel: number;
  stage: 'start' | 'job_change' | 'peak';
  skills: string[];
}

export const JOBS: Record<string, JobInfo> = {
  None: {
    title: 'None',
    minLevel: 1,
    stage: 'start',
    skills: [],
  },
  Necromancer: {
    title: 'Necromancer',
    minLevel: 40,
    stage: 'job_change',
    skills: ['Shadow Extraction', 'Shadow Preservation', 'Shadow Exchange'],
  },
  'Shadow Monarch': {
    title: 'Shadow Monarch',
    minLevel: 99,
    stage: 'peak',
    skills: ['Shadow Extraction', 'Shadow Preservation', 'Shadow Exchange', "Monarch's Domain"],
  },
};

export const JOB_CHANGE_CONFIG = {
  unlockLevel: 40,
  title: 'Job Change Quest: Continuous Survival',
  targetPoints: 15,
  roundDurationSeconds: 120, // 2 minutes
  roundTargets: {
    pushups: 10,
    squats: 10,
    situps: 10,
  },
};

// 5. Titles Data Table
export const TITLES_LIST: TitleDefinition[] = [
  // 5.3 Onboarding
  {
    id: 'player',
    name: 'Player',
    rarity: 'Common',
    unlock: { type: 'onboarding', value: 'accepted' },
    canonNote: 'Jinwoo is a Player first, a human second',
    bonusPct: 0,
  },
  // 5.1 Titles by Daily Quest completions
  {
    id: 'weakest_hunter',
    name: "World's Weakest Hunter",
    rarity: 'Common',
    unlock: { type: 'quests', value: 1 },
    canonNote: 'Canon alias of Jinwoo at the start',
    bonusPct: 0,
  },
  {
    id: 'wolf_assassin',
    name: 'Wolf Assassin',
    rarity: 'Rare',
    unlock: { type: 'quests', value: 10 },
    canonNote: 'Anime name (manhwa: "Wolf Slayer"): all stats +40% vs beast monsters',
    bonusPct: 2,
  },
  {
    id: 'dungeon_regular',
    name: 'Dungeon Regular',
    rarity: 'Common',
    unlock: { type: 'quests', value: 25 },
    canonNote: 'Original to the app',
    bonusPct: 0,
  },
  {
    id: 'gate_clearer',
    name: 'Gate Clearer',
    rarity: 'Rare',
    unlock: { type: 'quests', value: 50 },
    canonNote: 'Original to the app',
    bonusPct: 2,
  },
  {
    id: 'demon_slayer',
    name: 'Demon Slayer',
    rarity: 'Epic',
    unlock: { type: 'quests', value: 100 },
    canonNote: 'Canon: earned by defeating Demon King Baran',
    bonusPct: 4,
  },
  {
    id: 'king_of_the_dead',
    name: 'King of the Dead',
    rarity: 'Epic',
    unlock: { type: 'quests', value: 200 },
    canonNote: 'Canon alias of the Shadow Monarch',
    bonusPct: 4,
  },
  {
    id: 'worlds_strongest',
    name: "World's Strongest Hunter",
    rarity: 'Legendary',
    unlock: { type: 'quests', value: 365 },
    canonNote: 'Canon alias',
    bonusPct: 6,
  },
  {
    id: 'national_level',
    name: 'National Level Hunter',
    rarity: 'Legendary',
    unlock: { type: 'quests', value: 500 },
    canonNote: 'Canon unofficial tier above S-Rank',
    bonusPct: 6,
  },
  // 5.2 Titles by streak
  {
    id: 'persistent_hunter',
    name: 'Persistent Hunter',
    rarity: 'Common',
    unlock: { type: 'streak', value: 7 },
    canonNote: 'Original to the app',
    bonusPct: 0,
  },
  {
    id: 'iron_will',
    name: 'Iron Will',
    rarity: 'Rare',
    unlock: { type: 'streak', value: 30 },
    canonNote: 'Original to the app',
    bonusPct: 2,
  },
  {
    id: 'unbreakable',
    name: 'Unbreakable',
    rarity: 'Epic',
    unlock: { type: 'streak', value: 100 },
    canonNote: 'Original to the app',
    bonusPct: 4,
  },
  {
    id: 'monarchs_resolve',
    name: "Monarch's Resolve",
    rarity: 'Legendary',
    unlock: { type: 'streak', value: 365 },
    canonNote: 'Original to the app',
    bonusPct: 6,
  },
  // 5.3 Special quests and promotions
  {
    id: 'overcame_adversity',
    name: 'The One Who Overcame Adversity',
    rarity: 'Rare',
    unlock: { type: 'penalty', value: 1 },
    canonNote: 'Canon: stats +1% for every 1% of missing health',
    bonusPct: 2,
  },
  {
    id: 'd_rank_hunter',
    name: 'D-Rank Hunter',
    rarity: 'Common',
    unlock: { type: 'rank', value: 'D' },
    canonNote: 'Rank title',
    bonusPct: 0,
  },
  {
    id: 'c_rank_hunter',
    name: 'C-Rank Hunter',
    rarity: 'Rare',
    unlock: { type: 'rank', value: 'C' },
    canonNote: 'Rank title',
    bonusPct: 2,
  },
  {
    id: 'monarch_of_shadows',
    name: 'Monarch of Shadows',
    rarity: 'Epic',
    unlock: { type: 'job', value: 'Necromancer' },
    canonNote: 'Canon: given in the Job Change arc after Igris',
    bonusPct: 4,
  },
  {
    id: 'b_rank_hunter',
    name: 'B-Rank Hunter',
    rarity: 'Rare',
    unlock: { type: 'rank', value: 'B' },
    canonNote: 'Rank title',
    bonusPct: 2,
  },
  {
    id: 'a_rank_hunter',
    name: 'A-Rank Hunter',
    rarity: 'Epic',
    unlock: { type: 'rank', value: 'A' },
    canonNote: 'Rank title',
    bonusPct: 4,
  },
  {
    id: 's_rank_hunter',
    name: 'S-Rank Hunter',
    rarity: 'Legendary',
    unlock: { type: 'rank', value: 'S' },
    canonNote: 'Rank title, and peak of the Necromancer class',
    bonusPct: 6,
  },
];

// Helper to calculate total EXP granted by daily quest considering equipped title bonus
export const calculateQuestExpWithBonus = (
  streak: number,
  equippedTitleName: string
): { baseExp: number; bonusExp: number; totalExp: number } => {
  const baseExp = dailyQuestExp(streak);
  const found = TITLES_LIST.find((t) => t.name === equippedTitleName);
  const bonusPct = found ? found.bonusPct : 0;
  const bonusExp = Math.round(baseExp * (bonusPct / 100));
  return {
    baseExp,
    bonusExp,
    totalExp: baseExp + bonusExp,
  };
};

export function getTitleUnlockHint(def: TitleDefinition): string {
  switch (def.unlock.type) {
    case 'onboarding':
      return 'Accept the System during initial awakening';
    case 'quests':
      return `Complete ${def.unlock.value} Daily Quests in total`;
    case 'streak':
      return `Maintain a continuous ${def.unlock.value}-day streak`;
    case 'penalty':
      return 'Survive and clear your first Penalty Zone quest';
    case 'job':
      return 'Complete the Job Change Quest (unlocks at Level 40)';
    case 'rank':
      return `Pass the promotion trial and awaken to Rank ${def.unlock.value}`;
    default:
      return 'Unknown condition';
  }
}

export function checkTitleUnlocks(state: {
  totalQuestsCompleted: number;
  streak: number;
  penaltyQuestsCleared: number;
  rank: HunterRank;
  job: string;
  onboarded: boolean;
  unlockedTitleIds: Set<string>;
}): TitleDefinition[] {
  const newUnlocks: TitleDefinition[] = [];
  const ranks: HunterRank[] = ['E', 'D', 'C', 'B', 'A', 'S'];

  for (const def of TITLES_LIST) {
    if (state.unlockedTitleIds.has(def.id)) continue;
    let unlocked = false;

    switch (def.unlock.type) {
      case 'onboarding':
        unlocked = state.onboarded;
        break;
      case 'quests':
        unlocked = state.totalQuestsCompleted >= (def.unlock.value as number);
        break;
      case 'streak':
        unlocked = state.streak >= (def.unlock.value as number);
        break;
      case 'penalty':
        unlocked = state.penaltyQuestsCleared >= (def.unlock.value as number);
        break;
      case 'job':
        unlocked =
          state.job === def.unlock.value ||
          (def.unlock.value === 'Necromancer' &&
            (state.job === 'Necromancer' || state.job === 'Shadow Monarch'));
        break;
      case 'rank': {
        const currentRankIdx = ranks.indexOf(state.rank);
        const targetRankIdx = ranks.indexOf(def.unlock.value as HunterRank);
        unlocked = currentRankIdx >= targetRankIdx;
        break;
      }
    }

    if (unlocked) {
      newUnlocks.push(def);
    }
  }

  return newUnlocks;
}
