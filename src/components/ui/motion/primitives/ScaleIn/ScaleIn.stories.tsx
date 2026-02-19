import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { ScaleIn } from './ScaleIn';
import { Stagger } from '../Stagger';

const meta: Meta<typeof ScaleIn> = {
  title: 'Shared/Motion/ScaleIn',
  component: ScaleIn,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof ScaleIn>;

export const Default: Story = {
  render: () => (
    <Stagger className="flex gap-4">
      <ScaleIn>
        <div className="rounded-xl bg-sage p-6 text-dark">Card 1</div>
      </ScaleIn>
      <ScaleIn>
        <div className="rounded-xl bg-lavender p-6 text-dark">Card 2</div>
      </ScaleIn>
      <ScaleIn>
        <div className="rounded-xl bg-coral p-6 text-white">Card 3</div>
      </ScaleIn>
    </Stagger>
  ),
};
