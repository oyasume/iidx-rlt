/// <reference types="vitest" />
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import checker from "vite-plugin-checker";
import { visualizer } from "rollup-plugin-visualizer";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig(() => {
  return {
    base: "/iidx-rlt/",
    plugins: [
      react(),
      checker({
        typescript: true,
      }),
      visualizer(),
      VitePWA({
        registerType: "autoUpdate",
        manifest: {
          name: "RLT Manager",
          short_name: "RLT Manager",
          description: "beatmania IIDXのランダムレーンチケット活用支援ツール",
          start_url: "/iidx-rlt/",
          scope: "/iidx-rlt/",
          display: "standalone",
          background_color: "#ffffff",
          theme_color: "#000000",
          icons: [
            {
              src: "icons/icon192.png",
              sizes: "192x192",
              type: "image/png",
            },
            {
              src: "icons/icon512.png",
              sizes: "512x512",
              type: "image/png",
            },
          ],
        },
      }),
    ],
    test: {
      globals: true,
      environment: "jsdom",
      setupFiles: "./src/test/setup.ts",
      coverage: {
        include: ["src/**/*.{ts,tsx}"],
        exclude: ["src/**/*.stories.tsx", "src/types.ts", "src/storage/index.ts"],
      },
    },
    build: {
      outDir: "dist",
    },
  };
});
