import { TicketImporter } from "../features/import/TicketImporter";
import { usePersistentTickets } from "../hooks/usePersistentTickets";
import { LocalStorage } from "../storage/localStorage";

const storage = new LocalStorage();

export const TicketImporterPage = () => {
  const { saveTickets } = usePersistentTickets(storage);

  return <TicketImporter onImport={saveTickets} />;
};
