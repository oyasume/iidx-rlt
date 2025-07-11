import { render, screen } from "@testing-library/react";
import { TicketList } from "./TicketList";
import { describe, it, expect, vi } from "vitest";

describe("TicketList", () => {
  it("チケットが空のときは何も表示しない", () => {
    render(<TicketList tickets={[]} selectedSong={null} onOpenTextage={() => {}} />);

    expect(screen.queryByRole("list")).toBeNull();
  });

  it("チケットがある場合は一覧表示する", () => {
    const tickets = [
      { laneText: "1234567", expiration: "" },
      { laneText: "7654321", expiration: "" },
    ];
    render(<TicketList tickets={tickets} selectedSong={null} onOpenTextage={() => {}} />);

    expect(screen.getByText("1234567")).toBeInTheDocument();
    expect(screen.getByText("7654321")).toBeInTheDocument();
  });

  it("楽曲が選択されていない場合はボタンがdisabledになる", () => {
    const tickets = [{ laneText: "1234567", expiration: "" }];
    render(<TicketList tickets={tickets} selectedSong={null} onOpenTextage={() => {}} />);

    expect(screen.getByRole("button")).toBeDisabled();
  });

  it("楽曲が選択されている場合はボタンがenableになる", () => {
    const tickets = [{ laneText: "1234567", expiration: "" }];
    render(<TicketList tickets={tickets} selectedSong={{ title: "", url: "", level: 12 }} onOpenTextage={() => {}} />);

    expect(screen.getByRole("button")).toBeEnabled();
  });

  it("ボタンをクリックするとonOpenTextageが呼ばれる", () => {
    const onOpenTextage = vi.fn();
    const tickets = [{ laneText: "1234567", expiration: "" }];
    render(
      <TicketList tickets={tickets} selectedSong={{ title: "", url: "", level: 12 }} onOpenTextage={onOpenTextage} />
    );

    screen.getByRole("button").click();

    expect(onOpenTextage).toHaveBeenCalledWith("1234567");
  });
});
