# Critical Update Instructions for MedCalcHelp

## Issue Fixed
The application had 4 non-functional categories (Insulin Dosing, Heparin Protocol, Critical Care, and Reconstitution) that appeared in the UI but had no questions in the database. This has been fixed.

## Steps to Apply the Fix

### 1. Update Database Schema
Run the following commands to update your database schema:

```bash
# Generate a new migration for the schema changes
npm run db:migrate

# If the above fails, you can push the schema directly
npm run db:push
```

### 2. Re-seed the Database
**CRITICAL**: You must use the new complete seed script to get all categories working:

```bash
# This will clear existing data and add ALL categories including critical care
npm run db:seed:complete
```

### 3. Verify the Fix
After seeding, verify that all categories work:
- Try clicking on "Insulin Dosing" - it should now show questions
- Try clicking on "Heparin Protocol" - it should now show questions
- Try clicking on "Critical Care" - it should now show questions
- Try clicking on "Reconstitution" - it should now show questions
- The "All Categories" option should now include questions from all 11 types

## What Changed

### Database Schema Updates:
1. Added 4 new QuestionType enums:
   - CRITICAL_CARE
   - INSULIN_DOSING
   - HEPARIN_PROTOCOL
   - RECONSTITUTION

2. Added 5 new QuestionCategory enums:
   - SLIDING_SCALE (for insulin)
   - CORRECTION_FACTOR (for insulin)
   - HEPARIN_CALCULATION
   - POWDER_RECONSTITUTION
   - CRITICAL_CALCULATION

### New Seed Data:
The `seed-complete.ts` file now includes:
- 3 questions for each difficulty level of Insulin Dosing
- 3 questions for each difficulty level of Heparin Protocol
- 3 questions for each difficulty level of Critical Care
- 3 questions for each difficulty level of Reconstitution
- All original questions from other categories

Total: 108+ questions covering all healthcare calculation needs

## For Production Deployments

Update your deployment scripts to use:
```bash
npm run db:seed:complete
```

Instead of the old `db:seed:expanded` command.

## Notes for Healthcare Providers

This update ensures that critical medication calculations for insulin, heparin, vasopressors, and reconstitution are now available for practice. These are essential skills for safe patient care and should have been included from the start. We apologize for any inconvenience.