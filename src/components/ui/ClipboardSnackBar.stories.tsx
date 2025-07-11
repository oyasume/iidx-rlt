import type { Meta, StoryObj } from "@storybook/react-vite";
import { ClipboardSnackbar } from "./ClipboardSnackBar";

const meta: Meta<typeof ClipboardSnackbar> = {
  title: "Component/ClipboardSnackbar",
  component: ClipboardSnackbar,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Success: Story = {
  name: "成功時",
  args: {
    open: true,
    error: null,
    successMessage: "クリップボードにコピーしました",
  },
};

export const Error: Story = {
  name: "エラー時",
  args: {
    open: true,
    error: "クリップボードへのコピーに失敗しました",
  },
};
