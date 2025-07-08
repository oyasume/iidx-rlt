import React, { useState, useCallback } from "react";
import { Box, Tabs, Tab, Typography, Stack, Divider } from "@mui/material";
import { TextageForm } from "./component/TextageForm";
import { PlaySide, Ticket, SongInfo } from "./types";
import { TicketSearchForm } from "./component/TicketSearchForm";
import { TicketList } from "./component/TicketList";
import { TicketControlPanel } from "./component/TicketControlPanel";
import { FormProvider } from "react-hook-form";
import { IStorage } from "./storage";
import { useAppSettings } from "./hooks/useAppSettings";
import { useSongs } from "./hooks/useSongs";
import { useTextageOpener } from "./hooks/useTextageOpener";
import { useTicketSearch } from "./hooks/useTicketSearch";

interface ToolProps {
  tickets: Ticket[];
  storage: IStorage;
  songsJsonUrl: string;
}

const Tool: React.FC<ToolProps> = ({ tickets, storage, songsJsonUrl }) => {
  const [tabIndex, setTabIndex] = useState(0);
  const { settings, updatePlaySide, isLoading: isSettingsLoading } = useAppSettings(storage);
  const { songs, isLoading: isSongDataLoading } = useSongs(songsJsonUrl);
  const [selectedSong, setSelectedSong] = useState<SongInfo | null>(null);
  const { methods, filteredTickets } = useTicketSearch(tickets, settings.playSide);

  const handleTabChange = (_event: React.SyntheticEvent, value: number) => {
    setTabIndex(value);
  };

  const handlePlaySideChange = useCallback(
    (newPlaySide: PlaySide) => {
      updatePlaySide(newPlaySide);
    },
    [updatePlaySide]
  );

  const { handleOpenTextage } = useTextageOpener(selectedSong, settings.playSide);

  if (isSettingsLoading || isSongDataLoading) {
    return <Typography>データを読み込んでいます...</Typography>;
  }

  return (
    <Box sx={{ bgcolor: "background.paper", color: "text.primary", p: 2 }}>
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs value={tabIndex} onChange={handleTabChange}>
          <Tab label="チケット一覧" />
          <Tab label="当たり配置管理" />
        </Tabs>
      </Box>

      {tabIndex === 0 && (
        <Stack spacing={3} sx={{ mt: 2 }}>
          <TicketControlPanel playSide={settings.playSide} onPlaySideChange={handlePlaySideChange} />
          <FormProvider {...methods}>
            <TicketSearchForm />
          </FormProvider>
          <Divider />
          <TextageForm songs={songs} selectedSong={selectedSong} setSelectedSong={setSelectedSong} />
          <Divider />
          <TicketList tickets={filteredTickets} selectedSong={selectedSong} onOpenTextage={handleOpenTextage} />
        </Stack>
      )}
      {tabIndex === 1 && <Box sx={{ mt: 2 }}>当たり配置管理画面</Box>}
    </Box>
  );
};

export default Tool;
