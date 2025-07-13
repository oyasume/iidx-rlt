import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { TicketSearchForm } from "./TicketSearchForm";
import { FormProvider, useForm } from "react-hook-form";
import { FC, PropsWithChildren } from "react";
import { SearchFormValues } from "../../../schema";
import { AppSettingsContext } from "../../../contexts/AppSettingsContext";
import { AppSettings } from "../../../types";

describe("TicketSearchForm", () => {
  const FormWrapper: FC<PropsWithChildren<{ settings: AppSettings }>> = ({ children, settings }) => {
    const methods = useForm<SearchFormValues>();
    return (
      <AppSettingsContext.Provider value={settings}>
        <FormProvider {...methods}>{children}</FormProvider>
      </AppSettingsContext.Provider>
    );
  };

  it("1P設定で必要な入力欄が正しく表示される", () => {
    render(
      <FormWrapper settings={{ playSide: "1P" }}>
        <TicketSearchForm />
      </FormWrapper>
    );

    expect(screen.getByLabelText("左側の3つが")).toBeInTheDocument();
    expect(screen.getByLabelText("右側の4つが")).toBeInTheDocument();
  });

  it("2P設定で必要な入力欄が正しく表示される", () => {
    render(
      <FormWrapper settings={{ playSide: "2P" }}>
        <TicketSearchForm />
      </FormWrapper>
    );

    expect(screen.getByLabelText("右側の3つが")).toBeInTheDocument();
    expect(screen.getByLabelText("左側の4つが")).toBeInTheDocument();
  });
});
