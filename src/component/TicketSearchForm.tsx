import React from "react";
import { TextField, FormControlLabel, Checkbox, Grid } from "@mui/material";

export const TicketSearchForm: React.FC = () => {
  return (
    <Grid container spacing={2}>
      <Grid size={6}>
        <TextField label="皿側の3つが" fullWidth variant="standard" slotProps={{ inputLabel: { shrink: true } }} />
        <FormControlLabel control={<Checkbox />} label="皿側は順不同" defaultChecked />
      </Grid>
      <Grid size={6}>
        <TextField label="非皿側の4つが" fullWidth variant="standard" slotProps={{ inputLabel: { shrink: true } }} />
        <FormControlLabel control={<Checkbox />} label="非皿側は順不同" defaultChecked />
      </Grid>
    </Grid>
  );
};
