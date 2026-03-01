-- AlterTable
ALTER TABLE "assessment_sessions" ADD COLUMN     "screeningSnapshot" JSONB;

-- CreateTable
CREATE TABLE "user_screening_results" (
    "id" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "answers" JSONB NOT NULL,
    "domainScores" JSONB NOT NULL,
    "flaggedDomains" "SymptomDomain"[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_screening_results_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_screening_results_userId_key" ON "user_screening_results"("userId");
