import { Checkbox, FormControl, FormControlLabel, FormLabel, TextFieldProps } from "@mui/material";
import { useFormContext } from "react-hook-form";

import { LaneTextInput } from "../../../components/ui/LaneTextInput";
import type { SearchFormValues } from "../../../schema";

type PatternInputProps = {
  label: string;
  name: keyof Pick<SearchFormValues, "scratchSideText" | "nonScratchSideText">;
  checkboxName: keyof Pick<SearchFormValues, "isScratchSideUnordered" | "isNonScratchSideUnordered">;
  length: 3 | 4;
} & Omit<TextFieldProps, "name" | "length">;

export const PatternInput: React.FC<PatternInputProps> = ({ label, name, checkboxName, length, ...rest }) => {
  const { register } = useFormContext<SearchFormValues>();

  return (
    <FormControl component="fieldset">
      <FormLabel component="legend">{label}</FormLabel>
      <LaneTextInput name={name} length={length} {...rest} />
      <FormControlLabel
        control={<Checkbox defaultChecked {...register(checkboxName)} />}
        label="順不同"
        slotProps={{ typography: { color: "text.secondary" } }}
      />
    </FormControl>
  );
};
