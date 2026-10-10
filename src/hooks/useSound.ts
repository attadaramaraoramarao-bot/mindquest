import { useCallback, useRef } from "react";

type SoundName =
  | "click"
  | "success"
  | "error"
  | "hint"
  | "levelComplete"
  | "unlock"
  | "star"
  | "gameOver"
  | "coin"
  | "tick";

interface SoundBuffer {
  name: SoundName;
  freqs: number[];
  durations: number[];
  type?: OscillatorType;
  volume?: number;
}

const SOUND_DEFS: SoundBuffer[] = [
  { name: "click", freqs: [600], durations: [0.08], type: "sine", volume: 0.15 },
  { name: "coin", freqs: [880, 1100], durations: [0.05, 0.08], type: "square", volume: 0.1 },
  {
    name: "success",
    freqs: [523, 659, 784],
    durations: [0.1, 0.1, 0.15],
    type: "sine",
    volume: 0.2,
  },
  {
    name: "error",
    freqs: [220, 180],
    durations: [0.15, 0.2],
    type: "sawtooth",
    volume: 0.15,
  },
  { name: "hint", freqs: [440, 550], durations: [0.12, 0.12], type: "triangle", volume: 0.15 },
  {
    name: "levelComplete",
    freqs: [523, 659, 784, 1047],
    durations: [0.12, 0.12, 0.12, 0.25],
    type: "sine",
    volume: 0.22,
  },
  {
    name: "unlock",
    freqs: [392, 523, 659],
    durations: [0.1, 0.1, 0.2],
    type: "triangle",
    volume: 0.2,
  },
  {
    name: "star",
    freqs: [1047, 1319],
    durations: [0.08, 0.12],
    type: "sine",
    volume: 0.18,
  },
  {
    name: "gameOver",
    freqs: [330, 277, 220],
    durations: [0.2, 0.2, 0.4],
    type: "sawtooth",
    volume: 0.18,
  },
  { name: "tick", freqs: [1000], durations: [0.03], type: "square", volume: 0.08 },
];

export function useSound() {
  const ctxRef = useRef<AudioContext | null>(null);
  const mutedRef = useRef(false);

  const getCtx = useCallback(() => {
    if (!ctxRef.current) {
      ctxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    return ctxRef.current;
  }, []);

  const play = useCallback(
    (name: SoundName) => {
      if (mutedRef.current) return;
      const def = SOUND_DEFS.find((s) => s.name === name);
      if (!def) return;
      const ctx = getCtx();
      if (ctx.state === "suspended") ctx.resume();
      const now = ctx.currentTime;
      let offset = 0;
      def.freqs.forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = def.type || "sine";
        osc.frequency.value = freq;
        gain.gain.setValueAtTime(0, now + offset);
        gain.gain.linearRampToValueAtTime(def.volume ?? 0.2, now + offset + 0.01);
        gain.gain.exponentialRampToValueAtTime(0.001, now + offset + def.durations[i]);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + offset);
        osc.stop(now + offset + def.durations[i]);
        offset += def.durations[i];
      });
    },
    [getCtx]
  );

  const setMuted = useCallback((m: boolean) => {
    mutedRef.current = m;
  }, []);

  return { play, setMuted };
}
