'use client';

import { type JSX, useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AlertTriangle, ShieldCheck } from 'lucide-react';
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
    endSession,
  } = useAssessmentChat();

  const router = useRouter();
  const [showEndConfirm, setShowEndConfirm] = useState(false);

  const handleEndClick = useCallback(() => {
    setShowEndConfirm(true);
  }, []);

  const handleConfirmEnd = useCallback(() => {
    setShowEndConfirm(false);
    endSession();
  }, [endSession]);

  const handleCancelEnd = useCallback(() => {
    setShowEndConfirm(false);
  }, []);

  // Dismiss the confirmation dialog if endSession fires from the timer
  useEffect(() => {
    if (isThinking) setShowEndConfirm(false);
  }, [isThinking]);

  // Escape key closes the dialog
  useEffect(() => {
    if (!showEndConfirm) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setShowEndConfirm(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [showEndConfirm]);

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
          onEndSession={handleEndClick}
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

      {/* End Session confirmation dialog */}
      {showEndConfirm && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/40">
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="end-session-title"
            className="flex max-w-sm flex-col items-center gap-4 rounded-2xl border border-sage bg-white p-8 text-center shadow-lg"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-amber-50">
              <AlertTriangle className="h-6 w-6 text-amber-500" />
            </div>
            <h2 id="end-session-title" className="text-lg font-semibold text-dark">
              End Session Early?
            </h2>
            <p className="text-sm text-gray">
              The assessment is not complete yet. A partial report will be
              generated based on the information gathered so far.
            </p>
            <div className="flex w-full gap-3">
              <button
                type="button"
                onClick={handleCancelEnd}
                className="flex-1 rounded-lg border border-sage px-4 py-2.5 text-sm font-semibold text-dark transition-colors hover:bg-cream"
              >
                Continue
              </button>
              <button
                type="button"
                onClick={handleConfirmEnd}
                className="flex-1 rounded-lg bg-red-500 px-4 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90"
              >
                End Session
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
