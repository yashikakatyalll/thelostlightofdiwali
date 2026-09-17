import { useMemo } from "react";

/**
 * Atmosphere layer: stars, fireflies, drifting dust, and lantern silhouettes.
 * Everything is pure CSS animation — cheap and looks alive on any device.
 */

export function StarField({ count = 60 }: { count?: number }) {
  const stars = useMemo(
    () =>
      Array.from({ length: count }).map((_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 55,
        size: Math.random() * 2 + 1,
        delay: Math.random() * 4,
        dur: 2 + Math.random() * 3,
      })),
    [count],
  );

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {stars.map((s) => (
        <span
          key={s.id}
          className="absolute rounded-full bg-white"
          style={{
            left: `${s.x}%`,
            top: `${s.y}%`,
            width: s.size,
            height: s.size,
            animation: `star-twinkle ${s.dur}s ease-in-out infinite`,
            animationDelay: `${s.delay}s`,
          }}
        />
      ))}
    </div>
  );
}

export function Fireflies({ count = 18 }: { count?: number }) {
  const flies = useMemo(
    () =>
      Array.from({ length: count }).map((_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: 60 + Math.random() * 40,
        dx: (Math.random() - 0.5) * 200 + "px",
        dy: -100 - Math.random() * 200 + "px",
        delay: Math.random() * 8,
        dur: 6 + Math.random() * 6,
      })),
    [count],
  );

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {flies.map((f) => (
        <span
          key={f.id}
          className="absolute h-2 w-2 rounded-full"
          style={
            {
              left: `${f.x}%`,
              top: `${f.y}%`,
              background:
                "radial-gradient(circle, oklch(0.95 0.18 90) 0%, oklch(0.86 0.16 70 / 0) 70%)",
              boxShadow: "0 0 12px oklch(0.92 0.16 85 / 0.9)",
              animation: `firefly-drift ${f.dur}s ease-in-out infinite`,
              animationDelay: `${f.delay}s`,
              "--dx": f.dx,
              "--dy": f.dy,
            } as React.CSSProperties
          }
        />
      ))}
    </div>
  );
}

export function FloatingPetals({ count = 14 }: { count?: number }) {
  const petals = useMemo(
    () =>
      Array.from({ length: count }).map((_, i) => ({
        id: i,
        x: Math.random() * 100,
        delay: Math.random() * 12,
        dur: 10 + Math.random() * 10,
        dx: (Math.random() - 0.5) * 200 + "px",
        size: 10 + Math.random() * 10,
        hue: Math.random() > 0.5 ? "oklch(0.78 0.2 45)" : "oklch(0.7 0.21 15)",
      })),
    [count],
  );
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {petals.map((p) => (
        <span
          key={p.id}
          className="absolute rounded-[40%_60%_50%_50%] opacity-80"
          style={
            {
              left: `${p.x}%`,
              top: 0,
              width: p.size,
              height: p.size * 1.4,
              background: p.hue,
              animation: `petal-fall ${p.dur}s linear infinite`,
              animationDelay: `${p.delay}s`,
              "--dx": p.dx,
            } as React.CSSProperties
          }
        />
      ))}
    </div>
  );
}

export function SuccessSparkles({ x, y }: { x: number; y: number }) {
  const bits = useMemo(
    () =>
      Array.from({ length: 16 }).map((_, i) => {
        const angle = (i / 16) * Math.PI * 2;
        const dist = 80 + Math.random() * 60;
        return {
          id: i,
          dx: Math.cos(angle) * dist,
          dy: Math.sin(angle) * dist,
          delay: Math.random() * 0.2,
        };
      }),
    [x, y],
  );
  return (
    <div
      className="absolute pointer-events-none"
      style={{ left: `${x}%`, top: `${y}%` }}
    >
      {bits.map((b) => (
        <span
          key={b.id}
          className="absolute h-3 w-3 rounded-full"
          style={{
            background:
              "radial-gradient(circle, oklch(0.95 0.18 85), transparent 70%)",
            transform: `translate(${b.dx}px, ${b.dy}px)`,
            animation: "sparkle-pop 1s ease-out forwards",
            animationDelay: `${b.delay}s`,
          }}
        />
      ))}
    </div>
  );
}
