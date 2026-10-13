export type HunterRank = 'E' | 'D' | 'C' | 'B' | 'A' | 'S';

export interface PlayerStats {
  strength: number;
  agility: number;
  vitality: number;
  intelligence: number;
  sense: number;
}

export interface InventoryItem {
  id: string;
  name: string;
  description: string;
  rarity: 'normal' | 'rare' | 'epic' | 'legendary';
  quantity: number;
  icon: string;
  effectType: 'fatigue_recovery' | 'exp_boost' | 'streak_shield' | 'stat_reset' | 'hp_recovery';
}

export interface Title {
  id: string;
  name: string;
  description: string;
  unlocked: boolean;
  effect: string;
}

export interface ExerciseProgress {
  pushups: number;
  situps: number;
  squats: number;
  pullups: number;
  runKm: number;
}

export interface DailyQuest {
  date: string; // YYYY-MM-DD
  targets: ExerciseProgress;
  progress: ExerciseProgress;
  isCompleted: boolean;
  isClaimed: boolean;
  expiresAt: number; // timestamp
}

export interface PenaltyState {
  isActive: boolean;
  reason: string;
  startedAt: number;
  expiresAt: number; // 4 hour survival window
  targetReps: {
    pushups: number;
    situps: number;
    squats: number;
    runKm: number;
  };
  progressReps: {
    pushups: number;
    situps: number;
    squats: number;
    runKm: number;
  };
}

export interface TrialState {
  targetRank: HunterRank;
  inProgress: boolean;
  startedAt?: number;
  progress: ExerciseProgress;
  cooldownUntil?: number; // timestamp if failed
}

export interface BonusQuest {
  id: string;
  title: string;
  description: string;
  statReward: 'intelligence' | 'sense' | 'vitality';
  expReward: number;
  completed: boolean;
  type: 'water' | 'meditation' | 'study' | 'sleep';
  targetValue: number;
  currentValue: number;
  unit: string;
}

export interface EmergencyQuest {
  id: string;
  title: string;
  description: string;
  active: boolean;
  expiresAt: number;
  targetSeconds: number; // e.g. 120s plank
  currentSeconds: number;
  rewardExp: number;
}

export interface SystemState {
  onboarded: boolean;
  playerName: string;
  job: string;
  activeTitle: string;
  rank: HunterRank;
  level: number;
  exp: number;
  hp: number;
  maxHp: number;
  mp: number;
  maxMp: number;
  fatigue: number;
  maxFatigue: number;
  abilityPoints: number;
  stats: PlayerStats;
  streak: number;
  bestStreak: number;
  lastActiveDate: string;
  dailyQuest: DailyQuest;
  penaltyState: PenaltyState;
  activeTrial?: TrialState;
  bonusQuests: BonusQuest[];
  emergencyQuest?: EmergencyQuest;
  inventory: InventoryItem[];
  titles: Title[];
  settings: {
    soundEnabled: boolean;
    hapticEnabled: boolean;
    units: 'metric' | 'imperial';
    themeAura: 'blue' | 'violet' | 'gold';
  };
  expBoostActive: boolean;
  streakShieldCount: number;
}
