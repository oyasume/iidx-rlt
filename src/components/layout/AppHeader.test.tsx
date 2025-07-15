import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { AppHeader } from "./AppHeader";

describe("AppHeader", () => {
  it("正しく表示されること", () => {
    render(<AppHeader />);

    expect(screen.getByRole("heading")).toBeInTheDocument();
  });
});
