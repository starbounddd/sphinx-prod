import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Navbar } from './Navbar';

const meta: Meta<typeof Navbar> = {
  title: 'Shared/Navigation/Navbar',
  component: Navbar,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Navbar>;

export const Default: Story = {
  decorators: [
    (Story) => (
      <div className="h-[200px] bg-cream">
        <Story />
      </div>
    ),
  ],
};

