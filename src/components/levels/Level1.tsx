import { useState, useCallback } from "react";
import { Lock, DoorOpen, Sparkles } from "lucide-react";
import LevelCompleteOverlay from "../LevelCompleteOverlay";
import LevelShell, { useLevelHelpers } from "../LevelShell";
import { GameProgress, LevelId } from "@/types";
import { fireConfetti } from "@/utils/confetti";

interface Level1Props {
  progress: GameProgress;
  onHome: () => void;
  onComplete: (
    levelId: LevelId,
    score: number,
    coins: number,
    stars: number
  ) => void;
  onNext: () => void;
}

const CLUES = [
  "The first digit is the number of sides on a triangle.",
  "The second digit is the number of planets in our solar system minus one.",
  "The third digit is half of ten.",
  "The fourth digit is the only even prime number.",
];

const CORRECT_CODE = "3752";

const HINTS = [
  "A triangle has 3 sides — that's your first digit.",
  "There are 8 planets. 8 minus 1 = 7 for the second digit.",
  "Ten divided by two equals 5 — your third digit.",
  "The only even prime is 2 — the last digit.",
];

export default function Level1({
  progress,
  onHome,
  onComplete,
  onNext,
}: Level1Props) {
  const { play, showToast } = useLevelHelpers();
  const [digits, setDigits] = useState(["", "", "", ""]);
  const [attempts, setAttempts] = useState(0);
  const [error, setError] = useState(false);
  const [hintIndex, setHintIndex] = useState(0);
  const [hintsLeft, setHintsLeft] = useState(3);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [showComplete, setShowComplete] = useState(false);
  const [solved, setSolved] = useState(false);

  const handleDigitChange = (index: number, value: string) => {
    const v = value.replace(/\D/g, "").slice(-1);
    const next = [...digits];
    next[index] = v;
    setDigits(next);
    setError(false);
    if (v && index < 3) {
      const el = document.getElementById(`digit-${index + 1}`);
      el?.focus();
    }
    play("click");
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !digits[index] && index > 0) {
      const el = document.getElementById(`digit-${index - 1}`);
      el?.focus();
    }
  };

  const handleHint = useCallback(() => {
    if (hintsLeft === 0) return;
    const hint = HINTS[hintIndex % HINTS.length];
    showToast("info", `Hint: ${hint}`);
    setHintIndex((i) => i + 1);
    setHintsLeft((h) => h - 1);
    setHintsUsed((h) => h + 1);
    play("hint");
  }, [hintsLeft, hintIndex, showToast, play]);

  const handleSubmit = useCallback(() => {
    const code = digits.join("");
    if (code.length < 4) {
      showToast("error", "Enter all four digits!");
      setError(true);
      play("error");
      return;
    }
    if (code === CORRECT_CODE) {
      setSolved(true);
      play("levelComplete");
      fireConfetti();
      const baseScore = 100;
      const penalty = attempts * 15 + hintsUsed * 10;
      const earnedScore = Math.max(40, baseScore - penalty);
      const earnedCoins = Math.max(10, 30 - hintsUsed * 5);
      const stars =
        attempts === 0 && hintsUsed === 0
          ? 3
          : attempts <= 1 && hintsUsed <= 1
          ? 2
          : 1;
      onComplete(1, earnedScore, earnedCoins, stars);
      setTimeout(() => setShowComplete(true), 800);
    } else {
      setAttempts((a) => a + 1);
      setError(true);
      play("error");
      showToast("error", `Wrong code! That was attempt ${attempts + 1}.`);
      setDigits(["", "", "", ""]);
      setTimeout(() => {
        const el = document.getElementById("digit-0");
        el?.focus();
      }, 300);
    }
  }, [digits, attempts, hintsUsed, showToast, play, onComplete]);

  const earnedScore = Math.max(40, 100 - attempts * 15 - hintsUsed * 10);
  const earnedCoins = Math.max(10, 30 - hintsUsed * 5);
  const finalStars =
    attempts === 0 && hintsUsed === 0 ? 3 : attempts <= 1 && hintsUsed <= 1 ? 2 : 1;

  return (
    <LevelShell
      progress={progress}
      levelName="The Secret Door"
      levelIcon={<Lock size={16} />}
      onHome={onHome}
      hintsLeft={hintsLeft}
      onHint={handleHint}
    >
      <div className="fade-in">
        {/* Story card */}
        <div className="rounded-2xl bg-slate-800/60 border border-white/10 p-5 mb-5 card-glow">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-400/30 flex items-center justify-center flex-shrink-0">
              <Sparkles size={20} className="text-amber-400" />
            </div>
            <div>
              <h2 className="font-display text-xl font-bold text-white mb-1">
                The Ancient Door
              </h2>
              <p className="text-slate-300 text-sm">
                A mysterious door stands before you, sealed with a four-digit
                lock. Study the ancient clues etched into the stone and enter
                the correct code to pass through.
              </p>
            </div>
          </div>
        </div>

        {/* Clues */}
        <div className="grid gap-3 sm:grid-cols-2 mb-5">
          {CLUES.map((clue, i) => (
            <div
              key={i}
              className="rounded-xl bg-white/5 border border-white/10 p-4 slide-up"
              style={{ animationDelay: `${i * 0.08}s` }}
            >
              <div className="flex items-center gap-2 mb-1">
                <span className="w-6 h-6 rounded-lg bg-amber-500/20 border border-amber-400/30 flex items-center justify-center text-amber-400 text-xs font-bold">
                  {i + 1}
                </span>
                <span className="text-amber-300 text-xs font-semibold uppercase tracking-wide">
                  Clue {i + 1}
                </span>
              </div>
              <p className="text-slate-200 text-sm">{clue}</p>
            </div>
          ))}
        </div>

        {/* Door + keypad */}
        <div className="rounded-2xl bg-slate-800/60 border border-white/10 p-6 text-center">
          <div
            className={`mx-auto w-40 h-48 rounded-t-full rounded-b-lg border-4 mb-6 transition-all duration-500 ${
              solved
                ? "border-emerald-400 bg-gradient-to-b from-emerald-500/30 to-emerald-700/20"
                : "border-amber-500/40 bg-gradient-to-b from-amber-900/30 to-stone-800/40 glow-door"
            }`}
          >
            {solved ? (
              <div className="flex flex-col items-center justify-center h-full gap-2">
                <DoorOpen size={48} className="text-emerald-400" />
                <span className="text-emerald-300 font-display font-bold text-sm">
                  OPEN!
                </span>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full gap-3">
                <Lock size={40} className="text-amber-400" />
                <div className="text-amber-300 font-display text-xs">SEALED</div>
              </div>
            )}
          </div>

          <div
            className={`flex justify-center gap-3 mb-4 ${
              error ? "shake-anim" : ""
            }`}
          >
            {digits.map((d, i) => (
              <input
                key={i}
                id={`digit-${i}`}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={d}
                onChange={(e) => handleDigitChange(i, e.target.value)}
                onKeyDown={(e) => handleKeyDown(i, e)}
                disabled={solved}
                className={`w-14 h-16 sm:w-16 sm:h-20 text-center text-2xl sm:text-3xl font-black rounded-xl border-2 bg-slate-900/50 text-white transition-all focus:outline-none ${
                  error
                    ? "border-rose-500/60 bg-rose-500/10"
                    : d
                    ? "border-amber-400/60 bg-amber-400/10"
                    : "border-white/15 focus:border-amber-400/50"
                }`}
                aria-label={`Digit ${i + 1}`}
              />
            ))}
          </div>

          {!solved && (
            <button
              onClick={handleSubmit}
              className="btn-press rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-white font-bold px-8 py-3 transition-all shadow-lg shadow-amber-500/30"
            >
              Enter Code
            </button>
          )}

          {attempts > 0 && !solved && (
            <p className="text-rose-400 text-xs mt-3">
              Attempts: {attempts}
              {attempts >= 2 && " — Try using a hint!"}
            </p>
          )}
        </div>
      </div>

      <LevelCompleteOverlay
        open={showComplete}
        stars={finalStars}
        earnedScore={earnedScore}
        earnedCoins={earnedCoins}
        message="The ancient door swings open! Your logic prevails."
        hasNext={true}
        onNext={onNext}
        onHome={onHome}
      />
    </LevelShell>
  );
}
