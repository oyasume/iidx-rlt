import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { TicketSearchForm } from "./TicketSearchForm";

describe("TicketSearchForm", () => {
  it("必要な入力欄が正しく表示される", () => {
    render(<TicketSearchForm />);

    expect(screen.getByLabelText("皿側の3つが")).toBeInTheDocument();
    expect(screen.getByLabelText("非皿側の4つが")).toBeInTheDocument();
  });
});
