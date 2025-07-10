import type { PlaySide, SongInfo } from "../types";

/**
 * TextageのプレビューURLを生成
 * @param songInfo 選択された曲の情報
 * @param laneText 適用するチケットの7桁の配置
 * @returns TextageのURL
 */
export const makeTextageUrl = (songInfo: SongInfo, playSide: PlaySide, laneText: string): string => {
  const baseURL = songInfo.url.split("?")[0];
  const otherOptions = songInfo.url.split("?")[1].slice(1);
  const playSideOption = playSide === "1P" ? "1" : "2";

  return `${baseURL}?${playSideOption}${otherOptions}R0${laneText}01234567`;
};
