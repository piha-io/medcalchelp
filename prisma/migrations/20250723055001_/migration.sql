/*
  Warnings:

  - You are about to drop the column `difficulty` on the `QuestionTemplate` table. All the data in the column will be lost.

*/
-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "QuestionCategory" ADD VALUE 'SLIDING_SCALE';
ALTER TYPE "QuestionCategory" ADD VALUE 'CORRECTION_FACTOR';
ALTER TYPE "QuestionCategory" ADD VALUE 'HEPARIN_CALCULATION';
ALTER TYPE "QuestionCategory" ADD VALUE 'POWDER_RECONSTITUTION';
ALTER TYPE "QuestionCategory" ADD VALUE 'CRITICAL_CALCULATION';

-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "QuestionType" ADD VALUE 'CRITICAL_CARE';
ALTER TYPE "QuestionType" ADD VALUE 'INSULIN_DOSING';
ALTER TYPE "QuestionType" ADD VALUE 'HEPARIN_PROTOCOL';
ALTER TYPE "QuestionType" ADD VALUE 'RECONSTITUTION';

-- DropIndex
DROP INDEX "QuestionTemplate_type_category_difficulty_idx";

-- AlterTable
ALTER TABLE "QuestionTemplate" DROP COLUMN "difficulty";

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

-- CreateIndex
CREATE INDEX "QuestionTemplate_type_category_idx" ON "QuestionTemplate"("type", "category");

-- AddForeignKey
ALTER TABLE "Guide" ADD CONSTRAINT "Guide_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "GuideCategory"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_GuideToGuideConcept" ADD CONSTRAINT "_GuideToGuideConcept_A_fkey" FOREIGN KEY ("A") REFERENCES "Guide"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_GuideToGuideConcept" ADD CONSTRAINT "_GuideToGuideConcept_B_fkey" FOREIGN KEY ("B") REFERENCES "GuideConcept"("id") ON DELETE CASCADE ON UPDATE CASCADE;
