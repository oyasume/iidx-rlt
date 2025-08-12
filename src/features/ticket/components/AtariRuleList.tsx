import React from "react";
import { List, ListItem, ListItemText, Typography, Paper } from "@mui/material";
import { AtariRule, PlaySide, SearchPattern } from "../../../types";

interface AtariRuleListProps {
  rules: AtariRule[];
  playSide: PlaySide;
}

const formatPattern = (pattern: SearchPattern, playSide: PlaySide): string => {
  const sPart = `${pattern.scratchSideText}${pattern.isScratchSideUnordered ? " (順不同)" : ""}`;
  const nsPart = `${pattern.nonScratchSideText}${pattern.isNonScratchSideUnordered ? " (順不同)" : ""}`;

  return playSide === "1P" ? `${sPart} | ${nsPart}` : `${nsPart} | ${sPart}`;
};

export const AtariRuleList: React.FC<AtariRuleListProps> = ({ rules, playSide }) => {
  if (!rules || rules.length === 0) {
    return null;
  }

  return (
    <Paper variant="outlined" sx={{ p: 2 }}>
      <Typography variant="subtitle1" gutterBottom>
        当たり配置になるチケットのパターン
      </Typography>
      <List dense>
        {rules.flatMap((rule) =>
          rule.patterns.map((pattern, index) => (
            <ListItem key={`${rule.id}-${index}`} disableGutters>
              <ListItemText primary={formatPattern(pattern, playSide)} secondary={rule.description} />
            </ListItem>
          ))
        )}
      </List>
    </Paper>
  );
};
