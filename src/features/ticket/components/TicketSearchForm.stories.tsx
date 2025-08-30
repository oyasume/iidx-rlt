import { zodResolver } from "@hookform/resolvers/zod";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { FormProvider, useForm } from "react-hook-form";

import { searchFormSchema, SearchFormValues } from "../../../schema";
import { useSettingsStore } from "../../../state/settingsStore";
import { PlaySide } from "../../../types";
import { TicketSearchForm } from "./TicketSearchForm";

type TicketSearchFormStoryProps = {
  playSide: PlaySide;
};

const meta: Meta<TicketSearchFormStoryProps> = {
  title: "Component/TicketSearchForm",
  component: TicketSearchForm,
  tags: ["autodocs"],
  decorators: [
    (Story, context) => {
      const side: PlaySide = context.args.playSide || "1P";
      useSettingsStore.setState({ playSide: side });

      const methods = useForm<SearchFormValues>({
        resolver: zodResolver(searchFormSchema),
        defaultValues: {
          scratchSideText: "***",
          isScratchSideUnordered: true,
          nonScratchSideText: "****",
          isNonScratchSideUnordered: true,
        },
      });
      return (
        <FormProvider {...methods}>
          <Story />
        </FormProvider>
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
  args: {
    playSide: "1P",
  },
};
