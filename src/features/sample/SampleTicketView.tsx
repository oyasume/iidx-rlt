import React from "react";
import { usePersistentTickets } from "../../hooks/usePersistentTickets";
import { TicketView } from "../ticket/TicketView";
import { SampleStorage } from "./storage/SampleStorage";
import { Typography } from "@mui/material";
import { SongInfo } from "../../types";

const sampleStorage = new SampleStorage();

export const sampleSongs: SongInfo[] = [
  {
    title: "V(A)",
    url: "https://textage.cc/score/5/v_taka.html?1AC00",
    level: 12,
  },
  {
    title: "rage against usual(A)",
    url: "https://textage.cc/score/12/rageagst.html?1AC00",
    level: 12,
  },
];

export const SampleTicketView: React.FC = () => {
  const { tickets, isLoading } = usePersistentTickets(sampleStorage);

  if (isLoading) {
    return <Typography>サンプルデータを読み込んでいます...</Typography>;
  }

  return (
    <TicketView
      tickets={tickets}
      storage={sampleStorage}
      songsSource={{
        type: "static",
        data: sampleSongs,
      }}
    />
  );
};
