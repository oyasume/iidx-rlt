import { useCallback } from "react";
import { useAtariMatcher } from "../../../hooks/useAtariMatcher";
import { getHighlightColor } from "../../../utils/getHighlightColor";
import { makeTextageUrl } from "../../../utils/makeTextageUrl";
import { Ticket, AtariRule, SearchPattern, PlaySide } from "../../../types";
import { AtariInfoForPanel } from "../components/TicketDetailPanel";

export const useAtariProcessor = (
  allTickets: Ticket[],
  playSide: PlaySide,
  allRules?: AtariRule[],
  uniquePatterns?: SearchPattern[]
) => {
  const atariMatcher = useAtariMatcher(allTickets, allRules, uniquePatterns, playSide);

  const addHighlight = useCallback(
    (tickets: Ticket[]) => {
      return tickets.map((ticket) => ({
        ...ticket,
        highlightColor: getHighlightColor(atariMatcher.get(ticket.laneText) || []),
      }));
    },
    [atariMatcher]
  );

  const getAtariInfoForPanel = useCallback(
    (ticket: Ticket | null): AtariInfoForPanel[] => {
      if (!ticket) return [];
      const rules = atariMatcher.get(ticket.laneText);
      if (!rules) return [];
      return rules.map((rule) => ({
        id: rule.id,
        songTitle: rule.songTitle,
        description: rule.description,
        textageUrl: makeTextageUrl(rule.textageURL, playSide, ticket.laneText),
      }));
    },
    [atariMatcher, playSide]
  );

  return { addHighlight, getAtariInfoForPanel };
};
