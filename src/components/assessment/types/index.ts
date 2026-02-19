/* ==========================================================================
   Chat Types
   ========================================================================== */

export type MessageRole = 'ai' | 'user';

export interface ChatMessage {
  id: string;
  role: MessageRole;
  content: string;
  timestamp: Date;
  /** Optional quick reply options to show after this message */
  quickReplies?: string[];
}

export interface AssessmentState {
  messages: ChatMessage[];
  isThinking: boolean;
  currentStep: number;
  isComplete: boolean;
}

/* ==========================================================================
   Report Types
   ========================================================================== */

export type FindingIconName = 'zap' | 'clock' | 'activity' | 'calendar';

export interface Finding {
  id: string;
  icon: FindingIconName;
  title: string;
  description: string;
}

export interface ClarityReport {
  id: string;
  userQuote: string;
  analysis: string;
  analysisHighlight?: string;
  findings: Finding[];
  createdAt: Date;
}

/* ==========================================================================
   Mock Data Helper Types
   ========================================================================== */

export interface AIResponse {
  content: string;
  quickReplies?: string[];
  isComplete?: boolean;
}
