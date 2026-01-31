import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { MatchScoreBadge } from "./MatchScoreBadge";

const meta: Meta<typeof MatchScoreBadge> = {
  title: "Provider/MatchScoreBadge",
  component: MatchScoreBadge,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof MatchScoreBadge>;

export const HighMatch: Story = {
  args: {
    score: 94,
  },
};

export const MediumMatch: Story = {
  args: {
    score: 75,
  },
};

export const LowMatch: Story = {
  args: {
    score: 45,
  },
};

export const AllScores: Story = {
  render: () => (
    <div className="flex flex-wrap gap-4">
      <MatchScoreBadge score={98} />
      <MatchScoreBadge score={85} />
      <MatchScoreBadge score={72} />
      <MatchScoreBadge score={58} />
    </div>
  ),
};
