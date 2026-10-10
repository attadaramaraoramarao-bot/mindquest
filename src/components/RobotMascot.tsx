interface RobotMascotProps {
  size?: number;
  expression?: "happy" | "thinking" | "sad" | "excited";
  className?: string;
}

export default function RobotMascot({
  size = 120,
  expression = "happy",
  className = "",
}: RobotMascotProps) {
  const eyeY = expression === "sad" ? 2 : 0;
  const mouthPath = {
    happy: "M20 40 Q32 50 44 40",
    thinking: "M22 44 L42 44",
    sad: "M20 46 Q32 38 44 46",
    excited: "M20 38 Q32 54 44 38",
  }[expression];

  return (
    <div
      className={`float-anim ${className}`}
      style={{ width: size, height: size }}
      aria-label="Robo mascot"
    >
      <svg viewBox="0 0 64 64" width={size} height={size}>
        {/* Antenna */}
        <line x1="32" y1="8" x2="32" y2="14" stroke="#94a3b8" strokeWidth="2" />
        <circle cx="32" cy="6" r="3" fill="#fbbf24">
          <animate
            attributeName="opacity"
            values="1;0.4;1"
            dur="1.5s"
            repeatCount="indefinite"
          />
        </circle>

        {/* Head */}
        <rect
          x="12"
          y="14"
          width="40"
          height="34"
          rx="10"
          fill="url(#robotGrad)"
          stroke="#475569"
          strokeWidth="1.5"
        />

        {/* Eyes */}
        <circle cx="23" cy={28 + eyeY} r="5" fill="#1e293b" />
        <circle cx="41" cy={28 + eyeY} r="5" fill="#1e293b" />
        <circle cx="24" cy={27 + eyeY} r="1.8" fill="#fff">
          <animate
            attributeName="opacity"
            values="1;1;0;1;1"
            dur="4s"
            repeatCount="indefinite"
          />
        </circle>
        <circle cx="42" cy={27 + eyeY} r="1.8" fill="#fff">
          <animate
            attributeName="opacity"
            values="1;1;0;1;1"
            dur="4s"
            repeatCount="indefinite"
          />
        </circle>

        {/* Cheek blush */}
        {expression === "excited" && (
          <>
            <circle cx="17" cy="36" r="3" fill="#fb7185" opacity="0.5" />
            <circle cx="47" cy="36" r="3" fill="#fb7185" opacity="0.5" />
          </>
        )}

        {/* Mouth */}
        <path
          d={mouthPath}
          fill="none"
          stroke="#1e293b"
          strokeWidth="2.5"
          strokeLinecap="round"
        />

        {/* Body */}
        <rect
          x="18"
          y="48"
          width="28"
          height="14"
          rx="6"
          fill="url(#robotBody)"
          stroke="#475569"
          strokeWidth="1"
        />
        <circle cx="25" cy="55" r="1.5" fill="#22d3ee" />
        <circle cx="32" cy="55" r="1.5" fill="#fbbf24" />
        <circle cx="39" cy="55" r="1.5" fill="#f472b6" />

        <defs>
          <linearGradient id="robotGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#e2e8f0" />
            <stop offset="100%" stopColor="#94a3b8" />
          </linearGradient>
          <linearGradient id="robotBody" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#cbd5e1" />
            <stop offset="100%" stopColor="#64748b" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}
