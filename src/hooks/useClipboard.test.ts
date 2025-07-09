import { renderHook, act } from "@testing-library/react";
import { useClipboard } from "./useClipboard";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

describe("useClipboard", () => {
  const mockWriteText = vi.fn();

  beforeEach(() => {
    vi.useFakeTimers();
    vi.clearAllMocks();
    vi.stubGlobal("navigator", {
      clipboard: { writeText: mockWriteText },
    });
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.unstubAllGlobals();
  });

  it("初期状態ではisCopied=false, エラーがnullである", () => {
    const { result } = renderHook(() => useClipboard());

    expect(result.current.isCopied).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it("コピー成功時にisCopiedがtrueになり、指定秒数後にfalseになる", async () => {
    mockWriteText.mockResolvedValueOnce(undefined);
    const { result } = renderHook(() => useClipboard(1000));

    await act(() => result.current.copyToClipboard("test"));

    expect(mockWriteText).toHaveBeenCalledWith("test");
    expect(result.current.isCopied).toBe(true);

    act(() => {
      vi.advanceTimersByTime(1000);
    });

    expect(result.current.isCopied).toBe(false);
  });

  it("コピー失敗時にerrorが設定され、isCopiedはfalseになる", async () => {
    mockWriteText.mockRejectedValueOnce(new Error());
    const { result } = renderHook(() => useClipboard());

    await act(() => result.current.copyToClipboard("test"));

    expect(result.current.isCopied).toBe(false);
    expect(result.current.error).toContain("クリップボードへのコピーに失敗しました");
  });
});
