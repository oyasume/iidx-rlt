import React, { useCallback, useMemo, useState } from "react";
import { FormProvider } from "react-hook-form";

import { TicketView } from "../ticket/TicketView";
import { sampleTickets } from "../../data";
import { SongInfo } from "../../types";
import { useTicketSearch } from "../../hooks/useTicketSearch";
import { useAppSettings } from "../../contexts/AppSettingsContext";
import { makeTextageUrl } from "../../utils/makeTextageUrl";
import { TicketDetailProvider, useTicketDetail } from "../../features/ticket/contexts/TicketDetailContext";
import { TicketDetailPanel, AtariInfoForPanel } from "../../features/ticket/components/TicketDetailPanel";
import { useAtariRules } from "../../hooks/useAtariRules";
import { useAtariMatcher } from "../../hooks/useAtariMatcher";
import { useSongs } from "../../hooks/useSongs";

const SampleTicketViewContent: React.FC = () => {
  const settings = useAppSettings();
  const { methods, filteredTickets } = useTicketSearch(sampleTickets, settings.playSide);
  const { songs, isLoading: isSongDataLoading } = useSongs({
    type: "url",
    path: `${import.meta.env.BASE_URL}data/songs.json`,
  });
  const { allRules, uniquePatterns, isLoading: isAtariRulesLoading } = useAtariRules();
  const atariMatcher = useAtariMatcher(sampleTickets, allRules, uniquePatterns, settings.playSide);

  const [selectedSong, setSelectedSong] = useState<SongInfo | null>(null);
  const { detailTicket, setDetailTicket } = useTicketDetail();

  const atariInfoForPanel = useMemo((): AtariInfoForPanel[] => {
    if (!detailTicket) return [];
    const rules = atariMatcher.get(detailTicket.laneText) || [];
    // ここら辺やりづらいのどうにかしたい
    const songsInRules = songs.filter((s) => rules.some((r) => s.title === r.songTitle));
    return rules
      .map((rule) => {
        const song = songsInRules.find((s) => s.title === rule.songTitle);
        if (!song) return null;
        return {
          id: rule.id,
          songTitle: rule.songTitle,
          description: rule.description,
          textageUrl: makeTextageUrl(song, settings.playSide, detailTicket.laneText),
        };
      })
      .filter((info): info is AtariInfoForPanel => info !== null);
  }, [detailTicket, atariMatcher, songs, settings.playSide]);

  const handleOpenTextage = useCallback(
    (laneText: string) => {
      if (selectedSong) {
        const url = makeTextageUrl(selectedSong, settings.playSide, laneText);
        window.open(url, "_blank", "noopener,noreferrer");
      }
    },
    [selectedSong, settings.playSide]
  );

  const isLoading = isSongDataLoading || isAtariRulesLoading;
  if (isLoading) {
    return <div>データを読み込んでいます...</div>;
  }

  return (
    <FormProvider {...methods}>
      <TicketView
        allTickets={sampleTickets}
        filteredTickets={filteredTickets}
        songs={songs}
        selectedSong={selectedSong}
        onSongSelect={setSelectedSong}
        onOpenTextage={handleOpenTextage}
      />
      <TicketDetailPanel ticket={detailTicket} atariInfo={atariInfoForPanel} onClose={() => setDetailTicket(null)} />
    </FormProvider>
  );
};

export const SampleTicketView: React.FC = () => {
  return (
    <TicketDetailProvider>
      <SampleTicketViewContent />
    </TicketDetailProvider>
  );
};
