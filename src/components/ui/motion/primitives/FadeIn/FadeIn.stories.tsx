import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { FadeIn } from "./FadeIn";

const meta: Meta<typeof FadeIn> = {
  title: "Shared/Motion/FadeIn",
  component: FadeIn,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof FadeIn>;

export const Default: Story = {
  args: {
    children: (
      <div className="rounded-xl bg-sage p-8 text-dark">
        This content fades in
      </div>
    ),
  },
};

export const WithDelay: Story = {
  args: {
    delay: 0.5,
    children: (
      <div className="rounded-xl bg-coral p-8 text-white">
        Fades in after 0.5s delay
      </div>
    ),
  },
};
