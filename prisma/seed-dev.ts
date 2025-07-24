import { PrismaClient } from '@prisma/client'
import { faker } from '@faker-js/faker'

const prisma = new PrismaClient()

async function seedDevelopment() {
  console.log('🌱 Starting development database seed...')

  // Run production seed first
  const { execSync } = require('child_process')
  console.log('📦 Running production seed first...')
  execSync('npx tsx prisma/seed-production.ts', { stdio: 'inherit' })

  // Add extra development data
  console.log('🔧 Adding development-specific data...')

  // Create a test user for development
  const testUser = await prisma.user.create({
    data: {
      email: 'test@medcalchelp.com',
      username: 'testuser',
      emailVerified: true,
      emailVerifiedAt: new Date(),
      lastActive: new Date(),
      profile: {
        create: {
          displayName: 'Test User',
          bio: 'Development test account',
          totalPoints: 1500,
          currentStreak: 7,
          longestStreak: 15,
          level: 5,
          experience: 1500,
        },
      },
    },
  })

  // Give test user some attempts and high scores
  const questionTemplates = await prisma.questionTemplate.findMany()
  
  for (let i = 0; i < 50; i++) {
    const questionTemplate = faker.helpers.arrayElement(questionTemplates)
    
    await prisma.userAttempt.create({
      data: {
        userId: testUser.id,
        questionId: questionTemplate.id,
        generatedValues: { dose: 100, strength: 50 },
        userAnswer: 2.0,
        correctAnswer: 2.0,
        isCorrect: true,
        timeSpent: faker.number.int({ min: 30, max: 180 }),
        hintsUsed: faker.number.int({ min: 0, max: 2 }),
        pointsEarned: 20,
        attemptedAt: faker.date.recent({ days: 7 }),
      },
    })
  }

  // Create test user scores
  await prisma.score.create({
    data: {
      userId: testUser.id,
      dailyScore: 200,
      weeklyScore: 800,
      monthlyScore: 1500,
      allTimeScore: 1500,
    },
  })

  // Add test achievements
  const achievementTypes = ['FIRST_CORRECT', 'STREAK_7', 'QUESTIONS_10', 'QUESTIONS_50', 'ACCURACY_80']
  
  for (const type of achievementTypes) {
    await prisma.achievement.create({
      data: {
        userId: testUser.id,
        type: type as any,
        unlockedAt: faker.date.recent({ days: 30 }),
      },
    })
  }

  console.log('✅ Created test user with achievements and high scores')
  console.log('🎉 Development seeding completed!')
  console.log(`
📋 Development Account:
   Email: test@medcalchelp.com
   Username: testuser
   Points: 1500
   Achievements: ${achievementTypes.length}
  `)
}

seedDevelopment()
  .catch((e) => {
    console.error('❌ Development seeding failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })