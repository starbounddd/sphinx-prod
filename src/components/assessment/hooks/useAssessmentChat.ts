'use client';

import { useState, useCallback, useEffect } from 'react';
import type { ChatMessage, AssessmentState } from '../types';

export function useAssessmentChat() {
  const [state, setState] = useState<AssessmentState>({
    messages: [],
    isThinking: false,
    currentStep: 1,
    isComplete: false,
  });

  const [inputValue, setInputValue] = useState('');
  const [threadId] = useState(() => crypto.randomUUID());
  const [isInitialized, setIsInitialized] = useState(false);
  const [domainStatuses, setDomainStatuses] = useState<Record<string, string>>(
    {}
  );
  const [currentDomain, setCurrentDomain] = useState<string | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [report, setReport] = useState<any>(null);
  const [dataPersisted, setDataPersisted] = useState(false);

  // ------------------------------------------------------------------
  // Persist chat data to localStorage when assessment completes
  // ------------------------------------------------------------------
  useEffect(() => {
    if (!state.isComplete || dataPersisted) return;

    try {
      localStorage.setItem(
        'sphinx_chat_messages',
        JSON.stringify(state.messages)
      );
      if (report) {
        localStorage.setItem('sphinx_chat_report', JSON.stringify(report));
      }
      localStorage.setItem(
        'sphinx_assessment_metadata',
        JSON.stringify({
          threadId,
          completedAt: new Date().toISOString(),
          totalQuestions: state.currentStep,
          domainStatuses,
        })
      );
      setDataPersisted(true);
    } catch (err) {
      console.error('Failed to persist assessment data:', err);
      setDataPersisted(true); // still allow redirect
    }
  }, [state.isComplete, state.messages, state.currentStep, report, domainStatuses, threadId, dataPersisted]);

  // ------------------------------------------------------------------
  // Init: read screening answers from localStorage and call the API
  // ------------------------------------------------------------------
  useEffect(() => {
    if (isInitialized) return;

    const stored = localStorage.getItem('sphinx_screening_answers');
    if (!stored) return; // no screening data yet

    const screeningAnswers: Record<string, number> = JSON.parse(stored);
    initAssessment(screeningAnswers);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isInitialized]);

  async function initAssessment(screeningAnswers: Record<string, number>) {
    setState((prev) => ({ ...prev, isThinking: true }));

    try {
      const res = await fetch('/api/assessment/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ threadId, screeningAnswers }),
      });

      const data = await res.json();

      if (data.success) {
        const aiMsg: ChatMessage = {
          id: `ai-${Date.now()}`,
          role: 'ai',
          content: data.message.content,
          timestamp: new Date(),
          quickReplies: data.message.quickReplies,
        };

        setState((prev) => ({
          ...prev,
          messages: [aiMsg],
          isThinking: false,
          currentStep: data.message.questionCount || 1,
          isComplete: data.message.isComplete,
        }));

        setDomainStatuses(data.message.domainStatuses || {});
        setCurrentDomain(data.message.currentDomain);
        setIsInitialized(true);
      }
    } catch (error) {
      console.error('Failed to initialize assessment:', error);
      setState((prev) => ({ ...prev, isThinking: false }));
    }
  }

  // ------------------------------------------------------------------
  // Send a user message and receive an AI reply
  // ------------------------------------------------------------------
  async function sendMessage(content: string) {
    if (!content.trim() || state.isThinking) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: content.trim(),
      timestamp: new Date(),
    };

    setState((prev) => ({
      ...prev,
      messages: [...prev.messages, userMsg],
      isThinking: true,
    }));

    setInputValue('');

    try {
      const res = await fetch('/api/assessment/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ threadId, message: content.trim() }),
      });

      const data = await res.json();

      if (data.success) {
        const aiMsg: ChatMessage = {
          id: `ai-${Date.now()}`,
          role: 'ai',
          content: data.message.content,
          timestamp: new Date(),
          quickReplies: data.message.quickReplies,
        };

        setState((prev) => ({
          ...prev,
          messages: [...prev.messages, aiMsg],
          isThinking: false,
          currentStep: data.message.questionCount,
          isComplete: data.message.isComplete,
        }));

        setDomainStatuses(data.message.domainStatuses || {});
        setCurrentDomain(data.message.currentDomain);
        if (data.message.report) setReport(data.message.report);
      }
    } catch (error) {
      console.error('Failed to send message:', error);
      setState((prev) => ({ ...prev, isThinking: false }));
    }
  }

  // ------------------------------------------------------------------
  // Convenience handlers
  // ------------------------------------------------------------------
  const handleQuickReply = useCallback(
    (option: string) => sendMessage(option),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const handleSend = useCallback(
    () => sendMessage(inputValue),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [inputValue]
  );

  const currentQuickReplies =
    state.messages.filter((m) => m.role === 'ai').at(-1)?.quickReplies ?? [];

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
    // New fields for sidebar / header
    domainStatuses,
    currentDomain,
    report,
    threadId,
    isInitialized,
    dataPersisted,
  };
}
