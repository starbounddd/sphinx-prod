import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Section } from './Section';
import { Container } from '../Container';

const meta: Meta<typeof Section> = {
  title: 'Shared/Layout/Section',
  component: Section,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Section>;

export const Default: Story = {
  args: {
    children: (
      <Container>
        <p>Default section with cream background</p>
      </Container>
    ),
  },
};

export const Dark: Story = {
  args: {
    variant: 'dark',
    children: (
      <Container>
        <p>Dark section with dark background</p>
      </Container>
    ),
  },
};

export const Muted: Story = {
  args: {
    variant: 'muted',
    children: (
      <Container>
        <p>Muted section with lavender background</p>
      </Container>
    ),
  },
};

export const Gradient: Story = {
  args: {
    variant: 'gradient',
    children: (
      <Container>
        <p>Gradient section (sage to lavender)</p>
      </Container>
    ),
  },
};

export const AllVariants: Story = {
  render: () => (
    <div>
      <Section variant="default" spacing="sm">
        <Container>
          <p className="text-center font-semibold">Default</p>
        </Container>
      </Section>
      <Section variant="dark" spacing="sm">
        <Container>
          <p className="text-center font-semibold">Dark</p>
        </Container>
      </Section>
      <Section variant="muted" spacing="sm">
        <Container>
          <p className="text-center font-semibold">Muted</p>
        </Container>
      </Section>
      <Section variant="gradient" spacing="sm">
        <Container>
          <p className="text-center font-semibold">Gradient</p>
        </Container>
      </Section>
    </div>
  ),
};
