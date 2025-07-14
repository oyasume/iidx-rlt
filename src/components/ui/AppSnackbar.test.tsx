import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { AppSnackbar } from "./AppSnackbar";
import userEvent from "@testing-library/user-event";

describe("AppSnackbar", () => {
  it("openがfalseなら何も描画されない", () => {
    const { container } = render(<AppSnackbar open={false} onClose={() => {}} message="" severity="success" />);
    expect(container).toBeEmptyDOMElement();
  });

  it("messageとseverityが正しく表示される", () => {
    render(<AppSnackbar open={true} onClose={() => {}} message="テストメッセージ" severity="error" />);
    const alert = screen.getByRole("alert");
    expect(alert).toHaveTextContent("テストメッセージ");
    expect(alert).toHaveClass("MuiAlert-filledError");
  });

  it("ボタンをクリックするとonCloseが呼ばれる", async () => {
    const user = userEvent.setup();
    const handleClose = vi.fn();
    render(<AppSnackbar open={true} onClose={handleClose} message="テスト" severity="success" />);

    const closeButton = screen.getByRole("button", { name: /close/i });
    await user.click(closeButton);

    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  it("clickawayのとき、onCloseが呼ばれないこと", async () => {
    const user = userEvent.setup();
    const handleClose = vi.fn();
    render(<AppSnackbar open={true} onClose={handleClose} message="テスト" severity="success" />);

    await user.click(document.body);

    expect(handleClose).not.toHaveBeenCalled();
  });
});
