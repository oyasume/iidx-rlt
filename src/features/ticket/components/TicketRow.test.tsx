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
    render(<TicketRow ticket={mockTicket} selectedSong={null} onOpenTextage={() => {}} onRowClick={() => {}} />, {
      wrapper: tableWrapper,
    });

    expect(screen.getByText(mockTicket.laneText)).toBeInTheDocument();
    expect(screen.getByText(mockTicket.expiration)).toBeInTheDocument();
  });

  it("楽曲が選択されていない場合、ボタンが見えなくなること", () => {
    render(<TicketRow ticket={mockTicket} selectedSong={null} onOpenTextage={() => {}} onRowClick={() => {}} />, {
      wrapper: tableWrapper,
    });

    expect(screen.queryByRole("button")).toBeNull();
  });

  it("楽曲が選択されている場合、ボタンは有効になること", () => {
    render(
      <TicketRow ticket={mockTicket} selectedSong={mockSelectedSong} onOpenTextage={() => {}} onRowClick={() => {}} />,
      {
        wrapper: tableWrapper,
      }
    );

    const button = screen.getByRole("button");
    expect(button).toBeEnabled();
  });

  it("ボタンをクリックするとonOpenTextageが呼ばれること", async () => {
    const user = userEvent.setup();
    const onOpenTextageMock = vi.fn();
    render(
      <TicketRow
        ticket={mockTicket}
        selectedSong={mockSelectedSong}
        onOpenTextage={onOpenTextageMock}
        onRowClick={() => {}}
      />,
      {
        wrapper: tableWrapper,
      }
    );

    await user.click(screen.getByRole("button"));
    expect(onOpenTextageMock).toHaveBeenCalledWith(mockTicket.laneText);
  });

  it("行をクリックするとonRowClickが呼ばれること", async () => {
    const user = userEvent.setup();
    const onRowClickMock = vi.fn();
    render(<TicketRow ticket={mockTicket} selectedSong={null} onOpenTextage={() => {}} onRowClick={onRowClickMock} />, {
      wrapper: tableWrapper,
    });

    await user.click(screen.getByText(mockTicket.laneText));

    expect(onRowClickMock).toHaveBeenCalledTimes(1);
    expect(onRowClickMock).toHaveBeenCalledWith(mockTicket);
  });
});
