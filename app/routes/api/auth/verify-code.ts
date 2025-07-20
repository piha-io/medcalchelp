import { createAPIFileRoute } from '@tanstack/start/api'
import { z } from 'zod'
import { verifyCodeAndLogin } from '../../../server/functions/auth'
import { setCookie } from 'vinxi/http'

const verifySchema = z.object({
  email: z.string().email(),
  code: z.string().length(6)
})

export const Route = createAPIFileRoute('/api/auth/verify-code')({
  POST: async ({ request }) => {
    try {
      const body = await request.json()
      const { email, code } = verifySchema.parse(body)
      
      const result = await verifyCodeAndLogin(email, code)
      
      // Set JWT cookie
      setCookie('auth-token', result.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7, // 7 days
        path: '/'
      })
      
      return Response.json({
        user: result.user,
        message: 'Successfully authenticated'
      }, { status: 200 })
    } catch (error) {
      if (error instanceof z.ZodError) {
        return Response.json({ 
          error: 'Invalid input',
          details: error.errors 
        }, { status: 400 })
      }
      
      if (error instanceof Error) {
        return Response.json({ 
          error: error.message 
        }, { status: 401 })
      }
      
      return Response.json({ 
        error: 'An unexpected error occurred' 
      }, { status: 500 })
    }
  }
})