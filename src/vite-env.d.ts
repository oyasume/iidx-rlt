/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_BOOKMARKLET_URL: string;
  readonly VITE_GAME_BASE_URL: string;
  readonly VITE_GA_MEASUREMENT_ID: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
