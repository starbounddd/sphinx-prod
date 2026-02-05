import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { EmailSignup } from './EmailSignup';

const meta: Meta<typeof EmailSignup> = {
  title: 'Landing/EmailSignup',
  component: EmailSignup,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div className="w-[576px] rounded-2xl bg-sage/30 p-8">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof EmailSignup>;

export const Default: Story = {};
