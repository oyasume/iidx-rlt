import { useState, useEffect, useCallback } from "react";
import { Ticket } from "../types";
import { IStorage } from "../storage";

export const usePersistentTickets = (storage: IStorage) => {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    storage
      .get({ tickets: [] })
      .then((savedData) => {
        setTickets(savedData.tickets);
      })
      .catch((error) => {
        console.error("チケットを読み込めない:", error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [storage]);

  const saveTickets = useCallback(
    async (newTickets: Ticket[]) => {
      setTickets(newTickets);
      await storage.set({ tickets: newTickets });
    },
    [storage]
  );

  return { tickets, saveTickets, isLoading };
};
