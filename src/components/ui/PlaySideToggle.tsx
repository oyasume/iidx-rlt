import { ToggleButton, ToggleButtonGroup, ToggleButtonGroupProps } from "@mui/material";
import React from "react";

import { PlaySide } from "../../types";

type PlaySideToggleProps = {
  value: PlaySide;
  onChange: (value: PlaySide) => void;
  size?: ToggleButtonGroupProps["size"];
  color?: ToggleButtonGroupProps["color"];
  exclusive?: boolean;
};

export const PlaySideToggle: React.FC<PlaySideToggleProps> = ({
  value,
  onChange,
  size = "large",
  color = "primary",
}) => {
  const handleChange = (_event: React.MouseEvent<HTMLElement>, newValue: PlaySide | null) => {
    if (newValue) onChange(newValue);
  };

  return (
    <ToggleButtonGroup size={size} value={value} color={color} exclusive onChange={handleChange}>
      <ToggleButton value="1P">1P</ToggleButton>
      <ToggleButton value="2P">2P</ToggleButton>
    </ToggleButtonGroup>
  );
};
