import { renderHook } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { useAtariProcessor } from "./useAtariProcessor";
import { Ticket, AtariRule } from "../../../types";

const tickets: Ticket[] = [
  { laneText: "1472356", expiration: "" },
  { laneText: "1234567", expiration: "" },
];

const rageRule: AtariRule = {
  id: "rage-rule",
  songTitle: "rage against usual(A)",
  textageURL: "https://textage.cc/score/12/rageagst.html?1AC00",
  priority: 5,
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

describe("useAtariProcessor", () => {
  it("チケットに正しくハイライト色を付与する関数を返す", () => {
    const { result } = renderHook(() => useAtariProcessor(tickets, "1P", [rageRule], rageRule.patterns));

    const highlighted = result.current.addHighlight(tickets);

    expect(highlighted).toEqual([
      { ...tickets[0], highlightColor: "gold" },
      { ...tickets[1], highlightColor: null },
    ]);
  });

  it("チケットの当たり情報を返す関数を返す", () => {
    const { result } = renderHook(() => useAtariProcessor(tickets, "1P", [rageRule], rageRule.patterns));

    const atariInfo = result.current.getAtariInfoForPanel(tickets[0]);

    expect(atariInfo).toHaveLength(1);
    expect(atariInfo[0].songTitle).toBe("rage against usual(A)");
  });
});
