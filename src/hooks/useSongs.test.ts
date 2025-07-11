import { renderHook, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { SongsSource, useSongs } from "./useSongs";
import { SongInfo } from "../types";

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
  const mockUrlSongsSource: SongsSource = {
    type: "url",
    path: "http://localhost:3000/data/songs.json",
  };
  const mockStaticSongsSource: SongsSource = {
    type: "static",
    data: mockSongs,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("初期状態", () => {
    const { result } = renderHook(() => useSongs(mockUrlSongsSource));

    expect(result.current.songs).toEqual([]);
    expect(result.current.isLoading).toBe(true);
    expect(result.current.error).toBeNull();
  });

  describe("URLから取得", () => {
    it("楽曲データを取得する", async () => {
      vi.spyOn(global, "fetch").mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockSongs),
      } as Response);
      const { result } = renderHook(() => useSongs(mockUrlSongsSource));

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
        expect(result.current.songs).toEqual(mockSongs);
        expect(result.current.error).toBeNull();
      });
    });

    it("fetchに失敗するとエラー", async () => {
      vi.spyOn(global, "fetch").mockRejectedValueOnce(new Error());
      const { result } = renderHook(() => useSongs(mockUrlSongsSource));

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
        expect(result.current.songs).toEqual([]);
        expect(result.current.error).toBeInstanceOf(Error);
        expect(result.current.error?.message).toContain("楽曲データの読み込みに失敗しました");
      });
    });
  });

  describe("静的データから取得", () => {
    it("楽曲データを取得する", async () => {
      const { result } = renderHook(() => useSongs(mockStaticSongsSource));

      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
        expect(result.current.songs).toEqual(mockSongs);
        expect(result.current.error).toBeNull();
      });
    });
  });
});
