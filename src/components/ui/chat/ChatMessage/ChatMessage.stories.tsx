import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { ChatMessage } from './ChatMessage';

const meta: Meta<typeof ChatMessage> = {
  title: 'Shared/Chat/ChatMessage',
  component: ChatMessage,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof ChatMessage>;

export const AIMessage: Story = {
  args: {
    variant: 'ai',
    children:
      "Hello! I'm here to help you understand your mental wellness better. How are you feeling today?",
  },
};

export const UserMessage: Story = {
  args: {
    variant: 'user',
    children: "I've been feeling a bit anxious lately, especially at work.",
  },
};

export const AIWithWordAnimation: Story = {
  args: {
    variant: 'ai',
    children:
      "I understand. Let's explore what might be causing these feelings of anxiety.",
    animateWords: true,
  },
};

export const Conversation: Story = {
  render: () => (
    <div className="flex max-w-md flex-col gap-3">
      <ChatMessage variant="ai">
        Hi there! Welcome to Sphinx. I'm here to help you gain clarity on your
        mental wellness.
      </ChatMessage>
      <ChatMessage variant="user">
        Thanks! I've been having trouble sleeping lately.
      </ChatMessage>
      <ChatMessage variant="ai">
        I'm sorry to hear that. Sleep difficulties can be challenging. Can you
        tell me more about when this started?
      </ChatMessage>
    </div>
  ),
};
