import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { BorderBeam } from "./BorderBeam";

const meta: Meta<typeof BorderBeam> = {
  title: "Shared/MagicUI/BorderBeam",
  component: BorderBeam,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <div className="relative h-40 w-64 overflow-hidden rounded-2xl border border-sage bg-white p-6">
        <Story />
        <div className="relative z-10 text-center">
          <p className="font-semibold text-dark">Card Content</p>
          <p className="text-sm text-gray">With border beam effect</p>
        </div>
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof BorderBeam>;

export const Default: Story = {
  args: {},
};

export const FastAnimation: Story = {
  args: {
    duration: 4,
  },
};

export const CustomColors: Story = {
  args: {
    colorFrom: "#6366f1",
    colorTo: "#8b5cf6",
  },
};

export const LargeBeam: Story = {
  args: {
    size: 150,
  },
};

export const WithDelay: Story = {
  args: {
    delay: 2,
  },
};
