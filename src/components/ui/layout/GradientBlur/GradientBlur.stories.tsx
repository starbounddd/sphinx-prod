import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { GradientBlur } from './GradientBlur';

const meta: Meta<typeof GradientBlur> = {
  title: 'Shared/Layout/GradientBlur',
  component: GradientBlur,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div className="relative h-[400px] w-[600px] overflow-hidden rounded-xl bg-cream">
        <Story />
        <div className="relative z-10 flex h-full items-center justify-center">
          <p className="text-lg font-medium text-dark">Content over gradient</p>
        </div>
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof GradientBlur>;

export const Coral: Story = {
  args: {
    color: 'coral',
    size: 'md',
    className: 'left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2',
  },
};

export const Lavender: Story = {
  args: {
    color: 'lavender',
    size: 'md',
    className: 'left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2',
  },
};

export const Small: Story = {
  args: {
    color: 'coral',
    size: 'sm',
    className: 'left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2',
  },
};

export const Large: Story = {
  args: {
    color: 'coral',
    size: 'lg',
    className: 'left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2',
  },
};

export const Combined: Story = {
  render: () => (
    <>
      <GradientBlur color="coral" size="md" className="left-0 top-0" />
      <GradientBlur color="lavender" size="sm" className="bottom-0 right-0" />
    </>
  ),
};
