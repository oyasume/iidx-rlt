import React from "react";
import { TextField, FormControlLabel, Checkbox, Grid } from "@mui/material";
import { useFormContext } from "react-hook-form";
import { SearchFormValues } from "../schema";

export const TicketSearchForm: React.FC = () => {
  const {
    register,
    formState: { errors },
  } = useFormContext<SearchFormValues>();

  return (
    <Grid container spacing={2}>
      <Grid size={6}>
        <TextField
          {...register("scratchSideText")}
          label="皿側の3つが"
          fullWidth
          variant="standard"
          slotProps={{ inputLabel: { shrink: true } }}
          error={!!errors.scratchSideText}
          helperText={errors.scratchSideText?.message}
        />
        <FormControlLabel
          control={<Checkbox defaultChecked {...register("isScratchSideUnordered")} />}
          label="順不同"
        />
      </Grid>
      <Grid size={6}>
        <TextField
          {...register("nonScratchSideText")}
          label="非皿側の4つが"
          fullWidth
          variant="standard"
          slotProps={{ inputLabel: { shrink: true } }}
          error={!!errors.nonScratchSideText}
          helperText={errors.nonScratchSideText?.message}
        />
        <FormControlLabel
          control={<Checkbox defaultChecked {...register("isNonScratchSideUnordered")} />}
          label="順不同"
        />
      </Grid>
    </Grid>
  );
};
