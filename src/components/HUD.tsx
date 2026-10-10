import { useEffect, useState } from "react";
import { Coins, Trophy, Volume2, VolumeX, Home as HomeIcon } from "lucide-react";

interface HUDProps {
  score: number;
  coins: number;
  muted: boolean;
  onToggleMute: () => void;
  onHome: () => void;
  levelName: string;
  levelIcon?: React.ReactNode;
  hintsLeft?: number;
  onHint?: () => void;
}

export default function HUD({
  score,
  coins,
  muted,
  onToggleMute,
  onHome,
  levelName,
  levelIcon,
  hintsLeft,
  onHint,
}: HUDProps) {
  const [coinBump, setCoinBump] = useState(false);

  useEffect(() => {
    setCoinBump(true);
    const t = setTimeout(() => setCoinBump(false), 400);
    return () => clearTimeout(t);
  }, [coins]);

  return (
    <div className="fixed top-0 left-0 right-0 z-40 px-3 py-2 sm:px-5 sm:py-3">
      <div className="mx-auto max-w-4xl flex items-center justify-between gap-2 rounded-2xl bg-slate-900/70 backdrop-blur-md border border-white/10 px-3 py-2 sm:px-4 sm:py-3 shadow-lg">
        {/* Left: Home + Level name */}
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          <button
            onClick={onHome}
            className="btn-press flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-white/5 hover:bg-white/15 border border-white/10 text-slate-200 transition-colors"
            aria-label="Go to map"
          >
            <HomeIcon size={18} />
          </button>
          <div className="flex items-center gap-2 min-w-0">
            {levelIcon && (
              <span className="text-amber-400 flex-shrink-0">{levelIcon}</span>
            )}
            <span className="font-display text-sm sm:text-base font-bold text-white truncate">
              {levelName}
            </span>
          </div>
        </div>

        {/* Right: Score, coins, hint, mute */}
        <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
          {onHint && (
            <button
              onClick={onHint}
              disabled={hintsLeft === 0}
              className="btn-press flex items-center gap-1 rounded-xl px-2 sm:px-3 py-2 bg-amber-500/20 hover:bg-amber-500/30 border border-amber-400/30 text-amber-300 text-xs sm:text-sm font-semibold transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              aria-label="Use hint"
            >
              <span aria-hidden="true">?</span>
              <span className="hidden sm:inline">Hint</span>
              {hintsLeft !== undefined && (
                <span className="text-amber-400/70">({hintsLeft})</span>
              )}
            </button>
          )}
          <div className="flex items-center gap-1.5 rounded-xl bg-white/5 border border-white/10 px-2 sm:px-3 py-2">
            <Trophy size={16} className="text-yellow-400" />
            <span className="font-bold text-white text-sm sm:text-base tabular-nums">
              {score}
            </span>
          </div>
          <div
            className={`flex items-center gap-1.5 rounded-xl bg-white/5 border border-white/10 px-2 sm:px-3 py-2 ${
              coinBump ? "badge-bounce" : ""
            }`}
          >
            <Coins size={16} className="text-amber-400" />
            <span className="font-bold text-amber-300 text-sm sm:text-base tabular-nums">
              {coins}
            </span>
          </div>
          <button
            onClick={onToggleMute}
            className="btn-press flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-white/5 hover:bg-white/15 border border-white/10 text-slate-200 transition-colors"
            aria-label={muted ? "Unmute" : "Mute"}
          >
            {muted ? <VolumeX size={18} /> : <Volume2 size={18} />}
          </button>
        </div>
      </div>
    </div>
  );
}
