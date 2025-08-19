import type { Meta, StoryObj } from "@storybook/react-vite";
import { TicketList } from "./TicketList";

const meta: Meta<typeof TicketList> = {
  title: "Component/TicketList",
  component: TicketList,
  tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    tickets: [{ laneText: "1234567" }, { laneText: "7654321" }],
    selectedSong: null,
    onOpenTextage: () => alert("Textageが開かれます"),
  },
};

export const WithSongSelected: Story = {
  args: {
    ...Default.args,
    selectedSong: {
      title: "A(A)",
      url: "https://textage.cc/score/7/a_amuro.html?1AC00",
      level: 12,
    },
  },
};
