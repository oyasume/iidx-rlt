import { renderHook, act } from "@testing-library/react";
import { useTicketSearch } from "./useTicketSearch";
import { Ticket } from "../../../types";
import { beforeEach, describe, expect, it, vi } from "vitest";
import * as ticketMatcher from "../../../utils/ticketMatcher";

describe("useTicketSearch", () => {
  const tickets: Ticket[] = [
    { laneText: "1234567", expiration: "" },
    { laneText: "7654321", expiration: "" },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("初期値で filterTickets が呼ばれる", () => {
    const filterTicketsSpy = vi.spyOn(ticketMatcher, "filterTickets").mockImplementation(() => [tickets[1]]);
    renderHook(() => useTicketSearch(tickets, "1P"));

    expect(filterTicketsSpy).toHaveBeenCalledWith(
      tickets,
      expect.objectContaining({ scratchSideText: "***", nonScratchSideText: "****" }),
      "1P"
    );
  });

  it("フォーム値を変更すると再評価される", () => {
    const filterTicketsSpy = vi.spyOn(ticketMatcher, "filterTickets").mockImplementation(() => [tickets[1]]);

    const { result } = renderHook(() => useTicketSearch(tickets, "1P"));

    act(() => {
      result.current.methods.setValue("scratchSideText", "765");
      result.current.methods.setValue("nonScratchSideText", "4321");
    });

    expect(filterTicketsSpy).toHaveBeenCalledWith(
      tickets,
      expect.objectContaining({ scratchSideText: "765", nonScratchSideText: "4321" }),
      "1P"
    );
    expect(result.current.filteredTickets).toEqual([tickets[1]]);
  });
});
