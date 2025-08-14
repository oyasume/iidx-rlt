import { render, screen, renderHook } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { MemoryRouter } from "react-router-dom";
import { useForm } from "react-hook-form";
import { TicketViewPage } from "./TicketViewPage";
import { AppSettingsContext, AppSettingsDispatchContext } from "../contexts/AppSettingsContext";
import * as useTicketViewData from "../features/ticket/hooks/useTicketViewData";
import * as useTicketSearch from "../hooks/useTicketSearch";
import { Ticket, SongInfo } from "../types";
import { SearchFormValues } from "../schema";

vi.mock("../features/ticket/hooks/useTicketViewData");
vi.mock("../hooks/useTicketSearch");

const mockTickets: Ticket[] = [{ laneText: "1234567", expiration: "" }];
const mockSongs: SongInfo[] = [{ title: "A(A)", url: "", level: 12 }];
const mockUpdatePlaySide = vi.fn();

const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <MemoryRouter>
    <AppSettingsContext.Provider value={{ playSide: "1P" }}>
      <AppSettingsDispatchContext.Provider value={{ updatePlaySide: mockUpdatePlaySide }}>
        {children}
      </AppSettingsDispatchContext.Provider>
    </AppSettingsContext.Provider>
  </MemoryRouter>
);

describe("TicketViewPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    const {
      result: { current: methods },
    } = renderHook(() => useForm<SearchFormValues>());

    vi.spyOn(useTicketViewData, "useTicketViewData").mockReturnValue({
      isLoading: false,
      tickets: mockTickets,
      songs: mockSongs,
      allRules: [],
      rulesBySong: new Map(),
      uniquePatterns: [],
    });

    vi.spyOn(useTicketSearch, "useTicketSearch").mockReturnValue({
      methods: methods,
      filteredTickets: mockTickets,
    });
  });

  it("ローディング中は「データを読み込んでいます...」と表示されること", () => {
    vi.spyOn(useTicketViewData, "useTicketViewData").mockReturnValue({
      isLoading: true,
      tickets: [],
      songs: [],
      allRules: undefined,
      rulesBySong: undefined,
      uniquePatterns: undefined,
    });
    render(<TicketViewPage />, { wrapper: TestWrapper });
    expect(screen.getByText("データを読み込んでいます...")).toBeInTheDocument();
  });

  it("各フックからのデータを元にチケットリストが正しく表示されること", () => {
    render(<TicketViewPage />, { wrapper: TestWrapper });
    expect(screen.getByText("1234567")).toBeInTheDocument();
  });

  it("チケットがない場合、「チケットがありません」というメッセージが表示されること", () => {
    vi.spyOn(useTicketViewData, "useTicketViewData").mockReturnValue({
      isLoading: false,
      tickets: [],
      songs: [],
      allRules: [],
      rulesBySong: new Map(),
      uniquePatterns: [],
    });
    render(<TicketViewPage />, { wrapper: TestWrapper });
    expect(screen.getByText("チケットがありません")).toBeInTheDocument();
  });

  it("プレイサイド切り替えボタンをクリックすると、updatePlaySideが呼ばれること", async () => {
    const user = userEvent.setup();
    render(<TicketViewPage />, { wrapper: TestWrapper });

    const playSide2PButton = screen.getByRole("button", { name: "2P" });
    await user.click(playSide2PButton);

    expect(mockUpdatePlaySide).toHaveBeenCalledWith("2P");
  });
});
