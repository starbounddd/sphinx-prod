import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { FindingCard } from './FindingCard';

const meta: Meta<typeof FindingCard> = {
  title: 'Assessment/FindingCard',
  component: FindingCard,
  parameters: {
    layout: 'padded',
    backgrounds: { default: 'cream' },
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div className="mx-auto max-w-md">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof FindingCard>;

export const Zap: Story = {
  args: {
    icon: 'zap',
    title: 'High Energy Periods',
    description:
      'You tend to feel most energized in the morning hours, which may indicate an opportunity to tackle challenging tasks early.',
  },
};

export const Clock: Story = {
  args: {
    icon: 'clock',
    title: 'Sleep Patterns',
    description:
      'Your sleep schedule appears irregular, which can significantly impact mood and energy levels.',
  },
};

export const Activity: Story = {
  args: {
    icon: 'activity',
    title: 'Stress Triggers',
    description:
      'Work-related situations seem to be your primary stress trigger, particularly around deadlines.',
  },
};

export const Calendar: Story = {
  args: {
    icon: 'calendar',
    title: 'Weekly Patterns',
    description:
      'Sundays and Mondays appear to be more challenging days for you emotionally.',
  },
};
