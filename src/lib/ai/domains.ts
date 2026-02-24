import type { SymptomDomain, AssessmentDimension } from './assessmentTypes';

/* ==========================================================================
   Domain Feature Library
   ========================================================================== */

export interface DomainFeature {
  description: string;
  highSalienceMarkers: string[];
  probingDimensions: Record<AssessmentDimension, string[]>;
}

export const DOMAIN_FEATURES: Record<SymptomDomain, DomainFeature> = {
  /* ------------------------------------------------------------------ */
  depression: {
    description:
      'Persistent low mood, loss of interest or pleasure, and associated emotional, cognitive, and physical changes.',
    highSalienceMarkers: [
      'Pervasive sadness or emptiness most of the day',
      'Loss of interest or pleasure in previously enjoyed activities',
      'Feelings of worthlessness or excessive guilt',
      'Recurrent thoughts of death (distinct from suicidal ideation)',
      'Significant weight or appetite changes',
    ],
    probingDimensions: {
      affective: [
        'Quality and persistence of low mood',
        'Ability to experience pleasure or joy',
        'Feelings of hopelessness about the future',
      ],
      cognitive: [
        'Difficulty concentrating or making decisions',
        'Negative self-talk patterns',
        'Ruminative thinking about past events',
      ],
      physiological: [
        'Changes in appetite or weight',
        'Fatigue or loss of energy',
        'Psychomotor retardation or agitation',
      ],
      behavioral: [
        'Social withdrawal or isolation',
        'Neglecting responsibilities or self-care',
        'Reduced activity levels compared to baseline',
      ],
      functional: [
        'Impact on work or academic performance',
        'Strain on personal relationships',
        'Ability to manage day-to-day tasks',
      ],
      perceptual: [
        'Subjective sense of time slowing down',
        'Feeling disconnected from surroundings',
        'Changes in how the world appears or feels',
      ],
    },
  },

  /* ------------------------------------------------------------------ */
  anger: {
    description:
      'Heightened irritability, anger outbursts, and difficulty managing frustration.',
    highSalienceMarkers: [
      'Frequent irritability disproportionate to triggers',
      'Angry outbursts or loss of temper',
      'Physical tension associated with anger',
      'Verbal or physical aggression toward others or objects',
      'Persistent resentment or hostility',
    ],
    probingDimensions: {
      affective: [
        'Intensity and duration of anger episodes',
        'Underlying emotions (hurt, fear, frustration)',
        'Emotional recovery time after an outburst',
      ],
      cognitive: [
        'Thoughts that fuel or escalate anger',
        'Perceived injustice or unfairness',
        'Ability to see others\' perspectives during conflict',
      ],
      physiological: [
        'Muscle tension, clenched jaw, or fists',
        'Elevated heart rate or feeling flushed',
        'Headaches or stomach discomfort tied to anger',
      ],
      behavioral: [
        'How anger is expressed (verbal, physical, passive)',
        'Coping strategies currently used',
        'Avoidance of situations that might trigger anger',
      ],
      functional: [
        'Impact on relationships (partner, family, coworkers)',
        'Consequences at work or school',
        'Legal or social repercussions',
      ],
      perceptual: [
        'Heightened sensitivity to perceived slights',
        'Feeling that others are intentionally provoking',
        'Noticing threat or hostility in neutral situations',
      ],
    },
  },

  /* ------------------------------------------------------------------ */
  mania: {
    description:
      'Periods of elevated mood, increased energy, reduced need for sleep, and impulsive or risky behavior.',
    highSalienceMarkers: [
      'Abnormally elevated, expansive, or irritable mood',
      'Markedly decreased need for sleep without fatigue',
      'Grandiosity or inflated self-esteem',
      'Pressured speech or racing thoughts',
      'Impulsive engagement in risky activities',
    ],
    probingDimensions: {
      affective: [
        'Quality of elevated mood (euphoric vs. irritable)',
        'Speed of mood shifts',
        'Sense of invincibility or heightened confidence',
      ],
      cognitive: [
        'Racing thoughts or flight of ideas',
        'Distractibility and difficulty sustaining attention',
        'Grandiose plans or beliefs about abilities',
      ],
      physiological: [
        'Sleep patterns and perceived need for sleep',
        'Energy levels compared to baseline',
        'Appetite and physical restlessness',
      ],
      behavioral: [
        'New projects started without completion',
        'Financial risk-taking (spending sprees, investments)',
        'Sexual behavior changes or social disinhibition',
      ],
      functional: [
        'Impact on work, relationships, or finances',
        'Ability to fulfill daily responsibilities',
        'Others\' observations about behavior changes',
      ],
      perceptual: [
        'Heightened sensory experiences (colors, sounds)',
        'Feeling of special connection to the world',
        'Altered sense of time (everything moving too slowly)',
      ],
    },
  },

  /* ------------------------------------------------------------------ */
  anxiety: {
    description:
      'Persistent nervousness, worry, panic episodes, and avoidance behavior.',
    highSalienceMarkers: [
      'Persistent excessive worry difficult to control',
      'Panic attacks with physical symptoms',
      'Avoidance of anxiety-provoking situations',
      'Restlessness or feeling keyed up',
      'Anticipatory dread about future events',
    ],
    probingDimensions: {
      affective: [
        'Nature of the worry (generalized vs. specific)',
        'Intensity of fear or dread',
        'Sense of impending doom or catastrophe',
      ],
      cognitive: [
        'Content of anxious thoughts',
        'Catastrophic thinking patterns',
        'Difficulty concentrating due to worry',
      ],
      physiological: [
        'Heart palpitations or chest tightness',
        'Shortness of breath or hyperventilation',
        'Gastrointestinal distress, sweating, or trembling',
      ],
      behavioral: [
        'Specific situations or places avoided',
        'Safety behaviors or reassurance-seeking',
        'Impact on leaving home or social engagement',
      ],
      functional: [
        'Work or school attendance and performance',
        'Limitations on social life',
        'Ability to travel or handle routine activities',
      ],
      perceptual: [
        'Hypervigilance or heightened startle response',
        'Feeling of unreality during anxiety spikes',
        'Sensitivity to bodily sensations',
      ],
    },
  },

  /* ------------------------------------------------------------------ */
  somatic_symptoms: {
    description:
      'Unexplained physical symptoms such as pain, fatigue, or discomfort without a clear medical cause.',
    highSalienceMarkers: [
      'Persistent pain without identifiable medical cause',
      'Excessive worry about physical symptoms',
      'Frequent medical visits yielding no diagnosis',
      'Fatigue or exhaustion beyond normal tiredness',
      'Multiple body areas affected',
    ],
    probingDimensions: {
      affective: [
        'Emotional distress caused by the symptoms',
        'Frustration or hopelessness about finding relief',
        'Fear that symptoms indicate a serious illness',
      ],
      cognitive: [
        'Beliefs about the cause of symptoms',
        'Health-related worry or catastrophizing',
        'Attention focused on bodily sensations',
      ],
      physiological: [
        'Location, quality, and intensity of pain',
        'Pattern of symptoms (constant vs. episodic)',
        'Relationship between symptoms and stress levels',
      ],
      behavioral: [
        'Medical help-seeking patterns',
        'Activity avoidance due to symptoms',
        'Use of medication or self-treatment',
      ],
      functional: [
        'Impact on work and daily routines',
        'Limitations on physical activities',
        'Effect on social participation',
      ],
      perceptual: [
        'Heightened body awareness',
        'Amplification of normal sensations',
        'Difficulty distinguishing stress from illness',
      ],
    },
  },

  /* ------------------------------------------------------------------ */
  suicidal_tendencies: {
    description:
      'Thoughts of self-harm, suicidal ideation, or feelings of wanting to not exist.',
    highSalienceMarkers: [
      'Passive wish to not be alive',
      'Active thoughts of ending one\'s life',
      'Formulation of a plan or method',
      'History of prior attempts',
      'Sense of being a burden to others',
    ],
    probingDimensions: {
      affective: [
        'Intensity of emotional pain or hopelessness',
        'Feelings of being trapped with no way out',
        'Sense of burdensomeness to others',
      ],
      cognitive: [
        'Nature of suicidal thoughts (passive vs. active)',
        'Presence or absence of a plan',
        'Reasons for living and protective factors',
      ],
      physiological: [
        'Sleep disruption associated with distress',
        'Appetite changes or self-neglect',
        'Physical pain contributing to ideation',
      ],
      behavioral: [
        'History of self-harm or prior attempts',
        'Giving away possessions or saying goodbyes',
        'Access to means (firearms, medications)',
      ],
      functional: [
        'Ability to engage in safety planning',
        'Social connectedness and support system',
        'Willingness to seek help',
      ],
      perceptual: [
        'Tunnel vision or narrowed perspective',
        'Feeling that nothing will ever improve',
        'Sense of detachment from life',
      ],
    },
  },

  /* ------------------------------------------------------------------ */
  psychosis: {
    description:
      'Experiences of hearing voices, unusual beliefs, or feeling that thoughts are being broadcast or controlled.',
    highSalienceMarkers: [
      'Auditory hallucinations (voices when alone)',
      'Belief that others can hear one\'s thoughts',
      'Paranoid ideation or persecutory beliefs',
      'Disorganized thinking or speech',
      'Unusual perceptual experiences',
    ],
    probingDimensions: {
      affective: [
        'Emotional response to hallucinatory experiences',
        'Distress caused by unusual beliefs',
        'Mood during psychotic episodes',
      ],
      cognitive: [
        'Content and conviction of unusual beliefs',
        'Thought broadcasting or insertion experiences',
        'Insight into the nature of experiences',
      ],
      physiological: [
        'Sleep disruption associated with symptoms',
        'Stress or substance triggers',
        'Physical tension or agitation',
      ],
      behavioral: [
        'Response to hallucinatory commands',
        'Social withdrawal or isolation',
        'Unusual rituals or protective behaviors',
      ],
      functional: [
        'Impact on self-care and daily routines',
        'Ability to maintain employment or studies',
        'Relationship difficulties due to symptoms',
      ],
      perceptual: [
        'Nature and frequency of hallucinations',
        'Visual, auditory, or tactile experiences',
        'Ability to distinguish hallucinations from reality',
      ],
    },
  },

  /* ------------------------------------------------------------------ */
  sleep_problems: {
    description:
      'Difficulty falling asleep, staying asleep, or non-restorative sleep affecting daily functioning.',
    highSalienceMarkers: [
      'Chronic difficulty falling asleep',
      'Frequent nighttime awakenings',
      'Early morning awakening and inability to return to sleep',
      'Non-restorative sleep despite adequate hours',
      'Daytime sleepiness or fatigue',
    ],
    probingDimensions: {
      affective: [
        'Emotional state at bedtime (worry, dread)',
        'Frustration or distress about sleep difficulties',
        'Mood upon waking',
      ],
      cognitive: [
        'Racing thoughts or rumination at bedtime',
        'Beliefs about sleep requirements',
        'Worry about consequences of poor sleep',
      ],
      physiological: [
        'Time to fall asleep and total hours slept',
        'Number and duration of awakenings',
        'Physical restlessness or discomfort in bed',
      ],
      behavioral: [
        'Sleep hygiene practices (screen use, caffeine)',
        'Napping patterns during the day',
        'Use of sleep aids (medication, alcohol)',
      ],
      functional: [
        'Daytime energy and alertness',
        'Impact on work or academic performance',
        'Effect on mood and relationships',
      ],
      perceptual: [
        'Nightmares or vivid dreams',
        'Hypnagogic or hypnopompic experiences',
        'Altered sense of time during wakefulness at night',
      ],
    },
  },

  /* ------------------------------------------------------------------ */
  memory: {
    description:
      'Difficulty with recall, retaining new information, or disorientation in familiar settings.',
    highSalienceMarkers: [
      'Forgetting recent conversations or events',
      'Difficulty learning new information',
      'Misplacing objects frequently',
      'Confusion about familiar locations or routines',
      'Needing to rely heavily on notes or reminders',
    ],
    probingDimensions: {
      affective: [
        'Frustration or embarrassment about memory lapses',
        'Anxiety about worsening cognitive function',
        'Emotional impact of forgetfulness on self-image',
      ],
      cognitive: [
        'Types of information most affected (names, events, tasks)',
        'Short-term vs. long-term memory difficulties',
        'Concentration and attention span',
      ],
      physiological: [
        'Sleep quality and its relationship to memory',
        'Medication or substance effects on cognition',
        'History of head injury or medical conditions',
      ],
      behavioral: [
        'Compensatory strategies (lists, alarms, routines)',
        'Avoidance of tasks requiring memory',
        'Changes in social engagement due to memory concerns',
      ],
      functional: [
        'Impact on work performance and reliability',
        'Difficulty managing finances or appointments',
        'Safety concerns (leaving appliances on, getting lost)',
      ],
      perceptual: [
        'Feeling of mental fog or cloudiness',
        'Difficulty placing familiar faces',
        'Sense that time is slipping or disjointed',
      ],
    },
  },

  /* ------------------------------------------------------------------ */
  repetitive_thoughts: {
    description:
      'Intrusive, unwanted thoughts and compulsive behaviors or mental rituals performed to reduce distress.',
    highSalienceMarkers: [
      'Intrusive thoughts that are distressing and unwanted',
      'Compulsive rituals (checking, counting, washing)',
      'Mental rituals (repeating phrases, mental reviewing)',
      'Significant time consumed by obsessions or compulsions',
      'Awareness that the thoughts or behaviors are excessive',
    ],
    probingDimensions: {
      affective: [
        'Anxiety or distress triggered by intrusive thoughts',
        'Relief (temporary) after performing compulsions',
        'Shame or embarrassment about the thoughts',
      ],
      cognitive: [
        'Content of intrusive thoughts (contamination, harm, symmetry)',
        'Beliefs about responsibility or consequence of not acting',
        'Degree of insight into irrationality of compulsions',
      ],
      physiological: [
        'Physical tension or discomfort before rituals',
        'Somatic sensations driving "not just right" feelings',
        'Fatigue from the effort of resisting or performing rituals',
      ],
      behavioral: [
        'Specific compulsions and their frequency',
        'Time spent per day on rituals',
        'Avoidance of triggers (places, objects, people)',
      ],
      functional: [
        'Impact on daily schedule and punctuality',
        'Effect on relationships and social activities',
        'Work or academic impairment',
      ],
      perceptual: [
        'Sensory-driven urges (need for symmetry, tactile "rightness")',
        'Hyperawareness of specific stimuli',
        'Feeling that environment is "contaminated" or unsafe',
      ],
    },
  },

  /* ------------------------------------------------------------------ */
  dissociation: {
    description:
      'Feeling detached from oneself, one\'s body, or surroundings, or experiencing the world as unreal.',
    highSalienceMarkers: [
      'Feeling detached from one\'s own body or mind',
      'Surroundings feeling dreamlike or unreal',
      'Gaps in memory for everyday events',
      'Emotional numbness or blunted feelings',
      'Sense of watching oneself from outside',
    ],
    probingDimensions: {
      affective: [
        'Emotional numbness or feeling "flat"',
        'Distress about dissociative experiences',
        'Disconnection from emotions during episodes',
      ],
      cognitive: [
        'Gaps in memory (minutes, hours, days)',
        'Confusion about identity or personal history',
        'Difficulty concentrating or "spacing out"',
      ],
      physiological: [
        'Physical numbness or tingling',
        'Altered perception of pain',
        'Relationship to stress or trauma triggers',
      ],
      behavioral: [
        'Actions performed without awareness ("autopilot")',
        'Finding evidence of actions one doesn\'t recall',
        'Coping strategies used during episodes',
      ],
      functional: [
        'Impact on work, driving, or safety-critical tasks',
        'Relationship strain from emotional unavailability',
        'Ability to maintain daily routines',
      ],
      perceptual: [
        'Visual distortions (foggy, tunnel vision)',
        'Altered sense of time (speeding up or slowing)',
        'Objects or people appearing unfamiliar',
      ],
    },
  },

  /* ------------------------------------------------------------------ */
  personality: {
    description:
      'Difficulties with sense of self, identity, and forming or maintaining close relationships.',
    highSalienceMarkers: [
      'Unstable or unclear sense of identity',
      'Chronic difficulty forming close relationships',
      'Fear of abandonment or rejection',
      'Patterns of intense but unstable relationships',
      'Persistent feelings of emptiness',
    ],
    probingDimensions: {
      affective: [
        'Emotional intensity and rapid shifts',
        'Chronic feelings of emptiness',
        'Difficulty tolerating distress or strong emotions',
      ],
      cognitive: [
        'Sense of who one is (values, goals, preferences)',
        'Black-and-white thinking about self or others',
        'Self-image stability or frequent changes',
      ],
      physiological: [
        'Physical responses to interpersonal stress',
        'Self-harm or risky behavior for emotional regulation',
        'Somatic complaints tied to relationship distress',
      ],
      behavioral: [
        'Patterns in relationship beginnings and endings',
        'Impulsive actions when emotionally triggered',
        'People-pleasing or conflict avoidance patterns',
      ],
      functional: [
        'Ability to maintain long-term relationships',
        'Workplace interpersonal difficulties',
        'Social isolation or overdependence on others',
      ],
      perceptual: [
        'Feeling fundamentally different from others',
        'Sense that one is "wearing a mask" socially',
        'Difficulty reading social cues or others\' intentions',
      ],
    },
  },

  /* ------------------------------------------------------------------ */
  substance_use: {
    description:
      'Use of alcohol, tobacco, or non-prescribed drugs with potential impact on wellbeing and functioning.',
    highSalienceMarkers: [
      'Using substances more than intended',
      'Unsuccessful attempts to cut down',
      'Cravings or strong urges to use',
      'Continued use despite negative consequences',
      'Increased tolerance or withdrawal symptoms',
    ],
    probingDimensions: {
      affective: [
        'Emotional triggers for substance use',
        'Mood changes when unable to use',
        'Guilt or shame about substance use',
      ],
      cognitive: [
        'Beliefs about needing the substance to cope',
        'Minimization or rationalization of use',
        'Awareness of the impact on one\'s life',
      ],
      physiological: [
        'Tolerance changes (needing more for same effect)',
        'Withdrawal symptoms when not using',
        'Physical health effects noticed',
      ],
      behavioral: [
        'Frequency and quantity of use',
        'Contexts and triggers for use',
        'Previous attempts to reduce or quit',
      ],
      functional: [
        'Impact on work, finances, or responsibilities',
        'Effect on relationships and social life',
        'Legal or health consequences',
      ],
      perceptual: [
        'Changes in how one perceives problems while using',
        'Altered sense of well-being tied to substance use',
        'Feeling unable to enjoy activities without substances',
      ],
    },
  },
};

/* ==========================================================================
   Question-to-Domain Mapping (matches wellbeing_surveyv1.json)
   ========================================================================== */

export const QUESTION_DOMAIN_MAP: Record<string, SymptomDomain> = {
  depression_low_mood: 'depression',
  anger_irritability: 'anger',
  mania_low_sleep_energy: 'mania',
  mania_risk_projects: 'mania',
  anxiety_nervous: 'anxiety',
  anxiety_avoidance: 'anxiety',
  somatic_pain: 'somatic_symptoms',
  suicidal_thoughts: 'suicidal_tendencies',
  psychosis_hearing_voices: 'psychosis',
  psychosis_thought_broadcast: 'psychosis',
  sleep_difficulty: 'sleep_problems',
  memory_difficulty: 'memory',
  repetitive_compulsive: 'repetitive_thoughts',
  dissociation_detached: 'dissociation',
  personality_identity: 'personality',
  personality_relationships: 'personality',
  substance_use_behavior: 'substance_use',
};

/* ==========================================================================
   Scoring Utilities
   ========================================================================== */

/**
 * Compute the average screening score per domain from raw question answers.
 *
 * @param answers  Record of questionId -> score (0-4)
 * @returns        Record of domain -> average score
 */
export function calculateDomainScores(
  answers: Record<string, number>,
): Record<SymptomDomain, number> {
  const totals: Partial<Record<SymptomDomain, { sum: number; count: number }>> = {};

  for (const [questionId, score] of Object.entries(answers)) {
    const domain = QUESTION_DOMAIN_MAP[questionId];
    if (!domain) continue;

    if (!totals[domain]) {
      totals[domain] = { sum: 0, count: 0 };
    }
    totals[domain]!.sum += score;
    totals[domain]!.count += 1;
  }

  const scores = {} as Record<SymptomDomain, number>;
  for (const [domain, data] of Object.entries(totals)) {
    scores[domain as SymptomDomain] = data!.count > 0 ? data!.sum / data!.count : 0;
  }

  return scores;
}

/**
 * Identify domains whose average screening score meets or exceeds the threshold,
 * sorted in descending order of severity (highest score first).
 *
 * @param domainScores  Record of domain -> average score
 * @param threshold     Minimum score to flag (default 2)
 * @returns             Array of flagged domains sorted by severity
 */
export function identifyFlaggedDomains(
  domainScores: Record<string, number>,
  threshold: number = 2,
): SymptomDomain[] {
  return (Object.entries(domainScores) as [SymptomDomain, number][])
    .filter(([, score]) => score >= threshold)
    .sort(([, a], [, b]) => b - a)
    .map(([domain]) => domain);
}
