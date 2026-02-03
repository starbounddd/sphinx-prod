import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { TertiaryButton } from "./TertiaryButton";

const meta: Meta<typeof TertiaryButton> = {
  title: "Shared/Buttons/TertiaryButton",
  component: TertiaryButton,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof TertiaryButton>;

export const Default: Story = {
  args: {
    children: "Browse Options",
  },
};

export const FullWidth: Story = {
  args: {
    children: "See All Features",
    fullWidth: true,
  },
  decorators: [
    (Story) => (
      <div style={{ width: "300px" }}>
        <Story />
      </div>
    ),
  ],
};

export const Disabled: Story = {
  args: {
    children: "Coming Soon",
    disabled: true,
  },
};
