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
