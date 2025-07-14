import type { Meta, StoryObj } from "@storybook/react-vite";
import { ComponentProps, useEffect } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { KeypadInput } from "./KeypadInput";
import { searchFormSchema, SearchFormValues } from "../../schema";

type KeypadInputStoryProps = ComponentProps<typeof KeypadInput> & {
  errorMessage?: string;
};

const meta: Meta<KeypadInputStoryProps> = {
  title: "Component/KeypadInput",
  component: KeypadInput,
  tags: ["autodocs"],
  decorators: [
    (Story, context) => {
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
        const { errorMessage, name } = context.args;
        if (errorMessage && name) {
          methods.setError(name, { type: "manual", message: errorMessage });
        }
        return () => {
          if (name) {
            methods.clearErrors(name);
          }
        };
      }, [context.args, context.args.errorMessage, context.args.name, methods]);

      return (
        <FormProvider {...methods}>
          <Story />
        </FormProvider>
      );
    },
  ],
  argTypes: {
    errorMessage: { control: "text" },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const ScratchSide: Story = {
  name: "皿側の3桁入力",
  args: {
    label: "左側の3つが",
    name: "scratchSideText",
    checkboxName: "isScratchSideUnordered",
    length: 3,
    exampleText: "例: 1*3",
    showExample: true,
  },
};

export const NonScratchSide: Story = {
  name: "非皿側の4桁入力",
  args: {
    label: "右側の4つが",
    name: "nonScratchSideText",
    checkboxName: "isNonScratchSideUnordered",
    length: 4,
    exampleText: "例: 45*7",
    showExample: true,
  },
};

export const WithError: Story = {
  name: "エラー表示",
  args: {
    ...ScratchSide.args,
    errorMessage: "3桁の数字または*を入力してください",
  },
};

export const NoExample: Story = {
  name: "例なし",
  args: {
    ...ScratchSide.args,
    showExample: false,
  },
};
