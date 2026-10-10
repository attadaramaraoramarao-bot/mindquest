import { useEffect, useState } from "react";
import StarRating from "./StarRating";
import RobotMascot from "./RobotMascot";
import { Coins, ArrowRight, Home as HomeIcon } from "lucide-react";

interface LevelCompleteOverlayProps {
  open: boolean;
  stars: number;
  earnedScore: number;
  earnedCoins: number;
  message: string;
  hasNext: boolean;
  onNext: () => void;
  onHome: () => void;
}

export default function LevelCompleteOverlay({
  open,
  stars,
  earnedScore,
  earnedCoins,
  message,
  hasNext,
  onNext,
  onHome,
}: LevelCompleteOverlayProps) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (open) {
      setShow(false);
      const t = setTimeout(() => setShow(true), 100);
      return () => clearTimeout(t);
    }
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
      <div
        className={`relative w-full max-w-md rounded-3xl bg-gradient-to-br from-slate-800 to-slate-900 border border-white/10 p-6 sm:p-8 text-center shadow-2xl ${
          show ? "pop-in" : "opacity-0"
        }`}
      >
        {/* Sparkles */}
        <div className="absolute -top-3 -left-3 text-amber-400 sparkle text-2xl">
          ✦
        </div>
        <div className="absolute -top-2 right-8 text-sky-400 sparkle text-xl" style={{ animationDelay: "0.3s" }}>
          ✦
        </div>
        <div className="absolute -bottom-2 -right-3 text-emerald-400 sparkle text-2xl" style={{ animationDelay: "0.6s" }}>
          ✦
        </div>

        <RobotMascot size={80} expression="excited" className="mx-auto mb-2" />

        <h2 className="font-display text-2xl sm:text-3xl font-black text-white mb-1 text-glow">
          Level Complete!
        </h2>
        <p className="text-slate-300 text-sm sm:text-base mb-4">{message}</p>

        <StarRating count={stars} size={36} />

        <div className="flex items-center justify-center gap-4 mt-5 mb-6">
          <div className="flex items-center gap-2 rounded-2xl bg-white/5 border border-white/10 px-4 py-2">
            <span className="text-yellow-400 font-bold text-lg tabular-nums">+{earnedScore}</span>
            <span className="text-xs text-slate-400">pts</span>
          </div>
          <div className="flex items-center gap-2 rounded-2xl bg-white/5 border border-white/10 px-4 py-2">
            <Coins size={18} className="text-amber-400" />
            <span className="text-amber-300 font-bold text-lg tabular-nums">+{earnedCoins}</span>
            <span className="text-xs text-slate-400">coins</span>
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={onHome}
            className="btn-press flex-1 flex items-center justify-center gap-2 rounded-xl bg-white/5 hover:bg-white/15 border border-white/10 text-slate-200 font-semibold py-3 transition-colors"
          >
            <HomeIcon size={18} />
            Map
          </button>
          {hasNext ? (
            <button
              onClick={onNext}
              className="btn-press flex-1 flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white font-bold py-3 transition-all shadow-lg shadow-emerald-500/30"
            >
              Next Level
              <ArrowRight size={18} />
            </button>
          ) : (
            <button
              onClick={onHome}
              className="btn-press flex-1 flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-white font-bold py-3 transition-all shadow-lg shadow-amber-500/30"
            >
              Finish
              <ArrowRight size={18} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
