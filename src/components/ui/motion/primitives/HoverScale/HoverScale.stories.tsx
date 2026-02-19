import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Send } from 'lucide-react';
import { HoverScale } from './HoverScale';

const meta: Meta<typeof HoverScale> = {
  title: 'Shared/Motion/HoverScale',
  component: HoverScale,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof HoverScale>;

export const Default: Story = {
  args: {
    className:
      'flex h-12 w-12 items-center justify-center rounded-full bg-coral text-white',
    children: <Send className="h-5 w-5" />,
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
    className:
      'flex h-12 w-12 items-center justify-center rounded-full bg-gray/30 text-gray cursor-not-allowed',
    children: <Send className="h-5 w-5" />,
  },
};

export const TextButton: Story = {
  args: {
    className: 'rounded-full bg-dark px-6 py-3 text-white font-medium',
    children: 'Send Message',
  },
};
