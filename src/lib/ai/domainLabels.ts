/**
 * Client-safe domain label map.
 *
 * Extracted from assessmentTypes.ts so that client components can import
 * domain labels without pulling in LangGraph (which requires node:async_hooks).
 */

export const DOMAIN_LABELS: Record<string, string> = {
  depression: 'Depression',
  anger: 'Anger & Irritability',
  mania: 'Mania & Elevated Mood',
  anxiety: 'Anxiety',
  somatic_symptoms: 'Somatic Symptoms',
  suicidal_tendencies: 'Suicidal Ideation',
  psychosis: 'Psychosis',
  sleep_problems: 'Sleep Problems',
  memory: 'Memory Difficulties',
  repetitive_thoughts: 'Repetitive Thoughts & Compulsions',
  dissociation: 'Dissociation',
  personality: 'Personality & Relationships',
  substance_use: 'Substance Use',
};
