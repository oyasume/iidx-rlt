import type { Meta, StoryObj } from "@storybook/react-vite";
import { TicketControlPanel } from "./TicketControlPanel";

const meta: Meta<typeof TicketControlPanel> = {
  title: "Component/TicketControlPanel",
  component: TicketControlPanel,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const PlaySide1P: Story = {
  args: {
    playSide: "1P",
    onPlaySideChange: () => {},
  },
};

export const PlaySide2P: Story = {
  args: {
    playSide: "2P",
    onPlaySideChange: () => {},
  },
};
