import { memo } from "react";

interface VillageBackdropProps {
  brightness: number; // 0..1
}

/**
 * Detailed layered Indian village scene — moon, mountains, peepal trees,
 * a central temple, rows of village houses with balconies, garlands,
 * rangoli on the ground, and hanging diya strings.
 */
function VillageBackdropBase({ brightness }: VillageBackdropProps) {
  const b = Math.max(0, Math.min(1, brightness));
  const win = b * b; // windows stay completely dark until brightness rises

  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Sky — completely black at b=0, slowly warms */}
      <div
        className="absolute inset-0 transition-[background] duration-1000"
        style={{
          background: `linear-gradient(180deg,
            oklch(${0.02 + b * 0.13} ${0.02 + b * 0.06} 275) 0%,
            oklch(${0.04 + b * 0.18} ${0.04 + b * 0.08} ${280 - b * 30}) 40%,
            oklch(${0.06 + b * 0.26} ${0.05 + b * 0.08} ${310 - b * 40}) 75%,
            oklch(${0.08 + b * 0.3} ${0.05 + b * 0.08} ${340 - b * 30}) 100%)`,
        }}
      />

      {/* Horizon bloom (off when dark) */}
      <div
        className="absolute inset-x-0 bottom-0 h-[55%] transition-opacity duration-1000"
        style={{
          background:
            "radial-gradient(ellipse at 50% 100%, oklch(0.78 0.2 45 / 0.5) 0%, transparent 70%)",
          opacity: b * 0.9,
        }}
      />

      {/* Moon — barely visible at start */}
      <div
        className="absolute transition-opacity duration-1000"
        style={{
          right: "10%",
          top: "10%",
          width: 110,
          height: 110,
          borderRadius: "50%",
          opacity: 0.3 + b * 0.7,
          background:
            "radial-gradient(circle at 35% 35%, oklch(0.98 0.04 90) 0%, oklch(0.86 0.06 80) 60%, oklch(0.6 0.04 80 / 0) 100%)",
          boxShadow: `0 0 ${40 + b * 60}px oklch(0.96 0.05 90 / ${0.2 + b * 0.35})`,
        }}
      />


      <svg viewBox="0 0 1600 900" preserveAspectRatio="xMidYMax slice" className="absolute inset-0 h-full w-full">
        <defs>
          <linearGradient id="mountains" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="oklch(0.2 0.08 280)" />
            <stop offset="100%" stopColor="oklch(0.12 0.06 275)" />
          </linearGradient>
          <linearGradient id="ground" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={`oklch(${0.24 + b * 0.12} 0.08 ${30 - b * 5})`} />
            <stop offset="100%" stopColor={`oklch(${0.08 + b * 0.06} 0.05 20)`} />
          </linearGradient>
          <linearGradient id="houseWall" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={`oklch(${0.32 + b * 0.2} 0.08 ${40 - b * 5})`} />
            <stop offset="100%" stopColor={`oklch(${0.16 + b * 0.1} 0.06 30)`} />
          </linearGradient>
          <linearGradient id="templeRoof" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={`oklch(${0.45 + b * 0.2} 0.15 30)`} />
            <stop offset="100%" stopColor={`oklch(${0.25 + b * 0.12} 0.1 25)`} />
          </linearGradient>
        </defs>

        {/* Distant mountains */}
        <path
          d="M 0 600 L 180 460 L 320 540 L 480 410 L 640 520 L 820 440 L 980 510 L 1180 450 L 1360 520 L 1600 470 L 1600 700 L 0 700 Z"
          fill="url(#mountains)"
          opacity="0.9"
        />
        {/* Mid hills */}
        <path
          d="M 0 660 L 240 580 L 460 640 L 720 560 L 960 630 L 1240 570 L 1600 620 L 1600 700 L 0 700 Z"
          fill={`oklch(${0.16 + b * 0.06} 0.08 280)`}
          opacity="0.9"
        />

        {/* Peepal trees silhouettes (left & right) */}
        {[
          { x: 60, scale: 1.1 },
          { x: 1500, scale: 1 },
        ].map((t, i) => (
          <g key={i} transform={`translate(${t.x} 530) scale(${t.scale})`}>
            <rect x="-6" y="0" width="12" height="120" fill="#2a1a35" />
            <circle cx="0" cy="-20" r="70" fill="oklch(0.2 0.08 150)" opacity="0.95" />
            <circle cx="-40" cy="10" r="44" fill="oklch(0.22 0.08 150)" opacity="0.9" />
            <circle cx="40" cy="10" r="44" fill="oklch(0.22 0.08 150)" opacity="0.9" />
            <circle cx="-15" cy="-55" r="36" fill="oklch(0.24 0.09 150)" opacity="0.9" />
          </g>
        ))}

        {/* Temple — onion-dome (Indian mandir) silhouette, NOT a tiered tree */}
        <g transform="translate(700 380)" opacity="0.98">
          {/* base platform */}
          <rect x="-20" y="210" width="240" height="30" fill={`oklch(${0.3 + b * 0.1} 0.06 30)`} />
          {/* main hall */}
          <rect x="20" y="120" width="160" height="100" fill="url(#houseWall)" />
          {/* arched doorway with glow */}
          <path
            d="M 80 220 L 80 170 Q 100 148 120 170 L 120 220 Z"
            fill="oklch(0.9 0.22 60)"
            opacity={0.3 + win * 0.7}
          />
          {/* side mini arched windows */}
          <path d="M 38 175 L 38 155 Q 48 142 58 155 L 58 175 Z" fill="oklch(0.85 0.2 60)" opacity={win} />
          <path d="M 142 175 L 142 155 Q 152 142 162 155 L 162 175 Z" fill="oklch(0.85 0.2 60)" opacity={win} />
          {/* corner pillars */}
          <rect x="22" y="120" width="10" height="100" fill={`oklch(${0.22 + b * 0.08} 0.06 30)`} />
          <rect x="168" y="120" width="10" height="100" fill={`oklch(${0.22 + b * 0.08} 0.06 30)`} />
          {/* roof ledge */}
          <rect x="14" y="112" width="172" height="12" rx="3" fill="url(#templeRoof)" />
          {/* central onion dome */}
          <path
            d="M 60 112 Q 60 80 75 70 Q 70 50 100 40 Q 130 50 125 70 Q 140 80 140 112 Z"
            fill="url(#templeRoof)"
          />
          {/* dome highlight */}
          <path d="M 80 70 Q 90 56 100 52" stroke={`oklch(${0.7 + b * 0.15} 0.16 35)`} strokeWidth="3" fill="none" opacity="0.7" />
          {/* finial / kalash */}
          <rect x="98" y="22" width="4" height="20" fill={`oklch(${0.65 + b * 0.2} 0.18 60)`} />
          <circle cx="100" cy="18" r="5" fill={`oklch(${0.9 + b * 0.05} 0.16 80)`} />
          <path d="M 100 12 L 100 4" stroke={`oklch(${0.9 + b * 0.05} 0.16 80)`} strokeWidth="2" />
          {/* two smaller side domes */}
          <path
            d="M 18 132 Q 18 116 28 110 Q 38 116 38 132 Z"
            fill="url(#templeRoof)"
          />
          <path
            d="M 162 132 Q 162 116 172 110 Q 182 116 182 132 Z"
            fill="url(#templeRoof)"
          />
          {/* hanging bells */}
          <circle cx="50" cy="135" r="4" fill="oklch(0.78 0.18 70)" opacity={0.5 + b * 0.5} />
          <circle cx="150" cy="135" r="4" fill="oklch(0.78 0.18 70)" opacity={0.5 + b * 0.5} />
        </g>

        {/* Row of detailed houses */}
        {[
          { x: 60, w: 200, h: 220, roof: 70 },
          { x: 290, w: 170, h: 190, roof: 55 },
          { x: 490, w: 220, h: 240, roof: 80 },
          { x: 920, w: 190, h: 210, roof: 60 },
          { x: 1130, w: 220, h: 250, roof: 80 },
          { x: 1380, w: 180, h: 205, roof: 60 },
        ].map((h, i) => (
          <g key={i} transform={`translate(${h.x} ${670 - h.h})`}>
            <rect width={h.w} height={h.h} fill="url(#houseWall)" />
            {/* roof */}
            <polygon
              points={`0,0 ${h.w / 2},${-h.roof} ${h.w},0`}
              fill={`oklch(${0.32 + b * 0.15} 0.14 30)`}
            />
            {/* roof tiles */}
            <path
              d={`M 0 0 L ${h.w} 0`}
              stroke={`oklch(${0.42 + b * 0.15} 0.13 30)`}
              strokeWidth="3"
              opacity="0.6"
            />
            {/* balcony */}
            <rect x={h.w * 0.2} y={h.h * 0.5} width={h.w * 0.6} height="6" fill={`oklch(${0.25 + b * 0.08} 0.06 30)`} />
            {/* balcony rails */}
            {[0.25, 0.4, 0.55, 0.7].map((p) => (
              <rect key={p} x={h.w * p} y={h.h * 0.5 - 10} width="2" height="10" fill={`oklch(${0.3 + b * 0.1} 0.06 30)`} />
            ))}
            {/* arched windows */}
            <path
              d={`M ${h.w * 0.26} ${h.h * 0.35} v ${-h.h * 0.05} a ${h.w * 0.08} ${h.h * 0.05} 0 0 1 ${h.w * 0.16} 0 v ${h.h * 0.05} z`}
              fill="oklch(0.9 0.18 60)"
              opacity={win * (0.6 + (i % 3) * 0.15)}
            />
            <path
              d={`M ${h.w * 0.58} ${h.h * 0.35} v ${-h.h * 0.05} a ${h.w * 0.08} ${h.h * 0.05} 0 0 1 ${h.w * 0.16} 0 v ${h.h * 0.05} z`}
              fill="oklch(0.9 0.18 60)"
              opacity={win * (0.7 + (i % 2) * 0.15)}
            />
            {/* door */}
            <rect
              x={h.w * 0.42}
              y={h.h * 0.62}
              width={h.w * 0.16}
              height={h.h * 0.38}
              rx="6"
              fill={`oklch(${0.16 + b * 0.05} 0.07 30)`}
            />
            {/* tiny diya by door */}
            <circle cx={h.w * 0.36} cy={h.h * 0.95} r="3" fill="oklch(0.92 0.18 70)" opacity={0.4 + b * 0.6}>
              <animate attributeName="r" values="3;3.6;3" dur="1.6s" repeatCount="indefinite" />
            </circle>
            {/* marigold garland */}
            <path
              d={`M ${h.w * 0.08} ${h.h * 0.27} Q ${h.w * 0.5} ${h.h * 0.16} ${h.w * 0.92} ${h.h * 0.27}`}
              stroke="oklch(0.78 0.2 55)"
              strokeWidth="3"
              strokeDasharray="3 2"
              fill="none"
              opacity={0.5 + b * 0.5}
            />
            {/* rangoli dot pattern at door */}
            {b > 0.2 && (
              <g opacity={b}>
                {[-12, 0, 12].map((dx) => (
                  <circle key={dx} cx={h.w * 0.5 + dx} cy={h.h * 1.02} r="2" fill="oklch(0.88 0.18 30)" />
                ))}
              </g>
            )}
          </g>
        ))}

        {/* Foreground ground */}
        <path d="M 0 670 L 1600 670 L 1600 900 L 0 900 Z" fill="url(#ground)" />

        {/* Path running through */}
        <path
          d="M 200 900 Q 800 750 1400 900"
          stroke={`oklch(${0.32 + b * 0.12} 0.06 50)`}
          strokeWidth="40"
          fill="none"
          opacity="0.6"
        />

        {/* Foreground rangoli (only visible when village awakens) */}
        {b > 0.3 && (
          <g transform="translate(800 820)" opacity={b}>
            {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => {
              const x = Math.cos((deg * Math.PI) / 180) * 38;
              const y = Math.sin((deg * Math.PI) / 180) * 18;
              const c = deg % 90 === 0 ? "#ff5a7a" : "#ffd24d";
              return <circle key={deg} cx={x} cy={y} r="5" fill={c} />;
            })}
            <circle cx="0" cy="0" r="8" fill="#fff" opacity="0.9" />
          </g>
        )}

        {/* Foreground grass + flower hints */}
        {Array.from({ length: 50 }).map((_, i) => {
          const x = (i / 50) * 1600 + (i * 37) % 23;
          return (
            <circle
              key={i}
              cx={x}
              cy={690 + ((i * 53) % 200)}
              r={2 + (i % 3)}
              fill={i % 2 ? "oklch(0.78 0.2 55)" : "oklch(0.7 0.21 15)"}
              opacity={0.4 + b * 0.5}
            />
          );
        })}
      </svg>

      {/* Hanging lantern strings */}
      <div className="absolute inset-x-0 top-0 h-36 pointer-events-none">
        <svg viewBox="0 0 1600 130" preserveAspectRatio="none" className="h-full w-full">
          <path
            d="M 0 28 Q 400 58 800 28 T 1600 28"
            stroke="oklch(0.5 0.05 30)"
            strokeWidth="2"
            fill="none"
          />
          {Array.from({ length: 18 }).map((_, i) => {
            const x = 40 + i * 90;
            const stringY = 28 + 30 * Math.sin((Math.PI * x) / 800) ** 2;
            const y = stringY + 24;
            const hue = i % 3 === 0 ? 45 : i % 3 === 1 ? 15 : 80;
            return (
              <g key={i} transform={`translate(${x} ${y})`}>
                <line x1="0" y1="-24" x2="0" y2="0" stroke="oklch(0.4 0.05 30)" strokeWidth="1.5" />
                <ellipse
                  cx="0"
                  cy="14"
                  rx="13"
                  ry="18"
                  fill={`oklch(0.7 0.2 ${hue})`}
                  opacity={0.45 + b * 0.55}
                  style={{
                    filter: `drop-shadow(0 0 ${6 + b * 18}px oklch(0.78 0.2 ${hue} / ${0.4 + b * 0.6}))`,
                  }}
                />
                <line x1="0" y1="32" x2="0" y2="38" stroke="oklch(0.4 0.05 30)" strokeWidth="1" />
                <path d="M -3 38 L 0 44 L 3 38" stroke="oklch(0.5 0.06 30)" strokeWidth="1" fill="none" />
              </g>
            );
          })}
        </svg>
      </div>

      {/* Vignette — heavy when dark, lifts as village wakes */}
      <div
        className="absolute inset-0 pointer-events-none transition-opacity duration-1000"
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 25%, oklch(0.02 0.02 270 / 0.95) 100%)",
          opacity: 1 - b * 0.5,
        }}
      />
      {/* Full black overlay that lifts as brightness grows */}
      <div
        className="absolute inset-0 pointer-events-none bg-black transition-opacity duration-1000"
        style={{ opacity: Math.max(0, 0.78 - b * 1.2) }}
      />

    </div>
  );
}

export const VillageBackdrop = memo(VillageBackdropBase);
