import type { Ticket, SearchPattern, PlaySide } from "../types";

const matchChar = (ruleChar: string, targetChar: string): boolean => {
  if (ruleChar === "*") return true;
  if (ruleChar === targetChar) return true;
  return false;
};

const matchSide = (ticketSideText: string, patternSideText: string, isUnordered: boolean): boolean => {
  const patternChars = patternSideText.split("");
  const ticketChars = ticketSideText.split("");
  if (patternChars.length !== ticketChars.length)
    throw new Error(`比較対象の長さが異なる ${patternChars.length} ${ticketChars.length}`);
  if (isUnordered) {
    for (const t of ticketChars) {
      if (patternChars.includes(t)) patternChars.splice(patternChars.indexOf(t), 1);
      else if (patternChars.includes("*")) patternChars.splice(patternChars.indexOf("*"), 1);
      else return false;
    }
    return true;
  }
  return ticketChars.every((targetChar, i) => matchChar(patternChars[i], targetChar));
};

export const matchTicket = (ticket: Ticket, pattern: SearchPattern, playSide: PlaySide): boolean => {
  const laneText = ticket.laneText;
  if (playSide === "1P") {
    const scratchSide = laneText.substring(0, 3);
    const nonScratchSide = laneText.substring(3);
    return (
      matchSide(scratchSide, pattern.scratchSide, pattern.isScratchSideUnordered) &&
      matchSide(nonScratchSide, pattern.nonScratchSide, pattern.isNonScratchSideUnordered)
    );
  } else {
    const scratchSide = laneText.substring(4);
    const nonScratchSide = laneText.substring(0, 4);
    return (
      matchSide(scratchSide, pattern.scratchSide, pattern.isScratchSideUnordered) &&
      matchSide(nonScratchSide, pattern.nonScratchSide, pattern.isNonScratchSideUnordered)
    );
  }
};

export const filterTickets = (tickets: Ticket[], pattern: SearchPattern, playSide: PlaySide): Ticket[] => {
  return tickets.filter((ticket) => matchTicket(ticket, pattern, playSide));
};
