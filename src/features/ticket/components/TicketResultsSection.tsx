import React from "react";
import { Box, Typography, ToggleButtonGroup, ToggleButton, Pagination } from "@mui/material";

interface TicketResultsSectionProps {
  totalCount: number;
  currentPage: number;
  pageCount: number;
  itemsPerPage: number;
  onPageChange: (event: React.ChangeEvent<unknown>, page: number) => void;
  onItemsPerPageChange: (event: React.MouseEvent<HTMLElement>, newItemsPerPage: number | null) => void;
  children: React.ReactNode;
}

export const TicketResultsSection: React.FC<TicketResultsSectionProps> = ({
  totalCount,
  currentPage,
  pageCount,
  itemsPerPage,
  onPageChange,
  onItemsPerPageChange,
  children,
}) => {
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, totalCount);

  return (
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
            onChange={onItemsPerPageChange}
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
          {children}
          {pageCount > 1 && (
            <Pagination count={pageCount} page={currentPage} onChange={onPageChange} sx={{ alignSelf: "center" }} />
          )}
        </>
      )}
    </>
  );
};
