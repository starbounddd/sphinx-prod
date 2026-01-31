import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { FindingsGrid } from "./FindingsGrid";
import type { Finding } from "../../types";

const meta: Meta<typeof FindingsGrid> = {
  title: "Assessment/FindingsGrid",
  component: FindingsGrid,
  parameters: {
    layout: "padded",
    backgrounds: { default: "cream" },
  },
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <div className="mx-auto max-w-3xl">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof FindingsGrid>;

const mockFindings: Finding[] = [
  {
    id: "1",
    icon: "zap",
    title: "High Energy Periods",
    description: "You tend to feel most energized in the morning hours.",
  },
  {
    id: "2",
    icon: "clock",
    title: "Sleep Patterns",
    description: "Your sleep schedule appears irregular, impacting mood.",
  },
  {
    id: "3",
    icon: "activity",
    title: "Stress Triggers",
    description: "Work-related situations seem to be your primary stress trigger.",
  },
  {
    id: "4",
    icon: "calendar",
    title: "Weekly Patterns",
    description: "Sundays and Mondays appear to be more challenging days.",
  },
];

export const Default: Story = {
  args: {
    findings: mockFindings,
  },
};

export const TwoFindings: Story = {
  args: {
    findings: mockFindings.slice(0, 2),
  },
};

export const SingleFinding: Story = {
  args: {
    findings: mockFindings.slice(0, 1),
  },
};
