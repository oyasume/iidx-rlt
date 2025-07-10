import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { BookmarkletSection } from "./BookmarkletSection";
import { useClipboard } from "../hooks/useClipboard";

vi.mock("../hooks/useClipboard");

describe("BookmarkletSection", () => {
  const mockCopyToClipboard = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useClipboard).mockReturnValue({
      copyToClipboard: mockCopyToClipboard,
      isCopied: false,
      error: null,
    });
  });

  it("リンクをクリックすると、コピーボタンが表示される", async () => {
    const user = userEvent.setup();
    render(<BookmarkletSection />);

    const showLink = screen.getByRole("button", { name: "ブックマークレットを表示" });
    await user.click(showLink);

    const copyButton = await screen.findByRole("button", { name: "コピー" });
    await user.click(copyButton);

    expect(mockCopyToClipboard).toHaveBeenCalledTimes(1);
  });
});
