import { useState, useEffect } from "react";
import { SongInfo } from "../types";

export type SongsSource = { type: "url"; path: string } | { type: "static"; data: SongInfo[] };

export const useSongs = (source: SongsSource) => {
  const [songs, setSongs] = useState<SongInfo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    setIsLoading(true);
    setError(null);

    if (source.type === "url") {
      fetch(source.path)
        .then((res) => res.json())
        .then((data) => {
          setSongs(data as SongInfo[]);
        })
        .catch((err) => {
          setError(new Error(`楽曲データの読み込みに失敗しました: ${err as string}`));
        })
        .finally(() => {
          setIsLoading(false);
        });
    } else if (source.type === "static") {
      setSongs(source.data);
      setIsLoading(false);
    }
  }, [source]);

  return { songs, isLoading, error };
};
