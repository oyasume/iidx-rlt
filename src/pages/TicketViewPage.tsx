import {
  Box,
  Button,
  CircularProgress,
  Divider,
  Stack,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from "@mui/material";
import React, { useCallback, useMemo, useState } from "react";
import ReactGA from "react-ga4";
import { FormProvider } from "react-hook-form";
import { Link } from "react-router-dom";
import useSWR from "swr";

import { Page } from "../components/layout/Page";
import { useAppSettings, useAppSettingsDispatch } from "../contexts/AppSettingsContext";
import { AtariInfoPanel } from "../features/ticket/components/AtariInfoPanel";
import { AtariRulePanel } from "../features/ticket/components/AtariRulePanel";
import { TextageForm } from "../features/ticket/components/TextageForm";
import { TicketList } from "../features/ticket/components/TicketList";
import { TicketResultsSection } from "../features/ticket/components/TicketResultsSection";
import { TicketSearchForm } from "../features/ticket/components/TicketSearchForm";
import { useTicketQuery } from "../features/ticket/hooks/useTicketQuery";
import { useTicketSelectors } from "../features/ticket/hooks/useTicketSelectors";
import { usePersistentTickets } from "../hooks/usePersistentTickets";
import { LocalStorage } from "../storage/localStorage";
import { AtariRule, PlaySide, SongInfo, Ticket } from "../types";
import { makeTextageUrl } from "../utils/makeTextageUrl";

const sampleTickets: Ticket[] = [
  { laneText: "1234567", expiration: "2999/12/31" },
  { laneText: "7654321", expiration: "2999/12/31" },
  { laneText: "3456712", expiration: "2999/12/31" },
  { laneText: "5432176", expiration: "2999/12/31" },
  { laneText: "1357246", expiration: "2999/12/31" },
  { laneText: "2461357", expiration: "2999/12/31" }, // 1P側
  { laneText: "6427531", expiration: "2999/12/31" },
  { laneText: "7531642", expiration: "2999/12/31" }, // 2P側
  { laneText: "1726354", expiration: "2999/12/31" },
  { laneText: "4567123", expiration: "2999/12/31" },
  { laneText: "1562347", expiration: "2999/12/31" }, // AIR RAID 1P
  { laneText: "1564237", expiration: "2999/12/31" }, // AIR RAID 2P
];

const storage = new LocalStorage();
const fetcher = (url: string) => fetch(url).then((res) => res.json());

interface TicketViewPageProps {
  isSample?: boolean;
}

export const TicketViewPage: React.FC<TicketViewPageProps> = ({ isSample = false }) => {
  const { tickets: persistentTickets, isLoading: isTicketsLoading } = usePersistentTickets(storage);

  const { data: songs, isLoading: isSongDataLoading } = useSWR<SongInfo[]>(
    `${import.meta.env.BASE_URL}data/songs.json`,
    fetcher
  );
  const { data: atariRules, isLoading: isAtariRulesLoading } = useSWR<AtariRule[]>(
    `${import.meta.env.BASE_URL}data/atari-rules.json`,
    fetcher
  );

  const settings = useAppSettings();
  const { updatePlaySide } = useAppSettingsDispatch();

  const { query, methods, ...handlers } = useTicketQuery();

  const tickets = isSample ? sampleTickets : persistentTickets;

  const { atariMap, atariSongs, selectedAtariRules, paginatedTickets, pageCount, totalCount } = useTicketSelectors(
    tickets,
    songs ?? [],
    atariRules ?? [],
    query,
    settings.playSide
  );

  const [detailTicket, setDetailTicket] = useState<Ticket | null>(null);
  const detailTicketRules = useMemo(() => {
    if (!detailTicket) return [];
    return atariMap.getRulesForTicket(detailTicket, settings.playSide) || [];
  }, [detailTicket, atariMap, settings.playSide]);

  const handlePlaySideToggle = (_event: React.MouseEvent<HTMLElement>, newPlaySide: PlaySide | null) => {
    if (newPlaySide !== null) {
      updatePlaySide(newPlaySide);
    }
  };

  const handleOpenTextage = useCallback(
    (laneText: string) => {
      if (query.textageSong) {
        const url = makeTextageUrl(query.textageSong.url, settings.playSide, laneText);
        ReactGA.event({
          category: "Outbound Link",
          action: "click_textage_link",
          label: query.textageSong.title,
        });
        window.open(url, "_blank", "noopener,noreferrer");
      }
    },
    [query.textageSong, settings.playSide]
  );

  const isLoading = isSample
    ? isSongDataLoading || isAtariRulesLoading
    : isTicketsLoading || isSongDataLoading || isAtariRulesLoading;

  if (isLoading && !import.meta.env.SSR) {
    return (
      <Page title="チケット一覧・当たり配置候補 - RLT Manager">
        <Box display="flex" justifyContent="center" alignItems="center" height="100%">
          <CircularProgress />
          <Typography sx={{ ml: 2 }}>データを読み込んでいます...</Typography>
        </Box>
      </Page>
    );
  }

  return (
    <Page title="チケット一覧・当たり配置候補">
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
          <TextageForm
            allSongs={songs ?? []}
            atariSongs={atariSongs}
            selectedSong={query.textageSong}
            onSongSelect={handlers.handleTextageSongChange}
            searchMode={query.filterMode}
            onModeChange={handlers.handleFilterModeChange}
          />
          <AtariRulePanel rules={selectedAtariRules} playSide={settings.playSide} />
          <Divider />
          {tickets.length === 0 && !isSample ? (
            <Box>
              <Typography variant="body1">チケットがありません</Typography>
              <Typography color="text.secondary">
                先にチケットをインポートするか、<Link to="/sample">サンプル</Link>でお試しください。
              </Typography>
              <Button component={Link} to="/import" variant="contained" sx={{ mt: 2 }}>
                インポートページへ
              </Button>
            </Box>
          ) : (
            <TicketResultsSection
              totalCount={totalCount}
              currentPage={query.currentPage}
              pageCount={pageCount}
              itemsPerPage={query.itemsPerPage}
              onPageChange={(_, page) => handlers.handlePageChange(page)}
              onItemsPerPageChange={(_, perPage) => handlers.handleItemsPerPageChange(perPage)}
            >
              <TicketList
                tickets={paginatedTickets}
                selectedSong={query.textageSong}
                onOpenTextage={handleOpenTextage}
                onRowClick={setDetailTicket}
              />
            </TicketResultsSection>
          )}
        </Stack>
        {detailTicket && detailTicketRules.length > 0 && (
          <AtariInfoPanel ticket={detailTicket} rules={detailTicketRules} onClose={() => setDetailTicket(null)} />
        )}
      </FormProvider>
    </Page>
  );
};
