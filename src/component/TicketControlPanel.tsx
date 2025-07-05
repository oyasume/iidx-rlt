import React from "react";
import { ToggleButtonGroup, ToggleButton } from "@mui/material";
import { PlaySide } from "../types";

interface TicketControlPanelProps {
  playSide: PlaySide;
  onPlaySideChange: (_newPlaySide: PlaySide) => void;
}

const TicketControlPanelComponent: React.FC<TicketControlPanelProps> = ({ playSide, onPlaySideChange }) => {
  const handleChange = (_event: React.MouseEvent<HTMLElement>, newPlaySide: PlaySide | null) => {
    if (newPlaySide !== null) {
      onPlaySideChange(newPlaySide);
    }
  };

  return (
    <ToggleButtonGroup value={playSide} exclusive color="primary" onChange={handleChange}>
      <ToggleButton value="1P">1P</ToggleButton>
      <ToggleButton value="2P">2P</ToggleButton>
    </ToggleButtonGroup>
  );
};

export const TicketControlPanel = React.memo(TicketControlPanelComponent);
