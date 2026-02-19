import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { PatientMatchCard } from './PatientMatchCard';

const meta: Meta<typeof PatientMatchCard> = {
  title: 'Provider/PatientMatchCard',
  component: PatientMatchCard,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div className="mx-auto max-w-2xl">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof PatientMatchCard>;

export const Default: Story = {
  args: {
    patientId: '7842',
    matchScore: 94,
    receivedAt: 'Received 2 hours ago',
    tags: [
      { label: 'Anxiety Disorder', variant: 'primary' },
      { label: 'Insured', variant: 'secondary' },
      { label: 'Age 28', variant: 'tertiary' },
    ],
    aiInsights:
      'Based on intake responses, this patient shows strong indicators for generalized anxiety disorder with comorbid insomnia. Recommend CBT-focused approach with sleep hygiene education.',
    stats: {
      duration: '3 months',
      intensity: 'Moderate',
      onset: 'Gradual',
    },
    keyContext: [
      'Previous therapy experience (CBT, 6 months)',
      'Currently on medication (Lexapro 10mg)',
      'Strong family support system',
      'Flexible work schedule for appointments',
    ],
    onAccept: () => console.log('Accepted'),
    onViewReport: () => console.log('View report'),
  },
};

export const HighMatchScore: Story = {
  args: {
    patientId: '9156',
    matchScore: 98,
    receivedAt: 'Received 30 minutes ago',
    tags: [
      { label: 'Depression', variant: 'primary' },
      { label: 'PTSD', variant: 'primary' },
      { label: 'Self-Pay', variant: 'secondary' },
    ],
    aiInsights:
      'Patient has experienced recent trauma and shows classic depression symptoms. High urgency case - recommend trauma-informed care approach.',
    stats: {
      duration: '6 weeks',
      intensity: 'Severe',
      onset: 'Sudden',
    },
    keyContext: [
      'Recent life event (job loss)',
      'No prior therapy experience',
      'Lives alone',
      'Available for immediate start',
    ],
    onAccept: () => console.log('Accepted'),
    onViewReport: () => console.log('View report'),
  },
};

export const LowerMatch: Story = {
  args: {
    patientId: '3421',
    matchScore: 72,
    receivedAt: 'Received yesterday',
    tags: [
      { label: 'Relationship Issues', variant: 'primary' },
      { label: 'Insured', variant: 'secondary' },
      { label: 'Age 45', variant: 'tertiary' },
    ],
    aiInsights:
      'Patient seeking couples therapy support. May benefit from referral to marriage and family therapist, though individual sessions could address personal coping strategies.',
    stats: {
      duration: '2 years',
      intensity: 'Mild',
      onset: 'Gradual',
    },
    keyContext: [
      'Currently in couples therapy',
      'Spouse not involved in treatment',
      'Work stress contributing factor',
    ],
    onAccept: () => console.log('Accepted'),
    onViewReport: () => console.log('View report'),
  },
};
