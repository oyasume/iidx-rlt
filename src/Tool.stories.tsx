import type { Meta, StoryObj } from "@storybook/react-vite";
import Tool from "./Tool";
import { Ticket } from "./types";

const meta: Meta<typeof Tool> = {
  title: "Tool",
  component: Tool,
  tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof meta>;

const mockTickets: Ticket[] = [
  { laneText: "1234567", expiration: "2025/12/31" },
  { laneText: "7654321", expiration: "2025/12/31" },
  { laneText: "1357246", expiration: "2025/12/31" },
  { laneText: "2461357", expiration: "2025/12/31" },
];

export const Default: Story = {
  args: {
    tickets: mockTickets,
  },
};

export const NoTickets: Story = {
  args: {
    tickets: [],
  },
};
