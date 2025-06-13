import { defineConfig } from 'vite';
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
});
