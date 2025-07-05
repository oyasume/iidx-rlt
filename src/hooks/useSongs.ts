import { useState, useEffect } from "react";
import { SongInfo } from "../types";

export const useSongs = () => {
  const [songs, setSongs] = useState<SongInfo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    fetch(chrome.runtime.getURL("/data/songs.json"))
      .then((res) => res.json())
      .then((data) => {
        setSongs(data as SongInfo[]);
      })
      .catch((err) => {
        setError(new Error(`楽曲データの読み込みに失敗しました: ${err}`));
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  return { songs, isLoading, error };
};
