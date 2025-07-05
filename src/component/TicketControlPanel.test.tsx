import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import { TicketControlPanel } from "./TicketControlPanel";

describe("TicketControlPanel", () => {
  it("指定したプレイサイドが正しく選択されること", () => {
    render(<TicketControlPanel playSide="2P" onPlaySideChange={() => {}} />);

    expect(screen.getByRole("button", { name: "1P", pressed: false })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "2P", pressed: true })).toBeInTheDocument();
  });

  it("プレイサイドを変更するとonPlaySideChangeが呼ばれること", async () => {
    const onPlaySideChange = vi.fn();
    const user = userEvent.setup();
    render(<TicketControlPanel playSide="1P" onPlaySideChange={onPlaySideChange} />);

    const button2P = screen.getByRole("button", { name: "2P" });
    await user.click(button2P);

    expect(onPlaySideChange).toHaveBeenCalledWith("2P");
  });
});
