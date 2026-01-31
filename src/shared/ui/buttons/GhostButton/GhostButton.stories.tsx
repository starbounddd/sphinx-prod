import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { GhostButton } from "./GhostButton";

const meta: Meta<typeof GhostButton> = {
  title: "Shared/Buttons/GhostButton",
  component: GhostButton,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof GhostButton>;

export const Default: Story = {
  args: {
    children: "Cancel",
  },
};

export const FullWidth: Story = {
  args: {
    children: "Skip",
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
