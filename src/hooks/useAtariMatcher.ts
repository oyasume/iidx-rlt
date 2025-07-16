import { useMemo } from "react";
import { Ticket, AtariRule, SearchPattern, PlaySide } from "../types";
import { matchTicket } from "../utils/ticketMatcher";
import { generatePatternKey } from "../utils/generatePatternKey";

/**
 * 所持チケットと当たり配置定義を照合し、どのチケットがどの曲の当たりになるかのマップを生成する
 */
export const useAtariMatcher = (
  tickets: Ticket[],
  allRules: AtariRule[] | undefined,
  uniquePatterns: SearchPattern[] | undefined,
  playSide: PlaySide
): Map<string, AtariRule[]> => {
  const atariInfo = useMemo(() => {
    const intermediateInfo = new Map<string, AtariRule[]>();
    if (!allRules || !tickets || !uniquePatterns) return intermediateInfo;

    // パターン -> ルールの逆引きインデックスを生成
    const rulesByPatternKey = new Map<string, AtariRule[]>();
    for (const rule of allRules) {
      for (const pattern of rule.patterns) {
        const key = generatePatternKey(pattern);
        if (!rulesByPatternKey.has(key)) rulesByPatternKey.set(key, []);
        rulesByPatternKey.get(key)!.push(rule);
      }
    }

    // チケットとパターンを照合
    for (const ticket of tickets) {
      // 精々 1000枚くらい
      for (const pattern of uniquePatterns) {
        // デフォルトで50個くらい。相当変なことしない限り1000を超えることはないはず
        if (matchTicket(ticket, pattern, playSide)) {
          const key = generatePatternKey(pattern);
          const matchedRules = rulesByPatternKey.get(key);
          if (matchedRules) {
            if (!intermediateInfo.has(ticket.laneText)) {
              intermediateInfo.set(ticket.laneText, []);
            }
            intermediateInfo.get(ticket.laneText)!.push(...matchedRules);
          }
        }
      }
    }

    for (const [laneText, rules] of intermediateInfo.entries()) {
      // 重複を排除しつつ、優先度でソートした新しい配列を作成
      const finalRules = [...new Map(rules.map((rule) => [rule.id, rule])).values()].sort(
        (a, b) => b.priority - a.priority
      );
      intermediateInfo.set(laneText, finalRules);
    }

    return intermediateInfo;
  }, [tickets, allRules, uniquePatterns, playSide]);

  return atariInfo;
};
