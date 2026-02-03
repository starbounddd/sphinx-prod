import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Heart, Stethoscope } from "lucide-react";
import { FeatureGrid } from "./FeatureGrid";
import { FeatureCard } from "./FeatureCard";

const meta: Meta<typeof FeatureGrid> = {
  title: "Landing/FeatureGrid",
  component: FeatureGrid,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof FeatureGrid>;

export const Default: Story = {};

// Individual FeatureCard stories
export const LightCard: StoryObj<typeof FeatureCard> = {
  render: () => (
    <div className="max-w-md p-8">
      <FeatureCard
        icon={<Heart className="h-12 w-12 text-coral" strokeWidth={1.5} />}
        title="For You"
        description={<>Get clarity on what you&apos;re feeling.<br />No diagnosis, no pressure—just understanding.</>}
        features={[
          "Anonymous and private conversations",
          "Clear, structured mental health reports",
          "Guidance to the right support resources",
        ]}
        variant="light"
      />
    </div>
  ),
};

export const DarkCard: StoryObj<typeof FeatureCard> = {
  render: () => (
    <div className="max-w-md p-8">
      <FeatureCard
        icon={<Stethoscope className="h-12 w-12 text-coral" strokeWidth={1.5} />}
        title="For Providers"
        description={<>Receive pre-structured patient intake data.<br />Spend less time on paperwork, more time on care.</>}
        features={[
          "Structured symptom data before first session",
          "Reduce intake time by 40%",
          "HIPAA-compliant integration options",
        ]}
        variant="dark"
      />
    </div>
  ),
};
