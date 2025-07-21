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

  const filteredTickets = useMemo(() => {
    const paddedFormValues = {
      ...formValues,
      scratchSideText: formValues.scratchSideText.padEnd(3, "*"),
      nonScratchSideText: formValues.nonScratchSideText.padEnd(4, "*"),
    };
    return filterTickets(tickets, paddedFormValues, playSide);
  }, [tickets, formValues, playSide]);

  return {
    methods,
    filteredTickets,
  };
};
