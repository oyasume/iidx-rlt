import React, { useCallback, useMemo, useState } from "react";
import ReactGA from "react-ga4";
import { FormProvider, useForm } from "react-hook-form";
import { Stack, Divider, Box, Button, ToggleButton, ToggleButtonGroup, Typography, Pagination } from "@mui/material";
import { Link } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { searchFormSchema, SearchFormValues } from "../schema";
import { usePagination } from "../hooks/usePagination";
import { TextageForm } from "../features/ticket/components/TextageForm";
import { TicketSearchForm } from "../features/ticket/components/TicketSearchForm";
import { TicketList } from "../features/ticket/components/TicketList";
import { SongInfo, PlaySide, Ticket } from "../types";
import { useAppSettings, useAppSettingsDispatch } from "../contexts/AppSettingsContext";
import { makeTextageUrl } from "../utils/makeTextageUrl";
import { AtariRulePanel } from "../features/ticket/components/AtariRulePanel";
import { matchTicket, filterTickets } from "../utils/ticketMatcher";
import { useTicketViewData } from "../features/ticket/hooks/useTicketViewData";
import { AtariInfoPanel } from "../features/ticket/components/AtariInfoPanel";
import { useAtariMatcher } from "../hooks/useAtariMatcher";
import { getHighlightColor } from "../utils/getHighlightColor";

interface TicketViewPageProps {
  isSample?: boolean;
}

export const TicketViewPage: React.FC<TicketViewPageProps> = ({ isSample = false }) => {
  const { isLoading, tickets, songs, allRules, rulesBySong, uniquePatterns } = useTicketViewData(isSample);

  // 1P/2Pの設定
  const settings = useAppSettings();
  const { updatePlaySide } = useAppSettingsDispatch();
  const handlePlaySideToggle = (_event: React.MouseEvent<HTMLElement>, newPlaySide: PlaySide | null) => {
    if (newPlaySide !== null) {
      updatePlaySide(newPlaySide);
    }
  };
  const atariMatcher = useAtariMatcher(tickets, allRules, uniquePatterns, settings.playSide);

  // 選択された曲の状態管理
  const [selectedSong, setSelectedSong] = useState<SongInfo | null>(null);
  const [searchMode, setSearchMode] = useState<"recommend" | "all">("recommend");
  const songsWithAtariRules = useMemo(() => {
    if (!songs || !rulesBySong) return [];
    return songs.filter((song) => rulesBySong.has(song.title));
  }, [songs, rulesBySong]);
  const selectedSongAtariRules = useMemo(() => {
    if (!selectedSong || !rulesBySong) return [];
    return rulesBySong.get(selectedSong.title) || [];
  }, [selectedSong, rulesBySong]);

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
        return selectedSongAtariRules.some((rule) =>
          rule.patterns.some((pattern) => matchTicket(ticket, pattern, settings.playSide))
        );
      })
      .map((ticket) => ({
        ...ticket,
        highlightColor: getHighlightColor(atariMatcher.get(ticket.laneText) || []),
      }));
  }, [
    atariMatcher,
    isNonScratchSideUnordered,
    isScratchSideUnordered,
    nonScratchSideText,
    scratchSideText,
    searchMode,
    selectedSong,
    selectedSongAtariRules,
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
    return atariMatcher.get(detailTicket.laneText) || [];
  }, [detailTicket, atariMatcher]);
  const handleCloseDetail = () => {
    setDetailTicket(null);
  };

  if (isLoading) {
    return <div>データを読み込んでいます...</div>;
  }

  const totalCount = processedTickets.length;
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
          searchMode={searchMode}
          onModeChange={setSearchMode}
        />
        <AtariRulePanel rules={selectedSongAtariRules} playSide={settings.playSide} />
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
      {detailTicket && detailTicketRules.length > 0 && (
        <AtariInfoPanel ticket={detailTicket} rules={detailTicketRules} onClose={handleCloseDetail} />
      )}
    </FormProvider>
  );
};
