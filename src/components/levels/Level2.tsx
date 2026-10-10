import { useState, useCallback, useEffect } from "react";
import { Type, Sparkles, RefreshCw } from "lucide-react";
import LevelCompleteOverlay from "../LevelCompleteOverlay";
import LevelShell, { useLevelHelpers } from "../LevelShell";
import { GameProgress, LevelId } from "@/types";
import { fireConfetti } from "@/utils/confetti";

interface Level2Props {
  progress: GameProgress;
  onHome: () => void;
  onComplete: (levelId: LevelId, score: number, coins: number, stars: number) => void;
  onNext: () => void;
}

interface SentencePuzzle {
  words: string[];
  answer: string;
  hint: string;
}

const PUZZLES: SentencePuzzle[] = [
  {
    words: ["ocean", "the", "vast", "is", "blue", "and"],
    answer: "the ocean is vast and blue",
    hint: "Start with the article 'the', then describe the ocean.",
  },
  {
    words: ["stars", "night", "shine", "the", "bright", "at"],
    answer: "the stars shine bright at night",
    hint: "Begin with 'the', then the subject, verb, and when.",
  },
  {
    words: ["never", "should", "you", "adventure", "give", "up", "on"],
    answer: "you should never give up on adventure",
    hint: "Start with 'you', then a modal verb, then 'never'...",
  },
];

export default function Level2({ progress, onHome, onComplete, onNext }: Level2Props) {
  const { play, showToast } = useLevelHelpers();
  const [puzzleIndex, setPuzzleIndex] = useState(0);
  const [available, setAvailable] = useState<string[]>([]);
  const [arranged, setArranged] = useState<string[]>([]);
  const [attempts, setAttempts] = useState(0);
  const [hintsLeft, setHintsLeft] = useState(3);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [showComplete, setShowComplete] = useState(false);
  const [solved, setSolved] = useState(false);
  const [error, setError] = useState(false);

  const puzzle = PUZZLES[puzzleIndex];

  useEffect(() => {
    setAvailable(shuffle([...puzzle.words]));
    setArranged([]);
    setError(false);
  }, [puzzleIndex, puzzle]);

  const shuffle = (arr: string[]): string[] => {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    if (a.join(" ") === puzzle.answer) return shuffle(arr);
    return a;
  };

  const addToArranged = (word: string, idx: number) => {
    if (solved) return;
    setAvailable((a) => a.filter((_, i) => i !== idx));
    setArranged((a) => [...a, word]);
    play("click");
    setError(false);
  };

  const removeFromArranged = (word: string, idx: number) => {
    if (solved) return;
    setArranged((a) => a.filter((_, i) => i !== idx));
    setAvailable((a) => [...a, word]);
    play("click");
    setError(false);
  };

  const handleHint = useCallback(() => {
    if (hintsLeft === 0) return;
    showToast("info", `Hint: ${puzzle.hint}`);
    setHintsLeft((h) => h - 1);
    setHintsUsed((h) => h + 1);
    play("hint");
  }, [hintsLeft, puzzle, showToast, play]);

  const handleSubmit = useCallback(() => {
    const sentence = arranged.join(" ");
    if (sentence === puzzle.answer) {
      setSolved(true);
      play("success");
      const isLast = puzzleIndex >= PUZZLES.length - 1;
      if (isLast) {
        play("levelComplete");
        fireConfetti();
        const baseScore = 100;
        const penalty = attempts * 10 + hintsUsed * 10;
        const earnedScore = Math.max(40, baseScore - penalty);
        const earnedCoins = Math.max(10, 30 - hintsUsed * 5);
        const stars = attempts === 0 && hintsUsed === 0 ? 3 : attempts <= 2 && hintsUsed <= 1 ? 2 : 1;
        onComplete(2, earnedScore, earnedCoins, stars);
        setTimeout(() => setShowComplete(true), 600);
      } else {
        showToast("success", "Correct! Next sentence...");
        setTimeout(() => {
          setPuzzleIndex((i) => i + 1);
          setSolved(false);
        }, 1200);
      }
    } else {
      setAttempts((a) => a + 1);
      setError(true);
      play("error");
      showToast("error", "That doesn't sound right. Try rearranging!");
    }
  }, [arranged, puzzle, puzzleIndex, attempts, hintsUsed, showToast, play, onComplete]);

  const handleReset = () => {
    setAvailable(shuffle([...puzzle.words]));
    setArranged([]);
    setError(false);
    play("click");
  };

  const earnedScore = Math.max(40, 100 - attempts * 10 - hintsUsed * 10);
  const earnedCoins = Math.max(10, 30 - hintsUsed * 5);
  const finalStars = attempts === 0 && hintsUsed === 0 ? 3 : attempts <= 2 && hintsUsed <= 1 ? 2 : 1;

  return (
    <LevelShell
      progress={progress}
      levelName="Word Master"
      levelIcon={<Type size={16} />}
      onHome={onHome}
      hintsLeft={hintsLeft}
      onHint={handleHint}
    >
      <div className="fade-in">
        {/* Story */}
        <div className="rounded-2xl bg-slate-800/60 border border-white/10 p-5 mb-5 card-glow">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-sky-500/20 border border-sky-400/30 flex items-center justify-center flex-shrink-0">
              <Sparkles size={20} className="text-sky-400" />
            </div>
            <div>
              <h2 className="font-display text-xl font-bold text-white mb-1">
                The Scroll of Words
              </h2>
              <p className="text-slate-300 text-sm">
                An ancient scroll has scattered its words. Arrange them in the
                correct order to form a meaningful sentence and restore the
                scroll's wisdom.
              </p>
            </div>
          </div>
        </div>

        {/* Progress dots */}
        <div className="flex justify-center gap-2 mb-5">
          {PUZZLES.map((_, i) => (
            <div
              key={i}
              className={`w-2 h-2 rounded-full transition-all ${
                i < puzzleIndex
                  ? "bg-emerald-400"
                  : i === puzzleIndex
                  ? "bg-sky-400 w-6"
                  : "bg-white/20"
              }`}
            />
          ))}
        </div>

        {/* Arranged sentence area */}
        <div
          className={`min-h-[100px] rounded-2xl bg-slate-800/60 border-2 border-dashed p-4 mb-4 flex flex-wrap gap-2 items-center justify-center ${
            error ? "shake-anim border-rose-500/40" : "border-white/15"
          } ${solved ? "border-emerald-400/40 bg-emerald-500/10" : ""}`}
        >
          {arranged.length === 0 && (
            <span className="text-slate-500 text-sm italic">
              Tap words below to build your sentence...
            </span>
          )}
          {arranged.map((word, i) => (
            <button
              key={`arr-${i}-${word}`}
              onClick={() => removeFromArranged(word, i)}
              className="chip-drop px-4 py-2 rounded-xl bg-sky-500/20 border border-sky-400/40 text-sky-200 font-semibold text-sm sm:text-base hover:bg-sky-500/30 transition-colors"
            >
              {word}
            </button>
          ))}
        </div>

        {/* Available words */}
        <div className="rounded-2xl bg-slate-800/40 border border-white/10 p-4 mb-4 flex flex-wrap gap-2 justify-center min-h-[70px]">
          {available.length === 0 ? (
            <span className="text-slate-500 text-sm italic">All words placed!</span>
          ) : (
            available.map((word, i) => (
              <button
                key={`avail-${i}-${word}`}
                onClick={() => addToArranged(word, i)}
                className="chip-drop px-4 py-2 rounded-xl bg-white/5 border border-white/20 text-slate-200 font-semibold text-sm sm:text-base hover:bg-white/15 hover:border-white/30 transition-colors"
              >
                {word}
              </button>
            ))
          )}
        </div>

        {/* Actions */}
        {!solved && (
          <div className="flex justify-center gap-3">
            <button
              onClick={handleReset}
              className="btn-press flex items-center gap-2 rounded-xl bg-white/5 hover:bg-white/15 border border-white/10 text-slate-200 font-semibold px-5 py-3 transition-colors"
            >
              <RefreshCw size={18} />
              Reset
            </button>
            <button
              onClick={handleSubmit}
              disabled={arranged.length === 0}
              className="btn-press rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white font-bold px-8 py-3 transition-all shadow-lg shadow-sky-500/30 disabled:opacity-40"
            >
              Check Sentence
            </button>
          </div>
        )}

        {solved && !showComplete && (
          <div className="text-center pop-in">
            <span className="text-emerald-400 font-display font-bold text-lg">
              Correct! ✓
            </span>
          </div>
        )}
      </div>

      <LevelCompleteOverlay
        open={showComplete}
        stars={finalStars}
        earnedScore={earnedScore}
        earnedCoins={earnedCoins}
        message="You've restored the scroll's wisdom! Words bend to your will."
        hasNext={true}
        onNext={onNext}
        onHome={onHome}
      />
    </LevelShell>
  );
}
