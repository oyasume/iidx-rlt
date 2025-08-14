import { getHighlightColor } from "./getHighlightColor";
import { AtariRule } from "../types";

describe("getHighlightColor", () => {
  const createRule = (priority: number): AtariRule => ({
    id: `rule-${priority}`,
    title: `Song ${priority}`,
    url: "",
    priority: priority,
    description: "",
    patterns: [],
  });

  const testCases = [
    {
      description: "優先度が5以上の場合はゴールドを返す",
      rules: [createRule(5)],
      expectedColor: "gold",
    },
    {
      description: "マッチ数が5以上の場合はゴールドを返す",
      rules: [createRule(1), createRule(1), createRule(1), createRule(1), createRule(1)],
      expectedColor: "gold",
    },
    {
      description: "優先度が2以上でゴールド条件を満たさない場合はシルバーを返す",
      rules: [createRule(2)],
      expectedColor: "silver",
    },
    {
      description: "マッチ数が3以上でゴールド条件を満たさない場合はシルバーを返す",
      rules: [createRule(1), createRule(1), createRule(1)],
      expectedColor: "silver",
    },
    {
      description: "マッチ数が1以上でシルバー・ゴールド条件を満たさない場合はブロンズを返す",
      rules: [createRule(1)],
      expectedColor: "bronze",
    },
    {
      description: "ルールが提供されない場合はnullを返す",
      rules: [],
      expectedColor: null,
    },
    {
      description: "品質（優先度）が数量（マッチ数）より優先される",
      rules: [createRule(5), createRule(1), createRule(1)],
      expectedColor: "gold",
    },
  ];

  it.each(testCases)("$description", ({ rules, expectedColor }) => {
    expect(getHighlightColor(rules)).toBe(expectedColor);
  });
});
