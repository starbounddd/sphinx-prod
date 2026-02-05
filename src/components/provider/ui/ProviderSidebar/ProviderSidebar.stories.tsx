import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { ProviderSidebar } from './ProviderSidebar';

const meta: Meta<typeof ProviderSidebar> = {
  title: 'Provider/ProviderSidebar',
  component: ProviderSidebar,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div style={{ height: '100vh', display: 'flex' }}>
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof ProviderSidebar>;

export const Dashboard: Story = {
  args: {
    activeTab: 'dashboard',
    inboxCount: 3,
    providerName: 'Dr. Smith',
    providerRole: 'Psychiatrist',
  },
};

export const Inbox: Story = {
  args: {
    activeTab: 'inbox',
    inboxCount: 5,
    providerName: 'Dr. Chen',
    providerRole: 'Psychologist',
  },
};

export const Patients: Story = {
  args: {
    activeTab: 'patients',
    inboxCount: 0,
    providerName: 'Dr. Johnson',
    providerRole: 'Therapist',
  },
};

export const WithAvatar: Story = {
  args: {
    activeTab: 'dashboard',
    inboxCount: 2,
    providerName: 'Dr. Williams',
    providerRole: 'Clinical Psychologist',
    providerAvatar:
      'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=100&h=100&fit=crop&crop=face',
  },
};
