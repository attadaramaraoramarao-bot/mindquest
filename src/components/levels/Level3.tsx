import { useState, useCallback, useEffect, useRef } from "react";
import { Brain, Sparkles, Eye, Play } from "lucide-react";
import LevelCompleteOverlay from "../LevelCompleteOverlay";
import LevelShell, { useLevelHelpers } from "../LevelShell";
import { GameProgress, LevelId } from "@/types";
import { fireConfetti } from "@/utils/confetti";

interface Level3Props {
  progress: GameProgress;
  onHome: () => void;
  onComplete: (levelId: LevelId, score: number, coins: number, stars: number) => void;
  onNext: () => void;
}

const TILES = [
  { color: "from-emerald-400 to-emerald-600", active: "bg-emerald-300", symbol: "✦", label: "star" },
  { color: "from-sky-400 to-sky-600", active: "bg-sky-300", symbol: "❖", label: "diamond" },
  { color: "from-rose-400 to-rose-600", active: "bg-rose-300", symbol: "♥", label: "heart" },
  { color: "from-amber-400 to-amber-600", active: "bg-amber-300", symbol: "☀", label: "sun" },
];

const MAX_ROUNDS = 5;

export default function Level3({ progress, onHome, onComplete, onNext }: Level3Props) {
  const { play, showToast } = useLevelHelpers();
  const [sequence, setSequence] = useState<number[]>([]);
  const [playerInput, setPlayerInput] = useState<number[]>([]);
  const [round, setRound] = useState(0);
  const [activeTile, setActiveTile] = useState<number | null>(null);
  const [phase, setPhase] = useState<"idle" | "showing" | "playing" | "success" | "failed">("idle");
  const [hintsLeft, setHintsLeft] = useState(3);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [showComplete, setShowComplete] = useState(false);
  const [errors, setErrors] = useState(0);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const generateSequence = useCallback(() => {
    const seq: number[] = [];
    for (let i = 0; i < MAX_ROUNDS; i++) {
      seq.push(Math.floor(Math.random() * 4));
    }
    return seq;
  }, []);

  const startGame = useCallback(() => {
    const seq = generateSequence();
    setSequence(seq);
    setPlayerInput([]);
    setRound(1);
    setAttempts(0);
    play("click");
  }, [generateSequence, play]);

  // Show sequence up to current round
  useEffect(() => {
    if (phase !== "showing" || sequence.length === 0) return;

    let step = 0;
    const showStep = () => {
      if (step >= round) {
        setActiveTile(null);
        setPhase("playing");
        return;
      }
      const tileIdx = sequence[step];
      setActiveTile(tileIdx);
      play("tick");
      timeoutRef.current = setTimeout(() => {
        setActiveTile(null);
        timeoutRef.current = setTimeout(() => {
          step++;
          showStep();
        }, 300);
      }, 600);
    };

    const startTimer = setTimeout(() => showStep(), 500);
    return () => {
      clearTimeout(startTimer);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [phase, sequence, round, play]);

  const beginRound = useCallback(() => {
    setPlayerInput([]);
    setPhase("showing");
    play("click");
  }, [play]);

  const handleTileClick = useCallback(
    (tileIdx: number) => {
      if (phase !== "playing") return;

      const nextInput = [...playerInput, tileIdx];
      setPlayerInput(nextInput);
      setActiveTile(tileIdx);
      setTimeout(() => setActiveTile(null), 200);
      play("tick");

      const expectedIdx = nextInput.length - 1;
      if (sequence[expectedIdx] !== tileIdx) {
        setErrors((e) => e + 1);
        setPhase("failed");
        play("error");
        showToast("error", "Wrong tile! Watch the sequence again.");
        setTimeout(() => {
          setAttempts((a) => a + 1);
          setPlayerInput([]);
          setPhase("showing");
        }, 1500);
        return;
      }

      if (nextInput.length === round) {
        // Round complete
        play("success");
        if (round >= MAX_ROUNDS) {
          // Level complete
          setPhase("success");
          play("levelComplete");
          fireConfetti();
          const baseScore = 100;
          const penalty = errors * 15 + attempts * 10 + hintsUsed * 10;
          const earnedScore = Math.max(40, baseScore - penalty);
          const earnedCoins = Math.max(10, 30 - hintsUsed * 5);
          const stars =
            errors === 0 && hintsUsed === 0
              ? 3
              : errors <= 1 && hintsUsed <= 1
              ? 2
              : 1;
          onComplete(3, earnedScore, earnedCoins, stars);
          setTimeout(() => setShowComplete(true), 800);
        } else {
          showToast("success", `Round ${round} done! Get ready...`);
          setTimeout(() => {
            setRound((r) => r + 1);
            setPhase("showing");
          }, 1000);
        }
      }
    },
    [phase, playerInput, sequence, round, play, showToast, errors, attempts, hintsUsed, onComplete]
  );

  const handleHint = useCallback(() => {
    if (hintsLeft === 0 || phase !== "playing") return;
    const nextTileIdx = sequence[playerInput.length];
    if (nextTileIdx !== undefined) {
      showToast("info", `The next symbol is "${TILES[nextTileIdx].label}" (${TILES[nextTileIdx].symbol})`);
      setHintsLeft((h) => h - 1);
      setHintsUsed((h) => h + 1);
      play("hint");
    }
  }, [hintsLeft, phase, sequence, playerInput, showToast, play]);

  const earnedScore = Math.max(40, 100 - errors * 15 - attempts * 10 - hintsUsed * 10);
  const earnedCoins = Math.max(10, 30 - hintsUsed * 5);
  const finalStars = errors === 0 && hintsUsed === 0 ? 3 : errors <= 1 && hintsUsed <= 1 ? 2 : 1;

  return (
    <LevelShell
      progress={progress}
      levelName="Memory Challenge"
      levelIcon={<Brain size={16} />}
      onHome={onHome}
      hintsLeft={hintsLeft}
      onHint={handleHint}
    >
      <div className="fade-in">
        {/* Story */}
        <div className="rounded-2xl bg-slate-800/60 border border-white/10 p-5 mb-5 card-glow">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center flex-shrink-0">
              <Sparkles size={20} className="text-emerald-400" />
            </div>
            <div>
              <h2 className="font-display text-xl font-bold text-white mb-1">
                The Memory Crystal
              </h2>
              <p className="text-slate-300 text-sm">
                A magical crystal will flash a sequence of glowing symbols.
                Watch carefully, then repeat the sequence by tapping the tiles
                in the exact same order. Each round adds one more step!
              </p>
            </div>
          </div>
        </div>

        {/* Round indicator */}
        <div className="flex justify-center items-center gap-3 mb-5">
          <span className="text-slate-400 text-sm">Round</span>
          <div className="flex gap-1.5">
            {Array.from({ length: MAX_ROUNDS }).map((_, i) => (
              <div
                key={i}
                className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold transition-all ${
                  i < round - 1
                    ? "bg-emerald-500 text-white"
                    : i === round - 1
                    ? "bg-amber-500 text-white scale-110"
                    : "bg-white/10 text-slate-500"
                }`}
              >
                {i + 1}
              </div>
            ))}
          </div>
        </div>

        {/* Status */}
        <div className="text-center mb-4 h-6">
          {phase === "idle" && (
            <span className="text-slate-400 text-sm">Press Start to begin the memory test</span>
          )}
          {phase === "showing" && (
            <span className="text-amber-400 text-sm font-semibold flex items-center justify-center gap-1.5">
              <Eye size={16} className="animate-pulse" />
              Watch the sequence...
            </span>
          )}
          {phase === "playing" && (
            <span className="text-emerald-400 text-sm font-semibold">
              Your turn! Tap {round} tile{round > 1 ? "s" : ""} in order
            </span>
          )}
          {phase === "failed" && (
            <span className="text-rose-400 text-sm font-semibold">Oops! Wrong tile — watch again</span>
          )}
          {phase === "success" && (
            <span className="text-emerald-400 text-sm font-semibold">Perfect memory! 🧠</span>
          )}
        </div>

        {/* Tile grid */}
        <div className="grid grid-cols-2 gap-3 sm:gap-4 max-w-xs mx-auto mb-5">
          {TILES.map((tile, i) => (
            <button
              key={i}
              onClick={() => handleTileClick(i)}
              disabled={phase !== "playing"}
              className={`aspect-square rounded-2xl border-2 flex items-center justify-center text-4xl sm:text-5xl transition-all duration-200 select-none ${
                activeTile === i
                  ? `${tile.active} border-white/50 scale-95 tile-active`
                  : `bg-gradient-to-br ${tile.color} border-white/10 ${
                      phase === "playing" ? "hover:brightness-110 cursor-pointer" : "cursor-default"
                    }`
              } ${phase === "idle" ? "opacity-40" : ""}`}
              aria-label={tile.label}
            >
              <span className={activeTile === i ? "text-slate-900" : "text-white/90"}>
                {tile.symbol}
              </span>
            </button>
          ))}
        </div>

        {/* Start / Replay button */}
        {phase === "idle" && (
          <div className="text-center">
            <button
              onClick={startGame}
              className="btn-press inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white font-bold px-8 py-3 transition-all shadow-lg shadow-emerald-500/30"
            >
              <Play size={20} fill="white" />
              Start
            </button>
          </div>
        )}

        {phase === "playing" && (
          <div className="text-center">
            <span className="text-slate-400 text-xs">
              Progress: {playerInput.length} / {round}
            </span>
          </div>
        )}

        {phase === "failed" && (
          <div className="text-center">
            <button
              onClick={beginRound}
              className="btn-press inline-flex items-center gap-2 rounded-2xl bg-white/5 hover:bg-white/15 border border-white/10 text-slate-200 font-semibold px-6 py-3 transition-colors"
            >
              <Eye size={18} />
              Watch Again
            </button>
          </div>
        )}
      </div>

      <LevelCompleteOverlay
        open={showComplete}
        stars={finalStars}
        earnedScore={earnedScore}
        earnedCoins={earnedCoins}
        message="Your memory is razor-sharp! The crystal resonates with your mind."
        hasNext={true}
        onNext={onNext}
        onHome={onHome}
      />
    </LevelShell>
  );
}
