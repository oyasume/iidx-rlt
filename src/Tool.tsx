import React, { useState, useMemo } from "react";
import {
  Box,
  Tabs,
  Tab,
  ToggleButtonGroup,
  ToggleButton,
  Typography,
  Autocomplete,
  TextField,
  Button,
  Stack,
  Divider,
} from "@mui/material";
import { PlaySide, Ticket, SongInfo } from "./types";
import { TicketSearchForm } from "./component/TicketSearchForm";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { searchFormSchema, SearchFormValues } from "./schema";
import { makeTextageUrl } from "./utils/makeTextageUrl";
import { filterTickets } from "./utils/ticketMatcher";
import { useAppSettings } from "./hooks/useAppSettings";
import { useSongs } from "./hooks/useSongs";

interface ToolProps {
  tickets: Ticket[];
}

const Tool: React.FC<ToolProps> = ({ tickets }) => {
  const [tabIndex, setTabIndex] = useState(0);
  const { settings, updatePlaySide, isLoading: isSettingsLoading } = useAppSettings();
  const { songs, isLoading: isSongDataLoading } = useSongs();
  const [selectedSong, setSelectedSong] = useState<SongInfo | null>(null);

  const methods = useForm<SearchFormValues>({
    resolver: zodResolver(searchFormSchema),
    defaultValues: {
      scratchSideText: "***",
      isScratchSideUnordered: true,
      nonScratchSideText: "****",
      isNonScratchSideUnordered: true,
    },
  });

  const formValues = methods.watch();

  const filteredTickets = useMemo(() => {
    return filterTickets(tickets, formValues, settings.playSide);
  }, [tickets, formValues, settings.playSide]);

  const handleTabChange = (_event: React.SyntheticEvent, value: number) => {
    setTabIndex(value);
  };

  const handlePlaySideChange = (_event: React.SyntheticEvent, newPlaySide: PlaySide | null) => {
    if (newPlaySide !== null) {
      updatePlaySide(newPlaySide);
    }
  };

  const handleOpenTextage = (laneText: string) => {
    if (selectedSong !== null) {
      const textageUrl = makeTextageUrl(selectedSong, settings.playSide, laneText);
      window.open(textageUrl, "_blank");
    }
  };

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
          <ToggleButtonGroup value={settings.playSide} exclusive color="primary" onChange={handlePlaySideChange}>
            <ToggleButton value="1P">1P</ToggleButton>
            <ToggleButton value="2P">2P</ToggleButton>
          </ToggleButtonGroup>
          <FormProvider {...methods}>
            <TicketSearchForm />
          </FormProvider>
          <Divider />
          <Box>
            <Typography>Textageの設定</Typography>
            <Autocomplete
              options={songs}
              getOptionLabel={(option) => option.title}
              value={selectedSong}
              onChange={(_event, newValue) => setSelectedSong(newValue)}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="楽曲を選択"
                  variant="standard"
                  sx={{ mt: 1 }}
                  slotProps={{ inputLabel: { shrink: true } }}
                  placeholder="曲名で検索 (例: 冥)"
                />
              )}
            />
          </Box>
          <Divider />
          <Box>
            <Stack>
              {filteredTickets.map((t, index) => (
                <Box key={index} sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  <Typography>{t.laneText}</Typography>
                  <Button variant="outlined" onClick={() => handleOpenTextage(t.laneText)} disabled={!selectedSong}>
                    Textageで確認
                  </Button>
                </Box>
              ))}
            </Stack>
          </Box>
        </Stack>
      )}
      {tabIndex === 1 && <Box sx={{ mt: 2 }}>当たり配置管理画面</Box>}
    </Box>
  );
};

export default Tool;
