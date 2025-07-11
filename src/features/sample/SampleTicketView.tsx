import React from "react";
import { usePersistentTickets } from "../../hooks/usePersistentTickets";
import { TicketView } from "../ticket/TicketView";
import { SampleStorage } from "./storage/SampleStorage";
import { Box, Typography } from "@mui/material";
import { SongInfo } from "../../types";
import { useTicketSearch } from "../../features/ticket/hooks/useTicketSearch";
import { FormProvider } from "react-hook-form";
import { useAppSettings } from "../../hooks/useAppSettings";

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
  const { settings, updatePlaySide } = useAppSettings(sampleStorage);
  const { tickets, isLoading } = usePersistentTickets(sampleStorage);
  const { methods, filteredTickets } = useTicketSearch(tickets, settings.playSide);

  if (isLoading) {
    return <Typography>サンプルデータを読み込んでいます...</Typography>;
  }

  return (
    <Box>
      <FormProvider {...methods}>
        <TicketView
          allTickets={tickets}
          filteredTickets={filteredTickets}
          songs={sampleSongs}
          settings={settings}
          onPlaySideChange={updatePlaySide}
        />
      </FormProvider>
    </Box>
  );
};
