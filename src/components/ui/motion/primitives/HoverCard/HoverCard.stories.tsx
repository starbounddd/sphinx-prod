import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { HoverCard } from "./HoverCard";

const meta: Meta<typeof HoverCard> = {
  title: "Shared/Motion/HoverCard",
  component: HoverCard,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof HoverCard>;

export const Default: Story = {
  args: {
    children: (
      <div className="cursor-pointer rounded-xl bg-white p-6 shadow-md">
        <p className="text-dark font-medium">Hover over me!</p>
        <p className="text-gray text-sm">I lift up on hover</p>
      </div>
    ),
  },
};

export const WithTap: Story = {
  args: {
    enableTap: true,
    children: (
      <div className="cursor-pointer rounded-xl bg-sage p-6">
        <p className="text-dark font-medium">Click me!</p>
        <p className="text-gray text-sm">I also respond to taps</p>
      </div>
    ),
  },
};
