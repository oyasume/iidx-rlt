import React from "react";
import { FormControl, FormLabel, OutlinedInput, FormHelperText, FormControlLabel, Checkbox } from "@mui/material";
import { useFormContext } from "react-hook-form";
import type { SearchFormValues } from "../../schema";

interface KeypadInputProps {
  label: string;
  name: keyof Pick<SearchFormValues, "scratchSideText" | "nonScratchSideText">;
  checkboxName: keyof Pick<SearchFormValues, "isScratchSideUnordered" | "isNonScratchSideUnordered">;
  length: 3 | 4;
  exampleText: string;
  showExample?: boolean;
}

export const KeypadInput: React.FC<KeypadInputProps> = ({
  label,
  name,
  checkboxName,
  length,
  exampleText,
  showExample = true,
}) => {
  const {
    register,
    formState: { errors },
  } = useFormContext<SearchFormValues>();
  const error = errors[name];

  return (
    <FormControl component="fieldset">
      <FormLabel component="legend">{label}</FormLabel>
      <OutlinedInput
        {...register(name)}
        placeholder={"*".repeat(length)}
        inputProps={{
          maxLength: length,
          inputMode: "tel",
          style: {
            textAlign: "center",
            letterSpacing: "0.8em",
            fontFamily: "monospace",
            fontWeight: "bold",
            padding: "0.5em",
          },
        }}
        // 謎の神調整
        sx={{ width: `${length * 2 + 3}em` }}
      />
      <FormHelperText error={!!error} sx={{ margin: 0.25 }}>
        {error?.message ?? (showExample ? exampleText : "")}
      </FormHelperText>
      <FormControlLabel
        control={<Checkbox defaultChecked {...register(checkboxName)} />}
        label="順不同"
        slotProps={{ typography: { color: "text.secondary" } }}
      />
    </FormControl>
  );
};
