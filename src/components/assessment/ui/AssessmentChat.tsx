'use client';

import { type JSX, useEffect } from 'react';
import { ChatInput } from '@/components/ui/chat';
import { AssessmentHeader } from './AssessmentHeader';
import { ChatSidebar } from './ChatSidebar';
import { ChatMessageList } from './ChatMessageList';
import { ThinkingIndicator } from './ThinkingIndicator';
import { QuickReplyBar } from './QuickReplyBar';
import { ChatDisclaimer } from './ChatDisclaimer';
import { useAssessmentChat } from '../hooks/useAssessmentChat';
import { cn } from '@/lib/utils';

interface AssessmentChatProps {
  className?: string;
}

/**
 * Main assessment chat page layout.
 *
 * Structure:
 *   4px top accent gradient bar
 *   flex row [ 280px sidebar | main chat area ]
 *
 * Matches the Pencil design (node FrXME).
 */
export function AssessmentChat({
  className,
}: AssessmentChatProps): JSX.Element {
  const {
    messages,
    isThinking,
    isComplete,
    currentStep,
    inputValue,
    setInputValue,
    currentQuickReplies,
    handleQuickReply,
    handleSend,
    domainStatuses,
    currentDomain,
    dataPersisted,
  } = useAssessmentChat();

  // Navigate to report after data has been persisted to localStorage
  useEffect(() => {
    if (isComplete && dataPersisted) {
      window.location.assign('/assessment/report');
    }
  }, [isComplete, dataPersisted]);

  return (
    <div
      className={cn(
        'relative flex h-screen flex-col overflow-hidden bg-white',
        className,
      )}
    >
      {/* 4px accent gradient bar */}
      <div className="h-1 w-full shrink-0 bg-linear-to-r from-[#0D9488] to-[#FFB7B2]" />

      {/* Main layout: sidebar + chat area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left sidebar */}
        <ChatSidebar
          domainStatuses={domainStatuses}
          currentDomain={currentDomain}
          questionCount={currentStep}
        />

        {/* Main chat area */}
        <div className="flex flex-1 flex-col overflow-hidden">
          {/* Header */}
          <AssessmentHeader
            currentDomain={currentDomain}
            questionCount={currentStep}
          />

          {/* Messages area */}
          <ChatMessageList messages={messages} className="flex-1" />

          {/* Thinking indicator */}
          {isThinking && (
            <div className="px-8 pb-4">
              <ThinkingIndicator />
            </div>
          )}

          {/* Bottom area: chips + input + disclaimer */}
          <div className="flex shrink-0 flex-col gap-3 border-t border-gray-200 bg-white px-8 pb-6">
            {/* Suggestion chips */}
            {!isThinking && currentQuickReplies.length > 0 && (
              <QuickReplyBar
                options={currentQuickReplies}
                onSelect={handleQuickReply}
                className="pt-3"
              />
            )}

            {/* Input row */}
            <ChatInput
              value={inputValue}
              onChange={setInputValue}
              onSend={handleSend}
              disabled={isThinking}
              placeholder="Type your response..."
            />

            {/* Disclaimer */}
            <ChatDisclaimer />
          </div>
        </div>
      </div>
    </div>
  );
}
