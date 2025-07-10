import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import { AppDrawer } from "./AppDrawer";

const mockTabs = [
  { label: "インポート", icon: <div data-testid="import-icon" /> },
  { label: "チケット一覧", icon: <div data-testid="tickets-icon" /> },
];

describe("AppDrawer", () => {
  it("すべてのタブが正しく表示されること", () => {
    render(<AppDrawer tabs={mockTabs} tabIndex={0} setTabIndex={() => {}} />);

    expect(screen.getByTestId("import-icon")).toBeInTheDocument();
    expect(screen.getByTestId("tickets-icon")).toBeInTheDocument();
  });

  it("tabIndexでタブが選択されたされること", () => {
    const activeIndex = 1;
    render(<AppDrawer tabs={mockTabs} tabIndex={activeIndex} setTabIndex={() => {}} />);

    const selectedItem = screen.getByRole("button", { name: "チケット一覧" });
    const unselectedItem = screen.getByRole("button", { name: "インポート" });

    expect(selectedItem).toHaveClass("Mui-selected");
    expect(unselectedItem).not.toHaveClass("Mui-selected");
  });

  it("タブをクリックしたときにsetTabIndexが正しいインデックスで呼び出されること", async () => {
    const mockSetTabIndex = vi.fn();
    const user = userEvent.setup();
    render(<AppDrawer tabs={mockTabs} tabIndex={0} setTabIndex={mockSetTabIndex} />);

    const targetItem = screen.getByRole("button", { name: "チケット一覧" });
    await user.click(targetItem);

    expect(mockSetTabIndex).toHaveBeenCalledWith(1);
  });
});
