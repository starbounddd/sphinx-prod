import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { PhoneShowcase } from "./PhoneShowcase";

const meta: Meta<typeof PhoneShowcase> = {
  title: "Landing/PhoneShowcase",
  component: PhoneShowcase,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof PhoneShowcase>;

export const Default: Story = {};
