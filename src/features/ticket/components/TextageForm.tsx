import React, { useState } from "react";
import {
  Autocomplete,
  TextField,
  ToggleButtonGroup,
  ToggleButton,
  useTheme,
  useMediaQuery,
  Stack,
} from "@mui/material";
import { SongInfo } from "../../../types";

interface TextageFormProps {
  allSongs: SongInfo[];
  atariSongs: SongInfo[];
  selectedSong: SongInfo | null;
  onSongSelect: (_song: SongInfo | null) => void;
}

export const TextageForm: React.FC<TextageFormProps> = ({ allSongs, atariSongs, selectedSong, onSongSelect }) => {
  const [searchMode, setSearchMode] = useState<"recommend" | "all">("recommend");
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const handleModeChange = (_event: React.MouseEvent<HTMLElement>, newMode: "recommend" | "all" | null) => {
    if (newMode !== null) {
      setSearchMode(newMode);
      // モード切り替え時に選択をクリア
      onSongSelect(null);
    }
  };

  const songs = searchMode === "recommend" ? atariSongs : allSongs;
  const placeholder = searchMode === "recommend" ? "当たり配置が定義済みの曲を検索" : "曲名で検索 (例: 冥)";

  return (
    <Stack spacing={2}>
      <ToggleButtonGroup
        value={searchMode}
        exclusive
        onChange={handleModeChange}
        aria-label="search mode"
        size="large"
        color="primary"
      >
        <ToggleButton value="recommend" aria-label="recommend search">
          おすすめから検索
        </ToggleButton>
        <ToggleButton value="all" aria-label="all songs search">
          全楽曲から検索
        </ToggleButton>
      </ToggleButtonGroup>
      <Autocomplete
        options={songs}
        getOptionLabel={(option) => option.title}
        value={selectedSong}
        onChange={(_event, newValue) => onSongSelect(newValue)}
        slotProps={{ listbox: { sx: { maxHeight: isMobile ? "25vh" : "40vh" } } }}
        renderInput={(params) => (
          <TextField
            {...params}
            label="楽曲を選択"
            variant="outlined"
            slotProps={{ inputLabel: { shrink: true } }}
            placeholder={placeholder}
          />
        )}
        sx={{ maxWidth: "500px" }}
      />
    </Stack>
  );
};
