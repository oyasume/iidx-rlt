import React, { useState, useEffect } from "react";
import { Box, Tabs, Tab } from "@mui/material";
import { Ticket } from "types";
import { TicketSearchForm } from "./component/TicketSearchForm";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { searchFormSchema, SearchFormValues } from "./schema";
import { filterTickets } from "./utils/ticketMatcher";

interface ToolProps {
  tickets: Ticket[];
}

const Tool: React.FC<ToolProps> = ({ tickets }) => {
  const [tabIndex, setTabIndex] = useState(0);
  const [filteredTickets, setFilteredTickets] = useState<Ticket[]>(tickets);

  const methods = useForm<SearchFormValues>({
    resolver: zodResolver(searchFormSchema),
    defaultValues: {
      scratchSideText: "***",
      isScratchSideUnordered: true,
      nonScratchSideText: "****",
      isNonScratchSideUnordered: true,
    },
  });

  const { scratchSideText, isScratchSideUnordered, nonScratchSideText, isNonScratchSideUnordered } = methods.watch();

  useEffect(() => {
    const currentValues: SearchFormValues = {
      scratchSideText,
      isScratchSideUnordered,
      nonScratchSideText,
      isNonScratchSideUnordered,
    };
    setFilteredTickets(filterTickets(tickets, currentValues, "1P"));
  }, [scratchSideText, isScratchSideUnordered, nonScratchSideText, isNonScratchSideUnordered, tickets]);

  const handleTabChange = (_event: React.SyntheticEvent, value: number) => {
    setTabIndex(value);
  };

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
