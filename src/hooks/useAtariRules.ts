import { useState, useEffect } from "react";
import type { AtariRule, SearchPattern } from "../types";
import { atariRulesSchema } from "../schema";
import { generatePatternKey } from "../utils/generatePatternKey";

interface IndexedAtariData {
  rulesBySong: Map<string, AtariRule[]>;
  uniquePatterns: SearchPattern[];
  allRules: AtariRule[];
}

export const useAtariRules = () => {
  const [indexedData, setIndexedData] = useState<IndexedAtariData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadRules = async () => {
      try {
        const versionResponse = await fetch(`${import.meta.env.BASE_URL}data/version.json?r=${new Date().getTime()}`);
        const versionData = (await versionResponse.json()) as { version: string };
        const version = versionData.version;

        // 当たり配置に更新があったらキャッシュを無視する
        const response = await fetch(`${import.meta.env.BASE_URL}data/atari-rules.json?v=${version}`);

        if (!response.ok) {
          throw new Error("Failed to fetch atari-rules.json");
        }
        const allRules = atariRulesSchema.parse(await response.json());

        const rulesBySong = new Map<string, AtariRule[]>();
        const uniquePatternSet = new Set<string>();
        const uniquePatterns: SearchPattern[] = [];

        for (const rule of allRules) {
          // 曲名 -> ルールリスト のインデックスを作成
          if (!rulesBySong.has(rule.songTitle)) {
            rulesBySong.set(rule.songTitle, []);
          }
          rulesBySong.get(rule.songTitle)!.push(rule);

          // 定義されているパターンの重複を除いたリストを作成
          for (const pattern of rule.patterns) {
            const patternKey = generatePatternKey(pattern);
            if (!uniquePatternSet.has(patternKey)) {
              uniquePatternSet.add(patternKey);
              uniquePatterns.push(pattern);
            }
          }
        }

        // 曲ごとのルールを優先度でソート
        for (const rules of rulesBySong.values()) {
          rules.sort((a, b) => a.priority - b.priority);
        }

        setIndexedData({ rulesBySong, uniquePatterns, allRules });
      } catch (error) {
        console.error("Failed to process atari rules:", error);
      } finally {
        setIsLoading(false);
      }
    };

    void loadRules();
  }, []);

  return { ...indexedData, isLoading };
};
