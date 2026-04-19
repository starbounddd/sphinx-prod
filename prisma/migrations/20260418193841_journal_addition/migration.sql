-- CreateTable
CREATE TABLE "journal_entries" (
    "id" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "content" TEXT NOT NULL,
    "questions" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "journal_entries_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "journal_entries_userId_idx" ON "journal_entries"("userId");

-- CreateIndex
CREATE INDEX "journal_entries_createdAt_idx" ON "journal_entries"("createdAt");
