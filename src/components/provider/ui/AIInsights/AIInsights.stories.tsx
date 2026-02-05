import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { AIInsights } from './AIInsights';

const meta: Meta<typeof AIInsights> = {
  title: 'Provider/AIInsights',
  component: AIInsights,
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
type Story = StoryObj<typeof AIInsights>;

export const Default: Story = {
  args: {
    children:
      'Based on intake responses, this patient shows strong indicators for generalized anxiety disorder with comorbid insomnia. Recommend CBT-focused approach with sleep hygiene education.',
  },
};

export const ShortInsight: Story = {
  args: {
    children: 'High compatibility with your specialty in anxiety disorders.',
  },
};

export const DetailedInsight: Story = {
  args: {
    children: (
      <>
        <strong>Primary Assessment:</strong> Patient exhibits classic GAD
        symptoms with recent exacerbation due to work stress.
        <br />
        <br />
        <strong>Recommended Approach:</strong> Initial focus on psychoeducation
        and relaxation techniques before progressing to cognitive restructuring.
      </>
    ),
  },
};
