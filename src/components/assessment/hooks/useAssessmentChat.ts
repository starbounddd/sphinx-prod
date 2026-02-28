'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import type { ChatMessage, AssessmentState } from '../types';

const SESSION_DURATION_MS = 20 * 60 * 1000; // 20 minutes

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

  // 20-minute countdown timer
  const [remainingMs, setRemainingMs] = useState(SESSION_DURATION_MS);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const startTimeRef = useRef<number | null>(null);

  // ------------------------------------------------------------------
  // Start the countdown timer once initialized
  // ------------------------------------------------------------------
  useEffect(() => {
    if (!isInitialized || state.isComplete) return;

    startTimeRef.current = Date.now();
    timerRef.current = setInterval(() => {
      const elapsed = Date.now() - (startTimeRef.current ?? Date.now());
      const left = Math.max(0, SESSION_DURATION_MS - elapsed);
      setRemainingMs(left);
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isInitialized, state.isComplete]);

  // ------------------------------------------------------------------
  // Force-end the session (timer expiry or manual End Session)
  // ------------------------------------------------------------------
  const forceEnd = useCallback(() => {
    if (state.isComplete) return;
    if (timerRef.current) clearInterval(timerRef.current);

    setState((prev) => ({ ...prev, isComplete: true, isThinking: false }));
  }, [state.isComplete]);

  // Auto-end when timer reaches zero
  useEffect(() => {
    if (remainingMs <= 0 && isInitialized && !state.isComplete) {
      forceEnd();
    }
  }, [remainingMs, isInitialized, state.isComplete, forceEnd]);

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

    let screeningAnswers: Record<string, number>;
    try {
      screeningAnswers = JSON.parse(stored);
    } catch {
      console.error('Invalid screening data in localStorage');
      return;
    }
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
  // Convenience handlers (ref avoids stale closures)
  // ------------------------------------------------------------------
  const sendMessageRef = useRef(sendMessage);
  sendMessageRef.current = sendMessage;

  const handleQuickReply = useCallback(
    (option: string) => sendMessageRef.current(option),
    []
  );

  const handleSend = useCallback(
    () => sendMessageRef.current(inputValue),
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
    // Timer + end session
    remainingMs,
    forceEnd,
  };
}
