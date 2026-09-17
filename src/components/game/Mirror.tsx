import { memo } from "react";
import type { Point } from "@/game/types";

interface MirrorProps {
  pos: Point;
  rotation: number;
  aligned: boolean;
  hint?: boolean;
  hideHint?: boolean;
  size?: number;
  locked?: boolean;
  autoRotating?: boolean;
  onTap: () => void;
}

/**
 * A mirror with N discrete rotations. Each tap rotates by a fixed step
 * (driven by the parent). Smooth animated transform shows the change so
 * players can clearly see cause and effect.
 */
function MirrorBase({
  pos,
  rotation,
  aligned,
  hint,
  hideHint = false,
  size = 120,
  locked = false,
  autoRotating = false,
  onTap,
}: MirrorProps) {
  const w = size;
  const h = size * 1.33;

  return (
    <button
      type="button"
      onClick={() => !locked && !autoRotating && onTap()}
      className={`absolute -translate-x-1/2 -translate-y-1/2 group focus:outline-none z-20 ${locked || autoRotating ? "cursor-not-allowed" : "cursor-pointer"}`}
      style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
      aria-label={locked ? "Mirror locked" : autoRotating ? "Mirror auto-rotating" : "Tap mirror to rotate"}
    >
      {hint && !aligned && !hideHint && (
        <span
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full"
          style={{
            width: 240,
            height: 240,
            background:
              "radial-gradient(circle, oklch(0.94 0.16 70 / 0.8), transparent 65%)",
            animation: "breathe 1.3s ease-in-out infinite",
          }}
        />
      )}

      {hint && !aligned && !hideHint && (
        <span
          className="font-hand pointer-events-none absolute -top-10 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full px-4 py-1.5 text-lg font-bold text-[#5a2a0a] shadow-lg"
          style={{
            background: "linear-gradient(180deg,#fff5d6,#ffd994)",
            animation: "float-soft 1.6s ease-in-out infinite",
          }}
        >
          Tap to spin!
        </span>
      )}

      <div
        className="relative"
        style={{
          width: w,
          height: h,
          transform: `rotate(${rotation}deg)`,
          transition: autoRotating
            ? "transform 0.9s linear, filter 0.5s"
            : "transform 0.55s cubic-bezier(.34,1.56,.64,1), filter 0.5s",
          filter: aligned
            ? "drop-shadow(0 0 38px oklch(0.96 0.18 75 / 1)) drop-shadow(0 0 14px oklch(0.98 0.14 85 / 0.9))"
            : locked
              ? "drop-shadow(0 8px 14px oklch(0.05 0 0 / 0.6)) grayscale(0.6) brightness(0.55)"
              : "drop-shadow(0 8px 14px oklch(0.05 0 0 / 0.6)) drop-shadow(0 0 10px oklch(0.92 0.1 80 / 0.4))",
        }}
      >
        <svg viewBox="0 0 120 160" className="h-full w-full">
          <defs>
            <radialGradient id="mGlassIdle" cx="38%" cy="30%" r="80%">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="25%" stopColor="#e8eef5" />
              <stop offset="60%" stopColor="#9aa6b6" />
              <stop offset="100%" stopColor="#3a4250" />
            </radialGradient>
            <radialGradient id="mGlassGold" cx="38%" cy="30%" r="80%">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="22%" stopColor="#fff7e0" />
              <stop offset="55%" stopColor="#ffd49a" />
              <stop offset="100%" stopColor="#7a3a0e" />
            </radialGradient>
            <linearGradient id="mFrameGold" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#fff0b0" />
              <stop offset="45%" stopColor="#e6b13a" />
              <stop offset="100%" stopColor="#7a4a0e" />
            </linearGradient>
            <linearGradient id="mFrameSilver" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#f0f3f7" />
              <stop offset="50%" stopColor="#a8b2c0" />
              <stop offset="100%" stopColor="#4a5260" />
            </linearGradient>
            <linearGradient id="mHandle" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#d49a3a" />
              <stop offset="100%" stopColor="#5a2a0a" />
            </linearGradient>
            <clipPath id="mClip">
              <circle cx="60" cy="58" r="42" />
            </clipPath>
          </defs>

          <rect x="52" y="95" width="16" height="52" rx="8" fill="url(#mHandle)" />
          <rect x="50" y="105" width="20" height="3" fill="#7a4a0e" opacity="0.7" />
          <rect x="50" y="120" width="20" height="3" fill="#7a4a0e" opacity="0.7" />
          <rect x="50" y="135" width="20" height="3" fill="#7a4a0e" opacity="0.7" />
          <rect x="46" y="144" width="28" height="8" rx="3" fill="#e6b13a" />
          <circle cx="60" cy="156" r="4" fill="#c24a1a" stroke="#fff2cc" strokeWidth="0.8" />

          <circle cx="60" cy="58" r="56" fill={aligned ? "url(#mFrameGold)" : "url(#mFrameSilver)"} />
          <circle cx="60" cy="58" r="46" fill="#7a3a14" />
          <circle cx="60" cy="58" r="42" fill={aligned ? "url(#mGlassGold)" : "url(#mGlassIdle)"} />

          <g clipPath="url(#mClip)">
            <rect x="18" y="20" width="84" height="32" fill="#ffe9b0" opacity="0.45" />
            <ellipse cx="44" cy="34" rx="12" ry="4" fill="#ffffff" opacity="0.75" />
            <ellipse cx="76" cy="42" rx="8" ry="3" fill="#ffffff" opacity="0.55" />
          </g>

          <circle cx="60" cy="58" r="41" fill="none" stroke="#ffffff" strokeWidth="1.5" opacity="0.6" />
          {/* Top marker — clearly shows which way the mirror is facing.
              This is the key visual cue players use to predict reflections. */}
          <polygon
            points="60,14 66,28 54,28"
            fill={aligned ? "#fff7c2" : "#ffd24d"}
            stroke="#5a2a0a"
            strokeWidth="1"
          />
          <ellipse cx="48" cy="46" rx="14" ry="5" fill="#ffffff" opacity="0.7" />
          <ellipse cx="78" cy="80" rx="6" ry="3" fill="#ffffff" opacity="0.5" />

          {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => {
            const r = 51;
            const x = 60 + Math.cos((deg * Math.PI) / 180) * r;
            const y = 58 + Math.sin((deg * Math.PI) / 180) * r;
            const color = deg % 90 === 0 ? "#c24a1a" : "#ffd24d";
            return (
              <circle key={deg} cx={x} cy={y} r="3" fill={color} stroke="#fff2cc" strokeWidth="0.6" />
            );
          })}

          {aligned && (
            <circle
              cx="60"
              cy="58"
              r="42"
              fill="none"
              stroke="oklch(0.98 0.18 85)"
              strokeWidth="3"
              opacity="0.95"
            />
          )}
        </svg>
      </div>

      {locked && (
        <span
          className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-3xl"
          style={{ filter: "drop-shadow(0 2px 6px oklch(0.05 0 0 / 0.9))" }}
          aria-hidden
        >
          🔒
        </span>
      )}
      {autoRotating && !aligned && (
        <span
          className="font-display pointer-events-none absolute -top-7 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-[#3a1a40]/85 px-3 py-1 text-xs uppercase tracking-widest text-[#ffd994] ring-1 ring-[#ffd994]/60"
        >
          spinning
        </span>
      )}
    </button>
  );
}

export const Mirror = memo(MirrorBase);
