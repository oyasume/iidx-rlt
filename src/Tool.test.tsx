import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Tool from "./Tool";
import { Ticket } from "./types";
import { useAppSettings } from "./hooks/useAppSettings";
import { useSongs } from "./hooks/useSongs";

const mockChrome = {
  runtime: {
    getURL: vi.fn((path: string) => `http://localhost:3000${path}`),
  },
};
vi.stubGlobal("chrome", mockChrome);

const mockUpdatePlaySide = vi.fn();

vi.mock("./hooks/useAppSettings");
vi.mock("./hooks/useSongs");

describe("Tool", () => {
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
  });

  const mockTickets: Ticket[] = [
    { laneText: "1234567", expiration: "" },
    { laneText: "7654321", expiration: "" },
  ];

  it("初期表示時にチケット一覧タブが選択される", () => {
    render(<Tool tickets={mockTickets} />);

    expect(screen.getByRole("tab", { name: "チケット一覧", selected: true })).toBeInTheDocument();
    expect(screen.getByText("1234567")).toBeInTheDocument();
    expect(screen.getByText("7654321")).toBeInTheDocument();
  });

  it("当たり配置管理タブに切り替えられること", async () => {
    const user = userEvent.setup();
    render(<Tool tickets={mockTickets} />);

    const managementTab = screen.getByRole("tab", { name: "当たり配置管理" });
    await user.click(managementTab);

    expect(screen.getByText("当たり配置管理画面")).toBeInTheDocument();
    expect(screen.queryByText("1234567")).not.toBeInTheDocument();
  });

  it("チケットリストが正しくフィルタリングされること", async () => {
    const user = userEvent.setup();
    render(<Tool tickets={mockTickets} />);

    const scratchSideInput = screen.getByLabelText("皿側の3つが");

    await user.clear(scratchSideInput);
    await user.type(scratchSideInput, "123");

    await waitFor(() => {
      expect(screen.queryByText("1234567")).toBeInTheDocument();
      expect(screen.queryByText("7654321")).not.toBeInTheDocument();
    });
  });

  it("handlePlaySideChangeが正しく呼び出されること", async () => {
    const user = userEvent.setup();
    render(<Tool tickets={mockTickets} />);

    const playSide2P = screen.getByRole("button", { name: "2P" });
    await user.click(playSide2P);

    expect(mockUpdatePlaySide).toHaveBeenCalledWith("2P");
  });

  it("isLoadingがtrueの場合、ローディング表示がされること", () => {
    vi.mocked(useAppSettings).mockReturnValue({
      settings: { playSide: "1P" },
      updatePlaySide: mockUpdatePlaySide,
      isLoading: true,
    });
    render(<Tool tickets={mockTickets} />);

    expect(screen.getByText("データを読み込んでいます...")).toBeInTheDocument();
  });

  it("Textageで確認ボタンが正しく動作すること", async () => {
    const user = userEvent.setup();
    const windowOpen = vi.spyOn(window, "open").mockImplementation(() => null);
    render(<Tool tickets={mockTickets} />);

    const autocomplete = screen.getByLabelText("楽曲を選択");
    await user.click(autocomplete);
    await user.type(autocomplete, "A");
    const songOption = await screen.findByText("A(A)");
    await user.click(songOption);

    const ticketElement = screen.getByText("1234567");
    const textageButton = within(ticketElement.parentElement as HTMLElement).getByRole("button", {
      name: "Textageで確認",
    });
    await user.click(textageButton);

    expect(windowOpen).toHaveBeenCalledWith("https://textage.cc/score/7/a_amuro.html?1AC00R1234567", "_blank");
    windowOpen.mockRestore();
  });
});
