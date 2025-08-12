import type { Meta, StoryObj } from "@storybook/react-vite";
import { TextageForm } from "./TextageForm";

const meta: Meta<typeof TextageForm> = {
  title: "Component/TextageForm",
  component: TextageForm,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof meta>;

const allSongsData = [
  {
    title: "A(A)",
    url: "https://textage.cc/score/7/a_amuro.html?1AC00",
    level: 12,
  },
  {
    title: "冥(A)",
    url: "https://textage.cc/score/12/_mei.html?1AC00",
    level: 12,
  },
];

const atariSongsData = [allSongsData[0], allSongsData[1]];

export const Default: Story = {
  args: {
    allSongs: allSongsData,
    atariSongs: atariSongsData,
    selectedSong: null,
    onSongSelect: () => {},
  },
};
