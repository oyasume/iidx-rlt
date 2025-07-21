import { render, screen } from "@testing-library/react";
import { TicketList } from "./TicketList";
import { describe, it, expect, vi } from "vitest";

vi.mock("./TicketRow", () => ({
  TicketRow: ({ ticket }: { ticket: { laneText: string } }) => (
    <tr>
      <td>{ticket.laneText}</td>
    </tr>
  ),
}));

describe("TicketList", () => {
  it("チケットが空のときは何も表示しない", () => {
    const { container } = render(
      <TicketList tickets={[]} selectedSong={null} onOpenTextage={() => {}} onRowClick={() => {}} />
    );

    expect(container.firstChild).toBeNull();
  });

  it("チケットがある場合は一覧表示する", () => {
    const tickets = [
      { laneText: "1234567", expiration: "" },
      { laneText: "7654321", expiration: "" },
    ];
    render(<TicketList tickets={tickets} selectedSong={null} onOpenTextage={() => {}} onRowClick={() => {}} />);

    expect(screen.getByText("チケット")).toBeInTheDocument();
    expect(screen.getByText("有効期限")).toBeInTheDocument();

    expect(screen.getByText("1234567")).toBeInTheDocument();
    expect(screen.getByText("7654321")).toBeInTheDocument();
  });
});
