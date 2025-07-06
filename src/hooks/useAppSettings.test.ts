import { act, renderHook } from "@testing-library/react";
import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { useAppSettings } from "./useAppSettings";
import { IStorage } from "../storage";

const mockStorage: IStorage = {
  get: vi.fn(<T extends object>(_keys: T): Promise<T> => Promise.resolve({ playSide: "1P" } as T)),
  set: vi.fn((_items: object): Promise<void> => Promise.resolve()),
};

describe("useAppSettings", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe("初期状態", () => {
    it("設定がロードされる", async () => {
      const { result } = renderHook(() => useAppSettings(mockStorage));

      expect(result.current.isLoading).toBe(true);

      await act(async () => {
        vi.runAllTimers();
        await Promise.resolve();
      });

      expect(result.current.isLoading).toBe(false);
      expect(result.current.settings.playSide).toBe("1P");
    });

    it("ストレージの get が呼ばれる", async () => {
      renderHook(() => useAppSettings(mockStorage));
      await act(async () => {});

      expect(mockStorage.get).toHaveBeenCalledTimes(1);
    });
  });

  describe("updatePlaySideが呼ばれたとき", () => {
    it("すぐにはストレージに保存せず、状態のみ更新する", async () => {
      const { result } = renderHook(() => useAppSettings(mockStorage));

      await act(async () => {
        vi.runAllTimers();
        await Promise.resolve();
      });
      act(() => {
        result.current.updatePlaySide("2P");
      });

      expect(result.current.settings.playSide).toBe("2P");
      expect(mockStorage.set).not.toHaveBeenCalled();
    });

    it("デバウンスの後に保存する", async () => {
      const { result } = renderHook(() => useAppSettings(mockStorage));

      await act(async () => {
        vi.runAllTimers();
        await Promise.resolve();
      });
      act(() => {
        result.current.updatePlaySide("2P");
        vi.advanceTimersByTime(500);
      });

      expect(mockStorage.set).toHaveBeenCalledTimes(1);
      expect(mockStorage.set).toHaveBeenCalledWith({ playSide: "2P" });
    });

    it("短時間に2回変更されても最後の1回だけ保存される", async () => {
      const { result } = renderHook(() => useAppSettings(mockStorage));

      await act(async () => {
        vi.runAllTimers();
        await Promise.resolve();
      });
      act(() => {
        result.current.updatePlaySide("2P");
        result.current.updatePlaySide("1P");
        vi.advanceTimersByTime(500);
      });

      expect(mockStorage.set).toHaveBeenCalledTimes(1);
      expect(mockStorage.set).toHaveBeenCalledWith({ playSide: "1P" });
    });
  });
});
