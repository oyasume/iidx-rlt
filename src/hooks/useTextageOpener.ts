import { useCallback } from "react";
import { SongInfo, PlaySide } from "../types";
import { makeTextageUrl } from "../utils/makeTextageUrl";

export const useTextageOpener = (selectedSong: SongInfo | null, playSide: PlaySide) => {
  const handleOpenTextage = useCallback(
    (laneText: string) => {
      if (selectedSong !== null) {
        const textageUrl = makeTextageUrl(selectedSong, playSide, laneText);
        window.open(textageUrl, "_blank", "noopener,noreferrer");
      }
    },
    [selectedSong, playSide]
  );

  return { handleOpenTextage };
};
