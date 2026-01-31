import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { ProviderHeader } from "./ProviderHeader";

const meta: Meta<typeof ProviderHeader> = {
  title: "Provider/ProviderHeader",
  component: ProviderHeader,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof ProviderHeader>;

export const Default: Story = {
  args: {
    title: "Incoming Referrals",
    notificationCount: 3,
    showNewPatient: true,
    onNewPatient: () => console.log("New patient clicked"),
  },
};

export const NoNotifications: Story = {
  args: {
    title: "Patient Schedule",
    notificationCount: 0,
    showNewPatient: true,
    onNewPatient: () => console.log("New patient clicked"),
  },
};

export const WithoutNewPatientButton: Story = {
  args: {
    title: "Settings",
    notificationCount: 1,
    showNewPatient: false,
  },
};
