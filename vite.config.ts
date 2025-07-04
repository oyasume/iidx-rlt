/// <reference types="vitest" />
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { crx } from "@crxjs/vite-plugin";
import checker from "vite-plugin-checker";

import manifest from "./manifest.json";

export default defineConfig({
  plugins: [
    react(),
    checker({
      typescript: true,
    }),
    crx({ manifest }),
  ],
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "./src/test/setup.ts",
    coverage: {
      include: ["src/**/*.{ts,tsx}"],
      exclude: ["src/**/*.stories.tsx", "src/content.tsx"],
    },
  },
});
