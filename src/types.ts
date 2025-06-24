export interface Ticket {
  laneText: string;
  expiration: string;
}

export interface SearchPattern {
  scratchSide: string;
  isScratchSideUnordered: boolean;
  nonScratchSide: string;
  isNonScratchSideUnordered: boolean;
}

export type PlaySide = "1P" | "2P";
