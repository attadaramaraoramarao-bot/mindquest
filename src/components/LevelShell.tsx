import { useState, useCallback, ReactNode } from "react";
import HUD from "./HUD";
import Toast from "./Toast";
import { useSound } from "@/hooks/useSound";
import { useToast } from "@/hooks/useToast";
import { GameProgress } from "@/types";

export interface LevelShellProps {
  progress: GameProgress;
  levelName: string;
  levelIcon: ReactNode;
  onHome: () => void;
  children: ReactNode;
  hintsLeft?: number;
  onHint?: () => void;
}

export default function LevelShell({
  progress,
  levelName,
  levelIcon,
  onHome,
  children,
  hintsLeft,
  onHint,
}: LevelShellProps) {
  const { play, setMuted } = useSound();
  const { toast, showToast, dismissToast } = useToast();
  const [muted, setMutedState] = useState(false);

  const toggleMute = useCallback(() => {
    setMutedState((m) => {
      const next = !m;
      setMuted(next);
      return next;
    });
  }, [setMuted]);

  return (
    <div className="bg-fantasy min-h-screen relative overflow-hidden">
      <HUD
        score={progress.totalScore}
        coins={progress.totalCoins}
        muted={muted}
        onToggleMute={toggleMute}
        onHome={onHome}
        levelName={levelName}
        levelIcon={levelIcon}
        hintsLeft={hintsLeft}
        onHint={onHint}
      />
      <Toast toast={toast} onDismiss={dismissToast} />
      <div className="pt-20 pb-6 px-4 relative z-10">
        <div className="max-w-3xl mx-auto">{children}</div>
      </div>
    </div>
  );
}

export function useLevelHelpers() {
  const { play, setMuted } = useSound();
  const { toast, showToast, dismissToast } = useToast();
  return { play, setMuted, toast, showToast, dismissToast };
}
