"use client";

import type { JSX } from "react";
import { useRouter } from "next/navigation";
import { ChatInput } from "@/shared/ui/chat";
import { AssessmentHeader } from "../AssessmentHeader";
import { ChatMessageList } from "../ChatMessageList";
import { ThinkingIndicator } from "../ThinkingIndicator";
import { QuickReplyBar } from "../QuickReplyBar";
import { useAssessmentChat } from "../../hooks";
import { cn } from "@/lib/utils";

interface AssessmentChatProps {
  className?: string;
}

/**
 * Main assessment chat container
 * Uses 1:2:1 grid layout for messages (AI left, empty middle, User right)
 * Features decorative corner elements
 */
export function AssessmentChat({ className }: AssessmentChatProps): JSX.Element {
  const router = useRouter();
  const {
    messages,
    isThinking,
    isComplete,
    inputValue,
    setInputValue,
    currentQuickReplies,
    handleQuickReply,
    handleSend,
  } = useAssessmentChat();

  // Navigate to report when assessment is complete
  if (isComplete) {
    router.push("/assessment/report");
  }

  return (
    <div className={cn("relative flex h-screen flex-col overflow-hidden", className)}>
      {/* Decorative corner flourishes */}
      <div className="corner-flourish top-left" />
      <div className="corner-flourish bottom-right" />

      {/* Header */}
      <AssessmentHeader />

      {/* Messages area - full width with 1:2:1 grid inside */}
      <div className="relative z-10 flex-1 overflow-y-auto">
        <ChatMessageList messages={messages} className="py-6" />

        {/* Thinking indicator - centered */}
        {isThinking && (
          <div className="flex justify-center px-6 py-4">
            <ThinkingIndicator />
          </div>
        )}
      </div>

      {/* Bottom bar with input - centered layout */}
      <div className="relative z-10 bg-linear-to-t from-cream via-cream/95 to-cream/0 pb-8 pt-6">
        {/* Quick replies - centered */}
        {!isThinking && currentQuickReplies.length > 0 && (
          <QuickReplyBar
            options={currentQuickReplies}
            onSelect={handleQuickReply}
            className="justify-center pb-5"
          />
        )}

        {/* Centered input container with glow effect */}
        <div className="mx-auto max-w-xl px-6">
          <ChatInput
            value={inputValue}
            onChange={setInputValue}
            onSend={handleSend}
            disabled={isThinking}
            placeholder="Share what's on your mind..."
            className="input-glow"
          />
        </div>
      </div>
    </div>
  );
}
