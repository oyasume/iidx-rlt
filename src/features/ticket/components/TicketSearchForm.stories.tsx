import type { Meta, StoryObj } from "@storybook/react-vite";
import { ComponentProps } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { TicketSearchForm } from "./TicketSearchForm";
import { searchFormSchema, SearchFormValues } from "../../../schema";
import { AppSettingsContext } from "../../../contexts/AppSettingsContext";
import { PlaySide } from "types";
import { TicketView } from "../TicketView";

type TicketViewStoryProps = ComponentProps<typeof TicketView> & {
  playSide: PlaySide;
};

const meta: Meta<TicketViewStoryProps> = {
  title: "Component/TicketSearchForm",
  component: TicketSearchForm,
  tags: ["autodocs"],
  decorators: [
    (Story, context) => {
      const playSide = context.args.playSide;
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
        <AppSettingsContext.Provider value={{ playSide }}>
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

export const PlaySide2P: Story = {
  args: {
    ...Default.args,
    playSide: "2P",
  },
};
