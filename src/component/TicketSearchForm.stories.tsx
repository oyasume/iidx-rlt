import type { Meta, StoryObj } from "@storybook/react-vite";
import { TicketSearchForm } from "./TicketSearchForm";

const meta: Meta<typeof TicketSearchForm> = {
  title: "Component/TicketSearchForm",
  component: TicketSearchForm,
  tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
