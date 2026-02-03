import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { SummaryCard } from "./SummaryCard";

const meta: Meta<typeof SummaryCard> = {
  title: "Assessment/SummaryCard",
  component: SummaryCard,
  parameters: {
    layout: "padded",
    backgrounds: { default: "cream" },
  },
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <div className="mx-auto max-w-md">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof SummaryCard>;

export const Default: Story = {
  args: {
    userQuote: "I've been feeling overwhelmed lately, especially at work",
    analysis: "indicates you may be experiencing burnout, a common response to prolonged stress.",
    analysisHighlight: "Your response",
  },
};

export const WithoutHighlight: Story = {
  args: {
    userQuote: "Sometimes I just feel lost and don't know what to do next",
    analysis: "Feeling uncertain about direction is a natural part of life transitions. This awareness is actually a strength.",
  },
};

export const LongQuote: Story = {
  args: {
    userQuote: "I've been struggling with sleep for months now. I lie awake thinking about everything that could go wrong tomorrow, and then I'm exhausted during the day",
    analysis: "suggests a pattern of anticipatory anxiety affecting your sleep quality. This cycle is treatable with the right support.",
    analysisHighlight: "What you're describing",
  },
};
