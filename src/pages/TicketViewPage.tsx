import React, { useCallback, useMemo, useState } from "react";
import ReactGA from "react-ga4";
import { FormProvider } from "react-hook-form";
import {
  Stack,
  Divider,
  Box,
  Button,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
  useTheme,
  useMediaQuery,
  Drawer,
  Paper,
  Pagination,
} from "@mui/material";
import { Link } from "react-router-dom";

import { useTicketSearch } from "../hooks/useTicketSearch";
import { usePagination } from "../hooks/usePagination";
import { TextageForm } from "../features/ticket/components/TextageForm";
import { TicketSearchForm } from "../features/ticket/components/TicketSearchForm";
import { TicketList } from "../features/ticket/components/TicketList";
import { SongInfo, PlaySide, Ticket } from "../types";
import { useAppSettings, useAppSettingsDispatch } from "../contexts/AppSettingsContext";
import { makeTextageUrl } from "../utils/makeTextageUrl";
import { TicketDetailPanel } from "../features/ticket/components/TicketDetailPanel";
import { AtariRuleList } from "../features/ticket/components/AtariRuleList";
import { matchTicket } from "../utils/ticketMatcher";
import { useTicketViewData } from "../features/ticket/hooks/useTicketViewData";
import { useAtariProcessor } from "../features/ticket/hooks/useAtariProcessor";

interface TicketViewPageProps {
  isSample?: boolean;
}

export const TicketViewPage: React.FC<TicketViewPageProps> = ({ isSample = false }) => {
  const { isLoading, tickets, songs, allRules, rulesBySong, uniquePatterns } = useTicketViewData(isSample);
  const settings = useAppSettings();
  const { updatePlaySide } = useAppSettingsDispatch();

  const [selectedSong, setSelectedSong] = useState<SongInfo | null>(null);
  const [applyAtariFilter, setApplyAtariFilter] = useState<boolean>(true);
  const [detailTicket, setDetailTicket] = useState<Ticket | null>(null);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const selectedSongAtariRules = useMemo(() => {
    if (!selectedSong || !rulesBySong) return [];
    return rulesBySong.get(selectedSong.title) || [];
  }, [selectedSong, rulesBySong]);

  const ticketsFilteredBySong = useMemo(() => {
    if (!selectedSong || selectedSongAtariRules.length === 0 || !applyAtariFilter) {
      return tickets;
    }
    return tickets.filter((ticket) =>
      selectedSongAtariRules.some((rule) =>
        rule.patterns.some((pattern) => matchTicket(ticket, pattern, settings.playSide))
      )
    );
  }, [tickets, selectedSong, selectedSongAtariRules, settings.playSide, applyAtariFilter]);

  const { methods, filteredTickets } = useTicketSearch(ticketsFilteredBySong, settings.playSide);
  const { addHighlight, getAtariInfoForPanel } = useAtariProcessor(
    tickets,
    settings.playSide,
    allRules,
    uniquePatterns
  );

  const highlightedTickets = useMemo(() => addHighlight(filteredTickets), [addHighlight, filteredTickets]);
  const atariInfoForPanel = getAtariInfoForPanel(detailTicket);

  const {
    currentPage,
    itemsPerPage,
    pageCount,
    paginatedItems: paginatedTickets,
    handlePageChange,
    handleItemsPerPageChange,
  } = usePagination(highlightedTickets, 50);

  const songsWithAtariRules = useMemo(() => {
    if (!songs || !rulesBySong) return [];
    return songs.filter((song) => rulesBySong.has(song.title));
  }, [songs, rulesBySong]);

  const handleOpenTextage = useCallback(
    (laneText: string) => {
      if (selectedSong) {
        const url = makeTextageUrl(selectedSong.url, settings.playSide, laneText);
        ReactGA.event({
          category: "Outbound Link",
          action: "click_textage_link",
          label: selectedSong.title,
        });
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

  const handleCloseDetail = () => {
    setDetailTicket(null);
  };

  if (isLoading) {
    return <div>データを読み込んでいます...</div>;
  }

  const totalCount = highlightedTickets.length;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, totalCount);

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
        <TextageForm
          allSongs={songs}
          atariSongs={songsWithAtariRules}
          selectedSong={selectedSong}
          onSongSelect={setSelectedSong}
          onModeChange={(mode) => setApplyAtariFilter(mode === "recommend")}
        />
        <AtariRuleList rules={selectedSongAtariRules} playSide={settings.playSide} />
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
          <>
            {totalCount > 0 && (
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "flex-end",
                  alignItems: "center",
                  gap: 2,
                  mb: 1,
                  minHeight: "32px",
                }}
              >
                <Typography variant="body2" color="text.secondary" sx={{ flexShrink: 0 }}>
                  {`${totalCount}件中 ${startIndex + 1}～${endIndex}件`}
                </Typography>
                <ToggleButtonGroup
                  value={itemsPerPage}
                  exclusive
                  onChange={handleItemsPerPageChange}
                  size="small"
                  color="primary"
                  aria-label="表示件数"
                >
                  <ToggleButton value={50}>50</ToggleButton>
                  <ToggleButton value={100}>100</ToggleButton>
                </ToggleButtonGroup>
              </Box>
            )}
            {totalCount === 0 ? (
              <Typography sx={{ color: "text.secondary" }}>検索条件に一致するチケットはありません。</Typography>
            ) : (
              <>
                <TicketList
                  tickets={paginatedTickets}
                  selectedSong={selectedSong}
                  onOpenTextage={handleOpenTextage}
                  onRowClick={setDetailTicket}
                />
                {pageCount > 1 && (
                  <Pagination
                    count={pageCount}
                    page={currentPage}
                    onChange={handlePageChange}
                    sx={{ alignSelf: "center" }}
                  />
                )}
              </>
            )}
          </>
        )}
      </Stack>
      {isMobile ? (
        <Drawer
          anchor="bottom"
          open={!!detailTicket}
          onClose={handleCloseDetail}
          slotProps={{
            paper: {
              sx: {
                height: "auto",
                maxHeight: "80vh",
                overflowY: "auto",
                borderTopLeftRadius: 12,
                borderTopRightRadius: 12,
              },
            },
          }}
        >
          <TicketDetailPanel ticket={detailTicket} atariInfo={atariInfoForPanel} onClose={handleCloseDetail} />
        </Drawer>
      ) : (
        detailTicket && (
          <Paper
            sx={{
              position: "fixed",
              bottom: 32,
              right: 32,
              zIndex: 1300,
              width: 400,
              borderRadius: 3,
              boxShadow: "0 4px 16px rgba(0, 0, 0, 0.3)",
            }}
          >
            <TicketDetailPanel ticket={detailTicket} atariInfo={atariInfoForPanel} onClose={handleCloseDetail} />
          </Paper>
        )
      )}
    </FormProvider>
  );
};
