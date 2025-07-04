import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Tool from "./Tool";
import { Ticket } from "./types";
import { useAppSettings } from "./hooks/useAppSettings";

const mockUpdatePlaySide = vi.fn();

vi.mock("./hooks/useAppSettings");

describe("Tool", () => {
  beforeEach(() => {
    vi.mocked(useAppSettings).mockReturnValue({
      settings: { playSide: "1P" },
      updatePlaySide: mockUpdatePlaySide,
      isLoading: false,
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

    expect(screen.getByText("設定を読み込んでいます...")).toBeInTheDocument();
  });
});
