export interface Ticket {
  laneText: string;
  expiration: string;
}

export interface SearchPattern {
  scratchSideText: string;
  isScratchSideUnordered: boolean;
  nonScratchSideText: string;
  isNonScratchSideUnordered: boolean;
}

export type PlaySide = "1P" | "2P";

export interface SongInfo {
  title: string;
  url: string;
  level: number;
}

export interface AppSettings {
  playSide: PlaySide;
}

export interface RouteDefinition {
  path: string;
  label: string;
  icon: React.ReactNode;
  element: React.ReactNode;
}
