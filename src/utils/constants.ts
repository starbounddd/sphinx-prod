// Application constants
export const APP_NAME = 'Survey App';
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

export const ERROR_MESSAGES = {
  networkError: 'Network error. Please check your connection and try again.',
  serverError: 'Server error. Please try again later.',
  validationError: 'Validation error. Please check your input and try again.',
  unauthorized: 'Unauthorized. Please log in to continue.',
  syncFailure: 'Failed to sync user to database. Please try again.',
};
