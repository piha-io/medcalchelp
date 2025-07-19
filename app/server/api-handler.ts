import type { IncomingMessage, ServerResponse } from 'http'
import { registerUser, loginUser, getCurrentUser } from '../server/functions/auth'
import { 
  getRandomQuestion, 
  submitAnswer, 
  getQuestionCategories,
  getUserAttempts,
  getUserStats 
} from '../server/functions/questions'
import { getLeaderboard, getUserRank } from '../server/functions/scores'
import { verifyToken } from '../lib/auth/jwt'

export async function handleApiRequest(req: IncomingMessage, res: ServerResponse) {
  const url = new URL(req.url!, `http://${req.headers.host}`)
  const pathname = url.pathname

  // CORS headers for development
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')
  res.setHeader('Access-Control-Allow-Credentials', 'true')

  if (req.method === 'OPTIONS') {
    res.statusCode = 204
    res.end()
    return
  }

  try {
    // POST /api/auth/register
    if (pathname === '/api/auth/register' && req.method === 'POST') {
      const body = await getRequestBody(req)
      const result = await registerUser(body)
      
      res.setHeader('Set-Cookie', `token=${result.token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${7 * 24 * 60 * 60}`)
      res.statusCode = 201
      res.setHeader('Content-Type', 'application/json')
      res.end(JSON.stringify(result))
      return
    }

    // POST /api/auth/login
    if (pathname === '/api/auth/login' && req.method === 'POST') {
      const body = await getRequestBody(req)
      const result = await loginUser(body)
      
      res.setHeader('Set-Cookie', `token=${result.token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${7 * 24 * 60 * 60}`)
      res.statusCode = 200
      res.setHeader('Content-Type', 'application/json')
      res.end(JSON.stringify(result))
      return
    }

    // POST /api/auth/logout
    if (pathname === '/api/auth/logout' && req.method === 'POST') {
      res.setHeader('Set-Cookie', 'token=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0')
      res.statusCode = 200
      res.setHeader('Content-Type', 'application/json')
      res.end(JSON.stringify({ message: 'Logged out successfully' }))
      return
    }

    // GET /api/auth/me
    if (pathname === '/api/auth/me' && req.method === 'GET') {
      const cookies = parseCookies(req.headers.cookie || '')
      const token = cookies.token
      
      if (!token) {
        res.statusCode = 401
        res.setHeader('Content-Type', 'application/json')
        res.end(JSON.stringify({ error: 'Authentication required' }))
        return
      }

      try {
        const payload = verifyToken(token)
        const user = await getCurrentUser(payload.userId)
        
        res.statusCode = 200
        res.setHeader('Content-Type', 'application/json')
        res.end(JSON.stringify({ user }))
      } catch (error) {
        res.statusCode = 401
        res.setHeader('Content-Type', 'application/json')
        res.end(JSON.stringify({ error: 'Invalid token' }))
      }
      return
    }

    // GET /api/questions/random
    if (pathname === '/api/questions/random' && req.method === 'GET') {
      const user = await requireAuth(req, res)
      if (!user) return

      const query = Object.fromEntries(url.searchParams)
      const question = await getRandomQuestion({
        type: query.type as any,
        category: query.category as any,
        difficulty: query.difficulty as any,
      })

      res.statusCode = 200
      res.setHeader('Content-Type', 'application/json')
      res.end(JSON.stringify({ question }))
      return
    }

    // POST /api/questions/submit
    if (pathname === '/api/questions/submit' && req.method === 'POST') {
      const user = await requireAuth(req, res)
      if (!user) return

      const body = await getRequestBody(req)
      const result = await submitAnswer(user.id, body)

      res.statusCode = 200
      res.setHeader('Content-Type', 'application/json')
      res.end(JSON.stringify(result))
      return
    }

    // GET /api/questions/categories
    if (pathname === '/api/questions/categories' && req.method === 'GET') {
      const categories = await getQuestionCategories()

      res.statusCode = 200
      res.setHeader('Content-Type', 'application/json')
      res.end(JSON.stringify({ categories }))
      return
    }

    // GET /api/questions/attempts
    if (pathname === '/api/questions/attempts' && req.method === 'GET') {
      const user = await requireAuth(req, res)
      if (!user) return

      const limit = parseInt(url.searchParams.get('limit') || '10')
      const attempts = await getUserAttempts(user.id, limit)

      res.statusCode = 200
      res.setHeader('Content-Type', 'application/json')
      res.end(JSON.stringify({ attempts }))
      return
    }

    // GET /api/questions/stats
    if (pathname === '/api/questions/stats' && req.method === 'GET') {
      const user = await requireAuth(req, res)
      if (!user) return

      const stats = await getUserStats(user.id)

      res.statusCode = 200
      res.setHeader('Content-Type', 'application/json')
      res.end(JSON.stringify({ stats }))
      return
    }

    // GET /api/leaderboard
    if (pathname === '/api/leaderboard' && req.method === 'GET') {
      const timeFrame = url.searchParams.get('timeFrame') as any || 'daily'
      const limit = parseInt(url.searchParams.get('limit') || '10')

      const leaderboard = await getLeaderboard(timeFrame, limit)

      res.statusCode = 200
      res.setHeader('Content-Type', 'application/json')
      res.end(JSON.stringify({ leaderboard }))
      return
    }

    // GET /api/leaderboard/rank
    if (pathname === '/api/leaderboard/rank' && req.method === 'GET') {
      const user = await requireAuth(req, res)
      if (!user) return

      const timeFrame = url.searchParams.get('timeFrame') as any || 'daily'
      const rank = await getUserRank(user.id, timeFrame)

      res.statusCode = 200
      res.setHeader('Content-Type', 'application/json')
      res.end(JSON.stringify(rank))
      return
    }

    // 404 for unknown routes
    res.statusCode = 404
    res.setHeader('Content-Type', 'application/json')
    res.end(JSON.stringify({ error: 'Not found' }))
  } catch (error: any) {
    console.error('API Error:', error)
    res.statusCode = error.message.includes('already') ? 400 : 500
    res.setHeader('Content-Type', 'application/json')
    res.end(JSON.stringify({ error: error.message || 'Internal server error' }))
  }
}

// Helper function to require authentication
async function requireAuth(req: IncomingMessage, res: ServerResponse) {
  const cookies = parseCookies(req.headers.cookie || '')
  const token = cookies.token

  if (!token) {
    res.statusCode = 401
    res.setHeader('Content-Type', 'application/json')
    res.end(JSON.stringify({ error: 'Authentication required' }))
    return null
  }

  try {
    const payload = verifyToken(token)
    return { id: payload.userId }
  } catch (error) {
    res.statusCode = 401
    res.setHeader('Content-Type', 'application/json')
    res.end(JSON.stringify({ error: 'Invalid token' }))
    return null
  }
}

async function getRequestBody(req: IncomingMessage): Promise<any> {
  return new Promise((resolve, reject) => {
    let body = ''
    req.on('data', chunk => {
      body += chunk.toString()
    })
    req.on('end', () => {
      try {
        resolve(JSON.parse(body))
      } catch (error) {
        reject(error)
      }
    })
    req.on('error', reject)
  })
}

function parseCookies(cookieHeader: string): Record<string, string> {
  const cookies: Record<string, string> = {}
  cookieHeader.split(';').forEach(cookie => {
    const [name, value] = cookie.trim().split('=')
    if (name && value) {
      cookies[name] = value
    }
  })
  return cookies
}