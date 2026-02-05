import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { SlideIn } from './SlideIn';

const meta: Meta<typeof SlideIn> = {
  title: 'Shared/Motion/SlideIn',
  component: SlideIn,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof SlideIn>;

export const FromUp: Story = {
  args: {
    direction: 'up',
    children: (
      <div className="rounded-xl bg-sage p-8 text-dark">
        Slides in from below
      </div>
    ),
  },
};

export const FromLeft: Story = {
  args: {
    direction: 'left',
    children: (
      <div className="rounded-xl bg-lavender p-8 text-dark">
        Slides in from left
      </div>
    ),
  },
};

export const FromRight: Story = {
  args: {
    direction: 'right',
    children: (
      <div className="rounded-xl bg-coral p-8 text-white">
        Slides in from right
      </div>
    ),
  },
};

export const WithDelay: Story = {
  args: {
    direction: 'up',
    delay: 0.3,
    children: (
      <div className="rounded-xl bg-cream p-8 text-dark">
        Slides in after 0.3s
      </div>
    ),
  },
};
