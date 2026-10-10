import { useEffect, useRef } from "react";

export default function Particles({ count = 30 }: { count?: number }) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    container.innerHTML = "";
    for (let i = 0; i < count; i++) {
      const p = document.createElement("div");
      p.className = "particle";
      const size = Math.random() * 4 + 2;
      p.style.width = `${size}px`;
      p.style.height = `${size}px`;
      p.style.left = `${Math.random() * 100}%`;
      p.style.animationDuration = `${Math.random() * 10 + 8}s`;
      p.style.animationDelay = `${Math.random() * 10}s`;
      const colors = ["rgba(255,255,255,0.5)", "rgba(251,191,36,0.4)", "rgba(56,189,248,0.4)", "rgba(167,139,250,0.3)"];
      p.style.background = colors[Math.floor(Math.random() * colors.length)];
      container.appendChild(p);
    }
  }, [count]);

  return <div ref={containerRef} className="particles" aria-hidden="true" />;
}
