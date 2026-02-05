import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { AssessmentChat } from './AssessmentChat';

const meta: Meta<typeof AssessmentChat> = {
  title: 'Assessment/AssessmentChat',
  component: AssessmentChat,
  parameters: {
    layout: 'fullscreen',
    nextjs: {
      appDirectory: true,
      navigation: {
        push: () => {},
      },
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof AssessmentChat>;

export const Default: Story = {};
