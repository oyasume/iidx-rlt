/// <reference types="vitest" />
import { defineConfig, UserConfig } from "vite";
import react from "@vitejs/plugin-react";
import { crx } from "@crxjs/vite-plugin";
import checker from "vite-plugin-checker";
import { VitePWA } from "vite-plugin-pwa";

import manifest from "./manifest.json";

const commonConfig: UserConfig = {
  plugins: [
    react(),
    checker({
      typescript: true,
    }),
  ],
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "./src/test/setup.ts",
    coverage: {
      include: ["src/**/*.{ts,tsx}"],
      exclude: [
        "src/**/*.stories.tsx",
        "src/app-extension/content.tsx",
        "src/types.ts",
        "src/storage/index.ts",
        "src/storage/chromeStorage.ts",
      ],
    },
  },
};

export default defineConfig(({ mode }) => {
  if (mode === "webapp") {
    return {
      ...commonConfig,
      plugins: [
        ...commonConfig.plugins!,
        VitePWA({
          registerType: "autoUpdate",
          manifest: {
            name: "iidx-rlt",
            short_name: "iidx-rlt",
            description: "beatmania IIDXのランダムレーンチケット活用支援ツール",
            start_url: "/",
            display: "standalone",
            background_color: "#ffffff",
            theme_color: "#000000",
            icons: [
              {
                src: "/icons/icon192.png",
                sizes: "192x192",
                type: "image/png",
              },
              {
                src: "/icons/icon512.png",
                sizes: "512x512",
                type: "image/png",
              },
            ],
          },
        }),
      ],
      build: {
        outDir: "dist-web",
      },
    };
  }

  return {
    ...commonConfig,
    plugins: [...commonConfig.plugins!, crx({ manifest })],
    build: {
      outDir: "dist-extension",
    },
  };
});
