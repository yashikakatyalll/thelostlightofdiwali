import { useEffect, useMemo, useState } from "react";
import type { LevelConfig } from "@/game/types";
import { VillageBackdrop } from "./VillageBackdrop";
import { Mirror } from "./Mirror";
import { Diya } from "./Diya";
import { LightBeam } from "./LightBeam";
import { Elephant } from "./Elephant";
import { Obstacle } from "./Obstacle";
import { Fireflies, StarField, SuccessSparkles } from "./Particles";
import { LevelCompleteScreen } from "./LevelCompleteScreen";
import { useStageSize } from "@/hooks/useStageSize";
import { useLevelState } from "@/hooks/useLevelState";
import { sfx } from "@/game/audio";
import { LEVELS } from "@/game/levels";

interface LevelStageProps {
  level: LevelConfig;
  onComplete: () => void;
}

const SEEN_KEY = "chakra-tutorials-seen";
function isTutorialSeen(id: number) {
  if (typeof window === "undefined") return false;
  try {
    const s = JSON.parse(window.sessionStorage.getItem(SEEN_KEY) || "[]") as number[];
    return s.includes(id);
  } catch {
    return false;
  }
}
function markTutorialSeen(id: number) {
  if (typeof window === "undefined") return;
  try {
    const s = JSON.parse(window.sessionStorage.getItem(SEEN_KEY) || "[]") as number[];
    if (!s.includes(id)) {
      s.push(id);
      window.sessionStorage.setItem(SEEN_KEY, JSON.stringify(s));
    }
  } catch {
    // ignore
  }
}

export function LevelStage({ level, onComplete }: LevelStageProps) {
  const { ref, size } = useStageSize<HTMLDivElement>();
  const { aligned, rotations, cleared, locked, tapMirror, tapObstacle, allAligned, beamPath, litDiyas } =
    useLevelState(level);
  const [celebrating, setCelebrating] = useState(false);
  const [showComplete, setShowComplete] = useState(false);
  const [showTutorial, setShowTutorial] = useState(
    !!level.tutorial && !isTutorialSeen(level.id),
  );

  // When all mirrors line up: celebrate, pop fireworks, then show the
  // "Level Complete" card so the player taps Continue themselves.
  useEffect(() => {
    if (!allAligned) return;
    const celebrateTimer = setTimeout(() => setCelebrating(true), 400);
    const fireworkTimers = [900, 1850, 2900].map((delay) =>
      window.setTimeout(() => sfx.firework(), delay),
    );
    const completeTimer = setTimeout(() => setShowComplete(true), 3600);
    return () => {
      clearTimeout(celebrateTimer);
      clearTimeout(completeTimer);
      fireworkTimers.forEach(clearTimeout);
    };
  }, [allAligned]);

  const brightness = Math.min(1, level.brightness + (allAligned ? 0.55 : 0));

  // Particle-based fireworks — each firework expands outward in all
  // directions like real ones (no single-line ray tips).
  const fireworks = useMemo(
    () =>
      Array.from({ length: 7 }).map((_, i) => ({
        id: i,
        x: 12 + (i / 6) * 76 + (Math.random() - 0.5) * 8,
        y: 10 + Math.random() * 32,
        delay: 0.5 + i * 0.6 + Math.random() * 0.3,
        hue: [45, 30, 15, 60, 25, 50, 40][i % 7],
        size: 140 + Math.random() * 70,
        particles: 26 + Math.floor(Math.random() * 8),
      })),
    [level.id],
  );

  const minDim = Math.min(size.w, size.h) || 600;
  const mirrorSize = Math.max(76, Math.min(120, minDim * 0.13));
  const elephantSize = level.elephantSize ?? Math.max(360, Math.min(560, minDim * 0.7));

  return (
    <div ref={ref} className="relative h-full w-full overflow-hidden">
      <VillageBackdrop brightness={brightness} />
      <StarField count={70} />
      <Fireflies count={allAligned ? 65 : 22} />

      <div
        className="absolute -translate-x-1/2 -translate-y-1/2 pointer-events-none"
        style={{ left: `${level.source.x}%`, top: `${level.source.y}%` }}
      >
        <div
          className="h-28 w-28 rounded-full"
          style={{
            background:
              "radial-gradient(circle, oklch(0.99 0.18 90) 0%, oklch(0.92 0.2 75 / 0.85) 35%, oklch(0.78 0.22 45 / 0.5) 65%, transparent 85%)",
            boxShadow:
              "0 0 90px oklch(0.92 0.2 80 / 1), 0 0 180px oklch(0.82 0.22 55 / 0.85), 0 0 260px oklch(0.7 0.22 40 / 0.6)",
            animation: "breathe 2.4s ease-in-out infinite",
          }}
        />
      </div>


      <LightBeam path={beamPath} visible={beamPath.length > 1} stage={size} />

      {/* Ghost preview rays — show where each mirror would currently send light.
          This is the core reasoning aid: players trace mentally BEFORE tapping. */}
      {!allAligned &&
        level.mirrors.map((m) => {
          const rot = rotations[m.id] ?? 0;
          if (locked[m.id]) return null;
          // arrow points "up" at rot=0 → direction vector (sin, -cos)
          const rad = (rot * Math.PI) / 180;
          const dx = Math.sin(rad);
          const dy = -Math.cos(rad);
          const angle = (Math.atan2(dy, dx) * 180) / Math.PI;
          const isAligned = !!aligned[m.id];
          return (
            <div
              key={`ghost-${m.id}`}
              className="absolute pointer-events-none z-[6]"
              style={{ left: `${m.pos.x}%`, top: `${m.pos.y}%` }}
            >
              <div
                className="absolute origin-left"
                style={{
                  width: 1600,
                  height: 2,
                  transform: `rotate(${angle}deg)`,
                  top: -1,
                  left: 0,
                  background: isAligned
                    ? "repeating-linear-gradient(90deg, oklch(0.94 0.16 80 / 0.55) 0 10px, transparent 10px 18px)"
                    : "repeating-linear-gradient(90deg, oklch(0.95 0.04 80 / 0.32) 0 6px, transparent 6px 14px)",
                  filter: "blur(0.4px)",
                }}
              />
            </div>
          );
        })}

      {level.diyas.map((d) => (
        <Diya key={d.id} pos={d.pos} lit={litDiyas.has(d.id)} size={d.size} />
      ))}

      {level.obstacles?.map((o) => (
        <Obstacle
          key={o.id}
          obstacle={o}
          cleared={!!cleared[o.id]}
          hideHint={level.hideTapHints}
          onTap={() => tapObstacle(o.id)}
        />
      ))}

      {level.mirrors.map((m) => (
        <Mirror
          key={m.id}
          pos={m.pos}
          size={mirrorSize}
          rotation={rotations[m.id] ?? 0}
          aligned={!!aligned[m.id]}
          hideHint={level.hideTapHints}
          hint={level.hintMirrorId === m.id && !aligned[m.id]}
          locked={!!locked[m.id]}
          autoRotating={!!m.autoRotate}
          onTap={() => tapMirror(m.id)}
        />
      ))}


      {allAligned && level.diyas.map((d) => <SuccessSparkles key={d.id} x={d.pos.x} y={d.pos.y} />)}

      {/* Particle fireworks — burst outward in all directions */}
      {allAligned && (
        <div className="absolute inset-0 pointer-events-none">
          {fireworks.map((f) => (
            <div key={f.id} className="absolute" style={{ left: `${f.x}%`, top: `${f.y}%` }}>
              {/* soft warm core */}
              <div
                className="absolute rounded-full"
                style={{
                  width: f.size * 0.28,
                  height: f.size * 0.28,
                  left: -f.size * 0.14,
                  top: -f.size * 0.14,
                  background: `radial-gradient(circle, oklch(0.98 0.22 ${f.hue} / 0.9), transparent 70%)`,
                  animation: "firework-burst 1.8s ease-out infinite",
                  animationDelay: `${f.delay}s`,
                }}
              />
              {Array.from({ length: f.particles }).map((_, k) => {
                const angle = (k / f.particles) * Math.PI * 2 + Math.random() * 0.25;
                const r = f.size * (0.45 + Math.random() * 0.35);
                const tx = Math.cos(angle) * r;
                const ty = Math.sin(angle) * r;
                const hue = f.hue + (Math.random() * 18 - 9);
                return (
                  <span
                    key={k}
                    className="absolute left-0 top-0 block h-[6px] w-[6px] rounded-full"
                    style={
                      {
                        marginLeft: -3,
                        marginTop: -3,
                        background: `radial-gradient(circle, oklch(0.98 0.22 ${hue}), transparent 70%)`,
                        boxShadow: `0 0 10px oklch(0.96 0.22 ${hue}), 0 0 4px oklch(0.98 0.2 ${hue})`,
                        animation: "firework-particle 1.8s cubic-bezier(.2,.7,.3,1) infinite",
                        animationDelay: `${f.delay}s`,
                        "--tx": `${tx}px`,
                        "--ty": `${ty}px`,
                      } as React.CSSProperties
                    }
                  />
                );
              })}
            </div>
          ))}
        </div>
      )}

      {/* Elephant — bigger, on the ground, off to one side. */}
      <div
        className="absolute -translate-x-1/2 -translate-y-full pointer-events-none z-[5]"
        style={{ left: `${level.elephantPos.x}%`, top: `${level.elephantPos.y}%` }}
      >
        <Elephant size={elephantSize} pointing={!allAligned} celebrating={celebrating} />
      </div>

      {/* Title card */}
      <div
        className="absolute left-1/2 top-2 -translate-x-1/2 text-center pointer-events-none z-30"
        style={{ animation: "slide-up-fade 0.7s ease-out both" }}
      >
        <div className="font-display text-[10px] uppercase tracking-[0.3em] text-[oklch(0.86_0.16_75)]/80">
          Level {level.id} / {LEVELS.length}
        </div>
        <h2 className="font-display text-xl text-white drop-shadow-[0_2px_12px_oklch(0.05_0_0_/_0.8)] md:text-2xl">
          {level.title}
        </h2>
      </div>

      {showComplete && (
        <LevelCompleteScreen
          completedIndex={level.id - 1}
          onContinue={onComplete}
        />
      )}

      {showTutorial && level.tutorial && (
        <div
          className="absolute inset-0 z-40 flex items-center justify-center bg-black/55 backdrop-blur-sm"
          onClick={() => {
            markTutorialSeen(level.id);
            setShowTutorial(false);
          }}
        >
          <div
            className="mx-6 max-w-md rounded-3xl px-7 py-6 text-center shadow-2xl ring-4 ring-[oklch(0.86_0.18_75)]"
            style={{
              background: "linear-gradient(180deg,#fff5d6,#ffd994)",
              animation: "slide-up-fade 0.5s ease-out both",
            }}
          >
            <p className="font-display text-3xl text-[#5a2a0a] md:text-4xl">
              {level.tutorial.title}
            </p>
            <p className="font-hand mt-3 text-xl text-[#5a2a0a] md:text-2xl">
              {level.tutorial.body}
            </p>
            <button
              type="button"
              className="font-display mt-5 rounded-full bg-[#c24a1a] px-7 py-2 text-xl text-white shadow-lg hover:bg-[#a83a14]"
            >
              Let&apos;s go!
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
