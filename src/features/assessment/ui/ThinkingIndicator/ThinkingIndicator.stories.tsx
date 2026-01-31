import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { ThinkingIndicator } from "./ThinkingIndicator";

const meta: Meta<typeof ThinkingIndicator> = {
  title: "Assessment/ThinkingIndicator",
  component: ThinkingIndicator,
  parameters: {
    layout: "centered",
    backgrounds: { default: "cream" },
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof ThinkingIndicator>;

export const Default: Story = {};
