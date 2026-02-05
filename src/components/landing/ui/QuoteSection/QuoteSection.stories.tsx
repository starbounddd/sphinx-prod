import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { QuoteSection } from './QuoteSection';

const meta: Meta<typeof QuoteSection> = {
  title: 'Landing/QuoteSection',
  component: QuoteSection,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof QuoteSection>;

export const Default: Story = {};
