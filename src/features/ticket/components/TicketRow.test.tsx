import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import { Table, TableBody } from "@mui/material";
import { TicketRow } from "./TicketRow";
import { SongInfo, Ticket } from "types";

const mockTicket: Ticket = { laneText: "1234567", expiration: "2999/12/31" };
const mockSelectedSong: SongInfo = {
  title: "A(A)",
  url: "",
  level: 12,
};

const tableWrapper = ({ children }: { children: React.ReactNode }) => (
  <Table>
    <TableBody>{children}</TableBody>
  </Table>
);

describe("TicketRow", () => {
  it("チケット情報が正しく表示されること", () => {
    render(<TicketRow ticket={mockTicket} selectedSong={null} onOpenTextage={() => {}} />, { wrapper: tableWrapper });

    expect(screen.getByText(mockTicket.laneText)).toBeInTheDocument();
    expect(screen.getByText(mockTicket.expiration)).toBeInTheDocument();
  });

  it("楽曲が選択されていない場合、ボタンがdisabledになること", () => {
    render(<TicketRow ticket={mockTicket} selectedSong={null} onOpenTextage={() => {}} />, { wrapper: tableWrapper });
    expect(screen.getByRole("button")).toBeDisabled();
  });

  it("楽曲が選択されている場合、ボタンは有効になること", () => {
    render(<TicketRow ticket={mockTicket} selectedSong={mockSelectedSong} onOpenTextage={() => {}} />, {
      wrapper: tableWrapper,
    });

    const button = screen.getByRole("button");
    expect(button).toBeEnabled();
  });

  it("ボタンをクリックするとonOpenTextageが呼ばれること", async () => {
    const user = userEvent.setup();
    const onOpenTextageMock = vi.fn();
    render(<TicketRow ticket={mockTicket} selectedSong={mockSelectedSong} onOpenTextage={onOpenTextageMock} />, {
      wrapper: tableWrapper,
    });

    await user.click(screen.getByRole("button"));
    expect(onOpenTextageMock).toHaveBeenCalledWith(mockTicket.laneText);
  });
});
