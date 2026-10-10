import { useState, useCallback, useMemo } from "react";
import { Trees, Sparkles, CheckCircle2, AlertTriangle } from "lucide-react";
import LevelCompleteOverlay from "../LevelCompleteOverlay";
import LevelShell, { useLevelHelpers } from "../LevelShell";
import { GameProgress, LevelId } from "@/types";
import { fireConfetti } from "@/utils/confetti";

interface Level4Props {
  progress: GameProgress;
  onHome: () => void;
  onComplete: (levelId: LevelId, score: number, coins: number, stars: number) => void;
  onNext: () => void;
}

interface HiddenObject {
  id: string;
  label: string;
  emoji: string;
  top: string;
  left: string;
  found: boolean;
}

interface RiddleOption {
  text: string;
  correct: boolean;
}

const HIDDEN_OBJECTS: Omit<HiddenObject, "found">[] = [
  { id: "key", label: "Golden Key", emoji: "🗝️", top: "12%", left: "18%" },
  { id: "mushroom", label: "Magic Mushroom", emoji: "🍄", top: "55%", left: "72%" },
  { id: "lantern", label: "Old Lantern", emoji: "🏮", top: "30%", left: "45%" },
  { id: "feather", label: "Silver Feather", emoji: "🪶", top: "75%", left: "25%" },
  { id: "gem", label: "Forest Gem", emoji: "💎", top: "18%", left: "80%" },
];

const RIDDLE = {
  question: "I speak without a mouth and hear without ears. I have nobody, but I come alive with wind. What am I?",
  options: [
    { text: "A tree", correct: false },
    { text: "An echo", correct: true },
    { text: "A shadow", correct: false },
    { text: "A ghost", correct: false },
  ] as RiddleOption[],
  hint: "It repeats what you say, but has no voice of its own.",
};

export default function Level4({ progress, onHome, onComplete, onNext }: Level4Props) {
  const { play, showToast } = useLevelHelpers();
  const [objects, setObjects] = useState<HiddenObject[]>(
    HIDDEN_OBJECTS.map((o) => ({ ...o, found: false }))
  );
  const [riddleAnswered, setRiddleAnswered] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [attempts, setAttempts] = useState(0);
  const [hintsLeft, setHintsLeft] = useState(3);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [showComplete, setShowComplete] = useState(false);
  const [phase, setPhase] = useState<"searching" | "riddle" | "done">("searching");
  const [wrongClick, setWrongClick] = useState(false);

  const foundCount = objects.filter((o) => o.found).length;
  const allFound = foundCount === objects.length;

  const handleObjectClick = useCallback(
    (id: string) => {
      setObjects((prev) =>
        prev.map((o) => (o.id === id ? { ...o, found: true } : o))
      );
      play("coin");
      showToast("success", `Found: ${objects.find((o) => o.id === id)?.label}!`);
    },
    [play, showToast, objects]
  );

  const handleForestClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (phase !== "searching") return;
      // Check if clicked on a hidden object (they're in the same container)
      const target = e.target as HTMLElement;
      if (target.dataset.objectId) {
        handleObjectClick(target.dataset.objectId);
      }
    },
    [phase, handleObjectClick]
  );

  // Transition to riddle phase when all objects found
  useMemo(() => {
    if (allFound && phase === "searching") {
      setPhase("riddle");
      showToast("info", "All objects found! Now solve the riddle to escape.");
      play("unlock");
    }
  }, [allFound, phase, showToast, play]);

  const handleRiddleAnswer = useCallback(
    (idx: number, option: RiddleOption) => {
      if (riddleAnswered) return;
      setSelectedAnswer(idx);
      if (option.correct) {
        setRiddleAnswered(true);
        setPhase("done");
        play("levelComplete");
        fireConfetti();
        const baseScore = 100;
        const penalty = attempts * 10 + hintsUsed * 10;
        const earnedScore = Math.max(40, baseScore - penalty);
        const earnedCoins = Math.max(10, 30 - hintsUsed * 5);
        const stars = attempts === 0 && hintsUsed === 0 ? 3 : attempts <= 1 && hintsUsed <= 1 ? 2 : 1;
        onComplete(4, earnedScore, earnedCoins, stars);
        setTimeout(() => setShowComplete(true), 800);
      } else {
        setAttempts((a) => a + 1);
        setWrongClick(true);
        play("error");
        showToast("error", "That's not the right answer. Think again!");
        setTimeout(() => {
          setSelectedAnswer(null);
          setWrongClick(false);
        }, 800);
      }
    },
    [riddleAnswered, attempts, hintsUsed, onComplete, play, showToast]
  );

  const handleHint = useCallback(() => {
    if (hintsLeft === 0) return;
    if (phase === "searching") {
      const unfound = objects.find((o) => !o.found);
      if (unfound) {
        showToast("info", `Look for the ${unfound.label} ${unfound.emoji} in the forest.`);
      }
    } else if (phase === "riddle") {
      showToast("info", `Hint: ${RIDDLE.hint}`);
    }
    setHintsLeft((h) => h - 1);
    setHintsUsed((h) => h + 1);
    play("hint");
  }, [hintsLeft, phase, objects, showToast, play]);

  const earnedScore = Math.max(40, 100 - attempts * 10 - hintsUsed * 10);
  const earnedCoins = Math.max(10, 30 - hintsUsed * 5);
  const finalStars = attempts === 0 && hintsUsed === 0 ? 3 : attempts <= 1 && hintsUsed <= 1 ? 2 : 1;

  return (
    <LevelShell
      progress={progress}
      levelName="Mystery Forest"
      levelIcon={<Trees size={16} />}
      onHome={onHome}
      hintsLeft={hintsLeft}
      onHint={handleHint}
    >
      <div className="fade-in">
        {/* Story */}
        <div className="rounded-2xl bg-slate-800/60 border border-white/10 p-5 mb-5 card-glow">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-green-500/20 border border-green-400/30 flex items-center justify-center flex-shrink-0">
              <Sparkles size={20} className="text-green-400" />
            </div>
            <div>
              <h2 className="font-display text-xl font-bold text-white mb-1">
                The Enchanted Forest
              </h2>
              <p className="text-slate-300 text-sm">
                You're lost in a mystical forest. Find the five hidden objects
                scattered among the trees, then solve the forest spirit's riddle
                to find your way out.
              </p>
            </div>
          </div>
        </div>

        {phase === "searching" && (
          <>
            {/* Found counter */}
            <div className="flex items-center justify-center gap-2 mb-4">
              <span className="text-slate-300 text-sm font-semibold">
                Objects found:
              </span>
              <span className="text-emerald-400 font-bold tabular-nums">
                {foundCount} / {objects.length}
              </span>
            </div>

            {/* Forest scene */}
            <div
              onClick={handleForestClick}
              className={`relative w-full h-80 sm:h-96 rounded-2xl border border-green-500/20 overflow-hidden cursor-pointer ${
                wrongClick ? "shake-anim" : ""
              }`}
              style={{
                background:
                  "linear-gradient(180deg, #064e3b 0%, #065f46 30%, #047857 60%, #064e3b 100%)",
              }}
            >
              {/* Trees decoration */}
              <ForestBackground />

              {/* Hidden objects */}
              {objects.map((obj) => (
                <button
                  key={obj.id}
                  data-object-id={obj.id}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleObjectClick(obj.id);
                  }}
                  className={`absolute text-2xl sm:text-3xl transition-all p-1 rounded-lg ${
                    obj.found
                      ? "opacity-0 scale-0 pointer-events-none"
                      : "opacity-15 hover:opacity-90 hover:scale-125 hover:bg-white/10"
                  }`}
                  style={{ top: obj.top, left: obj.left }}
                  aria-label={obj.label}
                >
                  {obj.emoji}
                </button>
              ))}

              {/* Found objects display */}
              <div className="absolute bottom-2 left-2 right-2 flex flex-wrap gap-1.5 justify-center">
                {objects.map((obj) => (
                  <span
                    key={obj.id}
                    className={`text-lg transition-all ${
                      obj.found ? "opacity-100 scale-100" : "opacity-30 scale-90"
                    }`}
                  >
                    {obj.found ? obj.emoji : "❓"}
                  </span>
                ))}
              </div>

              {/* Hint text */}
              <p className="absolute top-2 left-1/2 -translate-x-1/2 text-white/40 text-xs italic pointer-events-none">
                Tap around the forest to find hidden objects...
              </p>
            </div>
          </>
        )}

        {phase === "riddle" && (
          <div className="pop-in">
            {/* Found objects summary */}
            <div className="flex justify-center gap-3 mb-5">
              {objects.map((obj) => (
                <div
                  key={obj.id}
                  className="flex flex-col items-center gap-1"
                >
                  <span className="text-2xl">{obj.emoji}</span>
                  <span className="text-emerald-400 text-xs">
                    <CheckCircle2 size={14} />
                  </span>
                </div>
              ))}
            </div>

            {/* Riddle card */}
            <div className="rounded-2xl bg-slate-800/60 border border-green-500/20 p-6 mb-4 card-glow">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-2xl">🧝</span>
                <span className="font-display text-sm text-green-400 font-bold uppercase tracking-wide">
                  Forest Spirit speaks...
                </span>
              </div>
              <p className="text-white text-base sm:text-lg font-display italic mb-5">
                "{RIDDLE.question}"
              </p>

              <div className="grid gap-2 sm:grid-cols-2">
                {RIDDLE.options.map((option, i) => (
                  <button
                    key={i}
                    onClick={() => handleRiddleAnswer(i, option)}
                    disabled={riddleAnswered}
                    className={`btn-press text-left rounded-xl border p-4 font-semibold text-sm transition-all ${
                      riddleAnswered && option.correct
                        ? "bg-emerald-500/20 border-emerald-400/50 text-emerald-200"
                        : selectedAnswer === i
                        ? "bg-rose-500/20 border-rose-400/50 text-rose-200"
                        : "bg-white/5 border-white/15 text-slate-200 hover:bg-white/10 hover:border-white/25"
                    } disabled:cursor-default`}
                  >
                    <span className="flex items-center justify-between">
                      {option.text}
                      {riddleAnswered && option.correct && (
                        <CheckCircle2 size={18} className="text-emerald-400" />
                      )}
                      {selectedAnswer === i && !option.correct && (
                        <AlertTriangle size={18} className="text-rose-400" />
                      )}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {phase === "done" && (
          <div className="text-center pop-in py-8">
            <span className="text-4xl">🌲✨🌲</span>
            <p className="text-emerald-400 font-display font-bold text-lg mt-3">
              The forest path opens before you!
            </p>
          </div>
        )}
      </div>

      <LevelCompleteOverlay
        open={showComplete}
        stars={finalStars}
        earnedScore={earnedScore}
        earnedCoins={earnedCoins}
        message="You've escaped the Mystery Forest! The spirits guide your way."
        hasNext={true}
        onNext={onNext}
        onHome={onHome}
      />
    </LevelShell>
  );
}

function ForestBackground() {
  const trees = [
    { left: "5%", top: "10%", size: 60 },
    { left: "85%", top: "5%", size: 50 },
    { left: "40%", top: "65%", size: 45 },
    { left: "65%", top: "40%", size: 55 },
    { left: "15%", top: "50%", size: 40 },
    { left: "90%", top: "60%", size: 50 },
  ];
  return (
    <>
      {trees.map((t, i) => (
        <div
          key={i}
          className="absolute opacity-30 select-none pointer-events-none"
          style={{
            left: t.left,
            top: t.top,
            fontSize: `${t.size}px`,
          }}
        >
          🌳
        </div>
      ))}
      {/* Fireflies */}
      {[...Array(6)].map((_, i) => (
        <div
          key={`firefly-${i}`}
          className="absolute w-1.5 h-1.5 rounded-full bg-yellow-300 sparkle"
          style={{
            top: `${Math.random() * 80 + 10}%`,
            left: `${Math.random() * 80 + 10}%`,
            animationDelay: `${Math.random() * 2}s`,
          }}
        />
      ))}
    </>
  );
}
