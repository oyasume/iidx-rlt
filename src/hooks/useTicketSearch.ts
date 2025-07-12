import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { searchFormSchema, SearchFormValues } from "../schema";
import { filterTickets } from "../utils/ticketMatcher";
import { useMemo } from "react";
import { Ticket, PlaySide } from "../types";

export const useTicketSearch = (tickets: Ticket[], playSide: PlaySide) => {
  const methods = useForm<SearchFormValues>({
    resolver: zodResolver(searchFormSchema),
    defaultValues: {
      scratchSideText: "***",
      isScratchSideUnordered: true,
      nonScratchSideText: "****",
      isNonScratchSideUnordered: true,
    },
  });

  const formValues = methods.watch();

  const filteredTickets = useMemo(() => {
    return filterTickets(tickets, formValues, playSide);
  }, [tickets, formValues, playSide]);

  return {
    methods,
    filteredTickets,
  };
};
