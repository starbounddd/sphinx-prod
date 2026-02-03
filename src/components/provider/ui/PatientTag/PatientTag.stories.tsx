import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { PatientTag } from "./PatientTag";

const meta: Meta<typeof PatientTag> = {
  title: "Provider/PatientTag",
  component: PatientTag,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof PatientTag>;

export const Primary: Story = {
  args: {
    label: "Anxiety Disorder",
    variant: "primary",
  },
};

export const Secondary: Story = {
  args: {
    label: "Motivated",
    variant: "secondary",
  },
};

export const Tertiary: Story = {
  args: {
    label: "Age 28",
    variant: "tertiary",
  },
};

export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      <PatientTag label="Depression" variant="primary" />
      <PatientTag label="Insured" variant="secondary" />
      <PatientTag label="Female" variant="tertiary" />
      <PatientTag label="PTSD" variant="primary" />
      <PatientTag label="Prior Therapy" variant="secondary" />
    </div>
  ),
};
