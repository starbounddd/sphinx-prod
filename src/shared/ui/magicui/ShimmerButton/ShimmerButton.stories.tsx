import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { ArrowRight } from "lucide-react";
import { ShimmerButton } from "./ShimmerButton";

const meta: Meta<typeof ShimmerButton> = {
  title: "Shared/MagicUI/ShimmerButton",
  component: ShimmerButton,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof ShimmerButton>;

export const Default: Story = {
  args: {
    children: "Get Started",
  },
};

export const WithIcon: Story = {
  args: {
    children: (
      <>
        Continue
        <ArrowRight className="h-5 w-5" />
      </>
    ),
  },
};

export const CustomColors: Story = {
  args: {
    children: "Custom Shimmer",
    shimmerColor: "rgba(255, 255, 255, 0.4)",
    background: "linear-gradient(to right, #6366f1, #8b5cf6)",
  },
};

export const SlowAnimation: Story = {
  args: {
    children: "Slow Shimmer",
    shimmerDuration: "4s",
  },
};

export const Disabled: Story = {
  args: {
    children: "Disabled",
    disabled: true,
  },
};
