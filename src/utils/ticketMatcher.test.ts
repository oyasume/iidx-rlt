import { describe, it, expect } from "vitest";
import { filterTickets } from "./ticketMatcher";
import type { Ticket, SearchPattern } from "../types";

const sampleTickets: Ticket[] = [
  { laneText: "1234567", expiration: "" },
  { laneText: "3217654", expiration: "" },
  { laneText: "7654321", expiration: "" },
  { laneText: "1746352", expiration: "" }, // Xperanza当たり例1P
  { laneText: "3645271", expiration: "" }, // Xperanza当たり例2P
];

describe("filterTickets", () => {
  it("1Pの順序通り検索が正しく動作すること", () => {
    const pattern: SearchPattern = {
      scratchSide: "123",
      isScratchSideUnordered: false,
      nonScratchSide: "4567",
      isNonScratchSideUnordered: false,
    };
    const result = filterTickets(sampleTickets, pattern, "1P");
    expect(result.map((t) => t.laneText)).toEqual(["1234567"]);
  });

  it("1Pの順不同検索が正しく動作すること", () => {
    const pattern: SearchPattern = {
      scratchSide: "17*",
      isScratchSideUnordered: true,
      nonScratchSide: "35**",
      isNonScratchSideUnordered: true,
    };
    const result = filterTickets(sampleTickets, pattern, "1P");
    expect(result.map((t) => t.laneText)).toEqual(["1746352"]);
  });

  it("2Pの順序通り検索が正しく動作すること", () => {
    const pattern: SearchPattern = {
      scratchSide: "321",
      isScratchSideUnordered: false,
      nonScratchSide: "7654",
      isNonScratchSideUnordered: false,
    };
    const result = filterTickets(sampleTickets, pattern, "2P");
    expect(result.map((t) => t.laneText)).toEqual(["7654321"]);
  });

  it("2Pの順不同検索が正しく動作すること", () => {
    const pattern: SearchPattern = {
      scratchSide: "17*",
      isScratchSideUnordered: true,
      nonScratchSide: "35**",
      isNonScratchSideUnordered: true,
    };
    const result = filterTickets(sampleTickets, pattern, "2P");
    expect(result.map((t) => t.laneText)).toEqual(["3645271"]);
  });

  it("ワイルドカード（皿側）が正しく動作すること", () => {
    const pattern: SearchPattern = {
      scratchSide: "1**",
      isScratchSideUnordered: false,
      nonScratchSide: "4567",
      isNonScratchSideUnordered: false,
    };
    const result = filterTickets(sampleTickets, pattern, "1P");
    expect(result.map((t) => t.laneText)).toEqual(["1234567"]);
  });

  it("ワイルドカード（非皿側）が正しく動作すること", () => {
    const pattern: SearchPattern = {
      scratchSide: "123",
      isScratchSideUnordered: false,
      nonScratchSide: "4***",
      isNonScratchSideUnordered: false,
    };
    const result = filterTickets(sampleTickets, pattern, "1P");
    expect(result.map((t) => t.laneText)).toEqual(["1234567"]);
  });

  it("不正な長さの検索条件の場合エラーになること", () => {
    const invalidPattern: SearchPattern = {
      scratchSide: "12",
      isScratchSideUnordered: false,
      nonScratchSide: "4567",
      isNonScratchSideUnordered: false,
    };

    expect(() => filterTickets(sampleTickets, invalidPattern, "1P")).toThrow("比較対象の長さが異なる");
  });
});
