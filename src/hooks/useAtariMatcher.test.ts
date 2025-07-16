import { renderHook } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { useAtariMatcher } from "./useAtariMatcher";
import { Ticket, AtariRule } from "../types";

const tickets: Ticket[] = [
  { laneText: "1472356", expiration: "" },
  { laneText: "2356147", expiration: "" },
  { laneText: "1263457", expiration: "" },
  { laneText: "3457126", expiration: "" },
];

const rageRule: AtariRule = {
  id: "rage-rule",
  songTitle: "rage against usual(A)",
  priority: 1,
  description: "",
  patterns: [
    {
      scratchSideText: "147",
      isScratchSideUnordered: true,
      nonScratchSideText: "****",
      isNonScratchSideUnordered: true,
    },
  ],
};

const meiRule: AtariRule = {
  id: "mei-rule",
  songTitle: "冥(A)",
  priority: 1,
  description: "縦連割れ",
  patterns: [
    {
      scratchSideText: "2**",
      isScratchSideUnordered: true,
      nonScratchSideText: "3***",
      isNonScratchSideUnordered: true,
    },
    {
      scratchSideText: "3**",
      isScratchSideUnordered: true,
      nonScratchSideText: "2***",
      isNonScratchSideUnordered: true,
    },
  ],
};

const meiRule2: AtariRule = {
  id: "mei-rule-2",
  songTitle: "冥(A)",
  priority: 2,
  description: "冥当たり",
  patterns: [
    {
      scratchSideText: "126",
      isScratchSideUnordered: true,
      nonScratchSideText: "****",
      isNonScratchSideUnordered: true,
    },
  ],
};

const allRules = [rageRule, meiRule, meiRule2];
const uniquePatterns = [...rageRule.patterns, ...meiRule.patterns, ...meiRule2.patterns];

describe("useAtariMatcher", () => {
  it("チケットに合致する当たりルールを正しく返すこと", () => {
    const { result } = renderHook(() => useAtariMatcher(tickets, allRules, uniquePatterns, "1P"));

    const atariForRage = result.current.get("1472356");
    expect(atariForRage?.[0].songTitle).toBe("rage against usual(A)");
    const atariForMei = result.current.get("1263457");
    expect(atariForMei?.[0].songTitle).toBe("冥(A)");
    expect(atariForMei?.[0].description).toBe("冥当たり");
    expect(atariForMei?.[1].songTitle).toBe("冥(A)");
    expect(atariForMei?.[1].description).toBe("縦連割れ");
  });

  it("当たりに該当しないチケットは結果に含まれないこと", () => {
    const { result } = renderHook(() => useAtariMatcher(tickets, allRules, uniquePatterns, "1P"));
    expect(result.current.has("1234567")).toBe(false);
  });

  it("2Pでも正しく当たりを判定すること", () => {
    const { result } = renderHook(() => useAtariMatcher(tickets, allRules, uniquePatterns, "2P"));
    const atariForRage = result.current.get("2356147");
    const atariForMei = result.current.get("3457126");
    expect(atariForRage).toHaveLength(1);
    expect(atariForMei).toHaveLength(2);
  });

  it("ルールが未定義の場合、空のMapを返すこと", () => {
    const { result } = renderHook(() => useAtariMatcher(tickets, undefined, undefined, "1P"));
    expect(result.current.size).toBe(0);
  });
});
