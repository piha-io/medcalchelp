-- CreateEnum
CREATE TYPE "QuestionType" AS ENUM ('DOSAGE_CALCULATION', 'IV_DRIP_RATE', 'UNIT_CONVERSION', 'PEDIATRIC_DOSING', 'CONCENTRATION', 'DILUTION', 'DIMENSIONAL_ANALYSIS', 'CRITICAL_CARE', 'INSULIN_DOSING', 'HEPARIN_PROTOCOL', 'RECONSTITUTION');

-- CreateEnum
CREATE TYPE "QuestionCategory" AS ENUM ('ORAL_MEDICATION', 'INJECTABLE_MEDICATION', 'IV_MEDICATION', 'WEIGHT_BASED', 'BSA_BASED', 'METRIC_CONVERSION', 'TIME_CONVERSION', 'VOLUME_CONVERSION', 'DIMENSIONAL_ANALYSIS', 'SLIDING_SCALE', 'CORRECTION_FACTOR', 'HEPARIN_CALCULATION', 'POWDER_RECONSTITUTION', 'CRITICAL_CALCULATION');

-- CreateEnum
CREATE TYPE "AchievementType" AS ENUM ('FIRST_CORRECT', 'STREAK_3', 'STREAK_7', 'STREAK_30', 'ACCURACY_80', 'ACCURACY_90', 'ACCURACY_100', 'SPEED_DEMON', 'LEVEL_5', 'LEVEL_10', 'LEVEL_25', 'LEVEL_50', 'QUESTIONS_10', 'QUESTIONS_50', 'QUESTIONS_100', 'QUESTIONS_500', 'QUESTIONS_1000', 'CATEGORY_MASTER', 'ALL_CATEGORIES');

-- CreateEnum
CREATE TYPE "Difficulty" AS ENUM ('BEGINNER', 'INTERMEDIATE', 'ADVANCED', 'EXPERT');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "username" TEXT,
    "emailVerified" BOOLEAN NOT NULL DEFAULT false,
    "emailVerifiedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "lastActive" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VerificationCode" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "used" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "VerificationCode_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserProfile" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "displayName" TEXT,
    "bio" TEXT,
    "avatarUrl" TEXT,
    "totalPoints" INTEGER NOT NULL DEFAULT 0,
    "currentStreak" INTEGER NOT NULL DEFAULT 0,
    "longestStreak" INTEGER NOT NULL DEFAULT 0,
    "level" INTEGER NOT NULL DEFAULT 1,
    "experience" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "QuestionTemplate" (
    "id" TEXT NOT NULL,
    "type" "QuestionType" NOT NULL,
    "category" "QuestionCategory" NOT NULL,
    "title" TEXT NOT NULL,
    "templateText" TEXT NOT NULL,
    "formulaTemplate" TEXT NOT NULL,
    "variables" JSONB NOT NULL,
    "units" JSONB NOT NULL,
    "hints" TEXT[],
    "explanation" TEXT NOT NULL,
    "conversionFactors" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "QuestionTemplate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserAttempt" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "questionId" TEXT NOT NULL,
    "generatedValues" JSONB NOT NULL,
    "userAnswer" DOUBLE PRECISION NOT NULL,
    "correctAnswer" DOUBLE PRECISION NOT NULL,
    "isCorrect" BOOLEAN NOT NULL,
    "tolerance" DOUBLE PRECISION NOT NULL DEFAULT 0.01,
    "timeSpent" INTEGER NOT NULL,
    "hintsUsed" INTEGER NOT NULL DEFAULT 0,
    "pointsEarned" INTEGER NOT NULL,
    "attemptedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UserAttempt_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Score" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "dailyScore" INTEGER NOT NULL DEFAULT 0,
    "weeklyScore" INTEGER NOT NULL DEFAULT 0,
    "monthlyScore" INTEGER NOT NULL DEFAULT 0,
    "allTimeScore" INTEGER NOT NULL DEFAULT 0,
    "lastResetDaily" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastResetWeekly" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastResetMonthly" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Score_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Achievement" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" "AchievementType" NOT NULL,
    "unlockedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Achievement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Guide" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "featuredImage" TEXT,
    "difficulty" "Difficulty" NOT NULL DEFAULT 'BEGINNER',
    "prerequisites" TEXT[],
    "learningOutcomes" TEXT[],
    "practiceProblems" JSONB,
    "order" INTEGER NOT NULL DEFAULT 0,
    "categoryId" TEXT NOT NULL,
    "isPublished" BOOLEAN NOT NULL DEFAULT false,
    "viewCount" INTEGER NOT NULL DEFAULT 0,
    "readingTime" INTEGER NOT NULL,
    "metaTitle" TEXT,
    "metaDescription" TEXT,
    "metaKeywords" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Guide_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GuideCategory" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "icon" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "GuideCategory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GuideConcept" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "GuideConcept_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_GuideToGuideConcept" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE INDEX "User_email_idx" ON "User"("email");

-- CreateIndex
CREATE INDEX "User_username_idx" ON "User"("username");

-- CreateIndex
CREATE INDEX "VerificationCode_email_code_idx" ON "VerificationCode"("email", "code");

-- CreateIndex
CREATE INDEX "VerificationCode_createdAt_idx" ON "VerificationCode"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "UserProfile_userId_key" ON "UserProfile"("userId");

-- CreateIndex
CREATE INDEX "QuestionTemplate_type_category_idx" ON "QuestionTemplate"("type", "category");

-- CreateIndex
CREATE INDEX "UserAttempt_userId_attemptedAt_idx" ON "UserAttempt"("userId", "attemptedAt");

-- CreateIndex
CREATE INDEX "UserAttempt_questionId_idx" ON "UserAttempt"("questionId");

-- CreateIndex
CREATE UNIQUE INDEX "Score_userId_key" ON "Score"("userId");

-- CreateIndex
CREATE INDEX "Score_dailyScore_idx" ON "Score"("dailyScore" DESC);

-- CreateIndex
CREATE INDEX "Score_weeklyScore_idx" ON "Score"("weeklyScore" DESC);

-- CreateIndex
CREATE INDEX "Score_monthlyScore_idx" ON "Score"("monthlyScore" DESC);

-- CreateIndex
CREATE INDEX "Score_allTimeScore_idx" ON "Score"("allTimeScore" DESC);

-- CreateIndex
CREATE INDEX "Achievement_userId_idx" ON "Achievement"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Achievement_userId_type_key" ON "Achievement"("userId", "type");

-- CreateIndex
CREATE UNIQUE INDEX "Guide_slug_key" ON "Guide"("slug");

-- CreateIndex
CREATE INDEX "Guide_slug_idx" ON "Guide"("slug");

-- CreateIndex
CREATE INDEX "Guide_categoryId_idx" ON "Guide"("categoryId");

-- CreateIndex
CREATE INDEX "Guide_difficulty_idx" ON "Guide"("difficulty");

-- CreateIndex
CREATE INDEX "Guide_isPublished_idx" ON "Guide"("isPublished");

-- CreateIndex
CREATE UNIQUE INDEX "GuideCategory_name_key" ON "GuideCategory"("name");

-- CreateIndex
CREATE UNIQUE INDEX "GuideCategory_slug_key" ON "GuideCategory"("slug");

-- CreateIndex
CREATE INDEX "GuideCategory_slug_idx" ON "GuideCategory"("slug");

-- CreateIndex
CREATE INDEX "GuideCategory_order_idx" ON "GuideCategory"("order");

-- CreateIndex
CREATE UNIQUE INDEX "GuideConcept_name_key" ON "GuideConcept"("name");

-- CreateIndex
CREATE UNIQUE INDEX "GuideConcept_slug_key" ON "GuideConcept"("slug");

-- CreateIndex
CREATE INDEX "GuideConcept_slug_idx" ON "GuideConcept"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "_GuideToGuideConcept_AB_unique" ON "_GuideToGuideConcept"("A", "B");

-- CreateIndex
CREATE INDEX "_GuideToGuideConcept_B_index" ON "_GuideToGuideConcept"("B");

-- AddForeignKey
ALTER TABLE "UserProfile" ADD CONSTRAINT "UserProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserAttempt" ADD CONSTRAINT "UserAttempt_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserAttempt" ADD CONSTRAINT "UserAttempt_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "QuestionTemplate"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Score" ADD CONSTRAINT "Score_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Achievement" ADD CONSTRAINT "Achievement_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Guide" ADD CONSTRAINT "Guide_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "GuideCategory"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_GuideToGuideConcept" ADD CONSTRAINT "_GuideToGuideConcept_A_fkey" FOREIGN KEY ("A") REFERENCES "Guide"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_GuideToGuideConcept" ADD CONSTRAINT "_GuideToGuideConcept_B_fkey" FOREIGN KEY ("B") REFERENCES "GuideConcept"("id") ON DELETE CASCADE ON UPDATE CASCADE;
