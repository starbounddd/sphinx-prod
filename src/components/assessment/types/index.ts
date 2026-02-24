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
   Report Types (Legacy)
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
   Assessment Report Types (Provider-Facing)
   ========================================================================== */

export interface DomainResult {
  domain: string;
  label: string;
  specificity: 'High' | 'Medium' | 'Low';
  impact: 'None' | 'Mild' | 'Moderate' | 'High';
  control: number;
  frequency: number;
  duration: string;
  clinicalNotes: string;
}

export interface SummaryStat {
  icon: string;
  value: string;
  label: string;
  color: string;
}

export interface AIInsight {
  icon: string;
  title: string;
  body: string;
  source: string;
  iconColor: string;
}

export interface ScreeningQuestionResult {
  questionId: string;
  questionText: string;
  domain: string;
  domainLabel: string;
  score: number;
  scoreLabel: string;
}

export interface AssessmentMetadata {
  completedAt: string;
  threadId: string;
  totalQuestions: number;
  domainStatuses: Record<string, string>;
}

export interface AssessmentReport {
  id: string;
  patientName: string;
  patientDOB: string;
  assessmentDate: string;
  status: 'completed' | 'in-progress';
  summaryStats: SummaryStat[];
  domains: DomainResult[];
  insights: AIInsight[];
  chiefComplaint?: string;
  analysis?: string;
  screeningResults?: ScreeningQuestionResult[];
  chatTranscript?: ChatMessage[];
  assessmentMetadata?: AssessmentMetadata;
}

/* ==========================================================================
   Mock Data Helper Types
   ========================================================================== */

export interface AIResponse {
  content: string;
  quickReplies?: string[];
  isComplete?: boolean;
}
