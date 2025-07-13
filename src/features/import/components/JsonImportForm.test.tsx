import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import { JsonImportForm } from "./JsonImportForm";

describe("JsonImportForm", () => {
  it("isLoadingがtrueの場合、入力欄とボタンが無効化される", () => {
    render(<JsonImportForm jsonText="" onTextChange={() => {}} onImportClick={() => {}} isLoading={true} />);

    expect(screen.getByRole("textbox")).toBeDisabled();
    expect(screen.getByRole("button", { name: "インポート実行" })).toBeDisabled();
  });

  it("テキストエリアへの入力がonTextChangeを呼び出す", async () => {
    const user = userEvent.setup();
    const mockOnTextChange = vi.fn();
    render(<JsonImportForm jsonText="" onTextChange={mockOnTextChange} onImportClick={() => {}} isLoading={false} />);

    const textbox = screen.getByRole("textbox");
    await user.click(textbox);
    await user.paste("test");

    expect(mockOnTextChange).toHaveBeenCalledWith("test");
  });

  it("ボタンをクリックするとonImportClickが呼び出される", async () => {
    const user = userEvent.setup();
    const mockOnImportClick = vi.fn();
    render(
      <JsonImportForm
        jsonText="some text"
        onTextChange={() => {}}
        onImportClick={mockOnImportClick}
        isLoading={false}
      />
    );

    const importButton = screen.getByRole("button", { name: "インポート実行" });
    await user.click(importButton);

    expect(mockOnImportClick).toHaveBeenCalledTimes(1);
  });
});
