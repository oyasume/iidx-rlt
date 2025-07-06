import type { Meta, StoryObj } from "@storybook/react-vite";
import Tool from "./Tool";
import { Ticket } from "./types";
import { IStorage } from "./storage";

const meta: Meta<typeof Tool> = {
  title: "Tool",
  component: Tool,
  tags: ["autodocs"],
  decorators: [
    (Story, context) => {
      const { storageDelay = 0 } = context.parameters as { storageDelay?: number };

      const mockStorage: IStorage = {
        get: async <T extends object>(keys: T): Promise<T> => {
          if (storageDelay === Infinity) {
            return new Promise(() => {});
          }
          await new Promise((resolve) => setTimeout(resolve, storageDelay));
          return { ...keys };
        },
        set: async (_items: object): Promise<void> => {
          if (storageDelay === Infinity) {
            return new Promise(() => {});
          }
          await new Promise((resolve) => setTimeout(resolve, storageDelay));
        },
      };

      window.chrome = {
        runtime: {
          getURL: (path: string) => {
            return path;
          },
        },
      } as typeof chrome;

      return <Story args={{ ...context.args, storage: mockStorage }} />;
    },
  ],
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

export const Loading: Story = {
  args: {
    tickets: mockTickets,
  },
  parameters: {
    storageDelay: Infinity,
  },
};
