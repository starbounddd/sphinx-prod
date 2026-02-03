import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Navbar } from "./Navbar";

const meta: Meta<typeof Navbar> = {
  title: "Shared/Navigation/Navbar",
  component: Navbar,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof Navbar>;

export const Default: Story = {
  decorators: [
    (Story) => (
      <div className="h-[200px] bg-cream">
        <Story />
      </div>
    ),
  ],
};

export const WithContent: Story = {
  render: () => (
    <div className="min-h-screen bg-cream">
      <Navbar />
      <main className="pt-32">
        <div className="mx-auto max-w-4xl px-8">
          <h1 className="text-4xl font-bold text-dark">Page Content</h1>
          <p className="mt-4 text-gray">
            The navbar is fixed at the top with a frosted glass effect.
          </p>
        </div>
      </main>
    </div>
  ),
};
