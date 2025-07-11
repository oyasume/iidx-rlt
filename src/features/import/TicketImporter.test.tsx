import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { TicketImporter } from "./TicketImporter";
import { Ticket } from "../../types";
import { useClipboard } from "../../hooks/useClipboard";

vi.mock("../../hooks/useClipboard");

describe("TicketImporter", () => {
  const mockOnImport = vi.fn().mockResolvedValue(undefined);
  const mockCopyToClipboard = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useClipboard).mockReturnValue({
      copyToClipboard: mockCopyToClipboard,
      isCopied: false,
      error: null,
    });
  });

  it("入力が空の状態でインポートボタンを押すと、エラーメッセージが表示される", async () => {
    const user = userEvent.setup();
    render(<TicketImporter onImport={mockOnImport} />);

    const importButton = screen.getByRole("button", { name: "インポート実行" });
    await user.click(importButton);

    expect(await screen.findByText("インポートするチケットデータがありません。")).toBeInTheDocument();
    expect(mockOnImport).not.toHaveBeenCalled();
  });

  it("不正な形式のJSONを入力してインポートボタンを押すと、エラーメッセージが表示される", async () => {
    const user = userEvent.setup();
    render(<TicketImporter onImport={mockOnImport} />);

    const textbox = screen.getByRole("textbox");
    await user.click(textbox);
    await user.paste("invalid-json");

    const importButton = screen.getByRole("button", { name: "インポート実行" });
    await user.click(importButton);

    expect(
      await screen.findByText(
        "チケットデータの形式が正しくありません。公式サイトでブックマークレットを実行し、表示された内容をすべてコピーして貼り付けてください。"
      )
    ).toBeInTheDocument();
    expect(mockOnImport).not.toHaveBeenCalled();
  });

  it("配列ではないJSONを入力してインポートボタンを押すと、エラーメッセージが表示される", async () => {
    const user = userEvent.setup();
    render(<TicketImporter onImport={mockOnImport} />);

    const textbox = screen.getByRole("textbox");
    await user.click(textbox);
    await user.paste(JSON.stringify({ laneText: "1234567", expiration: "" }));

    const importButton = screen.getByRole("button", { name: "インポート実行" });
    await user.click(importButton);

    expect(await screen.findByText("データが配列形式になっていません。")).toBeInTheDocument();
    expect(mockOnImport).not.toHaveBeenCalled();
  });

  it("正常なデータを入力するとインポートに成功して、テキストボックスが空になる", async () => {
    const user = userEvent.setup();
    const tickets: Ticket[] = [{ laneText: "1234567", expiration: "" }];
    render(<TicketImporter onImport={mockOnImport} />);

    const textbox = screen.getByRole("textbox");
    await user.click(textbox);
    await user.paste(JSON.stringify(tickets));

    const importButton = screen.getByRole("button", { name: "インポート実行" });
    await user.click(importButton);

    expect(await screen.findByText(/チケットをインポートしました/i)).toBeInTheDocument();
    expect(mockOnImport).toHaveBeenCalledWith(tickets);
    expect(textbox).toHaveValue("");
  });

  it("onImportが失敗した場合、エラーメッセージが表示され、テキストボックスは空にならない", async () => {
    const user = userEvent.setup();
    const tickets: Ticket[] = [{ laneText: "1234567", expiration: "" }];
    const validJson = JSON.stringify(tickets);
    mockOnImport.mockRejectedValue(new Error("Import failed"));

    render(<TicketImporter onImport={mockOnImport} />);

    const textbox = screen.getByRole("textbox");
    await user.click(textbox);
    await user.paste(validJson);

    const importButton = screen.getByRole("button", { name: "インポート実行" });
    await user.click(importButton);

    expect(mockOnImport).toHaveBeenCalledWith(tickets);
    expect(await screen.findByText(/チケットのインポート中に予期せぬエラーが発生しました/i)).toBeInTheDocument();
    expect(textbox).toHaveValue(validJson);
  });

  it("ブックマークレットのコピーボタンを押すと、copyToClipboardが呼ばれる", async () => {
    const user = userEvent.setup();
    render(<TicketImporter onImport={mockOnImport} />);

    const showBookmarkletLink = screen.getByRole("button", { name: "ブックマークレットを表示" });
    await user.click(showBookmarkletLink);

    const copyButton = screen.getByRole("button", { name: "コピー" });
    await user.click(copyButton);

    expect(mockCopyToClipboard).toHaveBeenCalled();
  });
});
