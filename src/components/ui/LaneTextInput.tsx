import React from "react";
import { Controller, useFormContext } from "react-hook-form";
import { TextField, TextFieldProps } from "@mui/material";

type LaneTextInputProps = {
  name: string;
  length: number;
} & Omit<TextFieldProps, "name" | "inputProps">;

export const LaneTextInput: React.FC<LaneTextInputProps> = ({ name, length, ...props }) => {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <TextField
          {...props}
          {...field}
          error={!!fieldState.error}
          helperText={fieldState.error?.message ?? props.helperText}
          slotProps={{
            ...props.slotProps,
            input: {
              ...(props.slotProps?.input ?? {}),
              inputProps: {
                maxLength: length,
                inputMode: "tel",
                style: {
                  textAlign: "center",
                  letterSpacing: "0.8em",
                  fontFamily: "monospace",
                  fontWeight: "bold",
                  padding: "0.5em",
                },
              },
            },
          }}
          sx={{
            ...props.sx,
            width: `${length * 2 + 1}em`,
          }}
        />
      )}
    />
  );
};
