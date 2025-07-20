import { prisma } from '../../lib/db/prisma'
import bcrypt from 'bcryptjs'
import { generateToken } from '../../lib/auth/jwt'

export async function registerUser(data: {
  username: string
  email: string
  password: string
}) {
  // Check if user already exists
  const existingUser = await prisma.user.findFirst({
    where: {
      OR: [
        { email: data.email },
        { username: data.username }
      ]
    }
  })

  if (existingUser) {
    throw new Error('User already exists with this email or username')
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(data.password, 10)

  // Create user with profile
  const user = await prisma.user.create({
    data: {
      username: data.username,
      email: data.email,
      passwordHash: hashedPassword,
      profile: {
        create: {
          totalPoints: 0,
          experience: 0,
          level: 1,
          currentStreak: 0,
          longestStreak: 0,
        }
      }
    },
    include: {
      profile: true
    }
  })

  // Generate token
  const token = generateToken(user)

  return {
    token,
    user: {
      id: user.id,
      username: user.username,
      email: user.email,
      profile: user.profile
    }
  }
}

export async function loginUser(data: {
  username: string
  password: string
}) {
  // Find user
  const user = await prisma.user.findUnique({
    where: { username: data.username },
    include: { profile: true }
  })

  if (!user) {
    throw new Error('Invalid credentials')
  }

  // Check password
  const isValidPassword = await bcrypt.compare(data.password, user.passwordHash)
  if (!isValidPassword) {
    throw new Error('Invalid credentials')
  }

  // Update last login
  await prisma.user.update({
    where: { id: user.id },
    data: { lastActive: new Date() }
  })

  // Generate token
  const token = generateToken(user)

  return {
    token,
    user: {
      id: user.id,
      username: user.username,
      email: user.email,
      profile: user.profile
    }
  }
}

export async function getCurrentUser(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      profile: true,
      achievements: {
        orderBy: { unlockedAt: 'desc' }
      }
    }
  })

  if (!user) {
    throw new Error('User not found')
  }

  return {
    id: user.id,
    username: user.username,
    email: user.email,
    profile: user.profile,
    achievements: user.achievements
  }
}