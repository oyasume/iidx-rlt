import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { Ticket } from "../types";
import { TicketImporterPage } from "./TicketImporterPage";
import * as persistentTicketsHook from "../hooks/usePersistentTickets";
import * as snackbarContext from "../contexts/SnackbarContext";

vi.mock("../hooks/usePersistentTickets");
vi.mock("../contexts/SnackbarContext");

describe("TicketImporterPage", () => {
  const mockSaveTickets = vi.fn();
  const mockShowSnackbar = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(persistentTicketsHook.usePersistentTickets).mockReturnValue({
      tickets: [],
      saveTickets: mockSaveTickets,
      isLoading: false,
    });
    vi.mocked(snackbarContext.useSnackbar).mockReturnValue({
      showSnackbar: mockShowSnackbar,
      open: false,
      message: "",
      severity: "success",
      closeSnackbar: vi.fn(),
    });
  });

  it("入力が空の状態でインポートボタンを押すと、エラーメッセージが表示される", async () => {
    const user = userEvent.setup();
    render(<TicketImporterPage />);

    const importButton = screen.getByRole("button", { name: "インポート実行" });
    await user.click(importButton);

    expect(mockShowSnackbar).toHaveBeenCalledWith("インポートするチケットデータがありません。", "error");
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

    expect(mockShowSnackbar).toHaveBeenCalledWith(
      expect.stringContaining("チケットデータの形式が正しくありません"),
      "error"
    );
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

    expect(mockShowSnackbar).toHaveBeenCalledWith("データが配列形式になっていません。", "error");
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
      expect(mockSaveTickets).toHaveBeenCalledWith(tickets);
    });

    expect(mockShowSnackbar).toHaveBeenCalledWith(`${tickets.length}件のチケットをインポートしました。`, "success");
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
    expect(mockShowSnackbar).toHaveBeenCalledWith(
      expect.stringContaining("チケットのインポート中に予期せぬエラーが発生しました"),
      "error"
    );
    expect(textbox).toHaveValue(validJson);
  });
});
