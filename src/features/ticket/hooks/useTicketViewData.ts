import { usePersistentTickets } from "../../../hooks/usePersistentTickets";
import { useSongs } from "../../../hooks/useSongs";
import { useAtariRules } from "../../../hooks/useAtariRules";
import { LocalStorage } from "../../../storage/localStorage";
import { sampleTickets } from "../../../data";

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
