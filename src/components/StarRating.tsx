import { useEffect, useState } from "react";

export default function StarRating({
  count,
  size = 28,
}: {
  count: number;
  size?: number;
}) {
  const [visible, setVisible] = useState(0);

  useEffect(() => {
    setVisible(0);
    const timers: ReturnType<typeof setTimeout>[] = [];
    for (let i = 0; i < count; i++) {
      timers.push(setTimeout(() => setVisible(i + 1), i * 300));
    }
    return () => timers.forEach(clearTimeout);
  }, [count]);

  return (
    <div className="flex gap-2 justify-center">
      {[0, 1, 2].map((i) => (
        <svg
          key={i}
          width={size}
          height={size}
          viewBox="0 0 24 24"
          className={i < visible ? "star-pop" : ""}
          style={{ opacity: i < visible ? 1 : 0.2 }}
          fill={i < visible ? "#fbbf24" : "#334155"}
          stroke={i < visible ? "#f59e0b" : "#1e293b"}
          strokeWidth="1.5"
        >
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      ))}
    </div>
  );
}
