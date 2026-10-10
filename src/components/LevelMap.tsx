import {
  LEVELS,
  GameProgress,
  LevelId,
} from "@/types";
import { Lock, Star, ArrowLeft } from "lucide-react";
import Particles from "./Particles";

interface LevelMapProps {
  progress: GameProgress;
  onSelectLevel: (id: LevelId) => void;
  onHome: () => void;
}

const LEVEL_ICONS: Record<number, string> = {
  1: "🚪",
  2: "📝",
  3: "🧠",
  4: "🌲",
  5: "⏱️",
};

export default function LevelMap({
  progress,
  onSelectLevel,
  onHome,
}: LevelMapProps) {
  const allDone = Object.keys(progress.levelStars).length === 5;

  return (
    <div className="bg-nebula min-h-screen relative px-4 py-6 overflow-hidden">
      <Particles count={20} />

      <div className="relative z-10 max-w-3xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6 fade-in">
          <button
            onClick={onHome}
            className="btn-press flex items-center gap-2 rounded-xl bg-white/5 hover:bg-white/15 border border-white/10 text-slate-200 px-3 py-2 text-sm font-semibold transition-colors"
          >
            <ArrowLeft size={18} />
            Home
          </button>
          <div className="text-center">
            <h1 className="font-display text-2xl sm:text-3xl font-black text-white text-glow">
              Choose Your Quest
            </h1>
            <p className="text-slate-400 text-xs sm:text-sm">
              {allDone ? "All levels complete! Replay any quest." : "Complete a level to unlock the next"}
            </p>
          </div>
          <div className="w-[72px]" />
        </div>

        {/* Path with level cards */}
        <div className="flex flex-col gap-4 sm:gap-5">
          {LEVELS.map((level, index) => {
            const unlocked = level.id <= progress.unlockedLevels;
            const stars = progress.levelStars[level.id] ?? 0;
            const isLeft = index % 2 === 0;

            return (
              <div
                key={level.id}
                className={`flex ${isLeft ? "justify-start" : "justify-end"}`}
              >
                <div
                  className={`w-full max-w-md slide-up ${
                    isLeft ? "" : ""
                  }`}
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <button
                    onClick={() => unlocked && onSelectLevel(level.id)}
                    disabled={!unlocked}
                    className={`w-full group relative overflow-hidden rounded-2xl border p-5 text-left transition-all ${
                      unlocked
                        ? "bg-white/5 hover:bg-white/10 border-white/10 hover-lift cursor-pointer"
                        : "bg-white/5 border-white/5 cursor-not-allowed opacity-50"
                    }`}
                    style={
                      unlocked
                        ? { boxShadow: `0 0 25px ${level.glow}` }
                        : undefined
                    }
                  >
                    <div className="flex items-center gap-4">
                      {/* Level number / icon */}
                      <div
                        className={`w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br ${level.color} flex items-center justify-center text-2xl sm:text-3xl flex-shrink-0 ${
                          unlocked ? "card-glow" : ""
                        }`}
                      >
                        {unlocked ? LEVEL_ICONS[level.id] : <Lock size={24} className="text-white" />}
                      </div>

                      {/* Text */}
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 mb-0.5">
                          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                            Level {level.id}
                          </span>
                          {stars > 0 && (
                            <div className="flex gap-0.5">
                              {[1, 2, 3].map((s) => (
                                <Star
                                  key={s}
                                  size={12}
                                  className={
                                    s <= stars
                                      ? "text-amber-400 fill-amber-400"
                                      : "text-slate-600"
                                  }
                                />
                              ))}
                            </div>
                          )}
                        </div>
                        <h3 className="font-display text-lg sm:text-xl font-bold text-white truncate">
                          {level.name}
                        </h3>
                        <p className="text-slate-400 text-xs sm:text-sm truncate">
                          {level.tagline}
                        </p>
                      </div>
                    </div>

                    {/* Connection path */}
                    {index < LEVELS.length - 1 && (
                      <div
                        className={`absolute ${
                          isLeft ? "left-7 sm:left-8" : "right-7 sm:right-8"
                        } -bottom-4 w-0.5 h-4 bg-gradient-to-b from-white/20 to-transparent`}
                      />
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Victory badge */}
        {allDone && (
          <div className="mt-6 text-center pop-in">
            <div className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-400/30 px-6 py-3">
              <span className="text-2xl">🏆</span>
              <span className="font-display font-bold text-amber-300">
                Mind Master Achieved!
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
