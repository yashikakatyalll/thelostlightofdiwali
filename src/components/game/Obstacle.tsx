import { memo, useState } from "react";
import type { ObstacleConfig } from "@/game/types";
import { sfx } from "@/game/audio";

interface ObstacleProps {
  obstacle: ObstacleConfig;
  cleared?: boolean;
  hideHint?: boolean;
  onTap?: () => void;
}

const SHARD_COUNT = 7;
const SHARDS = Array.from({ length: SHARD_COUNT }, (_, i) => {
  const angle = (i / SHARD_COUNT) * Math.PI * 2 + (i % 2 ? 0.4 : -0.2);
  const dist = 70 + Math.random() * 40;
  return {
    tx: Math.cos(angle) * dist,
    ty: Math.sin(angle) * dist - 10,
    rot: (i * 53) % 360,
    size: 9 + (i % 3) * 4,
  };
});

interface ShatterPiecesProps {
  color: string;
  visible: boolean;
}

function ShatterPieces({ color, visible }: ShatterPiecesProps) {
  if (!visible) return null;
  return (
    <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
      {SHARDS.map((s, i) => (
        <span
          key={i}
          className="absolute left-0 top-0 block"
          style={
            {
              width: s.size,
              height: s.size,
              marginLeft: -s.size / 2,
              marginTop: -s.size / 2,
              background: color,
              clipPath: "polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)",
              boxShadow: "0 2px 4px oklch(0.05 0 0 / 0.5)",
              animation: "shatter-piece 0.85s cubic-bezier(.2,.7,.3,1) forwards",
              "--tx": `${s.tx}px`,
              "--ty": `${s.ty}px`,
              "--rot": `${s.rot}deg`,
            } as React.CSSProperties
          }
        />
      ))}
    </div>
  );
}

function ObstacleBase({ obstacle, cleared, hideHint, onTap }: ObstacleProps) {
  const { pos, kind, blocking, moving, range = 6 } = obstacle;
  const interactive = !!blocking && !cleared;
  const [tapped, setTapped] = useState(false);

  const handleTap = () => {
    if (!interactive) return;
    setTapped(true);
    sfx.shatter();
    onTap?.();
  };

  const shardColor = kind === "stone" ? "#7a6a8c" : "#c47a48";
  const isGone = cleared || tapped;

  return (
    <div
      className="absolute"
      style={
        {
          left: `${pos.x}%`,
          top: `${pos.y}%`,
          zIndex: 6,
          transform: "translate(-50%, -50%)",
          animation: moving && !isGone ? "obstacle-slide 2.4s ease-in-out infinite" : undefined,
          "--range": `${range}vw`,
        } as React.CSSProperties
      }
    >
      <ShatterPieces color={shardColor} visible={tapped} />

      <button
        type="button"
        disabled={!interactive}
        onClick={handleTap}
        className="focus:outline-none"
        style={{
          opacity: isGone ? 0 : 1,
          transform: isGone ? "scale(0.4)" : "none",
          transition: "transform 0.25s ease-out, opacity 0.35s ease-out",
          filter: interactive ? "drop-shadow(0 0 14px oklch(0.92 0.16 75 / 0.7))" : undefined,
          pointerEvents: interactive ? "auto" : "none",
          cursor: interactive ? "pointer" : "default",
          position: "relative",
        }}
        aria-label={interactive ? "Smash" : undefined}
      >
        {interactive && (
          <>
            <span
              className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full"
              style={{
                width: 110,
                height: 110,
                background: "radial-gradient(circle, oklch(0.94 0.16 70 / 0.6), transparent 65%)",
                animation: "breathe 1.2s ease-in-out infinite",
              }}
            />
            {!hideHint && (
              <span
                className="font-hand pointer-events-none absolute -top-9 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full px-3 py-1 text-base font-bold text-[#5a2a0a] shadow-lg"
                style={{
                  background: "linear-gradient(180deg,#fff5d6,#ffd994)",
                  animation: "float-soft 1.6s ease-in-out infinite",
                }}
              >
                Tap to smash!
              </span>
            )}
          </>
        )}

        {kind === "stone" ? (
          <svg width="62" height="46" viewBox="0 0 56 40">
            <ellipse cx="28" cy="36" rx="24" ry="3" fill="#000" opacity="0.45" />
            <path
              d="M 6 30 Q 4 14 18 8 Q 32 2 44 10 Q 54 18 50 30 Q 46 36 28 36 Q 10 36 6 30 Z"
              fill="#5a4a6b"
            />
            <path d="M 12 24 Q 22 14 36 16" stroke="#7a6a8c" strokeWidth="2" fill="none" opacity="0.7" />
            <circle cx="22" cy="20" r="2" fill="#8a7aa0" opacity="0.6" />
          </svg>
        ) : (
          <svg width="52" height="64" viewBox="0 0 48 58">
            <ellipse cx="24" cy="54" rx="20" ry="3" fill="#000" opacity="0.45" />
            <path
              d="M 8 22 Q 4 40 12 52 Q 24 58 36 52 Q 44 40 40 22 Q 36 18 24 18 Q 12 18 8 22 Z"
              fill="#a05a2c"
            />
            <ellipse cx="24" cy="20" rx="16" ry="5" fill="#7a3f1c" />
            <ellipse cx="24" cy="19" rx="14" ry="3.5" fill="#3a1a08" />
            <path d="M 14 28 Q 12 40 18 50" stroke="#c47a48" strokeWidth="2" fill="none" opacity="0.7" />
            <circle cx="14" cy="36" r="2.5" fill="#ffb84d" />
            <circle cx="22" cy="38" r="2.5" fill="#ff7a4d" />
            <circle cx="30" cy="36" r="2.5" fill="#ffb84d" />
            <circle cx="36" cy="34" r="2.2" fill="#c24a1a" />
          </svg>
        )}
      </button>
    </div>
  );
}

export const Obstacle = memo(ObstacleBase);
