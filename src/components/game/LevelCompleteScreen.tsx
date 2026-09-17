import { LEVELS } from "@/game/levels";

interface LevelCompleteProps {
  completedIndex: number; // 0-based
  onContinue: () => void;
}

// Shown between levels. Simple, child-friendly: progress + big Continue button.
export function LevelCompleteScreen({ completedIndex, onContinue }: LevelCompleteProps) {
  const completed = completedIndex + 1;
  const total = LEVELS.length;
  const isLast = completed >= total;

  return (
    <div
      className="absolute inset-0 z-40 flex items-center justify-center bg-black/65 backdrop-blur-md"
      style={{ animation: "fade-in 0.4s ease-out both" }}
    >
      <div
        className="mx-6 w-full max-w-md rounded-3xl px-8 py-9 text-center shadow-2xl ring-4 ring-[oklch(0.86_0.18_75)]"
        style={{
          background: "linear-gradient(180deg,#fff5d6,#ffd994)",
          animation: "slide-up-fade 0.5s ease-out both",
        }}
      >
        <p className="font-display text-base uppercase tracking-[0.3em] text-[#a8501a]">
          Level Complete
        </p>
        <h2 className="font-display mt-2 text-4xl text-[#5a2a0a] md:text-5xl">
          Beautiful work!
        </h2>
        <p className="font-hand mt-3 text-2xl text-[#5a2a0a]">
          Level {completed} of {total} completed
        </p>

        {/* Tiny progress dots so kids can see how far they've come */}
        <div className="mt-5 flex justify-center gap-2">
          {Array.from({ length: total }).map((_, i) => (
            <span
              key={i}
              className="h-3 w-3 rounded-full"
              style={{
                background:
                  i < completed
                    ? "oklch(0.78 0.22 55)"
                    : "oklch(0.5 0.04 50 / 0.35)",
                boxShadow: i < completed ? "0 0 10px oklch(0.85 0.2 60)" : "none",
              }}
            />
          ))}
        </div>

        <button
          type="button"
          onClick={onContinue}
          className="font-display mt-7 w-full rounded-full bg-[#c24a1a] px-8 py-4 text-2xl text-white shadow-lg transition hover:bg-[#a83a14] active:scale-[0.98]"
        >
          {isLast ? "See the festival!" : "Continue"}
        </button>
      </div>
    </div>
  );
}
