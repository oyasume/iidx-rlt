import React from "react";
import { usePersistentTickets } from "../../hooks/usePersistentTickets";
import { TicketView } from "../ticket/TicketView";
import { SampleStorage } from "./storage/SampleStorage";
import { Typography } from "@mui/material";

const sampleStorage = new SampleStorage();

export const SampleTicketView: React.FC = () => {
  const { tickets, isLoading } = usePersistentTickets(sampleStorage);

  if (isLoading) {
    return <Typography>サンプルデータを読み込んでいます...</Typography>;
  }

  return (
    <TicketView tickets={tickets} storage={sampleStorage} songsJsonUrl={`${import.meta.env.BASE_URL}data/songs.json`} />
  );
};
