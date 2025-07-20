import { prisma } from '../db/prisma'

const CODE_LENGTH = 6
const CODE_EXPIRY_MINUTES = 10
const MAX_ATTEMPTS_PER_HOUR = 3

export function generateVerificationCode(): string {
  // Generate a 6-digit code
  const code = Math.floor(100000 + Math.random() * 900000).toString()
  return code
}

export async function createVerificationCode(email: string): Promise<string> {
  // Check rate limiting
  const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000)
  const recentAttempts = await prisma.verificationCode.count({
    where: {
      email,
      createdAt: {
        gte: oneHourAgo
      }
    }
  })

  if (recentAttempts >= MAX_ATTEMPTS_PER_HOUR) {
    throw new Error('Too many verification attempts. Please try again later.')
  }

  // Mark any existing codes for this email as used
  await prisma.verificationCode.updateMany({
    where: {
      email,
      used: false
    },
    data: {
      used: true
    }
  })

  // Generate new code
  const code = generateVerificationCode()
  const expiresAt = new Date(Date.now() + CODE_EXPIRY_MINUTES * 60 * 1000)

  // Save to database
  await prisma.verificationCode.create({
    data: {
      email,
      code,
      expiresAt
    }
  })

  return code
}

export async function verifyCode(email: string, code: string): Promise<boolean> {
  const verificationCode = await prisma.verificationCode.findFirst({
    where: {
      email,
      code,
      used: false,
      expiresAt: {
        gt: new Date()
      }
    },
    orderBy: {
      createdAt: 'desc'
    }
  })

  if (!verificationCode) {
    return false
  }

  // Mark as used
  await prisma.verificationCode.update({
    where: {
      id: verificationCode.id
    },
    data: {
      used: true
    }
  })

  return true
}

export async function cleanupExpiredCodes(): Promise<void> {
  // Delete codes older than 24 hours
  const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000)
  
  await prisma.verificationCode.deleteMany({
    where: {
      createdAt: {
        lt: yesterday
      }
    }
  })
}