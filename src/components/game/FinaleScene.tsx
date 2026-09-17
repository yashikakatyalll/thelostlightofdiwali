import { useEffect, useMemo, useState } from "react";
import { Heart, RotateCcw } from "lucide-react";
import { Elephant } from "./Elephant";
import { VillageBackdrop } from "./VillageBackdrop";
import { Fireflies, StarField } from "./Particles";
import { Diya } from "./Diya";
import { sfx } from "@/game/audio";

interface FinaleSceneProps {
  onReplay: () => void;
}

/** Lavish but cohesive finale: warm fireworks, rising lanterns, two big
 *  cute hand-animated dancers (woman in sari + man in kurta) flanking the
 *  hero elephant. */
export function FinaleScene({ onReplay }: FinaleSceneProps) {
  const [showButton, setShowButton] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setShowButton(true), 12000);
    const fireworkTimers = [700, 1900, 3400, 5400, 7900].map((delay) =>
      window.setTimeout(() => sfx.firework(), delay),
    );
    return () => {
      clearTimeout(t);
      fireworkTimers.forEach(clearTimeout);
    };
  }, []);

  // Particle fireworks — burst in all directions like real ones.
  const fireworks = useMemo(
    () =>
      Array.from({ length: 10 }).map((_, i) => ({
        id: i,
        x: 8 + (i / 9) * 84 + (Math.random() - 0.5) * 6,
        y: 8 + Math.random() * 38,
        delay: 0.3 + Math.random() * 11,
        hue: [45, 30, 15, 60, 75, 25, 50, 40, 20, 55][i % 10],
        size: 180 + Math.random() * 130,
        particles: 30 + Math.floor(Math.random() * 10),
      })),
    [],
  );

  const lanterns = useMemo(
    () =>
      Array.from({ length: 16 }).map((_, i) => ({
        id: i,
        x: 5 + ((i * 37) % 90),
        start: -12 - (i % 4) * 9,
        delay: (i * 1.7) % 14,
        dur: 11 + Math.random() * 7,
        dx: (Math.random() - 0.5) * 120 + "px",
        hue: i % 2 === 0 ? 45 : 25,
        size: 26 + Math.random() * 22,
      })),
    [],
  );

  // Diyas scattered along the ground.
  const diyas = useMemo(
    () =>
      Array.from({ length: 14 }).map((_, i) => ({
        id: i,
        x: 4 + (i / 13) * 92 + (Math.random() - 0.5) * 4,
        y: 80 + Math.sin(i * 0.9) * 5,
        size: (i % 3 === 0 ? "lg" : i % 2 === 0 ? "md" : "sm") as "sm" | "md" | "lg",
      })),
    [],
  );

  return (
    <div className="relative h-full w-full overflow-hidden">
      <VillageBackdrop brightness={1} />
      <StarField count={120} />
      <Fireflies count={60} />

      {/* Rising lanterns */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {lanterns.map((l) => (
          <div
            key={l.id}
            className="absolute"
            style={
              {
                left: `${l.x}%`,
                bottom: `${l.start}%`,
                animation: `rise-lantern ${l.dur}s ease-in infinite`,
                animationDelay: `${l.delay}s`,
                "--dx": l.dx,
              } as React.CSSProperties
            }
          >
            <div
              className="rounded-[40%]"
              style={{
                width: l.size,
                height: l.size * 1.3,
                background: `radial-gradient(circle, oklch(0.9 0.18 ${l.hue}), oklch(0.6 0.2 ${l.hue}))`,
                boxShadow: `0 0 ${l.size}px oklch(0.78 0.2 ${l.hue} / 0.7)`,
              }}
            />
          </div>
        ))}
      </div>

      {/* Particle fireworks — radiate in all directions, then fade with gravity */}
      <div className="absolute inset-0 pointer-events-none">
        {fireworks.map((f) => (
          <div key={f.id} className="absolute" style={{ left: `${f.x}%`, top: `${f.y}%` }}>
            <div
              className="absolute rounded-full"
              style={{
                width: f.size * 0.26,
                height: f.size * 0.26,
                left: -f.size * 0.13,
                top: -f.size * 0.13,
                background: `radial-gradient(circle, oklch(0.98 0.22 ${f.hue} / 0.9), transparent 70%)`,
                animation: "firework-burst 2s ease-out infinite",
                animationDelay: `${f.delay}s`,
              }}
            />
            {Array.from({ length: f.particles }).map((_, k) => {
              const angle = (k / f.particles) * Math.PI * 2 + Math.random() * 0.2;
              const r = f.size * (0.45 + Math.random() * 0.35);
              const tx = Math.cos(angle) * r;
              const ty = Math.sin(angle) * r;
              const hue = f.hue + (Math.random() * 16 - 8);
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
                      animation: "firework-particle 2s cubic-bezier(.2,.7,.3,1) infinite",
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

      {/* Foreground diyas all lit */}
      {diyas.map((d) => (
        <Diya key={d.id} pos={{ x: d.x, y: d.y }} lit size={d.size} />
      ))}

      {/* Two big dancers flanking the elephant — gentle sway, no spinning */}
      <div
        className="absolute left-[8%] bottom-[3%] pointer-events-none z-10"
        style={{ animation: "slide-up-fade 1s ease-out 0.6s both" }}
      >
        <WomanDancer size={Math.min(260, typeof window !== "undefined" ? window.innerHeight * 0.5 : 240)} />
      </div>
      <div
        className="absolute right-[8%] bottom-[3%] pointer-events-none z-10"
        style={{ animation: "slide-up-fade 1s ease-out 0.8s both" }}
      >
        <ManDancer size={Math.min(260, typeof window !== "undefined" ? window.innerHeight * 0.5 : 240)} />
      </div>

      {/* Hero elephant in the center */}
      <div
        className="absolute left-1/2 bottom-[3%] -translate-x-1/2 pointer-events-none z-20"
        style={{ animation: "slide-up-fade 1.4s ease-out 0.3s both" }}
      >
        <Elephant size={Math.min(280, typeof window !== "undefined" ? window.innerHeight * 0.55 : 260)} celebrating />
      </div>

      {/* Title card — wrapped in a translucent panel so text is readable
          against the fireworks/lanterns/dancers behind it. */}
      <div
        className="absolute inset-x-0 top-6 flex justify-center px-4 z-20"
        style={{ animation: "slide-up-fade 1s ease-out 0.6s both" }}
      >
        <div
          className="max-w-3xl rounded-3xl px-8 py-5 text-center ring-1 ring-white/20"
          style={{
            background:
              "linear-gradient(180deg, oklch(0.12 0.06 280 / 0.7), oklch(0.18 0.08 30 / 0.55))",
            backdropFilter: "blur(10px)",
            WebkitBackdropFilter: "blur(10px)",
            boxShadow: "0 10px 40px oklch(0.05 0 0 / 0.6)",
          }}
        >
          <div className="flex items-center justify-center gap-2 text-[oklch(0.92_0.16_75)]">
            <Heart className="h-4 w-4 fill-current" />
            <span className="font-display text-xs uppercase tracking-[0.4em]">Happy Diwali</span>
            <Heart className="h-4 w-4 fill-current" />
          </div>
          <h1
            className="mt-2 font-display text-4xl text-white sm:text-5xl md:text-6xl leading-tight"
            style={{ animation: "title-glow 3s ease-in-out infinite" }}
          >
            You brought the festival back
          </h1>
          <p className="font-hand mt-4 text-xl text-white md:text-2xl">
            The whole village is dancing because of you.
          </p>
        </div>
      </div>

      {showButton && (
        <button
          type="button"
          onClick={onReplay}
          className="absolute bottom-6 left-1/2 -translate-x-1/2 inline-flex items-center gap-2 rounded-full bg-white/15 px-7 py-3 font-display text-base text-white backdrop-blur-md ring-1 ring-white/30 transition hover:bg-white/25 z-30"
          style={{ animation: "slide-up-fade 0.6s ease-out both" }}
        >
          <RotateCcw className="h-4 w-4" />
          Play Again
        </button>
      )}
    </div>
  );
}

/* ===== Big animated dancers — same illustration style as the elephant ===== */

function WomanDancer({ size }: { size: number }) {
  return (
    <div
      className="relative select-none"
      style={{
        width: size * 0.7,
        height: size,
        animation: "villager-dance 1.2s ease-in-out infinite",
        transformOrigin: "50% 100%",
        filter: "drop-shadow(0 22px 26px oklch(0.06 0.04 270 / 0.6))",
      }}
    >
      <svg viewBox="0 0 140 200" className="absolute inset-0 h-full w-full">
        <defs>
          <linearGradient id="sari" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#ff6a8a" />
            <stop offset="100%" stopColor="#a82550" />
          </linearGradient>
          <radialGradient id="wSkin" cx="50%" cy="40%" r="60%">
            <stop offset="0%" stopColor="#f0c69a" />
            <stop offset="100%" stopColor="#b87a4a" />
          </radialGradient>
        </defs>

        {/* shadow */}
        <ellipse cx="70" cy="196" rx="46" ry="5" fill="#000" opacity="0.45" />

        {/* sari skirt — bell shape */}
        <path
          d="M 32 100 Q 8 170 14 192 Q 70 200 126 192 Q 132 170 108 100 Q 70 108 32 100 Z"
          fill="url(#sari)"
        />
        {/* gold border on hem */}
        <path d="M 14 188 Q 70 198 126 188" stroke="#ffd24d" strokeWidth="4" fill="none" />
        <path d="M 18 180 Q 70 188 122 180" stroke="#fff2cc" strokeWidth="1.5" fill="none" opacity="0.8" />
        {/* gold trim line up the sari */}
        <path d="M 70 108 L 70 188" stroke="#ffd24d" strokeWidth="1.5" opacity="0.7" />

        {/* blouse (choli) */}
        <path d="M 40 70 Q 70 64 100 70 L 96 102 Q 70 100 44 102 Z" fill="#3a1230" />
        {/* gold neckline */}
        <path d="M 56 72 Q 70 76 84 72" stroke="#ffd24d" strokeWidth="2" fill="none" />

        {/* Arms — swaying with the dance animation by being inside the group */}
        <g style={{ transformOrigin: "44px 78px", animation: "ear-wiggle 1.6s ease-in-out infinite" }}>
          <path d="M 44 78 Q 22 60 18 30" stroke="url(#wSkin)" strokeWidth="10" fill="none" strokeLinecap="round" />
          <circle cx="18" cy="28" r="6" fill="url(#wSkin)" />
          {/* gold bangles */}
          <circle cx="26" cy="50" r="6" fill="none" stroke="#ffd24d" strokeWidth="1.5" />
          <circle cx="22" cy="40" r="6" fill="none" stroke="#ffd24d" strokeWidth="1.5" />
        </g>
        <g style={{ transformOrigin: "96px 78px", animation: "ear-wiggle 1.6s ease-in-out infinite reverse" }}>
          <path d="M 96 78 Q 118 60 122 30" stroke="url(#wSkin)" strokeWidth="10" fill="none" strokeLinecap="round" />
          <circle cx="122" cy="28" r="6" fill="url(#wSkin)" />
          <circle cx="114" cy="50" r="6" fill="none" stroke="#ffd24d" strokeWidth="1.5" />
          <circle cx="118" cy="40" r="6" fill="none" stroke="#ffd24d" strokeWidth="1.5" />
        </g>

        {/* Sari pallu draped over shoulder */}
        <path d="M 96 70 Q 116 80 108 110 Q 96 124 88 100 Z" fill="url(#sari)" opacity="0.95" />
        <path d="M 96 72 Q 114 82 108 108" stroke="#ffd24d" strokeWidth="1.5" fill="none" />

        {/* Head */}
        <ellipse cx="70" cy="48" rx="22" ry="24" fill="url(#wSkin)" />
        {/* Hair */}
        <path d="M 48 48 Q 48 22 70 20 Q 92 22 92 48 Q 92 36 70 34 Q 50 36 48 48 Z" fill="#1a0a1a" />
        {/* hair bun */}
        <ellipse cx="70" cy="20" rx="10" ry="7" fill="#1a0a1a" />
        {/* flower in hair */}
        <g style={{ transformOrigin: "82px 24px" }}>
          <circle cx="82" cy="24" r="4" fill="#ff7ab0" />
          <circle cx="82" cy="24" r="1.6" fill="#ffd24d" />
        </g>
        {/* Bindi */}
        <circle cx="70" cy="36" r="2" fill="#c24a1a" />
        {/* Eyes — same style as elephant: large with white highlight */}
        <g style={{ animation: "blink 4s ease-in-out infinite", transformOrigin: "62px 46px" }}>
          <ellipse cx="62" cy="46" rx="3.4" ry="4.6" fill="#fff" />
          <ellipse cx="62.4" cy="47" rx="2.6" ry="3.6" fill="#1a1830" />
          <circle cx="63" cy="46" r="1" fill="#fff" />
        </g>
        <g style={{ animation: "blink 4s ease-in-out infinite", transformOrigin: "78px 46px" }}>
          <ellipse cx="78" cy="46" rx="3.4" ry="4.6" fill="#fff" />
          <ellipse cx="78.4" cy="47" rx="2.6" ry="3.6" fill="#1a1830" />
          <circle cx="79" cy="46" r="1" fill="#fff" />
        </g>
        {/* eyelashes */}
        <path d="M 58 42 L 56 40" stroke="#1a1830" strokeWidth="1" />
        <path d="M 82 42 L 84 40" stroke="#1a1830" strokeWidth="1" />
        {/* Cheeks */}
        <circle cx="56" cy="54" r="3" fill="#ff8aa0" opacity="0.7" />
        <circle cx="84" cy="54" r="3" fill="#ff8aa0" opacity="0.7" />
        {/* Smile */}
        <path d="M 64 58 Q 70 63 76 58" stroke="#3a1a08" strokeWidth="1.6" fill="none" strokeLinecap="round" />
        {/* Earrings */}
        <circle cx="48" cy="50" r="2" fill="#ffd24d" />
        <circle cx="92" cy="50" r="2" fill="#ffd24d" />
        {/* Nose ring */}
        <circle cx="74" cy="50" r="1.2" fill="none" stroke="#ffd24d" strokeWidth="0.8" />
      </svg>
    </div>
  );
}

function ManDancer({ size }: { size: number }) {
  return (
    <div
      className="relative select-none"
      style={{
        width: size * 0.7,
        height: size,
        animation: "villager-dance 1.3s ease-in-out infinite",
        animationDelay: "0.15s",
        transformOrigin: "50% 100%",
        filter: "drop-shadow(0 22px 26px oklch(0.06 0.04 270 / 0.6))",
      }}
    >
      <svg viewBox="0 0 140 200" className="absolute inset-0 h-full w-full">
        <defs>
          <linearGradient id="kurta" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#fff0c0" />
            <stop offset="100%" stopColor="#e6b13a" />
          </linearGradient>
          <radialGradient id="mSkin" cx="50%" cy="40%" r="60%">
            <stop offset="0%" stopColor="#e8b48a" />
            <stop offset="100%" stopColor="#a86a40" />
          </radialGradient>
        </defs>

        {/* shadow */}
        <ellipse cx="70" cy="196" rx="44" ry="5" fill="#000" opacity="0.45" />

        {/* Dhoti / pants — white with gold border */}
        <path d="M 38 130 L 30 192 L 64 192 L 68 130 Z" fill="#fff5e0" />
        <path d="M 72 130 L 76 192 L 110 192 L 102 130 Z" fill="#fff5e0" />
        <path d="M 30 192 L 64 192" stroke="#ffd24d" strokeWidth="2" />
        <path d="M 76 192 L 110 192" stroke="#ffd24d" strokeWidth="2" />

        {/* Kurta tunic */}
        <path
          d="M 36 70 Q 70 64 104 70 L 108 135 Q 70 144 32 135 Z"
          fill="url(#kurta)"
        />
        {/* kurta neckline */}
        <path d="M 60 70 L 70 84 L 80 70" stroke="#a8530a" strokeWidth="2" fill="none" />
        {/* embroidery */}
        <path d="M 70 86 L 70 132" stroke="#a8530a" strokeWidth="1.5" opacity="0.7" />
        <circle cx="70" cy="92" r="1.6" fill="#c24a1a" />
        <circle cx="70" cy="102" r="1.6" fill="#c24a1a" />
        <circle cx="70" cy="112" r="1.6" fill="#c24a1a" />

        {/* Sash */}
        <path d="M 32 100 Q 70 108 108 100 L 108 110 Q 70 118 32 110 Z" fill="#c24a1a" />

        {/* Arms — swaying */}
        <g style={{ transformOrigin: "40px 76px", animation: "ear-wiggle 1.5s ease-in-out infinite reverse" }}>
          <path d="M 40 76 Q 18 64 14 34" stroke="url(#kurta)" strokeWidth="14" fill="none" strokeLinecap="round" />
          <circle cx="14" cy="32" r="6" fill="url(#mSkin)" />
        </g>
        <g style={{ transformOrigin: "100px 76px", animation: "ear-wiggle 1.5s ease-in-out infinite" }}>
          <path d="M 100 76 Q 122 64 126 34" stroke="url(#kurta)" strokeWidth="14" fill="none" strokeLinecap="round" />
          <circle cx="126" cy="32" r="6" fill="url(#mSkin)" />
        </g>

        {/* Head */}
        <ellipse cx="70" cy="50" rx="22" ry="24" fill="url(#mSkin)" />

        {/* Turban (pagri) — bright orange */}
        <path
          d="M 46 42 Q 50 18 70 16 Q 90 18 94 42 Q 88 36 70 36 Q 52 36 46 42 Z"
          fill="#ff7a2a"
        />
        <path d="M 50 32 Q 70 22 90 32" stroke="#c24a1a" strokeWidth="1.5" fill="none" />
        {/* feather/jewel on turban */}
        <circle cx="86" cy="22" r="3" fill="#ffd24d" stroke="#a8530a" strokeWidth="1" />

        {/* Eyes — large with highlight (same as elephant style) */}
        <g style={{ animation: "blink 4.2s ease-in-out infinite", transformOrigin: "62px 50px" }}>
          <ellipse cx="62" cy="50" rx="3.4" ry="4.6" fill="#fff" />
          <ellipse cx="62.4" cy="51" rx="2.6" ry="3.6" fill="#1a1830" />
          <circle cx="63" cy="50" r="1" fill="#fff" />
        </g>
        <g style={{ animation: "blink 4.2s ease-in-out infinite", transformOrigin: "78px 50px" }}>
          <ellipse cx="78" cy="50" rx="3.4" ry="4.6" fill="#fff" />
          <ellipse cx="78.4" cy="51" rx="2.6" ry="3.6" fill="#1a1830" />
          <circle cx="79" cy="50" r="1" fill="#fff" />
        </g>
        {/* Brows */}
        <path d="M 58 44 Q 62 42 66 44" stroke="#3a1a08" strokeWidth="1.4" fill="none" strokeLinecap="round" />
        <path d="M 74 44 Q 78 42 82 44" stroke="#3a1a08" strokeWidth="1.4" fill="none" strokeLinecap="round" />
        {/* Cheeks */}
        <circle cx="56" cy="58" r="3" fill="#ff8a70" opacity="0.6" />
        <circle cx="84" cy="58" r="3" fill="#ff8a70" opacity="0.6" />
        {/* Smile */}
        <path d="M 62 62 Q 70 68 78 62" stroke="#3a1a08" strokeWidth="1.6" fill="none" strokeLinecap="round" />
        {/* Mustache (curled) */}
        <path d="M 62 60 Q 66 58 70 60 Q 74 58 78 60" stroke="#2a1408" strokeWidth="2" fill="none" strokeLinecap="round" />
      </svg>
    </div>
  );
}
