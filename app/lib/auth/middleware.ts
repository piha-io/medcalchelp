import type { Request, Response, NextFunction } from 'express'
import { verifyToken } from './jwt'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// Extend Express Request type to include user
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string
        email: string
        username?: string | null
      }
    }
  }
}

export async function requireAuth(req: Request, res: Response, next: NextFunction) {
  try {
    // Get token from cookie or Authorization header
    const token = req.cookies?.token || 
                  req.headers.authorization?.replace('Bearer ', '')

    if (!token) {
      return res.status(401).json({ error: 'Authentication required' })
    }

    // Verify token
    const payload = verifyToken(token)
    
    // Get user from database
    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
      select: {
        id: true,
        email: true,
        username: true,
      },
    })

    if (!user) {
      return res.status(401).json({ error: 'User not found' })
    }

    // Attach user to request
    req.user = user
    next()
  } catch (error) {
    console.error('Auth middleware error:', error)
    return res.status(401).json({ error: 'Invalid token' })
  }
}

// Optional auth - doesn't fail if no token, just sets req.user if available
export async function optionalAuth(req: Request, res: Response, next: NextFunction) {
  try {
    const token = req.cookies?.token || 
                  req.headers.authorization?.replace('Bearer ', '')

    if (token) {
      const payload = verifyToken(token)
      const user = await prisma.user.findUnique({
        where: { id: payload.userId },
        select: {
          id: true,
          email: true,
          username: true,
        },
      })

      if (user) {
        req.user = user
      }
    }
  } catch {
    // Ignore errors - this is optional auth
  }
  
  next()
}