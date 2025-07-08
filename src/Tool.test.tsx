import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Tool from "./Tool";
import { Ticket } from "./types";
import { useAppSettings } from "./hooks/useAppSettings";
import { useSongs } from "./hooks/useSongs";
import { IStorage } from "./storage";

const mockChrome = {
  runtime: {
    getURL: vi.fn((path: string) => `http://localhost:3000${path}`),
  },
};
vi.stubGlobal("chrome", mockChrome);

const mockUpdatePlaySide = vi.fn();

vi.mock("./hooks/useAppSettings");
vi.mock("./hooks/useSongs");

const mockStorage: IStorage = {
  get: vi.fn(<T extends object>(_keys: T): Promise<T> => Promise.resolve({ playSide: "1P" } as T)),
  set: vi.fn((_items: object): Promise<void> => Promise.resolve()),
};

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
    render(<Tool tickets={mockTickets} storage={mockStorage} songsJsonUrl="" />);

    expect(screen.getByRole("tab", { name: "チケット一覧", selected: true })).toBeInTheDocument();
    expect(screen.getByText("1234567")).toBeInTheDocument();
    expect(screen.getByText("7654321")).toBeInTheDocument();
  });

  it("当たり配置管理タブに切り替えられること", async () => {
    const user = userEvent.setup();
    render(<Tool tickets={mockTickets} storage={mockStorage} songsJsonUrl="" />);

    const managementTab = screen.getByRole("tab", { name: "当たり配置管理" });
    await user.click(managementTab);

    expect(screen.getByText("当たり配置管理画面")).toBeInTheDocument();
    expect(screen.queryByText("1234567")).not.toBeInTheDocument();
  });

  it("handlePlaySideChangeが正しく呼び出されること", async () => {
    const user = userEvent.setup();
    render(<Tool tickets={mockTickets} storage={mockStorage} songsJsonUrl="" />);

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
    render(<Tool tickets={mockTickets} storage={mockStorage} songsJsonUrl="" />);

    expect(screen.getByText("データを読み込んでいます...")).toBeInTheDocument();
  });
});
