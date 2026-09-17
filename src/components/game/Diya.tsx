import { memo } from "react";
import type { Point } from "@/game/types";

interface DiyaProps {
  pos: Point;
  lit: boolean;
  size?: "sm" | "md" | "lg";
}

const SIZES = {
  sm: { base: 64, glow: 150 },
  md: { base: 88, glow: 220 },
  lg: { base: 116, glow: 300 },
};

/**
 * Traditional Indian diya: wide oval clay lamp with a pool of golden oil,
 * a cotton wick, and a teardrop flame. Reads as "lit oil lamp" instantly.
 */
function DiyaBase({ pos, lit, size = "md" }: DiyaProps) {
  const s = SIZES[size];
  const uid = `${pos.x.toFixed(0)}-${pos.y.toFixed(0)}`;
  return (
    <div
      className="absolute -translate-x-1/2 -translate-y-1/2"
      style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
    >
      {/* Warm halo */}
      <div
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full pointer-events-none transition-opacity duration-700"
        style={{
          width: s.glow,
          height: s.glow,
          background:
            "radial-gradient(circle, oklch(0.95 0.16 80 / 0.85) 0%, oklch(0.82 0.2 50 / 0.4) 35%, transparent 70%)",
          opacity: lit ? 1 : 0,
          filter: "blur(8px)",
          animation: lit ? "breathe 2.6s ease-in-out infinite" : undefined,
        }}
      />

      <svg
        width={s.base}
        height={s.base}
        viewBox="0 0 120 100"
        className="relative"
        style={{
          filter: lit
            ? "drop-shadow(0 0 22px oklch(0.92 0.18 75 / 0.95))"
            : "drop-shadow(0 6px 8px oklch(0.05 0 0 / 0.65))",
        }}
      >
        <defs>
          <linearGradient id={`clay-${uid}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#e89255" />
            <stop offset="55%" stopColor="#a64f1f" />
            <stop offset="100%" stopColor="#3e1407" />
          </linearGradient>
          <radialGradient id={`oil-${uid}`} cx="50%" cy="35%" r="65%">
            <stop offset="0%" stopColor="#ffe39a" />
            <stop offset="100%" stopColor="#a35a1e" />
          </radialGradient>
          <radialGradient id={`flame-${uid}`} cx="50%" cy="80%" r="60%">
            <stop offset="0%" stopColor="#fffbe0" />
            <stop offset="35%" stopColor="oklch(0.94 0.18 90)" />
            <stop offset="75%" stopColor="oklch(0.78 0.22 50)" />
            <stop offset="100%" stopColor="oklch(0.6 0.22 30 / 0)" />
          </radialGradient>
        </defs>

        {/* ground shadow */}
        <ellipse cx="60" cy="92" rx="42" ry="4" fill="#000" opacity="0.45" />

        {/* === Diya body — wide boat-shaped clay lamp === */}
        {/* outer bowl */}
        <path
          d="M 10 62 Q 14 92 60 92 Q 106 92 110 62 Q 102 82 60 82 Q 18 82 10 62 Z"
          fill={`url(#clay-${uid})`}
        />
        {/* rim shape (the upper oval cup) */}
        <path
          d="M 10 62 Q 22 50 60 50 Q 98 50 110 62 Q 100 70 60 70 Q 20 70 10 62 Z"
          fill={`url(#clay-${uid})`}
        />
        {/* rim highlight */}
        <path
          d="M 14 60 Q 26 54 60 54 Q 94 54 106 60"
          stroke="#ffd6a3"
          strokeWidth="1.8"
          fill="none"
          opacity="0.8"
        />
        {/* pinched spout (tip where wick rests) */}
        <path d="M 56 50 Q 60 44 64 50 Z" fill={`url(#clay-${uid})`} />

        {/* Oil pool — golden inside the rim */}
        <ellipse cx="60" cy="62" rx="44" ry="6" fill={`url(#oil-${uid})`} />
        <ellipse cx="60" cy="60" rx="34" ry="3" fill="#fff3c2" opacity="0.55" />

        {/* Decorative dots around base */}
        {[18, 35, 60, 85, 102].map((x) => (
          <circle key={x} cx={x} cy={80} r="1.8" fill="#ffd6a3" opacity="0.85" />
        ))}

        {/* Wick (cotton, ghee-soaked) sitting in spout */}
        <path
          d="M 60 60 Q 62 52 60 44"
          stroke="#f3e3b8"
          strokeWidth="3.2"
          fill="none"
          strokeLinecap="round"
        />

        {/* Flame */}
        {lit && (
          <g
            style={{
              transformOrigin: "60px 44px",
              animation: "flame-flicker 0.55s ease-in-out infinite",
            }}
          >
            <ellipse cx="60" cy="32" rx="12" ry="22" fill={`url(#flame-${uid})`} />
            <ellipse cx="60" cy="34" rx="7" ry="15" fill="oklch(0.95 0.18 88)" />
            <ellipse cx="60" cy="40" rx="3" ry="7" fill="#fffce8" />
            {/* sparks */}
            <circle cx="68" cy="20" r="1.2" fill="#fff2a0" opacity="0.9" />
            <circle cx="52" cy="16" r="1" fill="#fff2a0" opacity="0.8" />
            <circle cx="64" cy="10" r="0.8" fill="#fff2a0" opacity="0.7" />
          </g>
        )}
      </svg>
    </div>
  );
}

export const Diya = memo(DiyaBase);
