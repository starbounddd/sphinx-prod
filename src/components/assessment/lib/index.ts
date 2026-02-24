import type { ClarityReport, AssessmentReport } from '../types';

/**
 * Mock report data for demonstration (legacy)
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

/**
 * Mock assessment report data matching the new provider-facing design
 */
export const MOCK_ASSESSMENT_REPORT: AssessmentReport = {
  id: 'assessment-report-1',
  patientName: 'Test Patient',
  patientDOB: 'Mar 15, 1995',
  assessmentDate: 'Feb 7, 2026',
  status: 'completed',
  summaryStats: [
    {
      icon: 'alert-triangle',
      value: '5',
      label: 'Domains Flagged out of 13',
      color: '#D97706',
    },
    {
      icon: 'activity',
      value: 'Anxiety',
      label: 'Highest Severity Domain',
      color: '#DC2626',
    },
    {
      icon: 'shield-check',
      value: 'Low-Mod',
      label: 'Overall Risk Level',
      color: '#0D9488',
    },
    {
      icon: 'brain',
      value: '92%',
      label: 'AI Confidence Score',
      color: '#0D9488',
    },
  ],
  domains: [
    {
      domain: 'Suicidal Ideation',
      label: 'Suicidal Ideation',
      specificity: 'High',
      impact: 'None',
      control: 0,
      frequency: 0,
      duration: '\u2014',
      clinicalNotes: 'No suicidal ideation or self-harm behaviors reported',
    },
    {
      domain: 'Psychosis',
      label: 'Psychosis',
      specificity: 'High',
      impact: 'None',
      control: 0,
      frequency: 0,
      duration: '\u2014',
      clinicalNotes: 'No psychotic symptoms detected in assessment',
    },
    {
      domain: 'Substance Use',
      label: 'Substance Use',
      specificity: 'High',
      impact: 'None',
      control: 0,
      frequency: 0,
      duration: '\u2014',
      clinicalNotes: 'No substance use or dependency reported',
    },
    {
      domain: 'Mania',
      label: 'Mania',
      specificity: 'Medium',
      impact: 'None',
      control: 0,
      frequency: 0,
      duration: '\u2014',
      clinicalNotes:
        'No manic symptoms reported during assessment period',
    },
    {
      domain: 'Dissociation',
      label: 'Dissociation',
      specificity: 'Medium',
      impact: 'None',
      control: 0,
      frequency: 0,
      duration: '\u2014',
      clinicalNotes: 'No dissociative symptoms reported',
    },
    {
      domain: 'Depression',
      label: 'Depression',
      specificity: 'Medium',
      impact: 'Mild',
      control: 3,
      frequency: 4,
      duration: '2 weeks',
      clinicalNotes:
        'Low mood and reduced interest in daily activities reported',
    },
    {
      domain: 'Anxiety',
      label: 'Anxiety',
      specificity: 'Medium',
      impact: 'High',
      control: 6,
      frequency: 7,
      duration: '4 weeks',
      clinicalNotes:
        'Social avoidance, panic episodes, persistent nervousness',
    },
    {
      domain: 'Anger',
      label: 'Anger',
      specificity: 'Medium',
      impact: 'Moderate',
      control: 4,
      frequency: 5,
      duration: '1 week',
      clinicalNotes:
        'Irritability and frustration in social and work contexts',
    },
    {
      domain: 'Sleep Problems',
      label: 'Sleep Problems',
      specificity: 'Medium',
      impact: 'Moderate',
      control: 5,
      frequency: 6,
      duration: '3 weeks',
      clinicalNotes:
        'Difficulty falling asleep, frequent waking during night',
    },
    {
      domain: 'Somatic Symptoms',
      label: 'Somatic Symptoms',
      specificity: 'Low',
      impact: 'Mild',
      control: 2,
      frequency: 3,
      duration: '3 weeks',
      clinicalNotes:
        'Intermittent headaches without identifiable medical cause',
    },
    {
      domain: 'Memory',
      label: 'Memory',
      specificity: 'Low',
      impact: 'None',
      control: 0,
      frequency: 0,
      duration: '\u2014',
      clinicalNotes:
        'No memory concerns reported during assessment',
    },
    {
      domain: 'Repetitive Thoughts',
      label: 'Repetitive Thoughts',
      specificity: 'Low',
      impact: 'Mild',
      control: 3,
      frequency: 3,
      duration: '2 weeks',
      clinicalNotes:
        'Occasional rumination on social interactions and performance',
    },
    {
      domain: 'Personality',
      label: 'Personality',
      specificity: 'Low',
      impact: 'None',
      control: 0,
      frequency: 0,
      duration: '\u2014',
      clinicalNotes:
        'No personality functioning concerns identified',
    },
  ],
  insights: [
    {
      icon: 'alert-triangle',
      title: 'Elevated Anxiety Pattern',
      body: 'Patient demonstrates consistent anxiety across social contexts with avoidance behaviors. Responses indicate significant impairment in daily functioning.',
      source: 'Based on Q5, Q6 analysis',
      iconColor: '#D97706',
    },
    {
      icon: 'moon',
      title: 'Sleep\u2013Mood Connection',
      body: 'Moderate sleep disturbance correlates with reported depressive symptoms. Consider sleep hygiene intervention alongside mood management.',
      source: 'Based on Q1, Q11 correlation',
      iconColor: '#0D9488',
    },
    {
      icon: 'shield-check',
      title: 'Risk Assessment',
      body: 'No suicidal ideation or psychotic symptoms detected. Overall risk level assessed as low-moderate. Primary attention: anxiety management.',
      source: 'Composite analysis \u00b7 92% confidence',
      iconColor: '#0D9488',
    },
    {
      icon: 'clipboard-list',
      title: 'Recommended Next Steps',
      body: 'Consider structured CBT for anxiety with sleep-focused interventions. Schedule follow-up assessment in 4 weeks to track progress.',
      source: 'AI recommendation \u00b7 Review required',
      iconColor: '#FFB7B2',
    },
  ],
};
