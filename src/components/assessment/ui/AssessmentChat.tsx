'use client';

import { type JSX, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ShieldCheck } from 'lucide-react';
import { ChatInput } from '@/components/ui/chat';
import { AssessmentHeader } from './AssessmentHeader';
import { ChatSidebar } from './ChatSidebar';
import { ChatMessageList } from './ChatMessageList';
import { ThinkingIndicator } from './ThinkingIndicator';
import { QuickReplyBar } from './QuickReplyBar';
import { useAssessmentChat } from '../hooks/useAssessmentChat';
import { cn } from '@/lib/utils';

interface AssessmentChatProps {
  className?: string;
}

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
    remainingMs,
    forceEnd,
  } = useAssessmentChat();

  const router = useRouter();

  useEffect(() => {
    if (isComplete && dataPersisted) {
      router.push('/assessment/report');
    }
  }, [isComplete, dataPersisted, router]);

  return (
    <div
      className={cn(
        'relative flex h-screen overflow-hidden bg-white',
        className,
      )}
    >
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
          remainingMs={remainingMs}
          onEndSession={forceEnd}
        />

        {/* Messages area */}
        <ChatMessageList messages={messages} className="flex-1" />

        {/* Bottom area: chips + input + hint */}
        <div className="flex shrink-0 flex-col gap-2.5 border-t border-[#E7E5E4] bg-cream px-10 pb-6 pt-4">
          {/* Suggestion chips */}
          {!isThinking && currentQuickReplies.length > 0 && (
            <QuickReplyBar
              options={currentQuickReplies}
              onSelect={handleQuickReply}
            />
          )}

          {/* Input row or thinking indicator */}
          {isThinking ? (
            <ThinkingIndicator />
          ) : (
            <ChatInput
              value={inputValue}
              onChange={setInputValue}
              onSend={handleSend}
              placeholder="Type your response..."
            />
          )}

          {/* Hint / disclaimer */}
          <div className="flex w-full items-center justify-center gap-1.5">
            <ShieldCheck className="h-3.5 w-3.5 text-[#78716C80]" />
            <span className="text-[11px] font-body text-muted-foreground">
              Your responses are confidential and encrypted. Press Enter to
              send.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
