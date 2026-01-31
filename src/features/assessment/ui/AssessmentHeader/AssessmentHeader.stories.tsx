import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { AssessmentHeader } from "./AssessmentHeader";

const meta: Meta<typeof AssessmentHeader> = {
  title: "Assessment/AssessmentHeader",
  component: AssessmentHeader,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof AssessmentHeader>;

export const Default: Story = {
  args: {
    title: "Sphinx Assessment",
    backHref: "/",
  },
};

export const CustomTitle: Story = {
  args: {
    title: "Clarity Check-In",
    backHref: "/dashboard",
  },
};
