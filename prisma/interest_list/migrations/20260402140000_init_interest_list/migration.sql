CREATE TABLE "interest_list_signups" (
    "id" UUID NOT NULL,
    "email" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "interest_list_signups_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "interest_list_signups_email_key" ON "interest_list_signups"("email");
