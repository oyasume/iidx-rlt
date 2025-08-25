import { useMemo } from "react";
import { AtariRule, PlaySide, SongInfo, Ticket, TicketQuery } from "../../../types";
import { createAtariMap } from "../../../utils/atari";
import { filterTickets, matchTicket } from "../../../utils/match";

export const useTicketSelectors = (
  tickets: Ticket[],
  songs: SongInfo[],
  atariRules: AtariRule[],
  query: TicketQuery,
  playSide: PlaySide
) => {
  const atariMap = useMemo(() => createAtariMap(atariRules), [atariRules]);

  const selectedAtariRules = useMemo(
    () => (query.textageSong ? (atariMap.getRulesForSong(query.textageSong.title) ?? []) : []),
    [atariMap, query.textageSong]
  );

  const filteredTickets = useMemo(() => {
    const searched = filterTickets(tickets, query, playSide);

    const applyAtariFilter = query.filterMode === "recommend" && query.textageSong;
    if (!applyAtariFilter) {
      return searched;
    }
    return searched.filter((ticket) =>
      selectedAtariRules.some((rule) => rule.patterns.some((pattern) => matchTicket(ticket, pattern, playSide)))
    );
  }, [tickets, query, playSide, selectedAtariRules]);

  const highlightedTickets = useMemo(
    () =>
      filteredTickets.map((ticket) => ({
        ...ticket,
        highlightColor: atariMap.getColorForTicket(ticket, playSide),
      })),
    [filteredTickets, atariMap, playSide]
  );

  const pageCount = useMemo(
    () => Math.ceil(highlightedTickets.length / query.itemsPerPage),
    [highlightedTickets.length, query.itemsPerPage]
  );

  const paginatedTickets = useMemo(() => {
    const startIndex = (query.currentPage - 1) * query.itemsPerPage;
    return highlightedTickets.slice(startIndex, startIndex + query.itemsPerPage);
  }, [highlightedTickets, query.currentPage, query.itemsPerPage]);

  const atariSongs = useMemo(
    () => songs.filter((song) => (atariMap.getRulesForSong(song.title) ?? []).length > 0),
    [songs, atariMap]
  );

  return {
    atariMap,
    atariSongs,
    selectedAtariRules,
    paginatedTickets,
    pageCount,
    totalCount: highlightedTickets.length,
  };
};
