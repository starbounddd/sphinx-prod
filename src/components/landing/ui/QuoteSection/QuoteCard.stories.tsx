import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { QuoteCard } from "./QuoteCard";

const meta: Meta<typeof QuoteCard> = {
  title: "Landing/QuoteCard",
  component: QuoteCard,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <div className="w-[320px]">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof QuoteCard>;

export const Sage: Story = {
  args: {
    quote: "I just feel overwhelmed and my chest hurts...",
    analysis: "Potential physical symptoms of anxiety triggered by stress",
    variant: "sage",
  },
};

export const Lavender: Story = {
  args: {
    quote: "Nothing feels worth it anymore, I'm so tired...",
    analysis: "Signs consistent with low mood and fatigue, common in depression",
    variant: "lavender",
  },
};

export const Coral: Story = {
  args: {
    quote: "I can't stop thinking about that thing I said...",
    analysis: "Repetitive thought patterns suggesting rumination or social anxiety",
    variant: "coral",
  },
};
