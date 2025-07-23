import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function seedUser() {
  console.log('Creating test user...')

  const hashedPassword = await bcrypt.hash('password123', 10)

  const user = await prisma.user.create({
    data: {
      email: 'test@example.com',
      username: 'testuser',
      emailVerified: true,
      profile: {
        create: {
          displayName: 'Test User',
        },
      },
    },
  })

  console.log('✅ Created user:', user.email)
}

seedUser()
  .catch((e) => {
    console.error('❌ Seeding failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })