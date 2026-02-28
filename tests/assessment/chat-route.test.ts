import {
  afterAll,
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from 'vitest';

import { POST } from '@/app/api/assessment/chat/route';
import { runAssessmentTurn } from '@/lib/ai/assessmentGraph';
import {
  calculateDomainScores,
  identifyFlaggedDomains,
} from '@/lib/ai/domains';

vi.mock('@/lib/ai/assessmentGraph', () => ({
  runAssessmentTurn: vi.fn(),
}));

vi.mock('@/lib/ai/domains', () => ({
  calculateDomainScores: vi.fn(),
  identifyFlaggedDomains: vi.fn(),
  QUESTION_DOMAIN_MAP: {
    anxiety_nervous: 'anxiety',
    depression_low_mood: 'depression',
  },
}));

function makeRequest(body: unknown) {
  return {
    json: vi.fn().mockResolvedValue(body),
  };
}

function makeAiMessage(content: unknown) {
  return {
    _getType: () => 'ai',
    content,
  };
}

describe('POST /api/assessment/chat', () => {
  const originalApiKey = process.env.OPENAI_API_KEY;
  const consoleErrorSpy = vi
    .spyOn(console, 'error')
    .mockImplementation(() => undefined);

  beforeEach(() => {
    vi.clearAllMocks();
    process.env.OPENAI_API_KEY = 'test-key';
  });

  afterEach(() => {
    process.env.OPENAI_API_KEY = originalApiKey;
  });

  afterAll(() => {
    consoleErrorSpy.mockRestore();
  });

  it('returns 400 for a missing threadId before checking server config', async () => {
    delete process.env.OPENAI_API_KEY;

    const response = await POST(
      makeRequest({ message: 'hello' }) as never,
    );

    expect(response.status).toBe(400);
    await expect(response.json()).resolves.toEqual({
      error: 'Missing or invalid required field: threadId',
    });
  });

  it('rejects ambiguous requests that include both message and screeningAnswers', async () => {
    const response = await POST(
      makeRequest({
        threadId: 'thread-1',
        message: 'hello',
        screeningAnswers: { anxiety_nervous: 3 },
      }) as never,
    );

    expect(response.status).toBe(400);
    await expect(response.json()).resolves.toEqual({
      error:
        'Invalid request: provide either "screeningAnswers" (to initialize) or "message" (to continue), not both',
    });
    expect(runAssessmentTurn).not.toHaveBeenCalled();
  });

  it('rejects non-numeric screening answers', async () => {
    const response = await POST(
      makeRequest({
        threadId: 'thread-1',
        screeningAnswers: { anxiety_nervous: 'high' },
      }) as never,
    );

    expect(response.status).toBe(400);
    await expect(response.json()).resolves.toEqual({
      error: 'Score for "anxiety_nervous" must be a number, got string',
    });
  });

  it('initializes an assessment from screening answers', async () => {
    vi.mocked(calculateDomainScores).mockReturnValue({
      anxiety: 3,
      depression: 2,
    });
    vi.mocked(identifyFlaggedDomains).mockReturnValue(['anxiety']);
    vi.mocked(runAssessmentTurn).mockResolvedValue({
      messages: [makeAiMessage('Let us start with anxiety symptoms.')],
      quickReplies: ['Most days', 'Sometimes'],
      isComplete: false,
      report: null,
      currentDomain: 'anxiety',
      questionCount: 1,
      domainAssessments: {
        anxiety: { status: 'in_progress' },
      },
    } as never);

    const response = await POST(
      makeRequest({
        threadId: 'thread-1',
        screeningAnswers: {
          anxiety_nervous: 3,
          depression_low_mood: 2,
        },
      }) as never,
    );

    expect(calculateDomainScores).toHaveBeenCalledWith({
      anxiety_nervous: 3,
      depression_low_mood: 2,
    });
    expect(identifyFlaggedDomains).toHaveBeenCalledWith({
      anxiety: 3,
      depression: 2,
    });
    expect(runAssessmentTurn).toHaveBeenCalledWith(
      'thread-1',
      undefined,
      [
        {
          questionId: 'anxiety_nervous',
          domain: 'anxiety',
          score: 3,
          questionText:
            'Feeling consistently nervous, anxious, panicked, or frightened?',
        },
        {
          questionId: 'depression_low_mood',
          domain: 'depression',
          score: 2,
          questionText:
            'A persistently low or down mood (for example, not taking pleasure in things you normally do)?',
        },
      ],
      ['anxiety'],
    );

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({
      success: true,
      message: {
        content: 'Let us start with anxiety symptoms.',
        quickReplies: ['Most days', 'Sometimes'],
        isComplete: false,
        report: null,
        currentDomain: 'anxiety',
        questionCount: 1,
        domainStatuses: {
          anxiety: 'in_progress',
        },
      },
    });
  });

  it('continues an assessment thread from a user message', async () => {
    vi.mocked(runAssessmentTurn).mockResolvedValue({
      messages: [
        { _getType: () => 'human', content: 'I cannot sleep.' },
        makeAiMessage('How long has your sleep been affected?'),
      ],
      quickReplies: ['A few days', 'Several weeks'],
      isComplete: false,
      report: null,
      currentDomain: 'sleep',
      questionCount: 3,
      domainAssessments: {
        sleep: { status: 'in_progress' },
        anxiety: { status: 'completed' },
      },
    } as never);

    const response = await POST(
      makeRequest({
        threadId: 'thread-1',
        message: 'I cannot sleep.',
      }) as never,
    );

    expect(runAssessmentTurn).toHaveBeenCalledWith(
      'thread-1',
      'I cannot sleep.',
    );
    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({
      success: true,
      message: {
        content: 'How long has your sleep been affected?',
        quickReplies: ['A few days', 'Several weeks'],
        isComplete: false,
        report: null,
        currentDomain: 'sleep',
        questionCount: 3,
        domainStatuses: {
          sleep: 'in_progress',
          anxiety: 'completed',
        },
      },
    });
  });

  it('returns 500 when the AI provider key is missing for an otherwise valid request', async () => {
    delete process.env.OPENAI_API_KEY;

    const response = await POST(
      makeRequest({
        threadId: 'thread-1',
        message: 'hello',
      }) as never,
    );

    expect(response.status).toBe(500);
    await expect(response.json()).resolves.toEqual({
      error: 'Server configuration error: missing AI provider key',
    });
  });

  it('returns 500 when the assessment graph throws', async () => {
    vi.mocked(runAssessmentTurn).mockRejectedValue(new Error('graph failure'));

    const response = await POST(
      makeRequest({
        threadId: 'thread-1',
        message: 'hello',
      }) as never,
    );

    expect(response.status).toBe(500);
    await expect(response.json()).resolves.toEqual({
      error: 'An internal error occurred while processing the assessment',
    });
  });
});
