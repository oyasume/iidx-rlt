import { describe, it, expect } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Tool from "./Tool";
import { Ticket } from "./types";

describe("Tool", () => {
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
});
