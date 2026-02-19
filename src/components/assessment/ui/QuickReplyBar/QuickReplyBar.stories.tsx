import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { QuickReplyBar } from './QuickReplyBar';

const meta: Meta<typeof QuickReplyBar> = {
  title: 'Assessment/QuickReplyBar',
  component: QuickReplyBar,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof QuickReplyBar>;

export const Default: Story = {
  args: {
    options: ["I'm feeling anxious", 'I need help sleeping', 'Just exploring'],
    onSelect: (option) => console.log('Selected:', option),
  },
};

export const ManyOptions: Story = {
  args: {
    options: [
      'Anxiety',
      'Depression',
      'Sleep Issues',
      'Stress',
      'Relationships',
      'Work-Life Balance',
    ],
    onSelect: (option) => console.log('Selected:', option),
  },
};

export const Disabled: Story = {
  args: {
    options: ['Option 1', 'Option 2', 'Option 3'],
    onSelect: (option) => console.log('Selected:', option),
    disabled: true,
  },
};
