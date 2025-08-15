import { zodResolver } from "@hookform/resolvers/zod";
import { Box, Button, Divider, Stack, ToggleButton, ToggleButtonGroup, Typography } from "@mui/material";
import React, { useCallback, useMemo, useState } from "react";
import ReactGA from "react-ga4";
import { FormProvider, useForm } from "react-hook-form";
import { Link } from "react-router-dom";

import { useAppSettings, useAppSettingsDispatch } from "../contexts/AppSettingsContext";
import { AtariInfoPanel } from "../features/ticket/components/AtariInfoPanel";
import { AtariRulePanel } from "../features/ticket/components/AtariRulePanel";
import { TextageForm } from "../features/ticket/components/TextageForm";
import { TicketList } from "../features/ticket/components/TicketList";
import { TicketResultsSection } from "../features/ticket/components/TicketResultsSection";
import { TicketSearchForm } from "../features/ticket/components/TicketSearchForm";
import { useTicketViewData } from "../features/ticket/hooks/useTicketViewData";
import { usePagination } from "../hooks/usePagination";
import { searchFormSchema, SearchFormValues } from "../schema";
import { PlaySide, SongInfo, Ticket } from "../types";
import { createAtariMap } from "../utils/atari";
import { makeTextageUrl } from "../utils/makeTextageUrl";
import { filterTickets, matchTicket } from "../utils/match";

interface TicketViewPageProps {
  isSample?: boolean;
}

export const TicketViewPage: React.FC<TicketViewPageProps> = ({ isSample = false }) => {
  const { isLoading, tickets, songs, atariRules } = useTicketViewData(isSample);
  // 1P/2Pの設定
  const settings = useAppSettings();
  const { updatePlaySide } = useAppSettingsDispatch();
  const handlePlaySideToggle = (_event: React.MouseEvent<HTMLElement>, newPlaySide: PlaySide | null) => {
    if (newPlaySide !== null) {
      updatePlaySide(newPlaySide);
    }
  };

  // 当たり配置情報
  const atariMap = useMemo(() => createAtariMap(atariRules), [atariRules]);

  // 選択された曲の状態管理
  const [selectedSong, setSelectedSong] = useState<SongInfo | null>(null);
  const [searchMode, setSearchMode] = useState<"recommend" | "all">("recommend");
  const atariSongs = useMemo(
    () => songs.filter((song) => (atariMap.getRulesForSong(song.title) ?? []).length > 0),
    [songs, atariMap]
  );
  const selectedAtariRules = useMemo(
    () => (selectedSong ? (atariMap.getRulesForSong(selectedSong.title) ?? []) : []),
    [atariMap, selectedSong]
  );
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

  // 検索フォームの状態管理
  const methods = useForm<SearchFormValues>({
    resolver: zodResolver(searchFormSchema),
    mode: "onChange",
    defaultValues: {
      scratchSideText: "",
      isScratchSideUnordered: true,
      nonScratchSideText: "",
      isNonScratchSideUnordered: true,
    },
  });
  const { scratchSideText, isScratchSideUnordered, nonScratchSideText, isNonScratchSideUnordered } = methods.watch();

  const processedTickets = useMemo(() => {
    const paddedSearchPattern = {
      scratchSideText: scratchSideText.padEnd(3, "*"),
      isScratchSideUnordered: isScratchSideUnordered,
      nonScratchSideText: nonScratchSideText.padEnd(4, "*"),
      isNonScratchSideUnordered: isNonScratchSideUnordered,
    };
    const filteredTickets = filterTickets(tickets, paddedSearchPattern, settings.playSide);

    return filteredTickets
      .filter((ticket) => {
        // おすすめから選択された曲がある場合、その曲の当たりチケットのみを表示
        const applyAtariFilter = searchMode === "recommend" && selectedSong;
        if (!applyAtariFilter) return true;
        return selectedAtariRules.some((rule) =>
          rule.patterns.some((pattern) => matchTicket(ticket, pattern, settings.playSide))
        );
      })
      .map((ticket) => ({
        ...ticket,
        highlightColor: atariMap.getColorForTicket(ticket, settings.playSide),
      }));
  }, [
    atariMap,
    isNonScratchSideUnordered,
    isScratchSideUnordered,
    nonScratchSideText,
    scratchSideText,
    searchMode,
    selectedAtariRules,
    selectedSong,
    settings.playSide,
    tickets,
  ]);

  // ページネーションの設定
  const {
    currentPage,
    itemsPerPage,
    pageCount,
    paginatedItems: paginatedTickets,
    handlePageChange,
    handleItemsPerPageChange,
  } = usePagination(processedTickets, 50);

  // 詳細チケットの状態管理
  const [detailTicket, setDetailTicket] = useState<Ticket | null>(null);
  const detailTicketRules = useMemo(() => {
    if (!detailTicket) return [];
    return atariMap.getRulesForTicket(detailTicket, settings.playSide) || [];
  }, [detailTicket, atariMap, settings.playSide]);
  const handleCloseDetail = () => {
    setDetailTicket(null);
  };

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
          atariSongs={atariSongs}
          selectedSong={selectedSong}
          onSongSelect={setSelectedSong}
          searchMode={searchMode}
          onModeChange={setSearchMode}
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
            totalCount={processedTickets.length}
            currentPage={currentPage}
            pageCount={pageCount}
            itemsPerPage={itemsPerPage}
            onPageChange={handlePageChange}
            onItemsPerPageChange={handleItemsPerPageChange}
          >
            <TicketList
              tickets={paginatedTickets}
              selectedSong={selectedSong}
              onOpenTextage={handleOpenTextage}
              onRowClick={setDetailTicket}
            />
          </TicketResultsSection>
        )}
      </Stack>
      {detailTicket && detailTicketRules.length > 0 && (
        <AtariInfoPanel ticket={detailTicket} rules={detailTicketRules} onClose={handleCloseDetail} />
      )}
    </FormProvider>
  );
};
