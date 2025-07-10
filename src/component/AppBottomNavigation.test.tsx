import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import { AppBottomNavigation } from "./AppBottomNavigation";

const mockTabs = [
  { label: "インポート", icon: <div data-testid="import-icon" /> },
  { label: "チケット一覧", icon: <div data-testid="tickets-icon" /> },
];

describe("AppBottomNavigation", () => {
  it("タブが正しく表示されること", () => {
    render(<AppBottomNavigation tabs={mockTabs} tabIndex={0} setTabIndex={() => {}} />);

    expect(screen.getByTestId("import-icon")).toBeInTheDocument();
    expect(screen.getByTestId("tickets-icon")).toBeInTheDocument();
  });

  it("tabIndexのタブがアクティブになること", () => {
    const activeIndex = 1;
    render(<AppBottomNavigation tabs={mockTabs} tabIndex={activeIndex} setTabIndex={() => {}} />);

    const activeButton = screen.getByRole("button", { name: "チケット一覧" });
    expect(activeButton).toHaveClass("Mui-selected");

    const inactiveButton = screen.getByRole("button", { name: "インポート" });
    expect(inactiveButton).not.toHaveClass("Mui-selected");
  });

  it("タブをクリックした際にsetTabIndexが正しいインデックスで呼び出されること", async () => {
    const mockSetTabIndex = vi.fn();
    const user = userEvent.setup();
    render(<AppBottomNavigation tabs={mockTabs} tabIndex={0} setTabIndex={mockSetTabIndex} />);

    const targetTab = screen.getByRole("button", { name: "チケット一覧" });
    await user.click(targetTab);

    expect(mockSetTabIndex).toHaveBeenCalledWith(1);
  });
});
