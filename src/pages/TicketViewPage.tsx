import { Box, Button, Divider, Stack, ToggleButton, ToggleButtonGroup, Typography } from "@mui/material";
import React, { useCallback, useMemo, useState } from "react";
import ReactGA from "react-ga4";
import { FormProvider } from "react-hook-form";
import { Link } from "react-router-dom";

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
import { useTicketViewData } from "../features/ticket/hooks/useTicketViewData";
import { PlaySide, Ticket } from "../types";
import { makeTextageUrl } from "../utils/makeTextageUrl";

interface TicketViewPageProps {
  isSample?: boolean;
}

export const TicketViewPage: React.FC<TicketViewPageProps> = ({ isSample = false }) => {
  const { isLoading, tickets, songs, atariRules } = useTicketViewData(isSample);

  const settings = useAppSettings();
  const { updatePlaySide } = useAppSettingsDispatch();

  const { query, methods, ...handlers } = useTicketQuery();

  const { atariMap, atariSongs, selectedAtariRules, paginatedTickets, pageCount, totalCount } = useTicketSelectors(
    tickets,
    songs,
    atariRules,
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

  const isSSR = import.meta.env.SSR;
  if (isLoading && !isSSR) {
    return (
      <>
        <title> チケット一覧・当たり配置候補 - RLT Manager</title>
        <div>データを読み込んでいます...</div>
      </>
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
            allSongs={songs}
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
