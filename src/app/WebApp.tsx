import { Typography } from "@mui/material";
import { LocalStorage } from "storage/localStorage";
import { usePersistentTickets } from "../hooks/usePersistentTickets";
import Tool from "Tool";

const storageInstance = new LocalStorage();

const WebApp: React.FC = () => {
  const { tickets, saveTickets, isLoading } = usePersistentTickets(storageInstance);

  if (isLoading) {
    return <Typography>チケット読み込み中...</Typography>;
  }

  return <Tool tickets={tickets} storage={storageInstance} songsJsonUrl={"data/songs.json"} />;
};

export default WebApp;
