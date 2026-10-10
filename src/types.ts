export type ScreenName = "home" | "map" | "level" | "victory";

export type LevelId = 1 | 2 | 3 | 4 | 5;

export interface LevelMeta {
  id: LevelId;
  name: string;
  tagline: string;
  icon: string;
  color: string;
  glow: string;
}

export interface GameProgress {
  unlockedLevels: number;
  totalScore: number;
  totalCoins: number;
  levelStars: Record<number, number>;
  levelScores: Record<number, number>;
  hintsUsed: number;
}

export const LEVELS: LevelMeta[] = [
  {
    id: 1,
    name: "The Secret Door",
    tagline: "Decipher the clues to crack the code",
    icon: "door-closed",
    color: "from-amber-500 to-orange-600",
    glow: "rgba(251, 146, 60, 0.5)",
  },
  {
    id: 2,
    name: "Word Master",
    tagline: "Arrange the scrambled words",
    icon: "type",
    color: "from-sky-500 to-blue-600",
    glow: "rgba(56, 189, 248, 0.5)",
  },
  {
    id: 3,
    name: "Memory Challenge",
    tagline: "Watch closely, then repeat the sequence",
    icon: "brain",
    color: "from-emerald-500 to-teal-600",
    glow: "rgba(16, 185, 129, 0.5)",
  },
  {
    id: 4,
    name: "Mystery Forest",
    tagline: "Find hidden objects and solve the riddle",
    icon: "trees",
    color: "from-green-500 to-emerald-700",
    glow: "rgba(34, 197, 94, 0.5)",
  },
  {
    id: 5,
    name: "Time Challenge",
    tagline: "Beat the clock to solve the puzzle",
    icon: "timer",
    color: "from-rose-500 to-red-600",
    glow: "rgba(244, 63, 94, 0.5)",
  },
];

export const STORAGE_KEY = "mindquest-progress-v1";

export const DEFAULT_PROGRESS: GameProgress = {
  unlockedLevels: 1,
  totalScore: 0,
  totalCoins: 0,
  levelStars: {},
  levelScores: {},
  hintsUsed: 0,
};
