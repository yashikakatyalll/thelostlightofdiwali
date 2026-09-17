import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import tsconfigPaths from "vite-tsconfig-paths";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";

// The app runs on TanStack Start, but the local setup is kept intentionally lean.
// This keeps the routing, SSR, Tailwind, and path aliases working without the
// extra scaffold noise that tends to come with generated starter projects.
export default defineConfig({
  plugins: [
    tanstackStart({
      // We point the server entry at the custom SSR wrapper so errors can be caught
      // consistently and rendered through the app's own fallback page.
      server: { entry: "server" },
    }),
    react(),
    tsconfigPaths(),
    tailwindcss(),
  ],
});
