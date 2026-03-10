/*
  Warnings:

  - You are about to drop the `ConsentVersion` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `UserConsent` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `user_profiles` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `users` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "SymptomDomain" AS ENUM ('depression', 'anger', 'mania', 'anxiety', 'somatic_symptoms', 'suicidal_tendencies', 'psychosis', 'sleep_problems', 'memory', 'repetitive_thoughts', 'dissociation', 'personality', 'substance_use');

-- CreateEnum
CREATE TYPE "AssessmentStatus" AS ENUM ('in_progress', 'completed', 'abandoned', 'expired');

-- CreateEnum
CREATE TYPE "DomainStatus" AS ENUM ('pending', 'in_progress', 'completed');

-- CreateEnum
CREATE TYPE "MessageRole" AS ENUM ('user', 'assistant', 'system');

-- CreateEnum
CREATE TYPE "SafetyEventType" AS ENUM ('suicidal_ideation', 'self_harm', 'violence', 'crisis');

-- DropForeignKey
ALTER TABLE "UserConsent" DROP CONSTRAINT "UserConsent_consentVersionId_fkey";

-- DropForeignKey
ALTER TABLE "UserConsent" DROP CONSTRAINT "UserConsent_userId_fkey";

-- DropForeignKey
ALTER TABLE "user_profiles" DROP CONSTRAINT "user_profiles_userId_fkey";

-- DropTable
DROP TABLE "ConsentVersion";

-- DropTable
DROP TABLE "UserConsent";

-- DropTable
DROP TABLE "user_profiles";

-- DropTable
DROP TABLE "users";

-- DropEnum
DROP TYPE "AgeRange";

-- CreateTable
CREATE TABLE "assessment_sessions" (
    "id" UUID NOT NULL,
    "threadId" TEXT NOT NULL,
    "userId" UUID,
    "status" "AssessmentStatus" NOT NULL DEFAULT 'in_progress',
    "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "endedAt" TIMESTAMP(3),
    "chiefComplaint" TEXT,
    "totalQuestions" INTEGER NOT NULL DEFAULT 0,
    "flaggedDomains" "SymptomDomain"[],
    "isEarlyTermination" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "assessment_sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "screening_responses" (
    "id" UUID NOT NULL,
    "sessionId" UUID NOT NULL,
    "questionId" TEXT NOT NULL,
    "domain" "SymptomDomain" NOT NULL,
    "score" INTEGER NOT NULL,
    "questionText" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "screening_responses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "chat_messages" (
    "id" UUID NOT NULL,
    "sessionId" UUID NOT NULL,
    "role" "MessageRole" NOT NULL,
    "content" TEXT NOT NULL,
    "sequence" INTEGER NOT NULL,
    "quickReplies" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "chat_messages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "domain_assessments" (
    "id" UUID NOT NULL,
    "sessionId" UUID NOT NULL,
    "domain" "SymptomDomain" NOT NULL,
    "status" "DomainStatus" NOT NULL DEFAULT 'pending',
    "screeningScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "functionalImpact" INTEGER NOT NULL DEFAULT 0,
    "control" INTEGER NOT NULL DEFAULT 0,
    "frequency" INTEGER NOT NULL DEFAULT 0,
    "confidence" INTEGER NOT NULL DEFAULT 0,
    "duration" TEXT NOT NULL DEFAULT '',
    "evidenceNotes" TEXT[],
    "questionsAsked" INTEGER NOT NULL DEFAULT 0,
    "dimensionsCovered" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "domain_assessments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "assessment_reports" (
    "id" UUID NOT NULL,
    "sessionId" UUID NOT NULL,
    "chiefComplaint" TEXT NOT NULL,
    "mainGoal" TEXT NOT NULL,
    "analysis" TEXT NOT NULL,
    "domains" JSONB NOT NULL,
    "findings" JSONB NOT NULL,
    "recommendations" TEXT[],
    "culturalBackground" TEXT,
    "summary" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "assessment_reports_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "safety_events" (
    "id" UUID NOT NULL,
    "sessionId" UUID NOT NULL,
    "eventType" "SafetyEventType" NOT NULL,
    "severity" INTEGER NOT NULL,
    "details" TEXT,
    "triggeredBy" TEXT,
    "notifiedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "safety_events_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "assessment_sessions_threadId_key" ON "assessment_sessions"("threadId");

-- CreateIndex
CREATE INDEX "assessment_sessions_userId_idx" ON "assessment_sessions"("userId");

-- CreateIndex
CREATE INDEX "assessment_sessions_status_idx" ON "assessment_sessions"("status");

-- CreateIndex
CREATE INDEX "assessment_sessions_startedAt_idx" ON "assessment_sessions"("startedAt");

-- CreateIndex
CREATE INDEX "screening_responses_sessionId_idx" ON "screening_responses"("sessionId");

-- CreateIndex
CREATE INDEX "screening_responses_domain_idx" ON "screening_responses"("domain");

-- CreateIndex
CREATE UNIQUE INDEX "screening_responses_sessionId_questionId_key" ON "screening_responses"("sessionId", "questionId");

-- CreateIndex
CREATE INDEX "chat_messages_sessionId_idx" ON "chat_messages"("sessionId");

-- CreateIndex
CREATE INDEX "chat_messages_sessionId_sequence_idx" ON "chat_messages"("sessionId", "sequence");

-- CreateIndex
CREATE INDEX "domain_assessments_sessionId_idx" ON "domain_assessments"("sessionId");

-- CreateIndex
CREATE UNIQUE INDEX "domain_assessments_sessionId_domain_key" ON "domain_assessments"("sessionId", "domain");

-- CreateIndex
CREATE UNIQUE INDEX "assessment_reports_sessionId_key" ON "assessment_reports"("sessionId");

-- CreateIndex
CREATE INDEX "safety_events_sessionId_idx" ON "safety_events"("sessionId");

-- CreateIndex
CREATE INDEX "safety_events_eventType_idx" ON "safety_events"("eventType");

-- CreateIndex
CREATE INDEX "safety_events_severity_idx" ON "safety_events"("severity");

-- AddForeignKey
ALTER TABLE "screening_responses" ADD CONSTRAINT "screening_responses_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "assessment_sessions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "chat_messages" ADD CONSTRAINT "chat_messages_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "assessment_sessions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "domain_assessments" ADD CONSTRAINT "domain_assessments_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "assessment_sessions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "assessment_reports" ADD CONSTRAINT "assessment_reports_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "assessment_sessions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "safety_events" ADD CONSTRAINT "safety_events_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "assessment_sessions"("id") ON DELETE CASCADE ON UPDATE CASCADE;
