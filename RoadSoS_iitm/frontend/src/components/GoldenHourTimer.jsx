import { useEffect, useMemo, useState } from "react";

const FULL = 60 * 60;

export default function GoldenHourTimer({ active, startedAt }) {
  const [now, setNow] = useState(Date.now());
  useEffect(() => {
    if (!active) return undefined;
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, [active]);

  const remaining = Math.max(0, FULL - Math.floor((now - (startedAt || now)) / 1000));
  const percent = remaining / FULL;
  const minutes = String(Math.floor(remaining / 60)).padStart(2, "0");
  const seconds = String(remaining % 60).padStart(2, "0");
  const stroke = useMemo(() => 2 * Math.PI * 52 * (1 - percent), [percent]);

  return (
    <div className="grid place-items-center gap-2">
      <svg className="h-36 w-36" viewBox="0 0 120 120" role="img" aria-label="Golden Hour countdown">
        <circle cx="60" cy="60" r="52" fill="none" stroke="#fed7aa" strokeWidth="10" />
        <circle
          cx="60"
          cy="60"
          r="52"
          fill="none"
          stroke={percent <= 0.3 ? "#dc2626" : "#16a34a"}
          strokeWidth="10"
          strokeDasharray={2 * Math.PI * 52}
          strokeDashoffset={stroke}
          strokeLinecap="round"
          transform="rotate(-90 60 60)"
        />
        <text x="60" y="66" textAnchor="middle" className="fill-gray-950 text-2xl font-black">{minutes}:{seconds}</text>
      </svg>
      <span className="text-sm font-semibold text-gray-700">Golden Hour</span>
    </div>
  );
}
