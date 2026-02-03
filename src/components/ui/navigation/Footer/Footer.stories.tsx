import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Footer } from "./Footer";

const meta: Meta<typeof Footer> = {
  title: "Shared/Navigation/Footer",
  component: Footer,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof Footer>;

export const Default: Story = {};

export const InContext: Story = {
  render: () => (
    <div className="min-h-screen bg-cream">
      <main className="p-8">
        <h1 className="text-4xl font-bold text-dark">Page Content</h1>
        <p className="mt-4 text-gray">Some content before the footer.</p>
      </main>
      <Footer />
    </div>
  ),
};
