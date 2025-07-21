import { json } from '@tanstack/start'
import { createAPIFileRoute } from '@tanstack/start/api'
import { updateUserProfile } from '../../../server/functions/auth'
import { verifyToken } from '../../../lib/auth/jwt'
import { z } from 'zod'

const updateProfileSchema = z.object({
  displayName: z.string().min(2).max(30).optional(),
  username: z.string().min(3).max(20).regex(/^[a-zA-Z0-9_]+$/).optional(),
}).refine(data => data.displayName !== undefined || data.username !== undefined, {
  message: 'At least one field must be provided for update'
})

export const Route = createAPIFileRoute('/api/profile/update')({
  POST: async ({ request }) => {
    try {
      // Check authentication
      const token = request.headers.get('cookie')?.split('; ')
        .find(row => row.startsWith('auth-token='))
        ?.split('=')[1]

      if (!token) {
        return json({ error: 'Unauthorized' }, { status: 401 })
      }

      const payload = verifyToken(token)
      if (!payload || !payload.userId) {
        return json({ error: 'Invalid token' }, { status: 401 })
      }

      // Parse and validate request body
      const body = await request.json()
      const validatedData = updateProfileSchema.parse(body)

      // Update user profile
      const updatedUser = await updateUserProfile(payload.userId, validatedData)

      return json({
        success: true,
        user: updatedUser
      })
    } catch (error: any) {
      console.error('Profile update error:', error)
      return json({ 
        error: error.message || 'Failed to update profile' 
      }, { 
        status: error.status || 500 
      })
    }
  }
})