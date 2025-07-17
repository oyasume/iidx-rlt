import { createContext, useState, useMemo, ReactNode, useContext } from "react";
import { Ticket } from "../../../types";

type TicketDetailContextType = {
  detailTicket: Ticket | null;
  setDetailTicket: (ticket: Ticket | null) => void;
};

const TicketDetailContext = createContext<TicketDetailContextType | undefined>(undefined);

export const TicketDetailProvider = ({ children }: { children: ReactNode }) => {
  const [detailTicket, setDetailTicket] = useState<Ticket | null>(null);

  const value = useMemo(
    () => ({
      detailTicket,
      setDetailTicket,
    }),
    [detailTicket]
  );

  return <TicketDetailContext.Provider value={value}>{children}</TicketDetailContext.Provider>;
};

export const useTicketDetail = () => {
  const context = useContext(TicketDetailContext);
  if (!context) {
    throw new Error("useTicketDetail must be used within a TicketDetailProvider");
  }
  return context;
};
