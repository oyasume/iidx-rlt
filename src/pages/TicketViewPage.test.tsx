import { render, renderHook, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { MemoryRouter } from "react-router-dom";
import { useForm } from "react-hook-form";
import { TicketViewPage } from "./TicketViewPage";
import { AppSettingsContext, AppSettingsDispatchContext } from "../contexts/AppSettingsContext";
import * as persistentTicketsHook from "../hooks/usePersistentTickets";
import * as useTicketSearchHook from "../hooks/useTicketSearch";
import * as songsHook from "../hooks/useSongs";
import * as atariRulesHook from "../hooks/useAtariRules";
import { Ticket, SongInfo } from "../types";
import { SearchFormValues } from "../schema";

vi.mock("../hooks/usePersistentTickets");
vi.mock("../hooks/useTicketSearch");
vi.mock("../hooks/useSongs");
vi.mock("../hooks/useAtariRules");

const mockTickets: Ticket[] = [
  { laneText: "1234567", expiration: "" },
  { laneText: "7654321", expiration: "" },
];
const mockFilteredTickets: Ticket[] = [{ laneText: "1234567", expiration: "" }];
const mockSongs: SongInfo[] = [{ title: "A(A)", url: "", level: 12 }];
const mockUpdatePlaySide = vi.fn();

const TestWrapper = ({ children }: { children: React.ReactNode }) => {
  return (
    <MemoryRouter>
      <AppSettingsContext.Provider value={{ playSide: "1P" }}>
        <AppSettingsDispatchContext.Provider value={{ updatePlaySide: mockUpdatePlaySide }}>
          {children}
        </AppSettingsDispatchContext.Provider>
      </AppSettingsContext.Provider>
    </MemoryRouter>
  );
};

describe("TicketViewPage", () => {
  beforeEach(() => {
    vi.mocked(persistentTicketsHook.usePersistentTickets).mockReturnValue({
      tickets: mockTickets,
      saveTickets: vi.fn(),
      isLoading: false,
    });
    const {
      result: { current: methods },
    } = renderHook(() => useForm<SearchFormValues>());
    vi.mocked(useTicketSearchHook.useTicketSearch).mockReturnValue({
      methods: methods,
      filteredTickets: mockFilteredTickets,
    });
    vi.mocked(songsHook.useSongs).mockReturnValue({
      songs: mockSongs,
      isLoading: false,
      error: null,
    });
    vi.mocked(atariRulesHook.useAtariRules).mockReturnValue({
      rulesBySong: new Map(),
      uniquePatterns: [],
      allRules: [],
      isLoading: false,
    });
    vi.clearAllMocks();
  });

  it("ローディング中は「データを読み込んでいます...」と表示されること", () => {
    vi.mocked(persistentTicketsHook.usePersistentTickets).mockReturnValue({
      tickets: [],
      saveTickets: vi.fn(),
      isLoading: true,
    });
    render(<TicketViewPage />, { wrapper: TestWrapper });
    expect(screen.getByText("データを読み込んでいます...")).toBeInTheDocument();
  });

  it("チケットがない場合、「チケットがありません」というメッセージが表示されること", () => {
    vi.mocked(persistentTicketsHook.usePersistentTickets).mockReturnValue({
      tickets: [],
      saveTickets: vi.fn(),
      isLoading: false,
    });
    render(<TicketViewPage />, { wrapper: TestWrapper });
    expect(screen.getByText("チケットがありません")).toBeInTheDocument();
  });

  it("検索条件に合うチケットがない場合、メッセージが表示されること", () => {
    const {
      result: { current: methods },
    } = renderHook(() => useForm<SearchFormValues>());
    vi.mocked(useTicketSearchHook.useTicketSearch).mockReturnValue({
      methods: methods,
      filteredTickets: [],
    });

    render(<TicketViewPage />, { wrapper: TestWrapper });
    expect(screen.getByText("検索条件に一致するチケットはありません。")).toBeInTheDocument();
  });

  it("検索でフィルタリングされたチケットが表示されること", () => {
    render(<TicketViewPage />, { wrapper: TestWrapper });

    expect(screen.getByText("1234567")).toBeInTheDocument();
    expect(screen.queryByText("7654321")).not.toBeInTheDocument();
  });

  it("プレイサイド切り替えボタンをクリックすると、updatePlaySideが呼ばれること", async () => {
    const user = userEvent.setup();
    render(<TicketViewPage />, { wrapper: TestWrapper });

    const playSide2PButton = screen.getByRole("button", { name: "2P" });
    await user.click(playSide2PButton);

    expect(mockUpdatePlaySide).toHaveBeenCalledWith("2P");
  });
});
