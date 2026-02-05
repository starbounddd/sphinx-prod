import type { ClarityReport } from '../types';

/**
 * Mock report data for demonstration
 */
export const MOCK_REPORT: ClarityReport = {
  id: 'report-1',
  userQuote: "I'm scared of crowds and my heart races...",
  analysisHighlight: 'Social Anxiety',
  analysis: 'with Physical Symptoms (Palpitations)',
  findings: [
    {
      id: '1',
      icon: 'zap',
      title: 'Triggers',
      description: 'Large gatherings, Unstructured social time',
    },
    {
      id: '2',
      icon: 'clock',
      title: 'Duration',
      description: 'Persistent for 6+ months',
    },
    {
      id: '3',
      icon: 'activity',
      title: 'Intensity',
      description: 'High - impacts daily functioning',
    },
    {
      id: '4',
      icon: 'calendar',
      title: 'Onset',
      description: 'Gradual, started after recent life changes',
    },
  ],
  createdAt: new Date(),
};
