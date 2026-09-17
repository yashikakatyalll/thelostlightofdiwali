import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useEffect, useState } from "react";
import { Volume2, VolumeX } from "lucide-react";
import { TitleScreen } from "@/components/game/TitleScreen";
import { LevelStage } from "@/components/game/LevelStage";
import { FinaleScene } from "@/components/game/FinaleScene";
import { IntroScene } from "@/components/game/IntroScene";
import { LEVELS } from "@/game/levels";
import { unlockAudio, startMusic, stopMusic } from "@/game/audio";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Chakra-Bots: The Lost Light of Diwali" },
      {
        name: "description",
        content:
          "A magical animated storybook — help a little elephant bring the lights of Diwali back to a sleepy Indian village.",
      },
      { property: "og:title", content: "Chakra-Bots: The Lost Light of Diwali" },
      {
        property: "og:description",
        content: "Help a little elephant restore the festival of lights.",
      },
    ],
  }),
  component: GamePage,
});

type Screen =
  | { kind: "title" }
  | { kind: "intro" }
  | { kind: "level"; index: number }
  | { kind: "finale" };

function GamePage() {
  const [screen, setScreen] = useState<Screen>({ kind: "title" });
  const [muted, setMuted] = useState(false);

  const begin = useCallback(() => {
    unlockAudio();
    startMusic("sad", 0.9);
    setScreen({ kind: "intro" });
  }, []);

  const startGameplay = useCallback(() => setScreen({ kind: "level", index: 0 }), []);

  const advance = useCallback(() => {
    setScreen((s) => {
      if (s.kind !== "level") return s;
      const next = s.index + 1;
      return next >= LEVELS.length ? { kind: "finale" } : { kind: "level", index: next };
    });
  }, []);

  const replay = useCallback(() => setScreen({ kind: "title" }), []);

  useEffect(() => {
    if (muted) {
      stopMusic();
      return;
    }
    if (screen.kind === "intro") startMusic("sad", 0.9);
    else if (screen.kind === "level" || screen.kind === "finale")
      startMusic("festive", 1.0);
  }, [muted, screen.kind]);



  return (
    <main className="fixed inset-0 bg-[oklch(0.06_0.04_270)]">
      {screen.kind === "title" && <TitleScreen onStart={begin} />}
      {screen.kind === "intro" && <IntroScene onFinish={startGameplay} />}
      {screen.kind === "level" && (
        <LevelStage key={screen.index} level={LEVELS[screen.index]} onComplete={advance} />
      )}
      {screen.kind === "finale" && <FinaleScene onReplay={replay} />}

      {/* Global mute toggle */}
      {screen.kind !== "title" && (
        <button
          type="button"
          onClick={() => setMuted((m) => !m)}
          aria-label={muted ? "Unmute" : "Mute"}
          className="absolute bottom-5 left-5 z-50 rounded-full bg-white/12 p-3 text-white backdrop-blur-md ring-1 ring-white/25 hover:bg-white/25 transition"
        >
          {muted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
        </button>
      )}
    </main>
  );
}
