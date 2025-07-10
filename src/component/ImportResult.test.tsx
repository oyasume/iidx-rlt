import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { ImportResult } from "./ImportResult";
import { ImporterState } from "../hooks/useImporter";

describe("ImportResult", () => {
  it("statusが'idle'の場合、何も表示されない", () => {
    const idleState: ImporterState = {
      status: "idle",
      error: null,
      importedCount: 0,
    };
    const { container } = render(<ImportResult state={idleState} />);

    expect(container).toBeEmptyDOMElement();
  });

  it("statusが'loading'の場合、何も表示されない", () => {
    const loadingState: ImporterState = {
      status: "loading",
      error: null,
      importedCount: 0,
    };
    const { container } = render(<ImportResult state={loadingState} />);

    expect(container).toBeEmptyDOMElement();
  });

  it("statusが'success'の場合、件数を含む成功メッセージが表示される", () => {
    const successState: ImporterState = {
      status: "success",
      error: null,
      importedCount: 5,
    };
    render(<ImportResult state={successState} />);

    expect(screen.getByText("5件のチケットをインポートしました。")).toBeInTheDocument();
  });

  it("statusが'error'の場合、エラーメッセージが表示される", () => {
    const errorMessage = "インポートに失敗しました。";
    const errorState: ImporterState = {
      status: "error",
      error: errorMessage,
      importedCount: 0,
    };

    render(<ImportResult state={errorState} />);
    expect(screen.getByText(errorMessage)).toBeInTheDocument();
  });
});
