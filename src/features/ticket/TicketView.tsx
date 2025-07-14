import { Typography, Stack, Divider, Box, Button, ToggleButton, ToggleButtonGroup } from "@mui/material";
import { Link } from "react-router-dom";

import { TextageForm } from "./components/TextageForm";
import { TicketSearchForm } from "./components/TicketSearchForm";
import { TicketList } from "./components/TicketList";
import { PlaySide, SongInfo, Ticket } from "../../types";
import { useAppSettings, useAppSettingsDispatch } from "../../contexts/AppSettingsContext";

interface TicketViewProps {
  allTickets: Ticket[];
  filteredTickets: Ticket[];
  songs: SongInfo[];
  selectedSong: SongInfo | null;
  onSongSelect: (song: SongInfo | null) => void;
  onOpenTextage: (laneText: string) => void;
}

export const TicketView: React.FC<TicketViewProps> = ({
  allTickets,
  filteredTickets,
  songs,
  selectedSong,
  onSongSelect,
  onOpenTextage,
}) => {
  const settings = useAppSettings();
  const { updatePlaySide } = useAppSettingsDispatch();

  const handlePlaySideToggle = (_event: React.MouseEvent<HTMLElement>, newPlaySide: PlaySide | null) => {
    if (newPlaySide !== null) {
      updatePlaySide(newPlaySide);
    }
  };

  return (
    <Stack spacing={2} sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <ToggleButtonGroup value={settings.playSide} color="primary" exclusive onChange={handlePlaySideToggle}>
        <ToggleButton value="1P">1P</ToggleButton>
        <ToggleButton value="2P">2P</ToggleButton>
      </ToggleButtonGroup>
      <TicketSearchForm />
      <Divider />
      <TextageForm songs={songs} selectedSong={selectedSong} onSongSelect={onSongSelect} />
      <Divider />
      {allTickets.length === 0 ? (
        <Box>
          <Typography variant="body1">チケットがありません</Typography>
          <Typography color="text.secondary">
            先にチケットをインポートするか、<Link to="/sample">サンプル</Link>でお試しください。
          </Typography>
          <Button component={Link} to="/import" variant="contained" sx={{ mt: 2 }}>
            インポートページへ
          </Button>
        </Box>
      ) : filteredTickets.length === 0 ? (
        <Typography sx={{ color: "text.secondary" }}>検索条件に一致するチケットはありません。</Typography>
      ) : (
        <TicketList tickets={filteredTickets} selectedSong={selectedSong} onOpenTextage={onOpenTextage} />
      )}
    </Stack>
  );
};
