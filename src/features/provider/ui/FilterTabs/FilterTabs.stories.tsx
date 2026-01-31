import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { useState } from "react";
import { FilterTabs } from "./FilterTabs";

const meta: Meta<typeof FilterTabs> = {
  title: "Provider/FilterTabs",
  component: FilterTabs,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof FilterTabs>;

const FILTER_TABS = [
  { id: "all", label: "All Referrals" },
  { id: "high-risk", label: "High Risk" },
  { id: "anxiety", label: "Anxiety Disorders" },
  { id: "depression", label: "Depression" },
];

export const Default: Story = {
  args: {
    tabs: FILTER_TABS,
    activeTab: "all",
    onTabChange: () => {},
  },
};

export const HighRiskSelected: Story = {
  args: {
    tabs: FILTER_TABS,
    activeTab: "high-risk",
    onTabChange: () => {},
  },
};

// Interactive story with state
function InteractiveFilterTabs() {
  const [activeTab, setActiveTab] = useState("all");
  return (
    <FilterTabs
      tabs={FILTER_TABS}
      activeTab={activeTab}
      onTabChange={setActiveTab}
    />
  );
}

export const Interactive: Story = {
  render: () => <InteractiveFilterTabs />,
};
