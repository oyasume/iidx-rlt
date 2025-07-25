import React from "react";
import { Autocomplete, TextField } from "@mui/material";
import { SongInfo } from "../../../types";

interface TextageFormProps {
  songs: SongInfo[];
  selectedSong: SongInfo | null;
  onSongSelect: (_song: SongInfo | null) => void;
}

export const TextageForm: React.FC<TextageFormProps> = ({ songs, selectedSong, onSongSelect }) => {
  return (
    <Autocomplete
      options={songs}
      getOptionLabel={(option) => option.title}
      value={selectedSong}
      onChange={(_event, newValue) => onSongSelect(newValue)}
      renderInput={(params) => (
        <TextField
          {...params}
          label="楽曲を選択"
          variant="outlined"
          sx={{ mt: 1 }}
          slotProps={{ inputLabel: { shrink: true } }}
          placeholder="曲名で検索 (例: 冥)"
        />
      )}
      sx={{ maxWidth: "500px" }}
    />
  );
};
