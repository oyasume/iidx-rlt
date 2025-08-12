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
} from "@mui/material";
import { Link } from "react-router-dom";

import { usePersistentTickets } from "../hooks/usePersistentTickets";
import { useSongs } from "../hooks/useSongs";
import { useTicketSearch } from "../hooks/useTicketSearch";
import { TextageForm } from "../features/ticket/components/TextageForm";
import { TicketSearchForm } from "../features/ticket/components/TicketSearchForm";
import { TicketList } from "../features/ticket/components/TicketList";
import { SongInfo, PlaySide, Ticket } from "../types";
import { LocalStorage } from "../storage/localStorage";
import { useAppSettings, useAppSettingsDispatch } from "../contexts/AppSettingsContext";
import { makeTextageUrl } from "../utils/makeTextageUrl";
import { TicketDetailPanel, AtariInfoForPanel } from "../features/ticket/components/TicketDetailPanel";
import { useAtariRules } from "../hooks/useAtariRules";
import { useAtariMatcher } from "../hooks/useAtariMatcher";
import { sampleTickets } from "../data";
import { getHighlightColor } from "../utils/getHighlightColor";
import { AtariRuleList } from "../features/ticket/components/AtariRuleList";
import { matchTicket } from "../utils/ticketMatcher";

const storage = new LocalStorage();

interface TicketViewPageProps {
  isSample?: boolean;
}

export const TicketViewPage: React.FC<TicketViewPageProps> = ({ isSample = false }) => {
  const { tickets: persistentTickets, isLoading: isTicketsLoading } = usePersistentTickets(storage);
  const tickets = isSample ? sampleTickets : persistentTickets;
  const isLoadingTickets = isSample ? false : isTicketsLoading;

  const settings = useAppSettings();
  const { updatePlaySide } = useAppSettingsDispatch();
  const { songs, isLoading: isSongDataLoading } = useSongs({
    type: "url",
    path: `${import.meta.env.BASE_URL}data/songs.json`,
  });
  const { allRules, rulesBySong, uniquePatterns, isLoading: isAtariRulesLoading } = useAtariRules();
  const atariMatcher = useAtariMatcher(tickets, allRules, uniquePatterns, settings.playSide);
  const [selectedSong, setSelectedSong] = useState<SongInfo | null>(null);
  const [detailTicket, setDetailTicket] = useState<Ticket | null>(null);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const songsWithAtariRules = useMemo(() => {
    if (!songs || !rulesBySong) return [];
    return songs.filter((song) => rulesBySong.has(song.title));
  }, [songs, rulesBySong]);

  const selectedSongAtariRules = useMemo(() => {
    if (!selectedSong || !rulesBySong) return [];
    return rulesBySong.get(selectedSong.title) || [];
  }, [selectedSong, rulesBySong]);

  const ticketsFilteredByAtariRule = useMemo(() => {
    if (!selectedSong || selectedSongAtariRules.length === 0) {
      return tickets;
    }
    return tickets.filter((ticket) =>
      selectedSongAtariRules.some((rule) =>
        rule.patterns.some((pattern) => matchTicket(ticket, pattern, settings.playSide))
      )
    );
  }, [tickets, selectedSong, selectedSongAtariRules, settings.playSide]);

  const { methods, filteredTickets } = useTicketSearch(ticketsFilteredByAtariRule, settings.playSide);

  const highlightedTickets = useMemo(() => {
    return filteredTickets.map((ticket) => ({
      ...ticket,
      highlightColor: getHighlightColor(atariMatcher.get(ticket.laneText) || []),
    }));
  }, [filteredTickets, atariMatcher]);

  const atariInfoForPanel = useMemo((): AtariInfoForPanel[] => {
    if (!detailTicket) return [];
    const rules = atariMatcher.get(detailTicket.laneText);
    if (!rules) return [];
    return rules
      .map((rule) => ({
        id: rule.id,
        songTitle: rule.songTitle,
        description: rule.description,
        textageUrl: makeTextageUrl(rule.textageURL, settings.playSide, detailTicket.laneText),
      }))
      .filter((info): info is AtariInfoForPanel => info !== null);
  }, [detailTicket, atariMatcher, settings.playSide]);

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
        <TextageForm
          allSongs={songs}
          atariSongs={songsWithAtariRules}
          selectedSong={selectedSong}
          onSongSelect={setSelectedSong}
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
        ) : highlightedTickets.length === 0 ? (
          <Typography sx={{ color: "text.secondary" }}>検索条件に一致するチケットはありません。</Typography>
        ) : (
          <TicketList
            tickets={highlightedTickets}
            selectedSong={selectedSong}
            onOpenTextage={handleOpenTextage}
            onRowClick={setDetailTicket}
          />
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
