import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Stagger } from './Stagger';
import { ScaleIn } from '../ScaleIn';

const meta: Meta<typeof Stagger> = {
  title: 'Shared/Motion/Stagger',
  component: Stagger,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Stagger>;

export const Default: Story = {
  args: {
    className: 'grid grid-cols-2 gap-4',
    children: (
      <>
        <ScaleIn>
          <div className="rounded-xl bg-sage p-6 text-dark">Item 1</div>
        </ScaleIn>
        <ScaleIn>
          <div className="rounded-xl bg-lavender p-6 text-dark">Item 2</div>
        </ScaleIn>
        <ScaleIn>
          <div className="rounded-xl bg-coral p-6 text-white">Item 3</div>
        </ScaleIn>
        <ScaleIn>
          <div className="rounded-xl bg-cream p-6 text-dark">Item 4</div>
        </ScaleIn>
      </>
    ),
  },
};

export const SlowStagger: Story = {
  args: {
    staggerDelay: 0.3,
    className: 'flex gap-4',
    children: (
      <>
        <ScaleIn>
          <div className="rounded-xl bg-sage p-6 text-dark">Slow 1</div>
        </ScaleIn>
        <ScaleIn>
          <div className="rounded-xl bg-lavender p-6 text-dark">Slow 2</div>
        </ScaleIn>
        <ScaleIn>
          <div className="rounded-xl bg-coral p-6 text-white">Slow 3</div>
        </ScaleIn>
      </>
    ),
  },
};
