// Survey related types
export interface SurveyQuestion {
  id: string;
  text: string;
  type: "multiple_choice" | "scale" | "text";
  options?: string[];
}

export interface SurveyResponse {
  questionId: string;
  answer: string | number;
}

export interface SurveyResult {
  surveyId: string;
  userId: string;
  responses: SurveyResponse[];
  score?: number;
  completedAt: Date;
}
