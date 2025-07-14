import { render, screen } from "@testing-library/react";
import { useEffect } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { describe, it, expect } from "vitest";
import { KeypadInput } from "./KeypadInput";
import { searchFormSchema, SearchFormValues } from "../../schema";
import { zodResolver } from "@hookform/resolvers/zod";

describe("KeypadInput", () => {
  const FormWrapper = ({
    children,
    name,
    errorMessage,
  }: {
    children: React.ReactNode;
    name?: keyof SearchFormValues;
    errorMessage?: string;
  }) => {
    const methods = useForm<SearchFormValues>({
      resolver: zodResolver(searchFormSchema),
      defaultValues: {
        scratchSideText: "***",
        nonScratchSideText: "****",
        isScratchSideUnordered: true,
        isNonScratchSideUnordered: true,
      },
    });

    useEffect(() => {
      if (errorMessage && name) {
        methods.setError(name, { type: "manual", message: errorMessage });
      }
    }, [errorMessage, name, methods]);

    return <FormProvider {...methods}>{children}</FormProvider>;
  };

  it("ラベルと入力例が正しく表示される", () => {
    render(
      <FormWrapper>
        <KeypadInput
          label="テストラベル"
          name="scratchSideText"
          checkboxName="isScratchSideUnordered"
          length={3}
          exampleText="例"
          showExample={true}
        />
      </FormWrapper>
    );

    const group = screen.getByRole("group", { name: /テストラベル/i });
    expect(group).toBeInTheDocument();
    expect(screen.getByText("例")).toBeInTheDocument();
  });

  it("エラーがある場合、エラーメッセージが表示される", () => {
    render(
      <FormWrapper name="scratchSideText" errorMessage="エラーメッセージ">
        <KeypadInput
          label="左側の3つが"
          name="scratchSideText"
          checkboxName="isScratchSideUnordered"
          length={3}
          exampleText="例"
          showExample={true}
        />
      </FormWrapper>
    );

    expect(screen.getByText("エラーメッセージ")).toBeInTheDocument();
    expect(screen.queryByText("例")).not.toBeInTheDocument();
  });

  it("showExample が false の場合、例が表示されない", () => {
    render(
      <FormWrapper>
        <KeypadInput
          label="左"
          name="scratchSideText"
          checkboxName="isScratchSideUnordered"
          length={3}
          exampleText="例"
          showExample={false}
        />
      </FormWrapper>
    );

    expect(screen.queryByText("例")).not.toBeInTheDocument();
  });
});
