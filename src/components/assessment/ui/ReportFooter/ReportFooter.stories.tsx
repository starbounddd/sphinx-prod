import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { ReportFooter } from "./ReportFooter";

const meta: Meta<typeof ReportFooter> = {
  title: "Assessment/ReportFooter",
  component: ReportFooter,
  parameters: {
    layout: "padded",
    backgrounds: { default: "cream" },
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof ReportFooter>;

export const Inline: Story = {
  args: {
    variant: "inline",
    onFindProvider: () => console.log("Find provider"),
    onSaveToJournal: () => console.log("Save to journal"),
  },
  decorators: [
    (Story) => (
      <div className="mx-auto max-w-sm">
        <Story />
      </div>
    ),
  ],
};

export const Sticky: Story = {
  args: {
    variant: "sticky",
    onFindProvider: () => console.log("Find provider"),
    onSaveToJournal: () => console.log("Save to journal"),
  },
  parameters: {
    layout: "fullscreen",
  },
  decorators: [
    (Story) => (
      <div className="relative min-h-[300px]">
        <div className="h-[200px]" />
        <Story />
      </div>
    ),
  ],
};
