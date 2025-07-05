import type { Meta, StoryObj } from "@storybook/react-vite";
import { TicketControlPanel } from "./TicketControlPanel";

const meta: Meta<typeof TicketControlPanel> = {
  title: "Component/TicketControlPanel",
  component: TicketControlPanel,
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    playSide: "1P",
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    onPlaySideChange: (_newPlaySide) => {},
  },
};

export const PlaySide2P: Story = {
  args: {
    playSide: "2P",
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    onPlaySideChange: (_newPlaySide) => {},
  },
};
