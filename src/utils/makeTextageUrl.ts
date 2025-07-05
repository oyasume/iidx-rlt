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
  if (playSide === "1P") {
    return `${baseURL}?1${otherOptions}R${laneText}`;
  } else {
    return `${baseURL}?2${otherOptions}R${laneText}`;
  }
};
