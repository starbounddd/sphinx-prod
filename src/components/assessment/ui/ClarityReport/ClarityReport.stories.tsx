import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { ClarityReport } from './ClarityReport';
import type { ClarityReport as ClarityReportType } from '../../types';

const meta: Meta<typeof ClarityReport> = {
  title: 'Assessment/ClarityReport',
  component: ClarityReport,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof ClarityReport>;

const mockReport: ClarityReportType = {
  id: 'report-1',
  userQuote:
    "I've been feeling overwhelmed lately, especially at work. It's hard to switch off.",
  analysis:
    'indicates you may be experiencing burnout, a common response to prolonged stress without adequate recovery time.',
  analysisHighlight: 'Your response',
  findings: [
    {
      id: '1',
      icon: 'zap',
      title: 'High Energy Periods',
      description:
        'You tend to feel most energized in the morning hours, which may indicate an opportunity to tackle challenging tasks early.',
    },
    {
      id: '2',
      icon: 'clock',
      title: 'Sleep Patterns',
      description:
        'Your sleep schedule appears irregular, which can significantly impact mood and energy levels.',
    },
    {
      id: '3',
      icon: 'activity',
      title: 'Stress Triggers',
      description:
        'Work-related situations seem to be your primary stress trigger, particularly around deadlines.',
    },
    {
      id: '4',
      icon: 'calendar',
      title: 'Weekly Patterns',
      description:
        'Sundays and Mondays appear to be more challenging days for you emotionally.',
    },
  ],
  createdAt: new Date(),
};

export const Default: Story = {
  args: {
    report: mockReport,
  },
};

export const MinimalFindings: Story = {
  args: {
    report: {
      ...mockReport,
      findings: mockReport.findings.slice(0, 2),
    },
  },
};
