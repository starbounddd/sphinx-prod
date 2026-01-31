import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { HoverFloat } from "./HoverFloat";

const meta: Meta<typeof HoverFloat> = {
  title: "Shared/Motion/HoverFloat",
  component: HoverFloat,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof HoverFloat>;

export const Default: Story = {
  args: {
    className: "rounded-full bg-sage px-6 py-3 text-dark font-medium",
    children: "Hover to float",
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
    className: "rounded-full bg-gray/30 px-6 py-3 text-gray cursor-not-allowed",
    children: "Disabled",
  },
};

export const Multiple: Story = {
  render: () => (
    <div className="flex gap-3">
      <HoverFloat className="rounded-full bg-sage px-4 py-2 text-dark">
        Option 1
      </HoverFloat>
      <HoverFloat className="rounded-full bg-lavender px-4 py-2 text-dark">
        Option 2
      </HoverFloat>
      <HoverFloat className="rounded-full bg-coral px-4 py-2 text-white">
        Option 3
      </HoverFloat>
    </div>
  ),
};
