import React from "react";
import { Box } from "@mui/material";
import { useAppSettings } from "../../../contexts/AppSettingsContext";
import { KeypadInput } from "../../../components/ui/KeypadInput";

export const TicketSearchForm: React.FC = () => {
  const settings = useAppSettings();
  const is1P = settings.playSide === "1P";

  const scratchSide = (
    <KeypadInput
      label={is1P ? "左側の3つが" : "右側の3つが"}
      name="scratchSideText"
      checkboxName="isScratchSideUnordered"
      length={3}
      exampleText="例: 1*3"
    />
  );

  const nonScratchSide = (
    <KeypadInput
      label={is1P ? "右側の4つが" : "左側の4つが"}
      name="nonScratchSideText"
      checkboxName="isNonScratchSideUnordered"
      length={4}
      exampleText="例: 45*7"
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
