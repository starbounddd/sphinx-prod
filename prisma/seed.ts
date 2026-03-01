import 'dotenv/config';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting seed...');

  // Create a test assessment session
  const session = await prisma.assessmentSession.create({
    data: {
      threadId: 'test-thread-001',
      userId: null, // No user for test data
      status: 'completed',
      chiefComplaint: 'Feeling anxious and having trouble sleeping',
      totalQuestions: 8,
      flaggedDomains: ['anxiety', 'sleep_problems'],
      isEarlyTermination: false,
      endedAt: new Date(),
      screeningResponses: {
        create: [
          {
            questionId: 'q1',
            domain: 'anxiety',
            score: 3,
            questionText: 'Feeling nervous, anxious, or on edge',
          },
          {
            questionId: 'q2',
            domain: 'anxiety',
            score: 2,
            questionText: 'Not being able to stop or control worrying',
          },
          {
            questionId: 'q3',
            domain: 'sleep_problems',
            score: 3,
            questionText: 'Trouble falling or staying asleep',
          },
        ],
      },
      domainAssessments: {
        create: [
          {
            domain: 'anxiety',
            status: 'completed',
            screeningScore: 2.5,
            functionalImpact: 2,
            control: 1,
            frequency: 2,
            confidence: 3,
            duration: '2-3 weeks',
            evidenceNotes: [
              'Reports daily anxiety affecting work',
              'Physical symptoms include racing heart',
            ],
            questionsAsked: 4,
            dimensionsCovered: ['affective', 'physiological', 'functional'],
          },
          {
            domain: 'sleep_problems',
            status: 'completed',
            screeningScore: 3.0,
            functionalImpact: 2,
            control: 1,
            frequency: 3,
            confidence: 2,
            duration: '1 month',
            evidenceNotes: ['Difficulty falling asleep most nights'],
            questionsAsked: 4,
            dimensionsCovered: ['behavioral', 'functional'],
          },
        ],
      },
      chatMessages: {
        create: [
          {
            role: 'assistant',
            content:
              "Hello! I'm here to help understand what you've been experiencing. Based on your screening, it looks like you've been dealing with some anxiety and sleep difficulties. Can you tell me more about what's been going on?",
            sequence: 1,
            quickReplies: [
              "I've been feeling very anxious lately",
              'My sleep has been really bad',
            ],
          },
          {
            role: 'user',
            content: "I've been feeling very anxious lately, especially at work",
            sequence: 2,
          },
          {
            role: 'assistant',
            content:
              'I understand. Work-related anxiety can be really challenging. How long have you been experiencing these anxious feelings?',
            sequence: 3,
            quickReplies: ['A few weeks', 'About a month', 'Several months'],
          },
        ],
      },
      report: {
        create: {
          chiefComplaint: 'Feeling anxious and having trouble sleeping',
          mainGoal: 'Better manage anxiety and improve sleep quality',
          analysis:
            'You have been experiencing significant anxiety that affects your daily functioning, particularly at work. This anxiety appears to be contributing to sleep difficulties.',
          domains: [
            {
              domain: 'anxiety',
              label: 'Anxiety',
              screeningScore: 2.5,
              functionalImpact: 2,
              control: 1,
              duration: '2-3 weeks',
              frequency: 2,
              confidence: 3,
              summary: 'Moderate anxiety with work-related triggers',
            },
            {
              domain: 'sleep_problems',
              label: 'Sleep Problems',
              screeningScore: 3.0,
              functionalImpact: 2,
              control: 1,
              duration: '1 month',
              frequency: 3,
              confidence: 2,
              summary: 'Difficulty falling asleep most nights',
            },
          ],
          findings: [
            {
              icon: 'zap',
              title: 'Work-Related Triggers',
              description: 'Anxiety appears to be primarily triggered by work situations',
            },
            {
              icon: 'clock',
              title: 'Recent Onset',
              description: 'Symptoms have developed over the past few weeks',
            },
          ],
          recommendations: [
            'Consider speaking with a mental health professional about anxiety management',
            'Establish a consistent sleep routine',
            'Practice relaxation techniques before bed',
          ],
        },
      },
    },
    include: {
      screeningResponses: true,
      domainAssessments: true,
      chatMessages: true,
      report: true,
    },
  });

  console.log('✅ Test assessment session created:', {
    id: session.id,
    threadId: session.threadId,
    status: session.status,
    screeningResponses: session.screeningResponses.length,
    domainAssessments: session.domainAssessments.length,
    chatMessages: session.chatMessages.length,
    hasReport: !!session.report,
  });

  console.log('🎉 Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
