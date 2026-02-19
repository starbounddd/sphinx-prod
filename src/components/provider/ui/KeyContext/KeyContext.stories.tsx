import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { KeyContext } from './KeyContext';

const meta: Meta<typeof KeyContext> = {
  title: 'Provider/KeyContext',
  component: KeyContext,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div className="w-[500px]">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof KeyContext>;

export const Default: Story = {
  args: {
    items: [
      'Previous therapy experience (CBT, 6 months)',
      'Currently on medication (Lexapro 10mg)',
      'Strong family support system',
      'Flexible work schedule for appointments',
    ],
  },
};

export const ShortList: Story = {
  args: {
    items: ['First-time therapy patient', 'No current medications'],
  },
};

export const LongList: Story = {
  args: {
    items: [
      'Diagnosed with GAD in 2022',
      'Previous hospitalization (2021)',
      'Currently in couples therapy',
      'Works remotely - flexible schedule',
      'Active in support group',
      'Family history of depression',
      'Prefers evening appointments',
    ],
  },
};
