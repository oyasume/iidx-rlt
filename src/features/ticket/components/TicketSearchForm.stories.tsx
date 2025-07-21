import type { Meta, StoryObj } from "@storybook/react-vite";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { TicketSearchForm } from "./TicketSearchForm";
import { searchFormSchema, SearchFormValues } from "../../../schema";
import { AppSettingsContext } from "../../../contexts/AppSettingsContext";
import { AppSettings, PlaySide } from "../../../types";

type TicketSearchFormStoryProps = {
  playSide: PlaySide;
};

const meta: Meta<TicketSearchFormStoryProps> = {
  title: "Component/TicketSearchForm",
  component: TicketSearchForm,
  tags: ["autodocs"],
  decorators: [
    (Story, context) => {
      const settings: AppSettings = { playSide: context.args.playSide || "1P" };
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
        <AppSettingsContext.Provider value={settings}>
          <FormProvider {...methods}>
            <Story />
          </FormProvider>
        </AppSettingsContext.Provider>
      );
    },
  ],
  argTypes: {
    playSide: {
      control: { type: "radio" },
      options: ["1P", "2P"],
    },
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    playSide: "1P",
  },
};
