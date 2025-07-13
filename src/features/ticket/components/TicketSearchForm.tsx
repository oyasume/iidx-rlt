import React from "react";
import { TextField, FormControlLabel, Checkbox, Grid } from "@mui/material";
import { useFormContext } from "react-hook-form";
import { SearchFormValues } from "../../../schema";
import { useAppSettingsContext } from "../../../contexts/AppSettingsContext";

export const TicketSearchForm: React.FC = () => {
  const {
    register,
    formState: { errors },
  } = useFormContext<SearchFormValues>();
  const { playSide } = useAppSettingsContext();
  const is1P = playSide === "1P";
  const scratchSideLabelText = is1P ? "左側の3つが" : "右側の3つが";
  const nonScratchSideLabelText = is1P ? "右側の4つが" : "左側の4つが";

  const scratchSide = (
    <Grid size={{ xs: 12, sm: 6 }}>
      <TextField
        {...register("scratchSideText")}
        label={scratchSideLabelText}
        fullWidth
        variant="standard"
        slotProps={{ inputLabel: { shrink: true } }}
        error={!!errors.scratchSideText}
        helperText={errors.scratchSideText?.message}
      />
      <FormControlLabel control={<Checkbox defaultChecked {...register("isScratchSideUnordered")} />} label="順不同" />
    </Grid>
  );

  const nonScratchSide = (
    <Grid size={{ xs: 12, sm: 6 }}>
      <TextField
        {...register("nonScratchSideText")}
        label={nonScratchSideLabelText}
        fullWidth
        variant="standard"
        slotProps={{ inputLabel: { shrink: true } }}
        error={!!errors.nonScratchSideText}
        helperText={errors.nonScratchSideText?.message as string}
      />
      <FormControlLabel
        control={<Checkbox defaultChecked {...register("isNonScratchSideUnordered")} />}
        label="順不同"
      />
    </Grid>
  );

  return (
    <Grid container spacing={2}>
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
    </Grid>
  );
};
