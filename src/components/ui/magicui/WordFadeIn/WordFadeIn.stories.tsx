import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { WordFadeIn } from './WordFadeIn';

const meta: Meta<typeof WordFadeIn> = {
  title: 'Shared/MagicUI/WordFadeIn',
  component: WordFadeIn,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div className="max-w-lg text-center">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof WordFadeIn>;

export const Default: Story = {
  args: {
    words: 'Mental wellness is a journey, not a destination.',
    className: 'text-lg text-dark',
  },
};

export const AsHeading: Story = {
  args: {
    words: 'Your mental health matters',
    as: 'h1',
    className: 'text-3xl font-bold text-dark',
  },
};

export const SlowAnimation: Story = {
  args: {
    words: "Take your time. Breathe. You're doing great.",
    delay: 0.15,
    className: 'text-xl text-gray',
  },
};

export const FastAnimation: Story = {
  args: {
    words: 'Quick fade in effect for shorter text',
    delay: 0.04,
    className: 'text-md text-dark',
  },
};

export const CoralText: Story = {
  args: {
    words: 'Sphinx helps you find the right care',
    as: 'h2',
    className: 'text-2xl font-semibold text-coral',
  },
};
