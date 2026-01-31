import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { BouncingDots } from "./BouncingDots";

const meta: Meta<typeof BouncingDots> = {
  title: "Shared/Motion/BouncingDots",
  component: BouncingDots,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof BouncingDots>;

export const Default: Story = {
  args: {
    count: 3,
  },
};

export const FourDots: Story = {
  args: {
    count: 4,
    dotClassName: "h-2 w-2 rounded-full bg-sage",
  },
};

export const CustomStyle: Story = {
  args: {
    count: 3,
    dotClassName: "h-3 w-3 rounded-full bg-dark",
  },
};

export const InContext: Story = {
  render: () => (
    <div className="flex items-center gap-3 rounded-full bg-white/60 px-5 py-3 shadow-md">
      <span className="text-gray text-sm">Sphinx is thinking</span>
      <BouncingDots dotClassName="h-1.5 w-1.5 rounded-full bg-coral" />
    </div>
  ),
};
