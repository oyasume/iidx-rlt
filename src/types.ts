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

export interface AtariRule {
  id: string;
  songTitle: string;
  priority: number;
  description: string;
  patterns: SearchPattern[];
}

export interface AppSettings {
  playSide: PlaySide;
}

export interface AppNavItem {
  path: string;
  label: string;
  icon: React.ReactNode;
}
