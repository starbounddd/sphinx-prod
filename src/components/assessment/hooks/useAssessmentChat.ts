'use client';

import { useState, useCallback } from 'react';
import type { ChatMessage, AssessmentState } from '../types';

// Initial AI message
const INITIAL_MESSAGES: ChatMessage[] = [
  {
    id: '1',
    role: 'ai',
    content:
      "Hi there. I'm here to help you understand what you're feeling. There's no rush, and nothing you say is wrong.",
    timestamp: new Date(),
  },
  {
    id: '2',
    role: 'ai',
    content:
      "Can you tell me what's been on your mind lately? Even if it's unclear or hard to put into words.",
    timestamp: new Date(),
    quickReplies: ['I feel overwhelmed', "I'm anxious", "I don't know"],
  },
];

// Mock AI responses - in production, this would call an API
const AI_RESPONSES: Record<
  string,
  { content: string; quickReplies?: string[] }
> = {
  'I feel overwhelmed': {
    content:
      "I hear you. When you say you feel 'stuck', does it feel more like a lack of motivation, or a fear of moving forward?",
    quickReplies: ["It's physical", "It's mental", "I don't know"],
  },
  "I'm anxious": {
    content:
      'Thank you for sharing that. Can you tell me more about when these feelings of anxiety started?',
    quickReplies: ['Recently', 'A few months ago', "It's always been there"],
  },
  "I don't know": {
    content:
      "That's completely okay. Sometimes feelings are hard to name. Let me ask a different way - what's been different about your days lately?",
    quickReplies: ['Sleep issues', 'Work stress', 'Relationships'],
  },
  default: {
    content:
      'Thank you for sharing that with me. Can you tell me more about how that affects your daily life?',
    quickReplies: ["It's very disruptive", 'Somewhat', 'Not much'],
  },
};

export function useAssessmentChat() {
  const [state, setState] = useState<AssessmentState>({
    messages: INITIAL_MESSAGES,
    isThinking: false,
    currentStep: 1,
    isComplete: false,
  });

  const [inputValue, setInputValue] = useState('');

  // Get current quick replies from the last AI message
  const currentQuickReplies =
    state.messages.filter((m) => m.role === 'ai').at(-1)?.quickReplies ?? [];

  const sendMessage = useCallback(
    (content: string) => {
      if (!content.trim() || state.isThinking) return;

      // Add user message
      const userMessage: ChatMessage = {
        id: `user-${Date.now()}`,
        role: 'user',
        content: content.trim(),
        timestamp: new Date(),
      };

      setState((prev) => ({
        ...prev,
        messages: [...prev.messages, userMessage],
        isThinking: true,
      }));

      setInputValue('');

      // Simulate AI thinking delay
      setTimeout(() => {
        const response = AI_RESPONSES[content.trim()] ?? AI_RESPONSES.default;

        const aiMessage: ChatMessage = {
          id: `ai-${Date.now()}`,
          role: 'ai',
          content: response.content,
          timestamp: new Date(),
          quickReplies: response.quickReplies,
        };

        setState((prev) => ({
          ...prev,
          messages: [...prev.messages, aiMessage],
          isThinking: false,
          currentStep: prev.currentStep + 1,
          // Complete after 5 exchanges for demo
          isComplete: prev.currentStep >= 4,
        }));
      }, 1500);
    },
    [state.isThinking]
  );

  const handleQuickReply = useCallback(
    (option: string) => {
      sendMessage(option);
    },
    [sendMessage]
  );

  const handleSend = useCallback(() => {
    sendMessage(inputValue);
  }, [inputValue, sendMessage]);

  return {
    messages: state.messages,
    isThinking: state.isThinking,
    isComplete: state.isComplete,
    currentStep: state.currentStep,
    inputValue,
    setInputValue,
    currentQuickReplies,
    handleQuickReply,
    handleSend,
  };
}
