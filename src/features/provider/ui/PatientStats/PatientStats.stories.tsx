import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { PatientStats } from "./PatientStats";

const meta: Meta<typeof PatientStats> = {
  title: "Provider/PatientStats",
  component: PatientStats,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <div className="w-[600px]">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof PatientStats>;

export const Default: Story = {
  args: {
    duration: "3 months",
    intensity: "Moderate",
    onset: "Gradual",
  },
};

export const AcuteCase: Story = {
  args: {
    duration: "2 weeks",
    intensity: "Severe",
    onset: "Sudden",
  },
};

export const ChronicCase: Story = {
  args: {
    duration: "2+ years",
    intensity: "Mild",
    onset: "Childhood",
  },
};
