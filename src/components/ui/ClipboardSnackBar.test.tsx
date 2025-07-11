import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { ClipboardSnackbar } from "./ClipboardSnackBar";

describe("ClipboardSnackbar", () => {
  it("非表示なら何も描画されない", () => {
    const { container } = render(<ClipboardSnackbar open={false} error={null} />);
    expect(container).toBeEmptyDOMElement();
  });

  it("成功時に successMessage が表示される", () => {
    render(<ClipboardSnackbar open={true} error={null} successMessage="コピー成功！" />);
    expect(screen.getByText("コピー成功！")).toBeInTheDocument();
  });

  describe("エラー表示", () => {
    it("error の内容が表示される", () => {
      render(<ClipboardSnackbar open={true} error="コピー失敗しました" />);
      expect(screen.getByText("コピー失敗しました")).toBeInTheDocument();
    });

    it("errorMessage を渡すと error より優先して表示される", () => {
      render(<ClipboardSnackbar open={true} error="error" errorMessage="表示されるエラー" />);
      expect(screen.getByText("表示されるエラー")).toBeInTheDocument();
    });
  });
});
