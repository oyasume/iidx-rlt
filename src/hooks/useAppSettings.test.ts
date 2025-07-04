import { act, renderHook } from "@testing-library/react";
import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { useAppSettings } from "./useAppSettings";
import { AppSettings } from "../types";

const mockChrome = {
  storage: {
    sync: {
      get: vi.fn((_default: AppSettings, callback: (_settings: AppSettings) => void) => {
        setTimeout(() => callback({ playSide: "1P" }), 0);
      }),
      set: vi.fn((_settings: AppSettings, callback: () => void) => {
        callback();
      }),
    },
  },
};
vi.stubGlobal("chrome", mockChrome);

describe("useAppSettings", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe("初期状態", () => {
    it("isLoaging が True", () => {
      const { result } = renderHook(() => useAppSettings());
      expect(result.current.isLoading).toBe(true);
    });

    it("設定がロードされる", () => {
      const { result } = renderHook(() => useAppSettings());

      act(() => {
        vi.runAllTimers();
      });

      expect(result.current.isLoading).toBe(false);
      expect(result.current.settings).toEqual({ playSide: "1P" });
    });

    it("ストレージの get が呼ばれる", () => {
      renderHook(() => useAppSettings());
      expect(mockChrome.storage.sync.get).toHaveBeenCalledTimes(1);
    });
  });

  describe("updatePlaySideが呼ばれたとき", () => {
    const setup = () => {
      const { result } = renderHook(() => useAppSettings());
      act(() => {
        vi.runAllTimers();
      });
      return { result };
    };

    it("すぐにはストレージに保存せず、状態のみ更新する", () => {
      const { result } = setup();

      act(() => {
        result.current.updatePlaySide("2P");
      });

      expect(result.current.settings.playSide).toBe("2P");
      expect(mockChrome.storage.sync.set).not.toHaveBeenCalled();
    });

    it("デバウンスの後に保存する", () => {
      const { result } = setup();

      act(() => {
        result.current.updatePlaySide("2P");
      });

      act(() => {
        vi.advanceTimersByTime(500);
      });

      expect(mockChrome.storage.sync.set).toHaveBeenCalledTimes(1);
      expect(mockChrome.storage.sync.set).toHaveBeenCalledWith({ playSide: "2P" }, expect.any(Function));
    });

    it("連続して呼ばれた場合、前回の保存処理がキャンセルされること", () => {
      const { result } = setup();

      act(() => {
        result.current.updatePlaySide("2P");
        result.current.updatePlaySide("1P"); // Call again before debounce
      });

      act(() => {
        vi.advanceTimersByTime(500);
      });

      expect(mockChrome.storage.sync.set).toHaveBeenCalledTimes(1);
      expect(mockChrome.storage.sync.set).toHaveBeenCalledWith({ playSide: "1P" }, expect.any(Function));
    });
  });
});
