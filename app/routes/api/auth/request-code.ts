import { createAPIFileRoute } from '@tanstack/start/api'
import { z } from 'zod'
import { requestVerificationCode } from '../../../server/functions/auth'

const requestSchema = z.object({
  email: z.string().email()
})

export const Route = createAPIFileRoute('/api/auth/request-code')({
  POST: async ({ request }) => {
    try {
      const body = await request.json()
      const { email } = requestSchema.parse(body)
      
      const result = await requestVerificationCode(email)
      
      return Response.json(result, { status: 200 })
    } catch (error) {
      if (error instanceof z.ZodError) {
        return Response.json({ 
          error: 'Invalid email address',
          details: error.errors 
        }, { status: 400 })
      }
      
      if (error instanceof Error) {
        const status = error.message.includes('Too many') ? 429 : 400
        return Response.json({ 
          error: error.message 
        }, { status })
      }
      
      return Response.json({ 
        error: 'An unexpected error occurred' 
      }, { status: 500 })
    }
  }
})