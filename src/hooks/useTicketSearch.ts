import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { searchFormSchema, SearchFormValues } from "../schema";
import { filterTickets } from "../utils/ticketMatcher";
import { useMemo } from "react";
import { Ticket, PlaySide } from "../types";

export const useTicketSearch = (tickets: Ticket[], playSide: PlaySide) => {
  const methods = useForm<SearchFormValues>({
    resolver: zodResolver(searchFormSchema),
    mode: "onChange",
    defaultValues: {
      scratchSideText: "",
      isScratchSideUnordered: true,
      nonScratchSideText: "",
      isNonScratchSideUnordered: true,
    },
  });

  const formValues = methods.watch();
  const { scratchSideText, nonScratchSideText, isScratchSideUnordered, isNonScratchSideUnordered } = formValues;

  const filteredTickets = useMemo(() => {
    const paddedFormValues = {
      scratchSideText: scratchSideText.padEnd(3, "*"),
      isScratchSideUnordered,
      nonScratchSideText: nonScratchSideText.padEnd(4, "*"),
      isNonScratchSideUnordered,
    };
    return filterTickets(tickets, paddedFormValues, playSide);
  }, [tickets, scratchSideText, nonScratchSideText, isScratchSideUnordered, isNonScratchSideUnordered, playSide]);

  return {
    methods,
    filteredTickets,
  };
};
