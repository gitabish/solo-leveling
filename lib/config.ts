import { ExerciseProgress, HunterRank, InventoryItem, Title } from './types';

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
    dailyQuest: {
      pushups: 30,
      situps: 30,
      squats: 30,
      pullups: 10,
      runKm: 2,
    },
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
    dailyQuest: {
      pushups: 60,
      situps: 60,
      squats: 60,
      pullups: 20,
      runKm: 4,
    },
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
    dailyQuest: {
      pushups: 100,
      situps: 100,
      squats: 100,
      pullups: 30,
      runKm: 6,
    },
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
    dailyQuest: {
      pushups: 100,
      situps: 100,
      squats: 100,
      pullups: 40,
      runKm: 10,
    },
    expBonus: 120,
  },
  A: {
    rank: 'A',
    name: 'A-Rank Hunter',
    minLevel: 71,
    maxLevel: 99,
    color: '#FF7A3D',
    badgeBorder: '#FF9564',
    bgGlow: 'rgba(255, 122, 61, 0.45)',
    dailyQuest: {
      pushups: 150,
      situps: 150,
      squats: 150,
      pullups: 50,
      runKm: 10,
    },
    expBonus: 200,
  },
  S: {
    rank: 'S',
    name: 'S-Rank Monarch',
    minLevel: 100,
    maxLevel: 999,
    color: '#FFC857',
    badgeBorder: '#FFE08A',
    bgGlow: 'rgba(255, 200, 87, 0.55)',
    dailyQuest: {
      pushups: 200,
      situps: 200,
      squats: 200,
      pullups: 60,
      runKm: 10,
    },
    expBonus: 350,
  },
};

export const TRIALS_CONFIG: TrialConfig[] = [
  {
    fromRank: 'E',
    toRank: 'D',
    title: 'Trial of the Awakened',
    minLevel: 10,
    description: 'Prove you have surpassed the limits of ordinary mankind. Single day rep requirement.',
    targets: {
      pushups: 60,
      pullups: 60,
      squats: 60,
      situps: 60,
      runKm: 0,
    },
  },
  {
    fromRank: 'D',
    toRank: 'C',
    title: 'Trial of Steel Endurance',
    minLevel: 25,
    description: 'Break into the intermediate ranks. Heavy compound volume and cardiovascular stamina.',
    targets: {
      pushups: 100,
      pullups: 80,
      squats: 100,
      situps: 100,
      runKm: 3,
    },
  },
  {
    fromRank: 'C',
    toRank: 'B',
    title: 'Trial of High-Tier Assault',
    minLevel: 45,
    description: 'B-Rank hunters withstand battlefield-grade exertion. Extreme calisthenic test.',
    targets: {
      pushups: 150,
      pullups: 100,
      squats: 150,
      situps: 150,
      runKm: 5,
    },
  },
  {
    fromRank: 'B',
    toRank: 'A',
    title: 'Trial of the Monarch Candidate',
    minLevel: 70,
    description: 'A-Rank represents the pinnacle of human capacity. Colossal physical output.',
    targets: {
      pushups: 200,
      pullups: 120,
      squats: 200,
      situps: 200,
      runKm: 10,
    },
  },
  {
    fromRank: 'A',
    toRank: 'S',
    title: 'Trial of Supreme Re-Awakening',
    minLevel: 99,
    description: 'The S-Rank trial is transcending mortal boundaries. The mark of a true Sovereign.',
    targets: {
      pushups: 300,
      pullups: 150,
      squats: 300,
      situps: 300,
      runKm: 10,
    },
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

export const ALL_TITLES: Title[] = [
  {
    id: 'wolf_slayer',
    name: 'Wolf Slayer',
    description: 'Achieve a continuous 7-day Daily Quest streak.',
    unlocked: false,
    effect: '+5% Strength performance boost',
  },
  {
    id: 'overcame_adversity',
    name: 'The One Who Overcame Adversity',
    description: 'Survive and clear a Penalty Zone quest.',
    unlocked: false,
    effect: 'Fatigue accumulation reduced by 10%',
  },
  {
    id: 'iron_will',
    name: 'Iron Will',
    description: 'Achieve a formidable 30-day streak.',
    unlocked: false,
    effect: '+10% EXP on all completed quests',
  },
  {
    id: 'monarch_candidate',
    name: 'Monarch Candidate',
    description: 'Reach Rank A through rigorous trials.',
    unlocked: false,
    effect: 'Unlock aura customization & +10 All Stats',
  },
  {
    id: 'shadow_sovereign',
    name: 'Shadow Sovereign',
    description: 'Ascend to Rank S and command the shadows.',
    unlocked: false,
    effect: 'Supreme monarch status and permanent golden aura',
  },
];

export function getExpNeeded(level: number): number {
  return 100 + (level - 1) * 40;
}

export function calculatePower(stats: { strength: number; agility: number; vitality: number; intelligence: number; sense: number }): number {
  return stats.strength * 3 + stats.agility * 2.5 + stats.vitality * 2.5 + stats.intelligence * 2 + stats.sense * 2;
}
