import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { CTASection } from "./CTASection";

const meta: Meta<typeof CTASection> = {
  title: "Landing/CTASection",
  component: CTASection,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof CTASection>;

export const Default: Story = {};
