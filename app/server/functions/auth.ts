import { prisma } from '../../lib/db/prisma'
import { generateToken } from '../../lib/auth/jwt'
import { createVerificationCode, verifyCode } from '../../lib/auth/verification'
import { sendVerificationCode } from '../../lib/email/email.service'

export async function requestVerificationCode(email: string) {
  // Normalize email
  email = email.toLowerCase().trim()

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email)) {
    throw new Error('Invalid email address')
  }

  try {
    // Generate verification code
    const code = await createVerificationCode(email)

    // Send email
    await sendVerificationCode({ email, code })

    return {
      success: true,
      message: 'Verification code sent to your email'
    }
  } catch (error: any) {
    if (error.message.includes('Too many verification attempts')) {
      throw error
    }
    throw new Error('Failed to send verification code. Please try again.')
  }
}

export async function verifyCodeAndLogin(email: string, code: string) {
  // Normalize email
  email = email.toLowerCase().trim()

  // Verify the code
  const isValid = await verifyCode(email, code)
  
  if (!isValid) {
    throw new Error('Invalid or expired verification code')
  }

  // Find or create user
  let user = await prisma.user.findUnique({
    where: { email },
    include: { profile: true }
  })

  if (!user) {
    // Create new user
    user = await prisma.user.create({
      data: {
        email,
        emailVerified: true,
        emailVerifiedAt: new Date(),
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
  } else {
    // Update existing user
    await prisma.user.update({
      where: { id: user.id },
      data: {
        emailVerified: true,
        emailVerifiedAt: user.emailVerifiedAt || new Date(),
        lastActive: new Date()
      }
    })
  }

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

// Legacy functions - will be removed
export async function registerUser(data: {
  username: string
  email: string
  password: string
}) {
  throw new Error('Password-based registration is no longer supported. Please use email verification.')
}

export async function loginUser(data: {
  username: string
  password: string
}) {
  throw new Error('Password-based login is no longer supported. Please use email verification.')
}