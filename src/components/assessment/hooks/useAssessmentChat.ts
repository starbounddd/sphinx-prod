'use client';

import { useReducer, useCallback, useEffect, useRef, useMemo } from 'react';
import type { ChatMessage } from '../types';
import { useSessionTimer } from './useSessionTimer';

/* ==========================================================================
   Constants
   ========================================================================== */

const SESSION_DURATION_SECONDS = 20 * 60; // 20 minutes

/* ==========================================================================
   Helpers
   ========================================================================== */

function createAIMessage(content: string, quickReplies?: string[]): ChatMessage {
  return {
    id: `ai-${Date.now()}`,
    role: 'ai',
    content,
    timestamp: new Date(),
    quickReplies,
  };
}

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
  | { type: 'MARK_PERSISTED' };

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
  };
}

/* ==========================================================================
   Hook
   ========================================================================== */

export function useAssessmentChat() {
  const [state, dispatch] = useReducer(chatReducer, null, createInitialState);
  const threadId = useMemo(() => crypto.randomUUID(), []);

  const endingRef = useRef(false);

  // ------------------------------------------------------------------
  // End session: request a partial report from the backend
  // ------------------------------------------------------------------
  const endSession = useCallback(async () => {
    if (endingRef.current) return;
    endingRef.current = true;

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

  // ------------------------------------------------------------------
  // Session countdown timer (delegates to useSessionTimer)
  // ------------------------------------------------------------------
  const { secondsLeft } = useSessionTimer({
    initialSeconds: SESSION_DURATION_SECONDS,
    isActive: state.isInitialized && !state.isComplete,
    onExpire: endSession,
  });

  const remainingMs = secondsLeft * 1000;

  // ------------------------------------------------------------------
  // Mark session as persisted when assessment completes.
  // Report is fetched from the DB API by the report page.
  // ------------------------------------------------------------------
  useEffect(() => {
    if (!state.isComplete || state.dataPersisted) return;
    dispatch({ type: 'MARK_PERSISTED' });
  }, [state.isComplete, state.dataPersisted]);

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
        body: JSON.stringify({ threadId }),
      });

      const data = await res.json();

      if (!res.ok) {
        console.error('[initAssessment] API error:', data.error);
        dispatch({ type: 'STOP_THINKING' });
        return;
      }

      if (data.success) {
        dispatch({
          type: 'INITIALIZE_SUCCESS',
          message: createAIMessage(data.message.content, data.message.quickReplies),
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
        dispatch({
          type: 'RECEIVE_AI_MESSAGE',
          message: createAIMessage(data.message.content, data.message.quickReplies),
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
    remainingMs,
    endSession,
  };
}
