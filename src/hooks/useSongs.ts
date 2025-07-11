import { useState, useEffect } from "react";
import { SongInfo } from "../types";

export type SongsSource = { type: "url"; path: string } | { type: "static"; data: SongInfo[] };

export const useSongs = (source: SongsSource) => {
  const [songs, setSongs] = useState<SongInfo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const type = source.type;
  const path = source.type === "url" ? source.path : undefined;
  const data = source.type === "static" ? source.data : undefined;

  useEffect(() => {
    setIsLoading(true);
    setError(null);

    if (type === "url" && path) {
      fetch(path)
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
    } else if (type === "static" && data) {
      setSongs(data);
      setIsLoading(false);
    }
  }, [type, path, data]);

  return { songs, isLoading, error };
};
