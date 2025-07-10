import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { AppHeader } from "./AppHeader";

describe("AppHeader", () => {
  it("正しく表示されること", () => {
    render(<AppHeader />);
    const githubLink = screen.getByRole("link", { name: /github repository/i });

    expect(screen.getByText("iidx-rlt")).toBeInTheDocument();
    expect(githubLink).toBeInTheDocument();
  });
});
