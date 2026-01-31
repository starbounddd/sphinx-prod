import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { ChatMessageList } from "./ChatMessageList";
import type { ChatMessage } from "../../types";

const meta: Meta<typeof ChatMessageList> = {
  title: "Assessment/ChatMessageList",
  component: ChatMessageList,
  parameters: {
    layout: "fullscreen",
    backgrounds: { default: "cream" },
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof ChatMessageList>;

const mockMessages: ChatMessage[] = [
  {
    id: "1",
    role: "ai",
    content: "Hi there! I'm Sphinx, your mental wellness guide. How are you feeling today?",
    timestamp: new Date(),
  },
  {
    id: "2",
    role: "user",
    content: "I've been feeling a bit overwhelmed lately",
    timestamp: new Date(),
  },
  {
    id: "3",
    role: "ai",
    content: "I hear you. Feeling overwhelmed is something many people experience. Can you tell me more about what's been contributing to this feeling?",
    timestamp: new Date(),
  },
  {
    id: "4",
    role: "user",
    content: "Work has been really stressful, and I'm not sleeping well",
    timestamp: new Date(),
  },
];

export const Default: Story = {
  args: {
    messages: mockMessages,
  },
  decorators: [
    (Story) => (
      <div className="h-[500px] overflow-hidden bg-cream p-4">
        <Story />
      </div>
    ),
  ],
};

export const SingleExchange: Story = {
  args: {
    messages: mockMessages.slice(0, 2),
  },
  decorators: [
    (Story) => (
      <div className="h-[300px] overflow-hidden bg-cream p-4">
        <Story />
      </div>
    ),
  ],
};

export const AIOnly: Story = {
  args: {
    messages: [mockMessages[0]],
  },
  decorators: [
    (Story) => (
      <div className="h-[200px] overflow-hidden bg-cream p-4">
        <Story />
      </div>
    ),
  ],
};
