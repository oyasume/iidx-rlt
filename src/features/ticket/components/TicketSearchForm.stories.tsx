import type { Meta, StoryObj } from "@storybook/react-vite";
import { TicketSearchForm } from "./TicketSearchForm";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { searchFormSchema, SearchFormValues } from "../../../schema";

const meta: Meta<typeof TicketSearchForm> = {
  title: "Component/TicketSearchForm",
  component: TicketSearchForm,
  tags: ["autodocs"],
  decorators: [
    (Story) => {
      const methods = useForm<SearchFormValues>({
        resolver: zodResolver(searchFormSchema),
        defaultValues: {
          scratchSideText: "***",
          isScratchSideUnordered: true,
          nonScratchSideText: "****",
          isNonScratchSideUnordered: true,
        },
      });
      return (
        <FormProvider {...methods}>
          <Story />
        </FormProvider>
      );
    },
  ],
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
