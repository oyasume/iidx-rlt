import { usePersistentTickets } from "../../../hooks/usePersistentTickets";
import { useSongs } from "../../../hooks/useSongs";
import { useAtariRules } from "../../../hooks/useAtariRules";
import { LocalStorage } from "../../../storage/localStorage";
import { Ticket } from "../../../types";

const sampleTickets: Ticket[] = [
  { laneText: "1234567", expiration: "2999/12/31" },
  { laneText: "7654321", expiration: "2999/12/31" },
  { laneText: "3456712", expiration: "2999/12/31" },
  { laneText: "5432176", expiration: "2999/12/31" },
  { laneText: "1357246", expiration: "2999/12/31" },
  { laneText: "2461357", expiration: "2999/12/31" }, // 1P側
  { laneText: "6427531", expiration: "2999/12/31" },
  { laneText: "7531642", expiration: "2999/12/31" }, // 2P側
  { laneText: "1726354", expiration: "2999/12/31" },
  { laneText: "4567123", expiration: "2999/12/31" },
];

const storage = new LocalStorage();

export const useTicketViewData = (isSample: boolean) => {
  const { tickets: persistentTickets, isLoading: isTicketsLoading } = usePersistentTickets(storage);
  const { songs, isLoading: isSongDataLoading } = useSongs({
    type: "url",
    path: `${import.meta.env.BASE_URL}data/songs.json`,
  });
  const { allRules, rulesBySong, uniquePatterns, isLoading: isAtariRulesLoading } = useAtariRules();

  const tickets = isSample ? sampleTickets : persistentTickets;

  const isLoading = isSample
    ? isSongDataLoading || isAtariRulesLoading
    : isTicketsLoading || isSongDataLoading || isAtariRulesLoading;

  return {
    isLoading,
    tickets,
    songs,
    allRules,
    rulesBySong,
    uniquePatterns,
  };
};
