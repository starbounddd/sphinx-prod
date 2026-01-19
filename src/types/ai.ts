// AI/LLM related types
export interface AIExplanation {
  text: string;
  confidence: number;
  version: string;
}

export interface AIRequest {
  input: string;
  model: string;
  temperature?: number;
  maxTokens?: number;
}

export interface AIResponse {
  output: string;
  tokens: number;
  model: string;
}
