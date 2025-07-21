import { useCallback, useMemo, useState } from "react";
import { FormProvider } from "react-hook-form";
import { Stack, Divider, Box, Button, ToggleButton, ToggleButtonGroup, Typography } from "@mui/material";
import { Link } from "react-router-dom";

import { usePersistentTickets } from "../hooks/usePersistentTickets";
import { useSongs } from "../hooks/useSongs";
import { useTicketSearch } from "../hooks/useTicketSearch";
import { TextageForm } from "../features/ticket/components/TextageForm";
import { TicketSearchForm } from "../features/ticket/components/TicketSearchForm";
import { TicketList } from "../features/ticket/components/TicketList";
import { SongInfo, PlaySide } from "../types";
import { LocalStorage } from "../storage/localStorage";
import { useAppSettings, useAppSettingsDispatch } from "../contexts/AppSettingsContext";
import { makeTextageUrl } from "../utils/makeTextageUrl";
import { TicketDetailPanel, AtariInfoForPanel } from "../features/ticket/components/TicketDetailPanel";
import { TicketDetailProvider, useTicketDetail } from "../features/ticket/contexts/TicketDetailContext";
import { useAtariRules } from "../hooks/useAtariRules";
import { useAtariMatcher } from "../hooks/useAtariMatcher";
import { sampleTickets } from "../data";

const storage = new LocalStorage();

interface TicketViewPageProps {
  isSample?: boolean;
}

const TicketViewPageContent = ({ isSample = false }: TicketViewPageProps) => {
  const { tickets: persistentTickets, isLoading: isTicketsLoading } = usePersistentTickets(storage);
  const tickets = isSample ? sampleTickets : persistentTickets;
  const isLoadingTickets = isSample ? false : isTicketsLoading;

  const settings = useAppSettings();
  const { updatePlaySide } = useAppSettingsDispatch();
  const { methods, filteredTickets } = useTicketSearch(tickets, settings.playSide);
  const { songs, isLoading: isSongDataLoading } = useSongs({
    type: "url",
    path: `${import.meta.env.BASE_URL}data/songs.json`,
  });
  const { allRules, uniquePatterns, isLoading: isAtariRulesLoading } = useAtariRules();
  const atariMatcher = useAtariMatcher(tickets, allRules, uniquePatterns, settings.playSide);
  const [selectedSong, setSelectedSong] = useState<SongInfo | null>(null);
  const { detailTicket, setDetailTicket } = useTicketDetail();

  const atariInfoForPanel = useMemo((): AtariInfoForPanel[] => {
    if (!detailTicket) return [];
    const rules = atariMatcher.get(detailTicket.laneText) || [];
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

  const handlePlaySideToggle = (_event: React.MouseEvent<HTMLElement>, newPlaySide: PlaySide | null) => {
    if (newPlaySide !== null) {
      updatePlaySide(newPlaySide);
    }
  };

  const isLoading = isLoadingTickets || isSongDataLoading || isAtariRulesLoading;

  if (isLoading) {
    return <div>データを読み込んでいます...</div>;
  }

  return (
    <FormProvider {...methods}>
      <Stack spacing={2} sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
        <ToggleButtonGroup
          size="large"
          value={settings.playSide}
          color="primary"
          exclusive
          onChange={handlePlaySideToggle}
        >
          <ToggleButton value="1P">1P</ToggleButton>
          <ToggleButton value="2P">2P</ToggleButton>
        </ToggleButtonGroup>
        <TicketSearchForm />
        <Divider />
        <TextageForm songs={songs} selectedSong={selectedSong} onSongSelect={setSelectedSong} />
        <Divider />
        {tickets.length === 0 ? (
          <Box>
            <Typography variant="body1">チケットがありません</Typography>
            <Typography color="text.secondary">
              先にチケットをインポートするか、<Link to="/sample">サンプル</Link>でお試しください。
            </Typography>
            <Button component={Link} to="/import" variant="contained" sx={{ mt: 2 }}>
              インポートページへ
            </Button>
          </Box>
        ) : filteredTickets.length === 0 ? (
          <Typography sx={{ color: "text.secondary" }}>検索条件に一致するチケットはありません。</Typography>
        ) : (
          <TicketList tickets={filteredTickets} selectedSong={selectedSong} onOpenTextage={handleOpenTextage} />
        )}
      </Stack>
      <TicketDetailPanel ticket={detailTicket} atariInfo={atariInfoForPanel} onClose={() => setDetailTicket(null)} />
    </FormProvider>
  );
};

export const TicketViewPage = ({ isSample = false }: TicketViewPageProps) => {
  return (
    <TicketDetailProvider>
      <TicketViewPageContent isSample={isSample} />
    </TicketDetailProvider>
  );
};
