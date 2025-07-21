import { renderHook, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { useAtariRules } from "./useAtariRules";
import { AtariRule } from "../types";

const mockAtariRules: AtariRule[] = [
  {
    id: "preset-rage-1",
    songTitle: "rage against usual(A)",
    textageURL: "",
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
  },
  {
    id: "preset-mei-1",
    songTitle: "冥(A)",
    textageURL: "",
    priority: 1,
    description: "",
    patterns: [
      {
        scratchSideText: "2**",
        isScratchSideUnordered: true,
        nonScratchSideText: "3***",
        isNonScratchSideUnordered: true,
      },
    ],
  },
  {
    id: "preset-other-song-1",
    songTitle: "Another Song(A)",
    textageURL: "",
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
  },
];

describe("useAtariRules", () => {
  const mockFetch = vi.spyOn(global, "fetch");

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("データの取得とインデックス構築に成功し、パターンが正しく重複排除されること", async () => {
    mockFetch
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ version: "test-version" }),
      } as Response)
      .mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockAtariRules),
      } as Response);

    const { result } = renderHook(() => useAtariRules());

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.uniquePatterns).toHaveLength(2);
    expect(result.current.uniquePatterns).toEqual([
      {
        scratchSideText: "147",
        isScratchSideUnordered: true,
        nonScratchSideText: "****",
        isNonScratchSideUnordered: true,
      },
      {
        scratchSideText: "2**",
        isScratchSideUnordered: true,
        nonScratchSideText: "3***",
        isNonScratchSideUnordered: true,
      },
    ]);
  });

  it("データの取得に失敗した場合、エラーがコンソールに出力されること", async () => {
    const consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    mockFetch.mockRejectedValueOnce(new Error("Network error"));

    const { result } = renderHook(() => useAtariRules());

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.allRules).toBeUndefined();
    expect(result.current.rulesBySong).toBeUndefined();
    expect(result.current.uniquePatterns).toBeUndefined();
    expect(consoleErrorSpy).toHaveBeenCalled();
    consoleErrorSpy.mockRestore();
  });

  it("レスポンスがokでない場合、エラーがコンソールに出力されること", async () => {
    const consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    mockFetch.mockResolvedValueOnce({
      ok: false,
    } as Response);

    const { result } = renderHook(() => useAtariRules());

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(consoleErrorSpy).toHaveBeenCalled();
    consoleErrorSpy.mockRestore();
  });
});
