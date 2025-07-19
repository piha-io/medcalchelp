import { z } from 'zod'
import { prisma } from '../../lib/prisma'
import { generateQuestion, calculateAnswer, checkAnswer } from '../../lib/questions/generator'
import type { QuestionType, QuestionCategory, Difficulty } from '@prisma/client'

// Get random question based on filters
export async function getRandomQuestion(filters: {
  type?: QuestionType
  category?: QuestionCategory
  difficulty?: Difficulty
}) {
  // Build where clause
  const where: any = {}
  if (filters.type) where.type = filters.type
  if (filters.category) where.category = filters.category
  if (filters.difficulty) where.difficulty = filters.difficulty

  // Get random question template
  const count = await prisma.questionTemplate.count({ where })
  
  if (count === 0) {
    throw new Error('No questions found matching the criteria')
  }
  
  const skip = Math.floor(Math.random() * count)
  
  const template = await prisma.questionTemplate.findFirst({
    where,
    skip,
  })

  if (!template) {
    throw new Error('No questions found')
  }

  // Generate question with random values
  const question = generateQuestion(template)

  return question
}

// Submit answer schema
const submitAnswerSchema = z.object({
  questionId: z.string(),
  generatedValues: z.record(z.any()),
  userAnswer: z.number(),
  timeSpent: z.number().int().positive(),
  hintsUsed: z.number().int().min(0),
})

// Submit answer and calculate results
export async function submitAnswer(userId: string, data: unknown) {
  const validatedData = submitAnswerSchema.parse(data)

  // Get question template
  const template = await prisma.questionTemplate.findUnique({
    where: { id: validatedData.questionId },
  })

  if (!template) {
    throw new Error('Question not found')
  }

  // Calculate correct answer
  const correctAnswer = calculateAnswer(template, validatedData.generatedValues)
  const isCorrect = checkAnswer(validatedData.userAnswer, correctAnswer, 0.01)

  // Calculate points based on difficulty and hints
  let basePoints = 10
  if (template.difficulty === 'INTERMEDIATE') basePoints = 20
  if (template.difficulty === 'ADVANCED') basePoints = 30
  if (template.difficulty === 'EXPERT') basePoints = 50

  // Reduce points for hints used (5 points per hint, minimum 5 points)
  const pointsEarned = isCorrect ? Math.max(basePoints - (validatedData.hintsUsed * 5), 5) : 0

  // Create attempt record
  const attempt = await prisma.userAttempt.create({
    data: {
      userId,
      questionId: validatedData.questionId,
      generatedValues: validatedData.generatedValues,
      userAnswer: validatedData.userAnswer,
      correctAnswer,
      isCorrect,
      timeSpent: validatedData.timeSpent,
      hintsUsed: validatedData.hintsUsed,
      pointsEarned,
    },
  })

  // Update user scores and stats if correct
  if (isCorrect) {
    await prisma.$transaction([
      // Update scores
      prisma.score.update({
        where: { userId },
        data: {
          dailyScore: { increment: pointsEarned },
          weeklyScore: { increment: pointsEarned },
          monthlyScore: { increment: pointsEarned },
          allTimeScore: { increment: pointsEarned },
        },
      }),
      // Update profile
      prisma.userProfile.update({
        where: { userId },
        data: {
          totalPoints: { increment: pointsEarned },
          experience: { increment: pointsEarned },
        },
      }),
    ])

    // Check for achievements
    await checkAchievements(userId)
  }

  // Update streak
  await updateStreak(userId)

  return {
    attempt: {
      id: attempt.id,
      isCorrect,
      correctAnswer,
      pointsEarned,
    },
    explanation: generateExplanation(template, validatedData.generatedValues, correctAnswer),
  }
}

// Get question categories with counts
export async function getQuestionCategories() {
  const categories = await prisma.questionTemplate.groupBy({
    by: ['type', 'category', 'difficulty'],
    _count: {
      id: true,
    },
  })

  // Transform into a more useful structure
  const result: Record<string, Record<string, number>> = {}
  
  categories.forEach(cat => {
    if (!result[cat.type]) {
      result[cat.type] = {}
    }
    result[cat.type][cat.category] = (result[cat.type][cat.category] || 0) + cat._count.id
  })

  return result
}

// Get user's recent attempts
export async function getUserAttempts(userId: string, limit: number = 10) {
  const attempts = await prisma.userAttempt.findMany({
    where: { userId },
    orderBy: { attemptedAt: 'desc' },
    take: limit,
    include: {
      question: {
        select: {
          type: true,
          category: true,
          difficulty: true,
          title: true,
        },
      },
    },
  })

  return attempts
}

// Get user statistics
export async function getUserStats(userId: string) {
  const stats = await prisma.userAttempt.aggregate({
    where: { userId },
    _count: { id: true },
    _avg: { 
      pointsEarned: true,
      timeSpent: true,
    },
    _sum: { pointsEarned: true },
  })

  const correctAttempts = await prisma.userAttempt.count({
    where: { 
      userId,
      isCorrect: true,
    },
  })

  const accuracy = stats._count.id > 0 
    ? (correctAttempts / stats._count.id) * 100 
    : 0

  // Get stats by category
  const categoryStats = await prisma.userAttempt.groupBy({
    by: ['questionId'],
    where: { userId },
    _count: { id: true },
    _avg: { pointsEarned: true },
  })

  // Get achievement count
  const achievementCount = await prisma.achievement.count({
    where: { userId },
  })

  return {
    totalAttempts: stats._count.id,
    totalPoints: stats._sum.pointsEarned || 0,
    averagePoints: stats._avg.pointsEarned || 0,
    averageTime: stats._avg.timeSpent || 0,
    accuracy: Math.round(accuracy * 10) / 10,
    correctAttempts,
    achievementCount,
  }
}

// Helper function to check achievements
async function checkAchievements(userId: string) {
  const stats = await prisma.userAttempt.groupBy({
    by: ['userId'],
    where: { userId },
    _count: { id: true },
  })

  const totalAttempts = stats[0]?._count.id || 0

  // Check question count achievements
  const questionAchievements = [
    { count: 1, type: 'FIRST_CORRECT' as const },
    { count: 10, type: 'QUESTIONS_10' as const },
    { count: 50, type: 'QUESTIONS_50' as const },
    { count: 100, type: 'QUESTIONS_100' as const },
    { count: 500, type: 'QUESTIONS_500' as const },
    { count: 1000, type: 'QUESTIONS_1000' as const },
  ]

  for (const achievement of questionAchievements) {
    if (totalAttempts >= achievement.count) {
      await prisma.achievement.upsert({
        where: { userId_type: { userId, type: achievement.type } },
        create: { userId, type: achievement.type },
        update: {},
      })
    }
  }

  // Check accuracy achievements
  if (totalAttempts >= 20) {
    const correctCount = await prisma.userAttempt.count({
      where: { userId, isCorrect: true },
    })
    const accuracy = (correctCount / totalAttempts) * 100

    if (accuracy >= 80) {
      await prisma.achievement.upsert({
        where: { userId_type: { userId, type: 'ACCURACY_80' } },
        create: { userId, type: 'ACCURACY_80' },
        update: {},
      })
    }
    if (accuracy >= 90) {
      await prisma.achievement.upsert({
        where: { userId_type: { userId, type: 'ACCURACY_90' } },
        create: { userId, type: 'ACCURACY_90' },
        update: {},
      })
    }
  }

  // Check streak achievements
  const profile = await prisma.userProfile.findUnique({
    where: { userId },
    select: { currentStreak: true },
  })

  if (profile) {
    const streakAchievements = [
      { days: 3, type: 'STREAK_3' as const },
      { days: 7, type: 'STREAK_7' as const },
      { days: 30, type: 'STREAK_30' as const },
    ]

    for (const achievement of streakAchievements) {
      if (profile.currentStreak >= achievement.days) {
        await prisma.achievement.upsert({
          where: { userId_type: { userId, type: achievement.type } },
          create: { userId, type: achievement.type },
          update: {},
        })
      }
    }
  }
}

// Helper function to update streak
async function updateStreak(userId: string) {
  const profile = await prisma.userProfile.findUnique({
    where: { userId },
  })

  if (!profile) return

  const lastAttempt = await prisma.userAttempt.findFirst({
    where: { 
      userId,
      attemptedAt: {
        lt: new Date(Date.now() - 24 * 60 * 60 * 1000), // Before 24 hours ago
      },
    },
    orderBy: { attemptedAt: 'desc' },
  })

  const now = new Date()
  const lastDate = lastAttempt ? new Date(lastAttempt.attemptedAt) : null

  if (lastDate) {
    const daysSinceLastAttempt = Math.floor((now.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24))
    
    if (daysSinceLastAttempt === 1) {
      // Continue streak
      await prisma.userProfile.update({
        where: { userId },
        data: {
          currentStreak: { increment: 1 },
          longestStreak: {
            set: Math.max(profile.currentStreak + 1, profile.longestStreak),
          },
        },
      })
    } else if (daysSinceLastAttempt > 1) {
      // Reset streak
      await prisma.userProfile.update({
        where: { userId },
        data: {
          currentStreak: 1,
        },
      })
    }
  } else {
    // First attempt today
    await prisma.userProfile.update({
      where: { userId },
      data: {
        currentStreak: 1,
        longestStreak: Math.max(1, profile.longestStreak),
      },
    })
  }
}

function generateExplanation(template: any, values: any, answer: number): string {
  let explanation = template.explanation
  
  // Replace placeholders with actual values
  for (const [key, value] of Object.entries(values)) {
    explanation = explanation.replace(new RegExp(`{${key}}`, 'g'), String(value))
  }
  
  explanation = explanation.replace('{answer}', answer.toFixed(2))
  
  return explanation
}