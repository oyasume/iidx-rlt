import type { Meta, StoryObj } from "@storybook/react-vite";
import { TicketView } from "./TicketView";
import { sampleSongs, sampleTickets } from "../../data";
import { MemoryRouter } from "react-router-dom";
import { FormProvider } from "react-hook-form";
import { AppSettings } from "types";
import { useTicketSearch } from "./hooks/useTicketSearch";

const meta: Meta<typeof TicketView> = {
  title: "Page/TicketView",
  component: TicketView,
  tags: ["autodocs"],
  decorators: [
    (Story, context) => {
      const settings: AppSettings = { playSide: "1P" };
      const { methods } = useTicketSearch(sampleTickets, settings.playSide);

      return (
        <MemoryRouter>
          <FormProvider {...methods}>
            <Story
              args={{
                allTickets: sampleTickets,
                filteredTickets: context.args.filteredTickets || sampleTickets,
                songs: sampleSongs,
                settings: settings,
                onPlaySideChange: () => {},
              }}
            />
          </FormProvider>
        </MemoryRouter>
      );
    },
  ],
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const NoTickets: Story = {
  args: {
    filteredTickets: [],
  },
};
