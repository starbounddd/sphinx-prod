import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { ProviderNavbar } from "./ProviderNavbar";

const meta: Meta<typeof ProviderNavbar> = {
  title: "Provider/ProviderNavbar",
  component: ProviderNavbar,
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <div className="w-full rounded-lg bg-white p-4">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof ProviderNavbar>;

export const Default: Story = {
  args: {
    activeTab: "patients",
    providerName: "Dr. Chen",
  },
};

export const DashboardActive: Story = {
  args: {
    activeTab: "dashboard",
    providerName: "Dr. Smith",
  },
};

export const PatientsActive: Story = {
  args: {
    activeTab: "patients",
    providerName: "Dr. Johnson",
  },
};
