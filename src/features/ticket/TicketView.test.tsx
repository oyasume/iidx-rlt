import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { UseFormReturn } from "react-hook-form";

import { TicketView } from "./TicketView";
import { Ticket } from "../../types";
import { useAppSettings } from "../../hooks/useAppSettings";
import { SongsSource, useSongs } from "../../hooks/useSongs";
import { useTicketSearch } from "./hooks/useTicketSearch";
import { SearchFormValues } from "../../schema";
import { IStorage } from "../../storage";
import { renderWithRouter } from "../../utils/renderWithRouter";

const mockUpdatePlaySide = vi.fn();

vi.mock("../../hooks/useAppSettings");
vi.mock("../../hooks/useSongs");
vi.mock("./hooks/useTicketSearch");

const mockStorage: IStorage = {
  get: vi.fn(<T extends object>(_keys: T): Promise<T> => Promise.resolve({ playSide: "1P" } as T)),
  set: vi.fn((_items: object): Promise<void> => Promise.resolve()),
};

describe("TicketView", () => {
  const mockTickets: Ticket[] = [
    { laneText: "1234567", expiration: "" },
    { laneText: "7654321", expiration: "" },
  ];
  const mockFilteredTickets: Ticket[] = [{ laneText: "7654321", expiration: "" }];
  const mockMethods = {
    register: vi.fn(),
    formState: {
      errors: {},
    },
  } as unknown as UseFormReturn<SearchFormValues>;
  const mockSongsSource: SongsSource = { type: "static", data: [] };

  beforeEach(() => {
    vi.mocked(useAppSettings).mockReturnValue({
      settings: { playSide: "1P" },
      updatePlaySide: mockUpdatePlaySide,
      isLoading: false,
    });
    vi.mocked(useSongs).mockReturnValue({
      songs: [
        {
          title: "A(A)",
          url: "https://textage.cc/score/7/a_amuro.html?1AC00",
          level: 12,
        },
      ],
      isLoading: false,
      error: null,
    });
    vi.mocked(useTicketSearch).mockReturnValue({
      methods: mockMethods,
      filteredTickets: mockFilteredTickets,
    });
  });

  it("isLoadingがtrueの場合、ローディング表示がされること", () => {
    vi.mocked(useAppSettings).mockReturnValue({
      settings: { playSide: "1P" },
      updatePlaySide: mockUpdatePlaySide,
      isLoading: true,
    });
    render(<TicketView tickets={mockTickets} storage={mockStorage} songsSource={mockSongsSource} />);

    expect(screen.getByText("データを読み込んでいます...")).toBeInTheDocument();
  });

  it("handlePlaySideChangeが正しく呼び出されること", async () => {
    const user = userEvent.setup();
    render(<TicketView tickets={mockTickets} storage={mockStorage} songsSource={mockSongsSource} />);

    const playSide2P = screen.getByRole("button", { name: "2P" });
    await user.click(playSide2P);

    expect(mockUpdatePlaySide).toHaveBeenCalledWith("2P");
  });

  describe("絞り込み時", () => {
    it("絞り込みされたチケットが表示される", () => {
      render(<TicketView tickets={mockTickets} storage={mockStorage} songsSource={mockSongsSource} />);

      mockFilteredTickets.forEach((ticket) => {
        expect(screen.getByText(ticket.laneText)).toBeInTheDocument();
      });
    });

    it("チケットが一つも登録されていない場合、メッセージが表示されること", () => {
      // リンクを使うためヘルパーが必要
      renderWithRouter(<TicketView tickets={[]} storage={mockStorage} songsSource={mockSongsSource} />);

      expect(screen.getByText("チケットがありません")).toBeInTheDocument();
    });

    it("検索条件に合うチケットがない場合、メッセージが表示されること", () => {
      vi.mocked(useTicketSearch).mockReturnValue({
        methods: mockMethods,
        filteredTickets: [],
      });
      render(<TicketView tickets={mockTickets} storage={mockStorage} songsSource={mockSongsSource} />);

      expect(screen.getByText("検索条件に一致するチケットはありません。"));
    });
  });
});
