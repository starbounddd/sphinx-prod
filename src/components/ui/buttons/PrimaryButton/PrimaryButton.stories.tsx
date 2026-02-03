import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { PrimaryButton } from "./PrimaryButton";

const meta: Meta<typeof PrimaryButton> = {
  title: "Shared/Buttons/PrimaryButton",
  component: PrimaryButton,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof PrimaryButton>;

export const Default: Story = {
  args: {
    children: "Get Started",
  },
};

export const WithArrow: Story = {
  args: {
    children: "Continue",
    showArrow: true,
  },
};

export const Shimmer: Story = {
  args: {
    children: "Start Assessment",
    shimmer: true,
  },
};

export const FullWidth: Story = {
  args: {
    children: "Submit",
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
    children: "Processing...",
    disabled: true,
  },
};
