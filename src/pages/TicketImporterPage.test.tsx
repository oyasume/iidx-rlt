import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { Ticket } from "../types";
import { TicketImporterPage } from "./TicketImporterPage";
import { useClipboard } from "../hooks/useClipboard";
import * as persistentTicketsHook from "../hooks/usePersistentTickets";

vi.mock("../hooks/usePersistentTickets");
vi.mock("../hooks/useClipboard");

describe("TicketImporterPage", () => {
  const mockSaveTickets = vi.fn();
  const mockCopyToClipboard = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(persistentTicketsHook.usePersistentTickets).mockReturnValue({
      tickets: [],
      saveTickets: mockSaveTickets,
      isLoading: false,
    });
    vi.mocked(useClipboard).mockReturnValue({
      copyToClipboard: mockCopyToClipboard,
      isCopied: false,
      error: null,
    });
  });

  it("入力が空の状態でインポートボタンを押すと、エラーメッセージが表示される", async () => {
    const user = userEvent.setup();
    render(<TicketImporterPage />);

    const importButton = screen.getByRole("button", { name: "インポート実行" });
    await user.click(importButton);

    expect(await screen.findByText("インポートするチケットデータがありません。")).toBeInTheDocument();
    expect(mockSaveTickets).not.toHaveBeenCalled();
  });

  it("不正な形式のJSONを入力してインポートボタンを押すと、エラーメッセージが表示される", async () => {
    const user = userEvent.setup();
    render(<TicketImporterPage />);

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
    expect(mockSaveTickets).not.toHaveBeenCalled();
  });

  it("配列ではないJSONを入力してインポートボタンを押すと、エラーメッセージが表示される", async () => {
    const user = userEvent.setup();
    render(<TicketImporterPage />);

    const textbox = screen.getByRole("textbox");
    await user.click(textbox);
    await user.paste(JSON.stringify({ laneText: "1234567", expiration: "" }));

    const importButton = screen.getByRole("button", { name: "インポート実行" });
    await user.click(importButton);

    expect(await screen.findByText("データが配列形式になっていません。")).toBeInTheDocument();
    expect(mockSaveTickets).not.toHaveBeenCalled();
  });

  it("正常なデータを入力するとインポートに成功して、テキストボックスが空になる", async () => {
    // saveTicketsが成功するシナリオ
    mockSaveTickets.mockResolvedValue(undefined);

    const user = userEvent.setup();
    const tickets: Ticket[] = [{ laneText: "1234567", expiration: "" }];
    render(<TicketImporterPage />);

    const textbox = screen.getByRole("textbox");
    await user.click(textbox);
    await user.paste(JSON.stringify(tickets));

    const importButton = screen.getByRole("button", { name: "インポート実行" });
    await user.click(importButton);

    await waitFor(() => {
      expect(screen.getByText(`${tickets.length}件のチケットをインポートしました。`)).toBeInTheDocument();
    });

    expect(mockSaveTickets).toHaveBeenCalledWith(tickets);
    expect(textbox).toHaveValue("");
  });

  it("チケットの保存に失敗した場合、エラーメッセージが表示され、テキストボックスは空にならない", async () => {
    const user = userEvent.setup();
    const tickets: Ticket[] = [{ laneText: "1234567", expiration: "" }];
    const validJson = JSON.stringify(tickets);

    mockSaveTickets.mockRejectedValue(new Error("Import failed"));

    render(<TicketImporterPage />);

    const textbox = screen.getByRole("textbox");
    await user.click(textbox);
    await user.paste(validJson);

    const importButton = screen.getByRole("button", { name: "インポート実行" });
    await user.click(importButton);

    expect(mockSaveTickets).toHaveBeenCalledWith(tickets);
    expect(await screen.findByText(/チケットのインポート中に予期せぬエラーが発生しました/i)).toBeInTheDocument();
    expect(textbox).toHaveValue(validJson);
  });

  it("ブックマークレットのコピーボタンを押すと、copyToClipboardが呼ばれる", async () => {
    const user = userEvent.setup();
    render(<TicketImporterPage />);

    const showBookmarkletLink = screen.getByRole("button", { name: "ブックマークレットを表示" });
    await user.click(showBookmarkletLink);

    const copyButton = screen.getByRole("button", { name: "コピー" });
    await user.click(copyButton);

    expect(mockCopyToClipboard).toHaveBeenCalledTimes(1);
  });
});
