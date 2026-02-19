import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { useState } from 'react';
import { QuickReplyChip } from './QuickReplyChip';

const meta: Meta<typeof QuickReplyChip> = {
  title: 'Shared/Chat/QuickReplyChip',
  component: QuickReplyChip,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof QuickReplyChip>;

export const Default: Story = {
  args: {
    children: "Yes, that's right",
    onClick: () => console.log('Clicked'),
  },
};

export const Selected: Story = {
  args: {
    children: 'Selected option',
    onClick: () => {},
    selected: true,
  },
};

export const Disabled: Story = {
  args: {
    children: 'Disabled chip',
    onClick: () => {},
    disabled: true,
  },
};

// Interactive story with multiple chips
function InteractiveChips() {
  const [selected, setSelected] = useState<string | null>(null);
  const options = ['Feeling anxious', 'Sleep issues', 'Work stress', 'Other'];

  return (
    <div className="flex flex-wrap gap-2">
      {options.map((option) => (
        <QuickReplyChip
          key={option}
          onClick={() => setSelected(option)}
          selected={selected === option}
        >
          {option}
        </QuickReplyChip>
      ))}
    </div>
  );
}

export const MultipleOptions: Story = {
  render: () => <InteractiveChips />,
};
