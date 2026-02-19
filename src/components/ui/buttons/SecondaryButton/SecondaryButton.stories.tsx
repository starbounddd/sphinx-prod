import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { SecondaryButton } from './SecondaryButton';

const meta: Meta<typeof SecondaryButton> = {
  title: 'Shared/Buttons/SecondaryButton',
  component: SecondaryButton,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof SecondaryButton>;

export const Default: Story = {
  args: {
    children: 'Learn More',
  },
};

export const FullWidth: Story = {
  args: {
    children: 'View Details',
    fullWidth: true,
  },
  decorators: [
    (Story) => (
      <div style={{ width: '300px' }}>
        <Story />
      </div>
    ),
  ],
};

export const Disabled: Story = {
  args: {
    children: 'Unavailable',
    disabled: true,
  },
};
