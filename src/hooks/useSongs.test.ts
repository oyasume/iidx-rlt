import { renderHook, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { useSongs } from "./useSongs";
import { SongInfo } from "../types";

const mockChrome = {
  runtime: {
    getURL: vi.fn((path: string) => `http://localhost:3000${path}`),
  },
};
vi.stubGlobal("chrome", mockChrome);

describe("useSongs", () => {
  const mockSongs: SongInfo[] = [
    {
      title: "A(A)",
      url: "https://textage.cc/score/7/a_amuro.html?1AC00",
      level: 12,
    },
    {
      title: "AA(A)",
      url: "https://textage.cc/score/11/aa_amuro.html?1AC00",
      level: 12,
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("初期状態", () => {
    const { result } = renderHook(() => useSongs());

    expect(result.current.songs).toEqual([]);
    expect(result.current.isLoading).toBe(true);
    expect(result.current.error).toBeNull();
  });

  it("楽曲データを取得する", async () => {
    vi.spyOn(global, "fetch").mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockSongs),
    } as Response);
    const { result } = renderHook(() => useSongs());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
      expect(result.current.songs).toEqual(mockSongs);
      expect(result.current.error).toBeNull();
    });

    expect(global.chrome.runtime.getURL).toHaveBeenCalledWith("/data/songs.json");
    expect(global.fetch).toHaveBeenCalledWith("http://localhost:3000/data/songs.json");
  });

  it("fetchに失敗するとエラー", async () => {
    vi.spyOn(global, "fetch").mockRejectedValueOnce(new Error());
    const { result } = renderHook(() => useSongs());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
      expect(result.current.songs).toEqual([]);
      expect(result.current.error).toBeInstanceOf(Error);
      expect(result.current.error?.message).toContain("楽曲データの読み込みに失敗しました");
    });

    expect(global.chrome.runtime.getURL).toHaveBeenCalledWith("/data/songs.json");
    expect(global.fetch).toHaveBeenCalledWith("http://localhost:3000/data/songs.json");
  });
});
