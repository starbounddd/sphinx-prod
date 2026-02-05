import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Container } from './Container';

const meta: Meta<typeof Container> = {
  title: 'Shared/Layout/Container',
  component: Container,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Container>;

export const Default: Story = {
  args: {
    children: (
      <div className="rounded-lg bg-sage p-8">
        <p className="text-dark">Default container (max-width: 1280px)</p>
      </div>
    ),
  },
};

export const Narrow: Story = {
  args: {
    size: 'narrow',
    children: (
      <div className="rounded-lg bg-sage p-8">
        <p className="text-dark">Narrow container (max-width: 768px)</p>
      </div>
    ),
  },
};

export const Wide: Story = {
  args: {
    size: 'wide',
    children: (
      <div className="rounded-lg bg-sage p-8">
        <p className="text-dark">Wide container (max-width: 1440px)</p>
      </div>
    ),
  },
};

export const AllSizes: Story = {
  render: () => (
    <div className="space-y-8 py-8">
      <Container size="narrow">
        <div className="rounded-lg bg-coral/20 p-4 text-center text-dark">
          Narrow
        </div>
      </Container>
      <Container>
        <div className="rounded-lg bg-sage p-4 text-center text-dark">
          Default
        </div>
      </Container>
      <Container size="wide">
        <div className="rounded-lg bg-lavender p-4 text-center text-dark">
          Wide
        </div>
      </Container>
    </div>
  ),
};
