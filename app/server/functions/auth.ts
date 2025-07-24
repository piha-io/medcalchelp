import { prisma } from '../../lib/prisma'
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
    // Generate username from email
    const emailPrefix = email.split('@')[0]
    let baseUsername = emailPrefix.replace(/[^a-zA-Z0-9]/g, '_').toLowerCase()
    let username = baseUsername
    let counter = 1
    
    // Check for uniqueness and append number if needed
    while (await prisma.user.findUnique({ where: { username } })) {
      username = `${baseUsername}_${counter}`
      counter++
    }
    
    // Create new user
    user = await prisma.user.create({
      data: {
        email,
        username,
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

export async function updateUserProfile(userId: string, data: {
  displayName?: string
  username?: string
}) {
  // Validate displayName
  if (data.displayName !== undefined) {
    const trimmedDisplayName = data.displayName.trim()
    if (trimmedDisplayName.length < 2 || trimmedDisplayName.length > 30) {
      throw new Error('Display name must be between 2 and 30 characters')
    }
    data.displayName = trimmedDisplayName
  }

  // Validate username if provided
  if (data.username !== undefined) {
    const trimmedUsername = data.username.trim().toLowerCase()
    
    // Username validation
    if (!/^[a-zA-Z0-9_]+$/.test(trimmedUsername)) {
      throw new Error('Username can only contain letters, numbers, and underscores')
    }
    
    if (trimmedUsername.length < 3 || trimmedUsername.length > 20) {
      throw new Error('Username must be between 3 and 20 characters')
    }
    
    // Check if username is already taken by another user
    const existingUser = await prisma.user.findUnique({
      where: { username: trimmedUsername }
    })
    
    if (existingUser && existingUser.id !== userId) {
      throw new Error('Username is already taken')
    }
    
    data.username = trimmedUsername
  }

  // Update user and profile
  const updateData: any = {}
  if (data.username !== undefined) {
    updateData.username = data.username
  }
  
  if (data.displayName !== undefined) {
    updateData.profile = {
      update: {
        displayName: data.displayName
      }
    }
  }

  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: updateData,
    include: {
      profile: true
    }
  })

  return {
    id: updatedUser.id,
    username: updatedUser.username,
    email: updatedUser.email,
    profile: updatedUser.profile
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