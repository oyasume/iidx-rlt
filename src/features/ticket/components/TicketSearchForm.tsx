import { Box } from "@mui/material";
import React from "react";

import { useSettingsStore } from "../../../store/settingsStore";
import { PatternInput } from "./PatternInput";

export const TicketSearchForm: React.FC = () => {
  const is1P = useSettingsStore((s) => s.playSide) === "1P";

  const scratchSide = (
    <PatternInput
      key="scratch"
      label={is1P ? "左側の3つが" : "右側の3つが"}
      name="scratchSideText"
      checkboxName="isScratchSideUnordered"
      length={3}
      placeholder="***"
      helperText="例: 1*3"
    />
  );

  const nonScratchSide = (
    <PatternInput
      key="non-scratch"
      label={is1P ? "右側の4つが" : "左側の4つが"}
      name="nonScratchSideText"
      checkboxName="isNonScratchSideUnordered"
      length={4}
      placeholder="****"
      helperText="例: 45*7"
    />
  );

  return (
    <Box sx={{ display: "flex", gap: 1, alignItems: "flex-start" }}>
      {is1P ? (
        <>
          {scratchSide}
          {nonScratchSide}
        </>
      ) : (
        <>
          {nonScratchSide}
          {scratchSide}
        </>
      )}
    </Box>
  );
};
