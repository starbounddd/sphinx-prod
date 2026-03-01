'use client';

import { useReducer, useCallback, useEffect, useRef, useMemo } from 'react';
import type { ChatMessage } from '../types';

/* ==========================================================================
   Constants
   ========================================================================== */

const SESSION_DURATION_MS = 20 * 60 * 1000; // 20 minutes

/* ==========================================================================
   State & Action Types
   ========================================================================== */

interface ChatState {
  // Core chat state
  messages: ChatMessage[];
  isThinking: boolean;
  currentStep: number;
  isComplete: boolean;
  // Input
  inputValue: string;
  // Session state
  isInitialized: boolean;
  dataPersisted: boolean;
  // Domain tracking
  domainStatuses: Record<string, string>;
  currentDomain: string | null;
  // Report
  report: unknown;
  // Timer
  remainingMs: number;
}

type ChatAction =
  | { type: 'SET_INPUT'; value: string }
  | { type: 'START_THINKING' }
  | { type: 'STOP_THINKING' }
  | { type: 'ADD_USER_MESSAGE'; message: ChatMessage }
  | { type: 'RECEIVE_AI_MESSAGE'; message: ChatMessage; questionCount: number; isComplete: boolean }
  | { type: 'INITIALIZE_SUCCESS'; message: ChatMessage; questionCount: number; isComplete: boolean; domainStatuses: Record<string, string>; currentDomain: string | null }
  | { type: 'UPDATE_DOMAIN_STATE'; domainStatuses: Record<string, string>; currentDomain: string | null }
  | { type: 'SET_REPORT'; report: unknown }
  | { type: 'COMPLETE_SESSION' }
  | { type: 'MARK_PERSISTED' }
  | { type: 'UPDATE_TIMER'; remainingMs: number };

/* ==========================================================================
   Reducer
   ========================================================================== */

function chatReducer(state: ChatState, action: ChatAction): ChatState {
  switch (action.type) {
    case 'SET_INPUT':
      return { ...state, inputValue: action.value };

    case 'START_THINKING':
      return { ...state, isThinking: true };

    case 'STOP_THINKING':
      return { ...state, isThinking: false };

    case 'ADD_USER_MESSAGE':
      return {
        ...state,
        messages: [...state.messages, action.message],
        isThinking: true,
        inputValue: '',
      };

    case 'RECEIVE_AI_MESSAGE':
      return {
        ...state,
        messages: [...state.messages, action.message],
        isThinking: false,
        currentStep: action.questionCount,
        isComplete: action.isComplete,
      };

    case 'INITIALIZE_SUCCESS':
      return {
        ...state,
        messages: [action.message],
        isThinking: false,
        currentStep: action.questionCount,
        isComplete: action.isComplete,
        isInitialized: true,
        domainStatuses: action.domainStatuses,
        currentDomain: action.currentDomain,
      };

    case 'UPDATE_DOMAIN_STATE':
      return {
        ...state,
        domainStatuses: action.domainStatuses,
        currentDomain: action.currentDomain,
      };

    case 'SET_REPORT':
      return { ...state, report: action.report };

    case 'COMPLETE_SESSION':
      return { ...state, isComplete: true, isThinking: false };

    case 'MARK_PERSISTED':
      return { ...state, dataPersisted: true };

    case 'UPDATE_TIMER':
      return { ...state, remainingMs: action.remainingMs };

    default:
      return state;
  }
}

/* ==========================================================================
   Initial State Factory
   ========================================================================== */

function createInitialState(): ChatState {
  return {
    messages: [],
    isThinking: false,
    currentStep: 1,
    isComplete: false,
    inputValue: '',
    isInitialized: false,
    dataPersisted: false,
    domainStatuses: {},
    currentDomain: null,
    report: null,
    remainingMs: SESSION_DURATION_MS,
  };
}

/* ==========================================================================
   Hook
   ========================================================================== */

export function useAssessmentChat() {
  const [state, dispatch] = useReducer(chatReducer, null, createInitialState);
  const threadId = useMemo(() => crypto.randomUUID(), []);

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const startTimeRef = useRef<number | null>(null);
  const endingRef = useRef(false);

  // ------------------------------------------------------------------
  // Start the countdown timer once initialized
  // ------------------------------------------------------------------
  useEffect(() => {
    if (!state.isInitialized || state.isComplete) return;

    startTimeRef.current = Date.now();
    timerRef.current = setInterval(() => {
      const elapsed = Date.now() - (startTimeRef.current ?? Date.now());
      const left = Math.max(0, SESSION_DURATION_MS - elapsed);
      dispatch({ type: 'UPDATE_TIMER', remainingMs: left });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [state.isInitialized, state.isComplete]);

  // ------------------------------------------------------------------
  // End session: request a partial report from the backend
  // ------------------------------------------------------------------
  const endSession = useCallback(async () => {
    if (endingRef.current) return;
    endingRef.current = true;
    if (timerRef.current) clearInterval(timerRef.current);

    dispatch({ type: 'START_THINKING' });

    try {
      const res = await fetch('/api/assessment/chat/end', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ threadId }),
      });

      const data = await res.json();
      if (data.success && data.message.report) {
        dispatch({ type: 'SET_REPORT', report: data.message.report });
      }
    } catch (err) {
      console.error('Failed to generate partial report:', err);
    }

    dispatch({ type: 'COMPLETE_SESSION' });
  }, [threadId]);

  // Auto-end when timer reaches zero
  useEffect(() => {
    if (state.remainingMs <= 0 && state.isInitialized && !state.isComplete) {
      endSession();
    }
  }, [state.remainingMs, state.isInitialized, state.isComplete, endSession]);

  // ------------------------------------------------------------------
  // Persist report to sessionStorage when assessment completes,
  // so the report page can read it after navigation.
  // ------------------------------------------------------------------
  useEffect(() => {
    if (!state.isComplete || state.dataPersisted) return;

    if (state.report) {
      try {
        sessionStorage.setItem('sphinx_chat_report', JSON.stringify(state.report));
      } catch {
        // sessionStorage may be full or unavailable
      }
    }

    dispatch({ type: 'MARK_PERSISTED' });
  }, [state.isComplete, state.dataPersisted, state.report]);

  // ------------------------------------------------------------------
  // Init: call the API (reads screening answers from DB)
  // ------------------------------------------------------------------
  useEffect(() => {
    if (state.isInitialized) return;
    initAssessment();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function initAssessment() {
    dispatch({ type: 'START_THINKING' });

    try {
      const res = await fetch('/api/assessment/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ threadId }),  // No screeningAnswers
      });

      const data = await res.json();

      if (!res.ok) {
        console.error('[initAssessment] API error:', data.error);
        dispatch({ type: 'STOP_THINKING' });
        return;
      }

      if (data.success) {
        const aiMsg: ChatMessage = {
          id: `ai-${Date.now()}`,
          role: 'ai',
          content: data.message.content,
          timestamp: new Date(),
          quickReplies: data.message.quickReplies,
        };

        dispatch({
          type: 'INITIALIZE_SUCCESS',
          message: aiMsg,
          questionCount: data.message.questionCount || 1,
          isComplete: data.message.isComplete,
          domainStatuses: data.message.domainStatuses || {},
          currentDomain: data.message.currentDomain,
        });
      }
    } catch (error) {
      console.error('Failed to initialize assessment:', error);
      dispatch({ type: 'STOP_THINKING' });
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

    dispatch({ type: 'ADD_USER_MESSAGE', message: userMsg });

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

        dispatch({
          type: 'RECEIVE_AI_MESSAGE',
          message: aiMsg,
          questionCount: data.message.questionCount,
          isComplete: data.message.isComplete,
        });

        dispatch({
          type: 'UPDATE_DOMAIN_STATE',
          domainStatuses: data.message.domainStatuses || {},
          currentDomain: data.message.currentDomain,
        });

        if (data.message.report) {
          dispatch({ type: 'SET_REPORT', report: data.message.report });
        }
      }
    } catch (error) {
      console.error('Failed to send message:', error);
      dispatch({ type: 'STOP_THINKING' });
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
    () => sendMessageRef.current(state.inputValue),
    [state.inputValue]
  );

  const setInputValue = useCallback((value: string) => {
    dispatch({ type: 'SET_INPUT', value });
  }, []);

  const currentQuickReplies =
    state.messages.filter((m) => m.role === 'ai').at(-1)?.quickReplies ?? [];

  return {
    // Core chat state
    messages: state.messages,
    isThinking: state.isThinking,
    isComplete: state.isComplete,
    currentStep: state.currentStep,
    // Input
    inputValue: state.inputValue,
    setInputValue,
    currentQuickReplies,
    // Handlers
    handleQuickReply,
    handleSend,
    // Domain state
    domainStatuses: state.domainStatuses,
    currentDomain: state.currentDomain,
    // Report
    report: state.report,
    // Session
    threadId,
    isInitialized: state.isInitialized,
    dataPersisted: state.dataPersisted,
    // Timer
    remainingMs: state.remainingMs,
    endSession,
  };
}
