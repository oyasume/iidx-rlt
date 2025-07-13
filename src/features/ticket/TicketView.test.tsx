import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, renderHook } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { FormProvider, useForm, UseFormReturn } from "react-hook-form";

import { TicketView } from "./TicketView";
import { SongInfo, Ticket } from "../../types";
import { useTicketSearch } from "../../hooks/useTicketSearch";
import { SearchFormValues } from "../../schema";
import { renderWithRouter } from "../../utils/renderWithRouter";
import { ReactNode } from "react";
import { AppSettingsContext } from "../../contexts/AppSettingsContext";

vi.mock("../../hooks/useTicketSearch");

const mockTickets: Ticket[] = [
  { laneText: "1234567", expiration: "" },
  { laneText: "7654321", expiration: "" },
];
const mockFilteredTickets: Ticket[] = [{ laneText: "7654321", expiration: "" }];
const mockSelectedSong: SongInfo = {
  title: "A(A)",
  url: "https://textage.cc/score/7/a_amuro.html?1AC00",
  level: 12,
};
const mockSongs: SongInfo[] = [mockSelectedSong];
const mockOnPlaySideChange = vi.fn();

const TestComponent = ({
  children,
  mockMethods,
}: {
  children: ReactNode;
  mockMethods: UseFormReturn<SearchFormValues>;
}) => {
  return (
    <FormProvider {...mockMethods}>
      <AppSettingsContext.Provider value={{ playSide: "1P" }}>{children}</AppSettingsContext.Provider>
    </FormProvider>
  );
};

describe("TicketView", () => {
  let mockMethods: UseFormReturn<SearchFormValues>;

  beforeEach(() => {
    const { result } = renderHook(() => useForm<SearchFormValues>());
    mockMethods = result.current;
    vi.mocked(useTicketSearch).mockReturnValue({
      methods: mockMethods,
      filteredTickets: mockFilteredTickets,
    });
  });

  it("handlePlaySideChangeが正しく呼び出されること", async () => {
    const user = userEvent.setup();
    render(
      <TestComponent mockMethods={mockMethods}>
        <TicketView
          allTickets={mockTickets}
          filteredTickets={mockFilteredTickets}
          songs={mockSongs}
          selectedSong={mockSelectedSong}
          onPlaySideChange={mockOnPlaySideChange}
          onSongSelect={() => {}}
          onOpenTextage={() => {}}
        />
      </TestComponent>
    );

    const playSide2P = screen.getByRole("button", { name: "2P" });
    await user.click(playSide2P);

    expect(mockOnPlaySideChange).toHaveBeenCalledWith("2P");
  });

  describe("絞り込み時", () => {
    it("絞り込みされたチケットが表示される", () => {
      render(
        <TestComponent mockMethods={mockMethods}>
          <TicketView
            allTickets={mockTickets}
            filteredTickets={mockFilteredTickets}
            songs={mockSongs}
            selectedSong={mockSelectedSong}
            onPlaySideChange={mockOnPlaySideChange}
            onSongSelect={() => {}}
            onOpenTextage={() => {}}
          />
        </TestComponent>
      );

      mockFilteredTickets.forEach((ticket) => {
        expect(screen.getByText(ticket.laneText)).toBeInTheDocument();
      });
    });

    it("チケットが一つも登録されていない場合、メッセージが表示されること", () => {
      renderWithRouter(
        <TestComponent mockMethods={mockMethods}>
          <TicketView
            allTickets={[]}
            filteredTickets={[]}
            songs={mockSongs}
            selectedSong={mockSelectedSong}
            onPlaySideChange={mockOnPlaySideChange}
            onSongSelect={() => {}}
            onOpenTextage={() => {}}
          />
        </TestComponent>
      );

      expect(screen.getByText("チケットがありません")).toBeInTheDocument();
    });

    it("検索条件に合うチケットがない場合、メッセージが表示されること", () => {
      render(
        <TestComponent mockMethods={mockMethods}>
          <TicketView
            allTickets={mockTickets}
            filteredTickets={[]}
            songs={mockSongs}
            selectedSong={mockSelectedSong}
            onPlaySideChange={mockOnPlaySideChange}
            onSongSelect={() => {}}
            onOpenTextage={() => {}}
          />
        </TestComponent>
      );

      expect(screen.getByText("検索条件に一致するチケットはありません。")).toBeInTheDocument();
    });
  });
});
