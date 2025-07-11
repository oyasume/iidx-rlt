import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { AppBottomNavigation } from "./AppBottomNavigation";
import { BrowserRouter } from "react-router-dom";
import { RouteDefinition } from "../../types";

const mockTabs: RouteDefinition[] = [
  { path: "/import", label: "インポート", icon: <div data-testid="import-icon" />, element: <div /> },
  { path: "/tickets", label: "チケット一覧", icon: <div data-testid="tickets-icon" />, element: <div /> },
];

const TestComponent = (props: { tabIndex: number }) => (
  <BrowserRouter>
    <AppBottomNavigation tabs={mockTabs} tabIndex={props.tabIndex} />
  </BrowserRouter>
);

describe("AppBottomNavigation", () => {
  it("tabIndexのタブがアクティブになること", () => {
    render(<TestComponent tabIndex={1} />);
    const activeButton = screen.getByRole("link", { name: "チケット一覧" });
    const inactiveButton = screen.getByRole("link", { name: "インポート" });

    expect(activeButton).toHaveClass("Mui-selected");
    expect(inactiveButton).not.toHaveClass("Mui-selected");
  });

  it("タブが正しいパスにリンクされていること", () => {
    render(<TestComponent tabIndex={0} />);

    expect(screen.getByRole("link", { name: "インポート" })).toHaveAttribute("href", "/import");
    expect(screen.getByRole("link", { name: "チケット一覧" })).toHaveAttribute("href", "/tickets");
  });
});
