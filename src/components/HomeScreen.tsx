import { useState } from "react";
import RobotMascot from "./RobotMascot";
import Particles from "./Particles";
import { Play, BookOpen, RotateCcw, Coins, Trophy, X, Lock } from "lucide-react";
import { LEVELS, GameProgress } from "@/types";

interface HomeScreenProps {
  progress: GameProgress;
  onPlay: () => void;
  onReset: () => void;
}

export default function HomeScreen({
  progress,
  onPlay,
  onReset,
}: HomeScreenProps) {
  const [showInstructions, setShowInstructions] = useState(false);
  const [showReset, setShowReset] = useState(false);

  return (
    <div className="bg-fantasy min-h-screen relative flex flex-col items-center justify-center px-4 py-8 overflow-hidden">
      <Particles count={35} />

      {/* Decorative floating islands */}
      <div className="absolute top-16 left-4 sm:left-12 opacity-20 island-float pointer-events-none">
        <div className="w-16 h-16 sm:w-24 sm:h-24 rounded-full bg-gradient-to-br from-sky-600 to-blue-800" />
      </div>
      <div className="absolute top-24 right-8 sm:right-20 opacity-20 island-float pointer-events-none" style={{ animationDelay: "1s" }}>
        <div className="w-12 h-12 sm:w-20 sm:h-20 rounded-full bg-gradient-to-br from-amber-600 to-orange-800" />
      </div>
      <div className="absolute bottom-32 left-8 sm:left-24 opacity-15 island-float pointer-events-none" style={{ animationDelay: "2s" }}>
        <div className="w-10 h-10 sm:w-16 sm:h-16 rounded-full bg-gradient-to-br from-emerald-600 to-teal-800" />
      </div>

      {/* Main content */}
      <div className="relative z-10 text-center max-w-2xl w-full">
        {/* Title */}
        <div className="mb-2 slide-up">
          <p className="text-amber-400 font-display text-sm sm:text-base tracking-[0.3em] uppercase mb-1">
            Think · Solve · Explore
          </p>
          <h1 className="font-display text-5xl sm:text-7xl font-black text-white text-glow leading-tight">
            Mind<span className="text-amber-400 text-glow-amber">Quest</span>
          </h1>
        </div>

        {/* Robot mascot */}
        <div className="my-4 slide-up" style={{ animationDelay: "0.1s" }}>
          <RobotMascot size={140} expression="happy" className="mx-auto" />
        </div>

        {/* Subtitle */}
        <p className="text-slate-300 text-sm sm:text-lg mb-6 slide-up" style={{ animationDelay: "0.15s" }}>
          An interactive puzzle adventure across five magical realms. Solve clues, crack codes, and beat the clock to become the ultimate Mind Master!
        </p>

        {/* Stats bar */}
        <div className="flex items-center justify-center gap-3 mb-6 slide-up" style={{ animationDelay: "0.2s" }}>
          <div className="flex items-center gap-2 rounded-2xl bg-white/5 border border-white/10 px-4 py-2">
            <Trophy size={18} className="text-yellow-400" />
            <span className="text-white font-bold tabular-nums">{progress.totalScore}</span>
            <span className="text-slate-400 text-xs">points</span>
          </div>
          <div className="flex items-center gap-2 rounded-2xl bg-white/5 border border-white/10 px-4 py-2">
            <Coins size={18} className="text-amber-400" />
            <span className="text-amber-300 font-bold tabular-nums">{progress.totalCoins}</span>
            <span className="text-slate-400 text-xs">coins</span>
          </div>
          <div className="flex items-center gap-2 rounded-2xl bg-white/5 border border-white/10 px-4 py-2">
            <Lock size={16} className="text-emerald-400" />
            <span className="text-white font-bold tabular-nums">
              {Object.keys(progress.levelStars).length}
            </span>
            <span className="text-slate-400 text-xs">/ 5 done</span>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex flex-col items-center gap-3 slide-up" style={{ animationDelay: "0.25s" }}>
          <button
            onClick={onPlay}
            className="btn-press w-full max-w-xs flex items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-white font-display font-bold text-xl py-4 px-8 transition-all shadow-lg shadow-amber-500/30 hover:shadow-amber-500/50"
          >
            <Play size={24} fill="white" />
            {progress.unlockedLevels > 1 ? "Continue" : "Play"}
          </button>

          <div className="flex gap-3 w-full max-w-xs">
            <button
              onClick={() => setShowInstructions(true)}
              className="btn-press flex-1 flex items-center justify-center gap-2 rounded-2xl bg-white/5 hover:bg-white/15 border border-white/10 text-slate-200 font-semibold py-3 transition-colors"
            >
              <BookOpen size={18} />
              How to Play
            </button>
            <button
              onClick={() => setShowReset(true)}
              className="btn-press flex-1 flex items-center justify-center gap-2 rounded-2xl bg-white/5 hover:bg-rose-500/20 border border-white/10 text-slate-200 hover:text-rose-300 font-semibold py-3 transition-colors"
            >
              <RotateCcw size={18} />
              Restart
            </button>
          </div>
        </div>

        {/* Level preview pills */}
        <div className="mt-8 flex flex-wrap justify-center gap-2 slide-up" style={{ animationDelay: "0.3s" }}>
          {LEVELS.map((level) => {
            const unlocked = level.id <= progress.unlockedLevels;
            const stars = progress.levelStars[level.id] ?? 0;
            return (
              <div
                key={level.id}
                className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold border transition-all ${
                  unlocked
                    ? "bg-white/10 border-white/20 text-white"
                    : "bg-white/5 border-white/5 text-slate-500"
                }`}
              >
                <span className={unlocked ? "text-amber-400" : "text-slate-600"}>
                  {unlocked ? "★".repeat(stars) || "○" : "🔒"}
                </span>
                {level.name}
              </div>
            );
          })}
        </div>
      </div>

      {/* Instructions modal */}
      {showInstructions && (
        <InstructionsModal onClose={() => setShowInstructions(false)} />
      )}

      {/* Reset confirmation */}
      {showReset && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4"
          onClick={() => setShowReset(false)}
        >
          <div
            className="pop-in w-full max-w-sm rounded-3xl bg-gradient-to-br from-slate-800 to-slate-900 border border-white/10 p-6 text-center shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-14 h-14 rounded-full bg-rose-500/20 border border-rose-400/30 flex items-center justify-center mx-auto mb-4">
              <RotateCcw size={26} className="text-rose-400" />
            </div>
            <h3 className="font-display text-xl font-bold text-white mb-2">Restart Game?</h3>
            <p className="text-slate-300 text-sm mb-6">
              This will erase all your progress, scores, and unlocked levels. This cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowReset(false)}
                className="btn-press flex-1 rounded-xl bg-white/5 hover:bg-white/15 border border-white/10 text-slate-200 font-semibold py-3 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  onReset();
                  setShowReset(false);
                }}
                className="btn-press flex-1 rounded-xl bg-gradient-to-r from-rose-500 to-red-500 hover:from-rose-400 hover:to-red-400 text-white font-bold py-3 transition-all shadow-lg shadow-rose-500/30"
              >
                Reset
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function InstructionsModal({ onClose }: { onClose: () => void }) {
  const steps = [
    { icon: "🚪", title: "The Secret Door", text: "Read the clues and figure out the hidden four-digit code." },
    { icon: "📝", title: "Word Master", text: "Arrange scrambled words into a meaningful sentence." },
    { icon: "🧠", title: "Memory Challenge", text: "Watch the sequence of glowing tiles, then repeat it back." },
    { icon: "🌲", title: "Mystery Forest", text: "Find hidden objects in the forest and solve the riddle." },
    { icon: "⏱️", title: "Time Challenge", text: "Solve math and logic puzzles before the timer runs out." },
  ];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4"
      onClick={onClose}
    >
      <div
        className="pop-in w-full max-w-lg rounded-3xl bg-gradient-to-br from-slate-800 to-slate-900 border border-white/10 p-6 sm:p-8 shadow-2xl max-h-[85vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display text-2xl font-black text-white">How to Play</h2>
          <button
            onClick={onClose}
            className="btn-press w-9 h-9 rounded-xl bg-white/5 hover:bg-white/15 border border-white/10 text-slate-300 flex items-center justify-center transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        <p className="text-slate-300 text-sm mb-5">
          Complete five puzzle levels to become a Mind Master. Each level tests different skills — logic, memory, observation, and speed.
        </p>

        <div className="space-y-3">
          {steps.map((step, i) => (
            <div
              key={i}
              className="flex items-start gap-3 rounded-2xl bg-white/5 border border-white/10 p-3 slide-up"
              style={{ animationDelay: `${i * 0.05}s` }}
            >
              <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-xl flex-shrink-0">
                {step.icon}
              </div>
              <div className="min-w-0">
                <h3 className="font-display font-bold text-white text-sm">
                  Level {i + 1}: {step.title}
                </h3>
                <p className="text-slate-400 text-xs mt-0.5">{step.text}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-5 rounded-2xl bg-amber-500/10 border border-amber-400/20 p-4">
          <h4 className="font-bold text-amber-300 text-sm mb-1">Tips</h4>
          <ul className="text-slate-300 text-xs space-y-1">
            <li>• Use the hint button if you get stuck — but hints cost points!</li>
            <li>• Earn stars (1–3) based on speed and accuracy per level.</li>
            <li>• Collect coins to track your adventure progress.</li>
            <li>• Your progress is saved automatically in your browser.</li>
          </ul>
        </div>

        <button
          onClick={onClose}
          className="btn-press w-full mt-5 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-white font-bold py-3 transition-all shadow-lg shadow-amber-500/30"
        >
          Got it!
        </button>
      </div>
    </div>
  );
}
