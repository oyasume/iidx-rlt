import { Typography, Stack, Divider, Box, Button, ToggleButton, ToggleButtonGroup } from "@mui/material";
import { Link } from "react-router-dom";

import { TextageForm } from "./components/TextageForm";
import { TicketSearchForm } from "./components/TicketSearchForm";
import { TicketList } from "./components/TicketList";
import { AppSettings, PlaySide, SongInfo, Ticket } from "../../types";

interface TicketViewProps {
  allTickets: Ticket[];
  filteredTickets: Ticket[];
  songs: SongInfo[];
  selectedSong: SongInfo | null;
  settings: AppSettings;
  onPlaySideChange: (newPlaySide: PlaySide) => void;
  onSongSelect: (song: SongInfo | null) => void;
  onOpenTextage: (laneText: string) => void;
}

export const TicketView: React.FC<TicketViewProps> = ({
  allTickets,
  filteredTickets,
  songs,
  settings,
  selectedSong,
  onPlaySideChange,
  onSongSelect,
  onOpenTextage,
}) => {
  const handlePlaySideToggle = (_event: React.MouseEvent<HTMLElement>, newPlaySide: PlaySide | null) => {
    if (newPlaySide !== null) {
      onPlaySideChange(newPlaySide);
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
        <Box sx={{ mt: 4 }}>
          <Typography variant="h6">チケットがありません</Typography>
          <Typography color="text.secondary" sx={{ mt: 1 }}>
            先にチケットをインポートするか、<Link to="/sample">サンプルページ</Link>でお試しください。
          </Typography>
          <Button component={Link} to="/import" variant="contained" sx={{ mt: 2 }}>
            インポートページへ
          </Button>
        </Box>
      ) : filteredTickets.length === 0 ? (
        <Typography sx={{ textAlign: "center", mt: 4, color: "text.secondary" }}>
          検索条件に一致するチケットはありません。
        </Typography>
      ) : (
        <TicketList tickets={filteredTickets} selectedSong={selectedSong} onOpenTextage={onOpenTextage} />
      )}
    </Stack>
  );
};
