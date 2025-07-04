import React, { useState, useMemo } from "react";
import { Box, Tabs, Tab, ToggleButtonGroup, ToggleButton, Typography } from "@mui/material";
import { PlaySide, Ticket } from "types";
import { TicketSearchForm } from "./component/TicketSearchForm";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { searchFormSchema, SearchFormValues } from "./schema";
import { filterTickets } from "./utils/ticketMatcher";
import { useAppSettings } from "./hooks/useAppSettings";

interface ToolProps {
  tickets: Ticket[];
}

const Tool: React.FC<ToolProps> = ({ tickets }) => {
  const [tabIndex, setTabIndex] = useState(0);
  const { settings, updatePlaySide, isLoading } = useAppSettings();

  const methods = useForm<SearchFormValues>({
    resolver: zodResolver(searchFormSchema),
    defaultValues: {
      scratchSideText: "***",
      isScratchSideUnordered: true,
      nonScratchSideText: "****",
      isNonScratchSideUnordered: true,
    },
  });

  const formValues = methods.watch();

  const filteredTickets = useMemo(() => {
    return filterTickets(tickets, formValues, settings.playSide);
  }, [tickets, formValues, settings.playSide]);

  const handleTabChange = (_event: React.SyntheticEvent, value: number) => {
    setTabIndex(value);
  };

  const handlePlaySideChange = (_event: React.MouseEvent<HTMLElement>, newPlaySide: PlaySide) => {
    updatePlaySide(newPlaySide);
  };

  if (isLoading) {
    return <Typography>設定を読み込んでいます...</Typography>;
  }

  return (
    <Box
      sx={{
        bgcolor: "background.paper",
        color: "text.primary",
        p: 2,
      }}
    >
      <Box sx={{ mb: 2 }}>
        <Tabs value={tabIndex} onChange={handleTabChange}>
          <Tab label="チケット一覧" />
          <Tab label="当たり配置管理" />
        </Tabs>
      </Box>
      <Box sx={{ mt: 2, mb: 2, display: "flex", alignItems: "center", gap: 2 }}>
        <ToggleButtonGroup value={settings.playSide} exclusive onChange={handlePlaySideChange} size="small">
          <ToggleButton value="1P">1P</ToggleButton>
          <ToggleButton value="2P">2P</ToggleButton>
        </ToggleButtonGroup>
      </Box>
      {tabIndex === 0 && (
        <Box>
          <FormProvider {...methods}>
            <TicketSearchForm />
          </FormProvider>
          <ul>
            {filteredTickets.map((t, index) => (
              <li key={index}>{t.laneText}</li>
            ))}
          </ul>
        </Box>
      )}
      {tabIndex === 1 && <Box>当たり配置管理画面</Box>}
    </Box>
  );
};

export default Tool;
