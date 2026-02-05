import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { SphinxSummary } from './SphinxSummary';

const meta: Meta<typeof SphinxSummary> = {
  title: 'Provider/SphinxSummary',
  component: SphinxSummary,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof SphinxSummary>;

export const ModerateRisk: Story = {
  args: {
    symptoms: ['Generalized Anxiety', 'Insomnia', 'Brain Fog'],
    riskLevel: 'moderate',
    riskLabel: 'Moderate Distress',
    aiInsight:
      'Patient exhibits patterns of catastrophic thinking in journal entries from past 2 weeks.',
  },
};

export const HighRisk: Story = {
  args: {
    symptoms: ['Mood Lability', 'Impulsivity'],
    riskLevel: 'high',
    riskLabel: 'High Variability',
    aiInsight:
      'AI detected rapid sentiment shifts within 48-hour windows over the last month.',
  },
};

export const LowRisk: Story = {
  args: {
    symptoms: ['Mild Stress', 'Sleep Irregularity'],
    riskLevel: 'low',
    riskLabel: 'Low Concern',
    aiInsight:
      'Patient shows consistent improvement in mood tracking over the past 3 weeks.',
  },
};
