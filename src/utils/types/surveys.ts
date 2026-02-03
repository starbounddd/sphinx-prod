// Survey-related types
export interface Survey {
  id: number;
  title: string;
  description?: string;
  authorId: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Question {
  id: number;
  surveyId: number;
  text: string;
  order: number;
}

export interface Answer {
  id: number;
  questionId: number;
  text: string;
  value: number;
}
