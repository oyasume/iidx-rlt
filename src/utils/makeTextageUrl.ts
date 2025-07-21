import type { PlaySide } from "../types";

/**
 * TextageのプレビューURLを生成
 * @param baseUrlWithParams TextageのデフォルトURL
 * @param playSide プレイサイド
 * @param laneText 適用するチケットの7桁の配置
 * @returns TextageのURL
 */
export const makeTextageUrl = (baseUrlWithParams: string, playSide: PlaySide, laneText: string): string => {
  const baseURL = baseUrlWithParams.split("?")[0];
  const otherOptions = baseUrlWithParams.split("?")[1].slice(1);
  const playSideOption = playSide === "1P" ? "1" : "2";

  return `${baseURL}?${playSideOption}${otherOptions}R0${laneText}01234567`;
};
