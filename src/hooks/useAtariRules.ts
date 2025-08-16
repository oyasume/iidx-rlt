import { useEffect, useState } from "react";

import { atariRulesSchema } from "../schema";
import type { AtariRule } from "../types";

export const useAtariRules = () => {
  const [atariRules, setAtariRules] = useState<AtariRule[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadRules = async () => {
      try {
        const versionResponse = await fetch(`${import.meta.env.BASE_URL}data/version.json`);
        const versionData = (await versionResponse.json()) as { version: string };
        const version = versionData.version;

        // 当たり配置に更新があったらキャッシュを無視する
        const response = await fetch(`${import.meta.env.BASE_URL}data/atari-rules.json?v=${version}`);
        if (!response.ok) {
          throw new Error("Failed to fetch atari-rules.json");
        }

        const allRules = atariRulesSchema.parse(await response.json());
        setAtariRules(allRules);
      } catch (error) {
        console.error("Failed to process atari rules:", error);
      } finally {
        setIsLoading(false);
      }
    };

    void loadRules();
  }, []);

  return { isLoading, atariRules };
};
