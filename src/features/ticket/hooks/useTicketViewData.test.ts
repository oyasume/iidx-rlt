import { renderHook, waitFor } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { useTicketViewData } from "./useTicketViewData";
import * as persistentTicketsHook from "../../../hooks/usePersistentTickets";
import * as songsHook from "../../../hooks/useSongs";
import * as atariRulesHook from "../../../hooks/useAtariRules";

vi.mock("../../../hooks/usePersistentTickets");
vi.mock("../../../hooks/useSongs");
vi.mock("../../../hooks/useAtariRules");

describe("useTicketViewData", () => {
  it("すべてのデータソースがロード中の場合、isLoadingはtrueになる", () => {
    vi.mocked(persistentTicketsHook.usePersistentTickets).mockReturnValue({
      tickets: [],
      isLoading: true,
      saveTickets: vi.fn(),
    });
    vi.mocked(songsHook.useSongs).mockReturnValue({
      songs: [],
      isLoading: true,
      error: null,
    });
    vi.mocked(atariRulesHook.useAtariRules).mockReturnValue({
      isLoading: true,
    });

    const { result } = renderHook(() => useTicketViewData(false));
    expect(result.current.isLoading).toBe(true);
  });

  it("すべてのデータがロード完了した場合、isLoadingはfalseになり、データが返される", async () => {
    const mockTickets = [{ laneText: "1234567", expiration: "" }];
    const mockSongs = [{ title: "A(A)", url: "", level: 12 }];

    vi.mocked(persistentTicketsHook.usePersistentTickets).mockReturnValue({
      tickets: mockTickets,
      isLoading: false,
      saveTickets: vi.fn(),
    });
    vi.mocked(songsHook.useSongs).mockReturnValue({
      songs: mockSongs,
      isLoading: false,
      error: null,
    });
    vi.mocked(atariRulesHook.useAtariRules).mockReturnValue({
      allRules: [],
      rulesBySong: new Map(),
      uniquePatterns: [],
      isLoading: false,
    });

    const { result } = renderHook(() => useTicketViewData(false));

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
      expect(result.current.tickets).toEqual(mockTickets);
      expect(result.current.songs).toEqual(mockSongs);
      expect(result.current.allRules).toEqual([]);
    });
  });

  it("isSampleがtrueの場合、チケットのローディング状態を無視する", () => {
    vi.mocked(persistentTicketsHook.usePersistentTickets).mockReturnValue({
      tickets: [],
      isLoading: true,
      saveTickets: vi.fn(),
    });
    vi.mocked(songsHook.useSongs).mockReturnValue({
      songs: [],
      isLoading: false,
      error: null,
    });
    vi.mocked(atariRulesHook.useAtariRules).mockReturnValue({
      isLoading: false,
    });

    const { result } = renderHook(() => useTicketViewData(true));
    expect(result.current.isLoading).toBe(false);
  });
});
