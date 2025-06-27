import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { TicketSearchForm } from "./TicketSearchForm";
import { FormProvider, useForm } from "react-hook-form";
import { FC, PropsWithChildren } from "react";
import { SearchFormValues } from "../schema";

describe("TicketSearchForm", () => {
  const FormWrapper: FC<PropsWithChildren> = ({ children }) => {
    const methods = useForm<SearchFormValues>();
    return <FormProvider {...methods}>{children}</FormProvider>;
  };

  it("必要な入力欄が正しく表示される", () => {
    render(
      <FormWrapper>
        <TicketSearchForm />
      </FormWrapper>
    );

    expect(screen.getByLabelText("皿側の3つが")).toBeInTheDocument();
    expect(screen.getByLabelText("非皿側の4つが")).toBeInTheDocument();
  });
});
