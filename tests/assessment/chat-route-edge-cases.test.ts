/**
 * Edge-case tests for POST /api/assessment/chat.
 *
 * Covers paths not exercised by the main chat-route.test.ts:
 *   - neither screeningAnswers nor message supplied
 *   - empty-string API key
 *   - malformed JSON body
 *   - empty screeningAnswers object (0 flagged domains)
 *   - getLastAiContent helper edge cases
 */
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

function makeFailingRequest() {
  return {
    json: vi.fn().mockRejectedValue(new SyntaxError('Unexpected token')),
  };
}

function makeAiMessage(content: unknown) {
  return {
    _getType: () => 'ai',
    content,
  };
}

describe('POST /api/assessment/chat — edge cases', () => {
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

  /* -------------------------------------------------------------------- */
  /* Missing both message and screeningAnswers                             */
  /* -------------------------------------------------------------------- */
  it('returns 400 when threadId is provided but no message or screeningAnswers', async () => {
    const response = await POST(
      makeRequest({ threadId: 'thread-1' }) as never,
    );

    expect(response.status).toBe(400);
    const body = await response.json();
    expect(body.error).toContain('provide either');
    expect(runAssessmentTurn).not.toHaveBeenCalled();
  });

  /* -------------------------------------------------------------------- */
  /* Malformed JSON body                                                   */
  /* -------------------------------------------------------------------- */
  it('returns 500 when the request body is not valid JSON', async () => {
    const response = await POST(makeFailingRequest() as never);

    expect(response.status).toBe(500);
    const body = await response.json();
    expect(body.error).toBe(
      'An internal error occurred while processing the assessment',
    );
  });

  /* -------------------------------------------------------------------- */
  /* Empty-string API key                                                  */
  /* -------------------------------------------------------------------- */
  it('returns 500 when the API key is an empty string', async () => {
    process.env.OPENAI_API_KEY = '';

    const response = await POST(
      makeRequest({ threadId: 'thread-1', message: 'hi' }) as never,
    );

    expect(response.status).toBe(500);
    const body = await response.json();
    expect(body.error).toContain('missing AI provider key');
  });

  /* -------------------------------------------------------------------- */
  /* Initialization with empty screening answers (0 flagged domains)      */
  /* -------------------------------------------------------------------- */
  it('handles initialization with zero flagged domains', async () => {
    vi.mocked(calculateDomainScores).mockReturnValue({});
    vi.mocked(identifyFlaggedDomains).mockReturnValue([]);
    vi.mocked(runAssessmentTurn).mockResolvedValue({
      messages: [makeAiMessage('No concerning areas found.')],
      quickReplies: [],
      isComplete: true,
      report: null,
      currentDomain: null,
      questionCount: 0,
      domainAssessments: {},
    } as never);

    const response = await POST(
      makeRequest({
        threadId: 'thread-2',
        screeningAnswers: { anxiety_nervous: 0, depression_low_mood: 0 },
      }) as never,
    );

    expect(response.status).toBe(200);
    const body = await response.json();
    expect(body.success).toBe(true);
    expect(body.message.domainStatuses).toEqual({});
  });

  /* -------------------------------------------------------------------- */
  /* getLastAiContent falls back when no AI messages present               */
  /* -------------------------------------------------------------------- */
  it('returns empty content when graph produces only human messages', async () => {
    vi.mocked(runAssessmentTurn).mockResolvedValue({
      messages: [{ _getType: () => 'human', content: 'Hello' }],
      quickReplies: [],
      isComplete: false,
      report: null,
      currentDomain: 'anxiety',
      questionCount: 1,
      domainAssessments: { anxiety: { status: 'in_progress' } },
    } as never);

    const response = await POST(
      makeRequest({ threadId: 'thread-3', message: 'hi' }) as never,
    );

    expect(response.status).toBe(200);
    const body = await response.json();
    expect(body.message.content).toBe('');
  });

  /* -------------------------------------------------------------------- */
  /* getLastAiContent handles non-string AI content                        */
  /* -------------------------------------------------------------------- */
  it('returns empty string when AI content is not a string', async () => {
    vi.mocked(runAssessmentTurn).mockResolvedValue({
      messages: [makeAiMessage({ blocks: ['complex content'] })],
      quickReplies: [],
      isComplete: false,
      report: null,
      currentDomain: 'anxiety',
      questionCount: 1,
      domainAssessments: { anxiety: { status: 'in_progress' } },
    } as never);

    const response = await POST(
      makeRequest({ threadId: 'thread-4', message: 'hi' }) as never,
    );

    expect(response.status).toBe(200);
    const body = await response.json();
    expect(body.message.content).toBe('');
  });

  /* -------------------------------------------------------------------- */
  /* Out-of-range screening answers                                        */
  /* -------------------------------------------------------------------- */
  it('rejects screening answers with out-of-range scores', async () => {
    const response = await POST(
      makeRequest({
        threadId: 'thread-5',
        screeningAnswers: { anxiety_nervous: 5 },
      }) as never,
    );

    expect(response.status).toBe(400);
    const body = await response.json();
    expect(body.error).toContain('must be between');
  });

  /* -------------------------------------------------------------------- */
  /* Whitespace-only message is rejected                                   */
  /* -------------------------------------------------------------------- */
  it('rejects whitespace-only messages', async () => {
    const response = await POST(
      makeRequest({ threadId: 'thread-6', message: '   ' }) as never,
    );

    expect(response.status).toBe(400);
    const body = await response.json();
    expect(body.error).toContain('empty');
  });

  /* -------------------------------------------------------------------- */
  /* Empty-string message is rejected                                      */
  /* -------------------------------------------------------------------- */
  it('rejects empty string messages', async () => {
    const response = await POST(
      makeRequest({ threadId: 'thread-7', message: '' }) as never,
    );

    expect(response.status).toBe(400);
    const body = await response.json();
    expect(body.error).toContain('empty');
  });
});
