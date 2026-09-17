import { Sparkles, Play } from "lucide-react";
import { Elephant } from "./Elephant";
import { Fireflies, StarField } from "./Particles";
import { VillageBackdrop } from "./VillageBackdrop";

interface TitleScreenProps {
  onStart: () => void;
}

export function TitleScreen({ onStart }: TitleScreenProps) {
  return (
    <div className="relative h-full w-full overflow-hidden">
      <VillageBackdrop brightness={0.1} />
      <StarField count={90} />
      <Fireflies count={26} />

      <div className="absolute inset-0 flex flex-col items-center justify-center overflow-y-auto px-6 py-3 text-center sm:py-5">
        <div
          className="mb-2 flex items-center gap-2 text-[oklch(0.86_0.16_75)]"
          style={{ animation: "slide-up-fade 0.8s ease-out both" }}
        >
          <Sparkles className="h-5 w-5" />
          <span className="font-display text-sm uppercase tracking-[0.4em]">A magical adventure</span>
          <Sparkles className="h-5 w-5" />
        </div>

        <h1
          className="font-display text-[clamp(2.5rem,9vh,6rem)] leading-none text-white"
          style={{
            animation: "title-glow 3s ease-in-out infinite, slide-up-fade 0.9s ease-out both",
          }}
        >
          The Lost Light
        </h1>
        <h2 className="mt-1 font-display text-[clamp(1.6rem,5vh,3rem)] text-[oklch(0.86_0.16_75)]"
          style={{ animation: "slide-up-fade 1s ease-out 0.1s both" }}
        >
          of Diwali
        </h2>

        <p
          className="mt-[clamp(.5rem,2vh,1.5rem)] max-w-md text-sm text-white/85 md:text-lg"
          style={{ animation: "slide-up-fade 1.1s ease-out 0.2s both" }}
        >
          A sleepy village waits in the dark. Help a little elephant bring the
          festival of lights back to life.
        </p>

        {/* Hero elephant — dominates the screen, the emotional hook */}
        <div className="relative mt-[clamp(.25rem,1vh,1.5rem)]" style={{ animation: "slide-up-fade 1.2s ease-out 0.3s both" }}>
          <Elephant size={Math.min(340, typeof window !== "undefined" ? window.innerHeight * 0.39 : 300)} />
        </div>

        <button
          type="button"
          onClick={onStart}
          className="group mt-2 inline-flex shrink-0 items-center gap-3 rounded-full bg-gradient-to-r from-[oklch(0.86_0.18_70)] to-[oklch(0.78_0.2_45)] px-8 py-3 font-display text-lg font-bold text-[oklch(0.18_0.06_270)] shadow-[0_10px_40px_oklch(0.78_0.2_45/0.5)] transition-all hover:scale-105 hover:shadow-[0_14px_60px_oklch(0.86_0.18_70/0.7)] active:scale-95 md:text-xl"
          style={{ animation: "slide-up-fade 1.3s ease-out 0.4s both" }}
        >
          <Play className="h-5 w-5 fill-current" />
          Begin the Story
        </button>
      </div>
    </div>
  );
}
