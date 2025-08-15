import { SearchPattern } from "../types";

/**
 * SearchPatternオブジェクトから、キー文字列を生成する
 * 例: { scratchSideText: "147", isScratchSideUnordered: true, ... } -> "s:147u|ns:****u"
 */
export const generatePatternKey = (pattern: SearchPattern): string => {
  const scratchPart = pattern.scratchSideText + (pattern.isScratchSideUnordered ? "u" : "o");
  const nonScratchPart = pattern.nonScratchSideText + (pattern.isNonScratchSideUnordered ? "u" : "o");
  return `s:${scratchPart}|ns:${nonScratchPart}`;
};

export const parsePatternKey = (key: string): SearchPattern => {
  const [scratchPart, nonScratchPart] = key.split("|").map((part) => part.split(":")[1]);
  const isScratchSideUnordered = scratchPart.endsWith("u");
  const isNonScratchSideUnordered = nonScratchPart.endsWith("u");

  return {
    scratchSideText: scratchPart.slice(0, -1),
    isScratchSideUnordered,
    nonScratchSideText: nonScratchPart.slice(0, -1),
    isNonScratchSideUnordered,
  };
};
