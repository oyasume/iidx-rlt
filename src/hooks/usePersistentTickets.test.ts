import { renderHook, act } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { usePersistentTickets } from "./usePersistentTickets";
import { IStorage } from "../storage";
import { Ticket } from "../types";

const mockTickets: Ticket[] = [
  { laneText: "1234567", expiration: "" },
  { laneText: "7654321", expiration: "" },
];

const mockStorage: IStorage = {
  get: vi.fn(),
  set: vi.fn(),
};

describe("usePersistentTickets", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(mockStorage.get).mockResolvedValue({ tickets: mockTickets });
    vi.mocked(mockStorage.set).mockResolvedValue(undefined);
  });

  describe("初期状態", () => {
    it("ストレージからチケットをロードして、isLoadingはfalseになる", async () => {
      const { result } = renderHook(() => usePersistentTickets(mockStorage));

      await act(async () => {});

      expect(result.current.isLoading).toBe(false);
      expect(mockStorage.get).toHaveBeenCalledTimes(1);
      expect(mockStorage.get).toHaveBeenCalledWith({ tickets: [] });
      expect(result.current.tickets).toEqual(mockTickets);
    });

    it("ストレージからの取得でエラーが発生した場合でも、isLoadingはfalseになり、チケットは空配列になる", async () => {
      const consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
      vi.mocked(mockStorage.get).mockRejectedValue(new Error("Storage error"));
      const { result } = renderHook(() => usePersistentTickets(mockStorage));

      await act(async () => {});

      expect(result.current.isLoading).toBe(false);
      expect(result.current.tickets).toEqual([]);
      expect(consoleErrorSpy).toHaveBeenCalled();
      consoleErrorSpy.mockRestore();
    });
  });

  describe("saveTickets", () => {
    it("新しいチケットで状態を更新し、ストレージに保存する", async () => {
      const { result } = renderHook(() => usePersistentTickets(mockStorage));
      const newTickets: Ticket[] = [{ laneText: "2461357", expiration: "" }];

      await act(async () => {});

      await act(async () => {
        await result.current.saveTickets(newTickets);
      });

      expect(result.current.tickets).toEqual(newTickets);
      expect(mockStorage.set).toHaveBeenCalledTimes(1);
      expect(mockStorage.set).toHaveBeenCalledWith({ tickets: newTickets });
    });
  });
});
