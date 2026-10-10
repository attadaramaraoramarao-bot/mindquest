import { useState, useCallback, useEffect, useRef } from "react";
import { Timer, Sparkles, Play, Zap } from "lucide-react";
import LevelCompleteOverlay from "../LevelCompleteOverlay";
import LevelShell, { useLevelHelpers } from "../LevelShell";
import { GameProgress, LevelId } from "@/types";
import { fireConfetti } from "@/utils/confetti";

interface Level5Props {
  progress: GameProgress;
  onHome: () => void;
  onComplete: (levelId: LevelId, score: number, coins: number, stars: number) => void;
  onNext: () => void;
}

interface Puzzle {
  question: string;
  answer: string;
  options?: string[];
  hint: string;
}

const PUZZLES: Puzzle[] = [
  {
    question: "What is 15 + 27 × 2?",
    answer: "69",
    hint: "Remember: multiplication comes before addition. So 27 × 2 = 54, then add 15.",
  },
  {
    question: "If a clock shows 3:15, what is the angle between the hour and minute hands?",
    answer: "7.5",
    options: ["0", "7.5", "15", "22.5"],
    hint: "The minute hand is at 90 degrees. The hour hand moves 0.5 degrees per minute past 3 o'clock.",
  },
  {
    question: "What number comes next: 2, 6, 12, 20, 30, ?",
    answer: "42",
    hint: "The differences are 4, 6, 8, 10, 12 — increasing by 2 each time.",
  },
  {
    question: "I am an odd number. Remove my first letter and I become even. What number am I?",
    answer: "seven",
    hint: "Write the number as a word. Remove the first letter of that word.",
  },
  {
    question: "What is the value of: (8 × 7) - (6 × 9) + 10?",
    answer: "8",
    hint: "56 - 54 + 10. Do the math step by step.",
  },
];

const TIME_PER_PUZZLE = 20;
const TOTAL_PUZZLES = 5;

export default function Level5({ progress, onHome, onComplete, onNext }: Level5Props) {
  const { play, showToast } = useLevelHelpers();
  const [puzzleIndex, setPuzzleIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState("");
  const [timeLeft, setTimeLeft] = useState(TIME_PER_PUZZLE);
  const [phase, setPhase] = useState<"idle" | "playing" | "done">("idle");
  const [correctCount, setCorrectCount] = useState(0);
  const [wrongAttempts, setWrongAttempts] = useState(0);
  const [hintsLeft, setHintsLeft] = useState(3);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [showComplete, setShowComplete] = useState(false);
  const [feedback, setFeedback] = useState<"none" | "correct" | "wrong">("none");
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const puzzle = PUZZLES[puzzleIndex];

  // Timer
  useEffect(() => {
    if (phase !== "playing") return;
    if (timeLeft <= 0) {
      // Time's up for this puzzle - move to next or end
      handleTimeout();
      return;
    }
    if (timeLeft <= 5 && timeLeft > 0) {
      play("tick");
    }
    intervalRef.current = setInterval(() => {
      setTimeLeft((t) => t - 1);
    }, 1000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [phase, timeLeft, play]);

  const handleTimeout = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    showToast("error", "Time's up! Moving to next puzzle.");
    play("error");
    setFeedback("wrong");
    setTimeout(() => {
      moveToNext(false);
    }, 1000);
  }, [showToast, play]);

  const moveToNext = useCallback(
    (wasCorrect: boolean) => {
      const newCorrect = wasCorrect ? correctCount + 1 : correctCount;
      if (!wasCorrect) setCorrectCount(newCorrect);

      if (puzzleIndex >= TOTAL_PUZZLES - 1) {
        // Game over
        setPhase("done");
        if (intervalRef.current) clearInterval(intervalRef.current);
        const finalCorrect = wasCorrect ? newCorrect : correctCount;
        play("levelComplete");
        fireConfetti();
        const baseScore = 100;
        const penalty = (TOTAL_PUZZLES - finalCorrect) * 15 + hintsUsed * 10 + wrongAttempts * 5;
        const earnedScore = Math.max(30, baseScore - penalty);
        const earnedCoins = Math.max(10, 25 - hintsUsed * 5);
        const stars = finalCorrect >= 5 && hintsUsed === 0 ? 3 : finalCorrect >= 3 ? 2 : 1;
        onComplete(5, earnedScore, earnedCoins, stars);
        setTimeout(() => setShowComplete(true), 800);
      } else {
        setPuzzleIndex((i) => i + 1);
        setUserAnswer("");
        setTimeLeft(TIME_PER_PUZZLE);
        setFeedback("none");
      }
    },
    [puzzleIndex, correctCount, hintsUsed, wrongAttempts, play, onComplete]
  );

  const handleSubmit = useCallback(() => {
    if (!userAnswer.trim()) {
      showToast("error", "Enter an answer!");
      return;
    }
    const normalized = userAnswer.trim().toLowerCase();
    const correct = puzzle.answer.toLowerCase();
    if (normalized === correct) {
      setFeedback("correct");
      setCorrectCount((c) => c + 1);
      play("success");
      showToast("success", "Correct!");
      if (intervalRef.current) clearInterval(intervalRef.current);
      setTimeout(() => moveToNext(true), 800);
    } else {
      setWrongAttempts((w) => w + 1);
      setFeedback("wrong");
      play("error");
      showToast("error", "Not quite! Try again or use a hint.");
      setUserAnswer("");
      setTimeout(() => setFeedback("none"), 500);
    }
  }, [userAnswer, puzzle, play, showToast, moveToNext]);

  const handleOptionClick = useCallback(
    (option: string) => {
      setUserAnswer(option);
      const correct = puzzle.answer.toLowerCase();
      if (option.toLowerCase() === correct) {
        setFeedback("correct");
        setCorrectCount((c) => c + 1);
        play("success");
        showToast("success", "Correct!");
        if (intervalRef.current) clearInterval(intervalRef.current);
        setTimeout(() => moveToNext(true), 800);
      } else {
        setWrongAttempts((w) => w + 1);
        setFeedback("wrong");
        play("error");
        showToast("error", "Wrong choice!");
        setTimeout(() => setFeedback("none"), 500);
      }
    },
    [puzzle, play, showToast, moveToNext]
  );

  const handleHint = useCallback(() => {
    if (hintsLeft === 0 || phase !== "playing") return;
    showToast("info", `Hint: ${puzzle.hint}`);
    setHintsLeft((h) => h - 1);
    setHintsUsed((h) => h + 1);
    play("hint");
  }, [hintsLeft, phase, puzzle, showToast, play]);

  const startGame = useCallback(() => {
    setPhase("playing");
    setPuzzleIndex(0);
    setUserAnswer("");
    setTimeLeft(TIME_PER_PUZZLE);
    setCorrectCount(0);
    setWrongAttempts(0);
    setFeedback("none");
    play("click");
  }, [play]);

  const earnedScore = Math.max(
    30,
    100 -
      (TOTAL_PUZZLES - (correctCount + (feedback === "correct" ? 1 : 0))) * 15 -
      hintsUsed * 10 -
      wrongAttempts * 5
  );
  const earnedCoins = Math.max(10, 25 - hintsUsed * 5);
  const finalCorrectCount = correctCount;
  const finalStars = finalCorrectCount >= 5 && hintsUsed === 0 ? 3 : finalCorrectCount >= 3 ? 2 : 1;

  const timePercent = (timeLeft / TIME_PER_PUZZLE) * 100;

  return (
    <LevelShell
      progress={progress}
      levelName="Time Challenge"
      levelIcon={<Timer size={16} />}
      onHome={onHome}
      hintsLeft={hintsLeft}
      onHint={handleHint}
    >
      <div className="fade-in">
        {/* Story */}
        <div className="rounded-2xl bg-slate-800/60 border border-white/10 p-5 mb-5 card-glow">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-rose-500/20 border border-rose-400/30 flex items-center justify-center flex-shrink-0">
              <Zap size={20} className="text-rose-400" />
            </div>
            <div>
              <h2 className="font-display text-xl font-bold text-white mb-1">
                The Final Trial
              </h2>
              <p className="text-slate-300 text-sm">
                The last guardian challenges you to a battle of wits against
                time. Solve five math and logic puzzles before the countdown
                reaches zero on each. Think fast!
              </p>
            </div>
          </div>
        </div>

        {phase === "idle" && (
          <div className="text-center py-10">
            <div className="float-anim mb-4">
              <Timer size={64} className="text-rose-400 mx-auto" />
            </div>
            <p className="text-slate-300 text-sm mb-1">
              You'll have <span className="text-rose-400 font-bold">{TIME_PER_PUZZLE} seconds</span> per puzzle
            </p>
            <p className="text-slate-400 text-xs mb-6">
              {TOTAL_PUZZLES} puzzles · Math, logic & riddles
            </p>
            <button
              onClick={startGame}
              className="btn-press inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-rose-500 to-red-600 hover:from-rose-400 hover:to-red-500 text-white font-bold px-10 py-4 text-lg transition-all shadow-lg shadow-rose-500/30"
            >
              <Play size={22} fill="white" />
              Begin Challenge
            </button>
          </div>
        )}

        {phase === "playing" && (
          <div className="pop-in">
            {/* Timer bar */}
            <div className="mb-4">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-slate-400 text-xs font-semibold">
                  Puzzle {puzzleIndex + 1} of {TOTAL_PUZZLES}
                </span>
                <span
                  className={`font-display font-black text-2xl tabular-nums ${
                    timeLeft <= 5
                      ? "text-rose-400 countdown-pulse"
                      : timeLeft <= 10
                      ? "text-amber-400"
                      : "text-white"
                  }`}
                >
                  {timeLeft}s
                </span>
              </div>
              <div className="h-2 rounded-full bg-white/10 overflow-hidden">
                <div
                  className={`timer-bar h-full rounded-full ${
                    timeLeft <= 5
                      ? "bg-gradient-to-r from-rose-500 to-red-500"
                      : timeLeft <= 10
                      ? "bg-gradient-to-r from-amber-500 to-orange-500"
                      : "bg-gradient-to-r from-emerald-500 to-teal-500"
                  }`}
                  style={{ width: `${timePercent}%` }}
                />
              </div>
            </div>

            {/* Progress dots */}
            <div className="flex justify-center gap-2 mb-4">
              {Array.from({ length: TOTAL_PUZZLES }).map((_, i) => (
                <div
                  key={i}
                  className={`w-2.5 h-2.5 rounded-full transition-all ${
                    i < puzzleIndex
                      ? "bg-emerald-400"
                      : i === puzzleIndex
                      ? "bg-rose-400 scale-125"
                      : "bg-white/15"
                  }`}
                />
              ))}
            </div>

            {/* Puzzle card */}
            <div
              className={`rounded-2xl bg-slate-800/60 border p-6 mb-4 text-center transition-all ${
                feedback === "correct"
                  ? "border-emerald-400/50 bg-emerald-500/10"
                  : feedback === "wrong"
                  ? "border-rose-500/50 bg-rose-500/10 shake-anim"
                  : "border-white/10"
              }`}
            >
              <div className="flex items-center justify-center gap-2 mb-3">
                <Sparkles size={18} className="text-rose-400" />
                <span className="text-rose-400 text-xs font-bold uppercase tracking-wider">
                  Solve this!
                </span>
              </div>
              <p className="font-display text-xl sm:text-2xl font-bold text-white mb-4">
                {puzzle.question}
              </p>

              {puzzle.options ? (
                <div className="grid grid-cols-2 gap-2">
                  {puzzle.options.map((opt) => (
                    <button
                      key={opt}
                      onClick={() => handleOptionClick(opt)}
                      className="btn-press rounded-xl bg-white/5 hover:bg-white/15 border border-white/15 text-white font-bold py-3 transition-colors"
                    >
                      {opt}°
                    </button>
                  ))}
                </div>
              ) : (
                <div className="flex gap-2 max-w-xs mx-auto">
                  <input
                    type="text"
                    value={userAnswer}
                    onChange={(e) => setUserAnswer(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                    placeholder="Your answer..."
                    className={`flex-1 text-center rounded-xl border-2 bg-slate-900/50 text-white font-bold text-lg py-3 px-4 focus:outline-none transition-all ${
                      feedback === "wrong"
                        ? "border-rose-500/60"
                        : "border-white/15 focus:border-rose-400/50"
                    }`}
                  />
                  <button
                    onClick={handleSubmit}
                    className="btn-press rounded-xl bg-gradient-to-r from-rose-500 to-red-600 text-white font-bold px-6 transition-all"
                  >
                    Go
                  </button>
                </div>
              )}
            </div>

            {/* Stats */}
            <div className="flex items-center justify-center gap-4 text-sm">
              <span className="text-emerald-400 font-semibold">
                ✓ {correctCount} correct
              </span>
              <span className="text-slate-500">|</span>
              <span className="text-rose-400 font-semibold">
                ✗ {wrongAttempts} wrong
              </span>
            </div>
          </div>
        )}

        {phase === "done" && (
          <div className="text-center py-8 pop-in">
            <div className="text-5xl mb-3">⚡</div>
            <h3 className="font-display text-2xl font-black text-white mb-2">
              Challenge Complete!
            </h3>
            <p className="text-slate-300 text-sm">
              You solved <span className="text-emerald-400 font-bold">{correctCount}</span> out of {TOTAL_PUZZLES} puzzles correctly!
            </p>
          </div>
        )}
      </div>

      <LevelCompleteOverlay
        open={showComplete}
        stars={finalStars}
        earnedScore={earnedScore}
        earnedCoins={earnedCoins}
        message={`You conquered the Time Challenge with ${finalCorrectCount}/${TOTAL_PUZZLES} correct! You are a true Mind Master!`}
        hasNext={false}
        onNext={onHome}
        onHome={onHome}
      />
    </LevelShell>
  );
}
