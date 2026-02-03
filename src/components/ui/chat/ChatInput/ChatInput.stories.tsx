import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { useState } from "react";
import { ChatInput } from "./ChatInput";

const meta: Meta<typeof ChatInput> = {
  title: "Shared/Chat/ChatInput",
  component: ChatInput,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof ChatInput>;

export const Default: Story = {
  args: {
    value: "",
    onChange: () => {},
    onSend: () => {},
    placeholder: "Type your message...",
  },
};

export const WithValue: Story = {
  args: {
    value: "I've been feeling stressed lately",
    onChange: () => {},
    onSend: () => {},
  },
};

export const Disabled: Story = {
  args: {
    value: "",
    onChange: () => {},
    onSend: () => {},
    disabled: true,
    placeholder: "Please wait...",
  },
};

// Interactive story with state
function InteractiveChatInput() {
  const [value, setValue] = useState("");
  const handleSend = () => {
    console.log("Sent:", value);
    setValue("");
  };

  return (
    <div style={{ width: "400px" }}>
      <ChatInput
        value={value}
        onChange={setValue}
        onSend={handleSend}
        placeholder="Type here and press Enter to send..."
      />
    </div>
  );
}

export const Interactive: Story = {
  render: () => <InteractiveChatInput />,
};
