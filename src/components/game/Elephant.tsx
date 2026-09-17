import { memo } from "react";

interface ElephantProps {
  pointing?: boolean;
  celebrating?: boolean;
  dancing?: boolean;
  sad?: boolean;
  size?: number;
}

/**
 * Cute mascot elephant — chunky body, four short tucked legs, big head,
 * huge eyes. Pure SVG, animated with CSS. Supports a 'sad' state for
 * the intro storybook moment.
 */
function ElephantBase({
  pointing = false,
  celebrating = false,
  dancing = false,
  sad = false,
  size = 320,
}: ElephantProps) {
  const anim = celebrating
    ? "happy-bounce 1.1s ease-in-out infinite"
    : dancing
      ? "elephant-dance 1.6s ease-in-out infinite"
      : sad
        ? "sad-sway 3.5s ease-in-out infinite"
        : "float-soft 4s ease-in-out infinite";

  return (
    <div
      className="relative select-none pointer-events-none"
      style={{
        height: size,
        width: size * 1.1,
        animation: anim,
        filter: "drop-shadow(0 26px 30px oklch(0.06 0.04 270 / 0.65))",
      }}
    >
      <svg viewBox="0 0 220 220" className="absolute inset-0 h-full w-full">
        <defs>
          <radialGradient id="elBody" cx="50%" cy="35%" r="75%">
            <stop offset="0%" stopColor="#e6cfff" />
            <stop offset="55%" stopColor="#a48bd9" />
            <stop offset="100%" stopColor="#5e468f" />
          </radialGradient>
          <radialGradient id="elBelly" cx="50%" cy="50%" r="60%">
            <stop offset="0%" stopColor="#f2dcff" />
            <stop offset="100%" stopColor="#a48bd9" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="elEar" cx="50%" cy="40%" r="60%">
            <stop offset="0%" stopColor="#f6c8b6" />
            <stop offset="100%" stopColor="#b86859" />
          </radialGradient>
          <radialGradient id="cheek" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#ff9cb8" stopOpacity="0.95" />
            <stop offset="100%" stopColor="#ff9cb8" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* ground shadow */}
        <ellipse cx="110" cy="200" rx="78" ry="6" fill="#000" opacity="0.35" />

        {/* === Legs — four chunky stubby legs tucked under the body === */}
        {[
          { cx: 72, cy: 188 },
          { cx: 96, cy: 192 },
          { cx: 130, cy: 192 },
          { cx: 154, cy: 188 },
        ].map((l, i) => (
          <g key={i}>
            {/* leg */}
            <ellipse cx={l.cx} cy={l.cy - 6} rx="14" ry="18" fill="#7a60b8" />
            {/* foot */}
            <ellipse cx={l.cx} cy={l.cy + 6} rx="15" ry="7" fill="#4d367d" />
            {/* toenails */}
            <circle cx={l.cx - 7} cy={l.cy + 8} r="1.8" fill="#fff2e0" />
            <circle cx={l.cx} cy={l.cy + 9} r="1.8" fill="#fff2e0" />
            <circle cx={l.cx + 7} cy={l.cy + 8} r="1.8" fill="#fff2e0" />
          </g>
        ))}

        {/* === Body — rounded oval === */}
        <ellipse cx="113" cy="150" rx="74" ry="42" fill="url(#elBody)" />
        <ellipse cx="113" cy="162" rx="58" ry="22" fill="url(#elBelly)" opacity="0.7" />

        {/* Tail */}
        <path
          d="M 184 148 Q 200 152 198 168"
          stroke="#6f57a8"
          strokeWidth="6"
          fill="none"
          strokeLinecap="round"
        />
        <circle cx="198" cy="170" r="5" fill="#3e2a66" />

        {/* === Ears (oversized, wiggling) === */}
        <g
          style={{
            transformOrigin: "60px 100px",
            animation: sad
              ? "none"
              : "ear-wiggle 3.5s ease-in-out infinite",
          }}
        >
          <ellipse cx="48" cy="104" rx="32" ry="42" fill="url(#elEar)" />
          <ellipse cx="50" cy="106" rx="18" ry="28" fill="#ff9cb8" opacity="0.45" />
        </g>
        <g
          style={{
            transformOrigin: "160px 100px",
            animation: sad
              ? "none"
              : "ear-wiggle 3.5s ease-in-out infinite reverse",
          }}
        >
          <ellipse cx="178" cy="104" rx="32" ry="42" fill="url(#elEar)" />
          <ellipse cx="176" cy="106" rx="18" ry="28" fill="#ff9cb8" opacity="0.45" />
        </g>

        {/* === Big head === */}
        <ellipse cx="113" cy="100" rx="60" ry="60" fill="url(#elBody)" />

        {/* Diwali forehead jewel + tilak */}
        <circle cx="113" cy="58" r="5.5" fill="#ffd24d" stroke="#b86a1c" strokeWidth="1.4" />
        <path d="M 97 68 Q 113 76 129 68" stroke="#ffd24d" strokeWidth="2" fill="none" opacity="0.85" />

        {/* Cheeks */}
        <ellipse cx="79" cy="116" rx="13" ry="8" fill="url(#cheek)" />
        <ellipse cx="147" cy="116" rx="13" ry="8" fill="url(#cheek)" />

        {/* Eyes */}
        <g style={{ animation: sad ? "none" : "blink 4s ease-in-out infinite", transformOrigin: "93px 102px" }}>
          <ellipse cx="93" cy="102" rx="10" ry={sad ? 8 : 12} fill="white" />
          <ellipse cx="94" cy={sad ? 102 : 105} rx="7" ry={sad ? 6 : 9} fill="#1a1830" />
          <circle cx="96" cy={sad ? 100 : 103} r="2.4" fill="white" />
        </g>
        <g style={{ animation: sad ? "none" : "blink 4s ease-in-out infinite", transformOrigin: "133px 102px" }}>
          <ellipse cx="133" cy="102" rx="10" ry={sad ? 8 : 12} fill="white" />
          <ellipse cx="134" cy={sad ? 102 : 105} rx="7" ry={sad ? 6 : 9} fill="#1a1830" />
          <circle cx="136" cy={sad ? 100 : 103} r="2.4" fill="white" />
        </g>

        {/* Happy lashes stay out of the sad expression. */}
        {!sad && (
          <g stroke="#3a2548" strokeWidth="2" strokeLinecap="round" fill="none">
            <path d="M 83 94 Q 92 87 103 94" />
            <path d="M 84 92 L 80 88 M 89 89 L 87 84 M 98 90 L 101 85" />
            <path d="M 123 94 Q 133 87 143 94" />
            <path d="M 125 90 L 122 85 M 136 89 L 138 84 M 142 92 L 146 88" />
          </g>
        )}

        {/* Sad brows + tears */}
        {sad && (
          <>
            <path d="M 81 91 Q 92 86 104 82" stroke="#3a2548" strokeWidth="4" fill="none" strokeLinecap="round" />
            <path d="M 122 82 Q 134 86 145 91" stroke="#3a2548" strokeWidth="4" fill="none" strokeLinecap="round" />
            <ellipse
              cx="100"
              cy="115"
              rx="2.8"
              ry="4"
              fill="#7fd4ff"
              style={{ animation: "tear-drop 2s ease-in infinite" }}
            />
            <ellipse
              cx="126"
              cy="115"
              rx="2.8"
              ry="4"
              fill="#7fd4ff"
              style={{ animation: "tear-drop 2.4s ease-in infinite", animationDelay: "0.6s" }}
            />
          </>
        )}

        {/* Mouth — frown when sad, smile otherwise */}
        {sad ? (
          <path
            d="M 100 138 Q 113 130 126 138"
            stroke="#3a2548"
            strokeWidth="2.5"
            fill="none"
            strokeLinecap="round"
          />
        ) : (
          <path
            d="M 99 134 Q 113 144 127 134"
            stroke="#3a2548"
            strokeWidth="2.5"
            fill="none"
            strokeLinecap="round"
          />
        )}

        {/* Trunk — curved, sways gently (droops when sad) */}
        <g
          style={{
            transformOrigin: "113px 132px",
            animation: sad ? "none" : "trunk-sway 3s ease-in-out infinite",
          }}
        >
          <path
            d={
              sad
                ? "M 113 132 Q 116 156 118 178"
                : "M 113 130 Q 121 152 133 158 Q 145 162 145 150"
            }
            stroke="#8e72c4"
            strokeWidth="14"
            fill="none"
            strokeLinecap="round"
          />
          {/* trunk rings */}
          <path d="M 116 146 Q 121 148 124 144" stroke="#5e468f" strokeWidth="1.2" fill="none" opacity="0.5" />
          <path d="M 121 158 Q 127 160 130 156" stroke="#5e468f" strokeWidth="1.2" fill="none" opacity="0.5" />
        </g>

        {/* Anklets on celebration */}
        {celebrating && (
          <>
            <circle cx="72" cy="206" r="2.5" fill="#ffd24d" />
            <circle cx="96" cy="208" r="2.5" fill="#ffd24d" />
            <circle cx="130" cy="208" r="2.5" fill="#ffd24d" />
            <circle cx="154" cy="206" r="2.5" fill="#ffd24d" />
          </>
        )}
      </svg>

      {/* pointing indicator removed — was a stray corner sparkle */}
    </div>
  );
}

export const Elephant = memo(ElephantBase);
