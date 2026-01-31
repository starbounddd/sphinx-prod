// Application constants
export const APP_NAME = 'Sphinx';
export const APP_VERSION = '0.1.0';

export const API_ENDPOINTS = {
  SURVEYS: '/api/surveys',
  AI_EXPLAIN: '/api/ai/explain',
  SAFETY_LOG: '/api/safety/log-event',
};

export const SURVEY_LIMITS = {
  maxQuestionsPerSurvey: 100,
  maxAnswersPerQuestion: 50,
  maxResponseLength: 5000,
};
