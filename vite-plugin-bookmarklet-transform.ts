import type { Plugin } from "vite";
import fs from "node:fs";
import path from "node:path";

export function bookmarkletTransformPlugin(): Plugin {
  return {
    name: "bookmarklet-transform",
    apply: "build",
    async writeBundle(options, bundle) {
      const outputPath = options.dir as string;
      const bookmarkletPath = path.join(outputPath, "bookmarklet.js");

      if (fs.existsSync(bookmarkletPath)) {
        let source = fs.readFileSync(bookmarkletPath, "utf-8");
        source = source.replace(/__VITE_GAME_BASE_URL__/g, process.env.VITE_GAME_BASE_URL || "");
        fs.writeFileSync(bookmarkletPath, source);
      }
    },
  };
}
