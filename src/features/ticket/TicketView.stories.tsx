import type { Meta, StoryObj } from "@storybook/react-vite";
import { TicketView } from "./TicketView";
import { sampleSongs, sampleTickets } from "../../data";
import { MemoryRouter } from "react-router-dom";
import { FormProvider, useForm } from "react-hook-form";
import { AppSettings, PlaySide } from "../../types";
import { AppSettingsContext, AppSettingsDispatchContext } from "../../contexts/AppSettingsContext";
import { SearchFormValues } from "../../schema";
import { ComponentProps } from "react";

type TicketViewStoryProps = ComponentProps<typeof TicketView> & {
  playSide: PlaySide;
};

const meta: Meta<TicketViewStoryProps> = {
  title: "Page/TicketView",
  component: TicketView,
  tags: ["autodocs"],
  decorators: [
    (Story, context) => {
      const settings: AppSettings = { playSide: context.args.playSide || "1P" };
      const methods = useForm<SearchFormValues>({
        defaultValues: {
          scratchSideText: "***",
          isScratchSideUnordered: true,
          nonScratchSideText: "****",
          isNonScratchSideUnordered: true,
        },
      });

      return (
        <AppSettingsContext.Provider value={settings}>
          <AppSettingsDispatchContext.Provider value={{ updatePlaySide: () => {} }}>
            <MemoryRouter>
              <FormProvider {...methods}>
                <Story />
              </FormProvider>
            </MemoryRouter>
          </AppSettingsDispatchContext.Provider>
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
  name: "1P表示",
  args: {
    playSide: "1P",
    allTickets: sampleTickets,
    filteredTickets: sampleTickets,
    songs: sampleSongs,
    selectedSong: null,
  },
};

export const Side2P: Story = {
  name: "2P表示",
  args: {
    ...Default.args,
    playSide: "2P",
  },
};

export const NoTickets: Story = {
  name: "チケットなし",
  args: {
    ...Default.args,
    allTickets: [],
    filteredTickets: [],
  },
};
