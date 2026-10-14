import { ExerciseProgress, HunterRank, InventoryItem, Title } from './types';
import { expToNext, TITLES_LIST, dailyQuestFor } from '@/src/config/progression';

export interface RankInfo {
  rank: HunterRank;
  name: string;
  minLevel: number;
  maxLevel: number;
  color: string;
  badgeBorder: string;
  bgGlow: string;
  dailyQuest: ExerciseProgress;
  expBonus: number;
}

export interface TrialConfig {
  fromRank: HunterRank;
  toRank: HunterRank;
  title: string;
  minLevel: number;
  description: string;
  targets: ExerciseProgress;
  timeLimitMinutes?: number;
}

export const RANK_CONFIG: Record<HunterRank, RankInfo> = {
  E: {
    rank: 'E',
    name: 'E-Rank Hunter',
    minLevel: 1,
    maxLevel: 10,
    color: '#6C8CA8',
    badgeBorder: '#84A7C7',
    bgGlow: 'rgba(108, 140, 168, 0.4)',
    dailyQuest: dailyQuestFor(1),
    expBonus: 0,
  },
  D: {
    rank: 'D',
    name: 'D-Rank Hunter',
    minLevel: 11,
    maxLevel: 25,
    color: '#3DE0C0',
    badgeBorder: '#4DF5D2',
    bgGlow: 'rgba(61, 224, 192, 0.4)',
    dailyQuest: dailyQuestFor(11),
    expBonus: 25,
  },
  C: {
    rank: 'C',
    name: 'C-Rank Hunter',
    minLevel: 26,
    maxLevel: 45,
    color: '#3FA9FF',
    badgeBorder: '#5EC0FF',
    bgGlow: 'rgba(63, 169, 255, 0.4)',
    dailyQuest: dailyQuestFor(26),
    expBonus: 60,
  },
  B: {
    rank: 'B',
    name: 'B-Rank Hunter',
    minLevel: 46,
    maxLevel: 70,
    color: '#8B5CFF',
    badgeBorder: '#AA82FF',
    bgGlow: 'rgba(139, 92, 255, 0.45)',
    dailyQuest: dailyQuestFor(46),
    expBonus: 120,
  },
  A: {
    rank: 'A',
    name: 'A-Rank Hunter',
    minLevel: 71,
    maxLevel: 98,
    color: '#FF7A3D',
    badgeBorder: '#FF9564',
    bgGlow: 'rgba(255, 122, 61, 0.45)',
    dailyQuest: dailyQuestFor(71),
    expBonus: 200,
  },
  S: {
    rank: 'S',
    name: 'S-Rank Monarch',
    minLevel: 99,
    maxLevel: 999,
    color: '#FFC857',
    badgeBorder: '#FFE08A',
    bgGlow: 'rgba(255, 200, 87, 0.55)',
    dailyQuest: dailyQuestFor(99),
    expBonus: 350,
  },
};

export const TRIALS_CONFIG: TrialConfig[] = [
  {
    fromRank: 'E',
    toRank: 'D',
    title: 'Trial of the Awakened (E → D)',
    minLevel: 10,
    description: 'Surpass ordinary human limits. Single day total reps requirement.',
    targets: {
      pushups: 60,
      pullups: 25,
      squats: 60,
      situps: 60,
      runKm: 0,
    },
  },
  {
    fromRank: 'D',
    toRank: 'C',
    title: 'Trial of Steel Endurance (D → C)',
    minLevel: 25,
    description: 'Break into the intermediate ranks. Heavy compound volume and cardiovascular stamina.',
    targets: {
      pushups: 100,
      pullups: 40,
      squats: 100,
      situps: 100,
      runKm: 3,
    },
  },
  {
    fromRank: 'C',
    toRank: 'B',
    title: 'Trial of High-Tier Assault (C → B)',
    minLevel: 45,
    description: 'B-Rank hunters withstand battlefield-grade exertion. Extreme calisthenic test.',
    targets: {
      pushups: 150,
      pullups: 55,
      squats: 150,
      situps: 150,
      runKm: 5,
    },
  },
  {
    fromRank: 'B',
    toRank: 'A',
    title: 'Trial of the Monarch Candidate (B → A)',
    minLevel: 70,
    description: 'A-Rank represents the pinnacle of human capacity. Colossal physical output.',
    targets: {
      pushups: 200,
      pullups: 70,
      squats: 200,
      situps: 200,
      runKm: 10,
    },
  },
  {
    fromRank: 'A',
    toRank: 'S',
    title: 'Trial of Supreme Re-Awakening (A → S)',
    minLevel: 98,
    description: 'The S-Rank trial is transcending mortal boundaries. Complete 10km run under 60 minutes.',
    targets: {
      pushups: 300,
      pullups: 100,
      squats: 300,
      situps: 300,
      runKm: 10,
    },
    timeLimitMinutes: 60,
  },
];

export const INITIAL_ITEMS: InventoryItem[] = [
  {
    id: 'potion_recovery',
    name: 'Potion of Recovery',
    description: 'Clear all Fatigue immediately and restores full HP.',
    rarity: 'rare',
    quantity: 1,
    icon: 'FlaskConical',
    effectType: 'fatigue_recovery',
  },
  {
    id: 'streak_shield',
    name: 'Streak Shield',
    description: 'Protects player streak and wards off a missed day penalty once.',
    rarity: 'epic',
    quantity: 1,
    icon: 'Shield',
    effectType: 'streak_shield',
  },
];

// Convert all titles from progression.ts
export const ALL_TITLES: Title[] = TITLES_LIST.map((t) => ({
  id: t.id,
  name: t.name,
  rarity: t.rarity,
  description: t.canonNote,
  canonNote: t.canonNote,
  bonusPct: t.bonusPct,
  effect: `+${t.bonusPct}% Daily Quest EXP`,
  unlocked: t.id === 'player', // 'Player' is starting title given at onboarding
}));

export function getExpNeeded(level: number): number {
  return expToNext(level);
}

export function calculatePower(stats: {
  strength: number;
  agility: number;
  vitality: number;
  intelligence: number;
  sense: number;
}): number {
  return (
    stats.strength * 3 +
    stats.agility * 2.5 +
    stats.vitality * 2.5 +
    stats.intelligence * 2 +
    stats.sense * 2
  );
}
