import type { Meta, StoryObj } from "@storybook/react-vite";
import { AppSnackbar } from "./AppSnackbar";

const meta: Meta<typeof AppSnackbar> = {
  title: "Component/AppSnackbar",
  component: AppSnackbar,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
  },
  argTypes: {
    open: { control: "boolean" },
    message: { control: "text" },
    severity: {
      control: "radio",
      options: ["success", "error", "info", "warning"],
    },
    autoHideDuration: { control: "number" },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    open: true,
    message: "メッセージ",
    severity: "success",
  },
};
