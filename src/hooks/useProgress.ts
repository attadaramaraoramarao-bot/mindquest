import { useCallback, useEffect, useState } from "react";
import {
  DEFAULT_PROGRESS,
  GameProgress,
  LevelId,
  STORAGE_KEY,
} from "@/types";

function loadProgress(): GameProgress {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { ...DEFAULT_PROGRESS };
    const parsed = JSON.parse(raw);
    return {
      ...DEFAULT_PROGRESS,
      ...parsed,
      levelStars: { ...parsed.levelStars },
      levelScores: { ...parsed.levelScores },
    };
  } catch {
    return { ...DEFAULT_PROGRESS };
  }
}

export function useProgress() {
  const [progress, setProgress] = useState<GameProgress>(loadProgress);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
    } catch {
      /* ignore */
    }
  }, [progress]);

  const completeLevel = useCallback(
    (
      levelId: LevelId,
      earnedScore: number,
      earnedCoins: number,
      stars: number
    ) => {
      setProgress((prev) => {
        const prevStars = prev.levelStars[levelId] ?? 0;
        const prevScore = prev.levelScores[levelId] ?? 0;
        return {
          ...prev,
          unlockedLevels: Math.max(prev.unlockedLevels, Math.min(levelId + 1, 5) as number),
          totalScore: prev.totalScore - prevScore + earnedScore,
          totalCoins: prev.totalCoins + earnedCoins,
          levelStars: {
            ...prev.levelStars,
            [levelId]: Math.max(prevStars, stars),
          },
          levelScores: {
            ...prev.levelScores,
            [levelId]: Math.max(prevScore, earnedScore),
          },
        };
      });
    },
    []
  );

  const addCoins = useCallback((amount: number) => {
    setProgress((prev) => ({ ...prev, totalCoins: prev.totalCoins + amount }));
  }, []);

  const incrementHintsUsed = useCallback(() => {
    setProgress((prev) => ({ ...prev, hintsUsed: prev.hintsUsed + 1 }));
  }, []);

  const resetProgress = useCallback(() => {
    setProgress({ ...DEFAULT_PROGRESS, levelStars: {}, levelScores: {} });
  }, []);

  return {
    progress,
    completeLevel,
    addCoins,
    incrementHintsUsed,
    resetProgress,
  };
}
