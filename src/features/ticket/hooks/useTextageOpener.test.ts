import { renderHook, act } from "@testing-library/react";
import { vi, describe, it, expect } from "vitest";
import { useTextageOpener } from "./useTextageOpener";
import { SongInfo } from "../../../types";
import * as makeTextageUrl from "../../../utils/makeTextageUrl";

describe("useTextageOpener", () => {
  const mockSong: SongInfo = {
    title: "A(A)",
    url: "https://textage.cc/score/7/a_amuro.html?1AC00",
    level: 12,
  };

  it("曲が選択されてる状態で正しいURLを正しく開くこと", () => {
    const windowOpen = vi.spyOn(window, "open").mockImplementation(() => null);
    const mockMakeTextageUrl = vi.spyOn(makeTextageUrl, "makeTextageUrl").mockReturnValue("testurl");
    const { result } = renderHook(() => useTextageOpener(mockSong, "1P"));

    act(() => {
      result.current.handleOpenTextage("1234567");
    });
    expect(mockMakeTextageUrl).toHaveBeenCalledWith(mockSong, "1P", "1234567");
    expect(windowOpen).toHaveBeenCalledWith("testurl", "_blank", "noopener,noreferrer");
  });

  it("曲が選択されていない場合、何も開かないこと", () => {
    const windowOpen = vi.spyOn(window, "open").mockImplementation(() => null);
    const { result } = renderHook(() => useTextageOpener(null, "1P"));

    act(() => {
      result.current.handleOpenTextage("1234567");
    });

    expect(windowOpen).not.toHaveBeenCalled();
  });
});
