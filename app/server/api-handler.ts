import type { IncomingMessage, ServerResponse } from 'http'
import { requestVerificationCode, verifyCodeAndLogin, getCurrentUser } from './functions/auth'
import { 
  getRandomQuestion, 
  submitAnswer, 
  getQuestionCategories,
  getUserAttempts,
  getUserStats 
} from './functions/questions'
import { getLeaderboard, getUserRank } from './functions/scores'
import { 
  getBlogPosts, 
  getBlogPostBySlug, 
  getBlogCategories, 
  getBlogTags,
  getRecentPosts,
  getPopularPosts
} from './functions/blog'
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
    // POST /api/auth/request-code
    if (pathname === '/api/auth/request-code' && req.method === 'POST') {
      const body = await getRequestBody(req)
      const result = await requestVerificationCode(body.email)
      
      res.statusCode = 200
      res.setHeader('Content-Type', 'application/json')
      res.end(JSON.stringify(result))
      return
    }

    // POST /api/auth/verify-code
    if (pathname === '/api/auth/verify-code' && req.method === 'POST') {
      const body = await getRequestBody(req)
      const result = await verifyCodeAndLogin(body.email, body.code)
      
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
      const query = Object.fromEntries(url.searchParams)
      const question = await getRandomQuestion({
        type: query.type as any,
        category: query.category as any,
      })

      res.statusCode = 200
      res.setHeader('Content-Type', 'application/json')
      res.end(JSON.stringify({ question }))
      return
    }

    // POST /api/questions/submit
    if (pathname === '/api/questions/submit' && req.method === 'POST') {
      const body = await getRequestBody(req)
      
      // Check if user is authenticated
      const cookies = parseCookies(req.headers.cookie || '')
      const token = cookies.token
      let userId: string | null = null
      
      if (token) {
        try {
          const payload = verifyToken(token)
          userId = payload.userId
        } catch (error) {
          // Token invalid, treat as guest
        }
      }

      // Submit answer (will save to DB if authenticated, otherwise just validate)
      const result = await submitAnswer(userId, body)

      res.statusCode = 200
      res.setHeader('Content-Type', 'application/json')
      res.end(JSON.stringify({ 
        ...result,
        isGuest: !userId 
      }))
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
      // Check if user is authenticated
      const cookies = parseCookies(req.headers.cookie || '')
      const token = cookies.token
      
      if (!token) {
        // Return empty stats for guest users
        res.statusCode = 200
        res.setHeader('Content-Type', 'application/json')
        res.end(JSON.stringify({ 
          stats: {
            totalAttempts: 0,
            correctAttempts: 0,
            accuracy: 0,
            averageTime: 0,
            achievementCount: 0
          }
        }))
        return
      }

      try {
        const payload = verifyToken(token)
        const stats = await getUserStats(payload.userId)

        res.statusCode = 200
        res.setHeader('Content-Type', 'application/json')
        res.end(JSON.stringify({ stats }))
      } catch (error) {
        // Invalid token, return empty stats
        res.statusCode = 200
        res.setHeader('Content-Type', 'application/json')
        res.end(JSON.stringify({ 
          stats: {
            totalAttempts: 0,
            correctAttempts: 0,
            accuracy: 0,
            averageTime: 0,
            achievementCount: 0
          }
        }))
      }
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

    // GET /api/user/achievements
    if (pathname === '/api/user/achievements' && req.method === 'GET') {
      const user = await requireAuth(req, res)
      if (!user) return

      const currentUser = await getCurrentUser(user.id)
      
      res.statusCode = 200
      res.setHeader('Content-Type', 'application/json')
      res.end(JSON.stringify({ achievements: currentUser.achievements }))
      return
    }

    // Blog API Routes
    // GET /api/blog/posts
    if (pathname === '/api/blog/posts' && req.method === 'GET') {
      const query = Object.fromEntries(url.searchParams)
      const result = await getBlogPosts({
        page: query.page ? parseInt(query.page) : undefined,
        limit: query.limit ? parseInt(query.limit) : undefined,
        category: query.category,
        tag: query.tag,
        search: query.search,
      })

      res.statusCode = 200
      res.setHeader('Content-Type', 'application/json')
      res.end(JSON.stringify(result))
      return
    }

    // GET /api/blog/posts/:slug
    const blogPostMatch = pathname.match(/^\/api\/blog\/posts\/([^\/]+)$/)
    if (blogPostMatch && req.method === 'GET') {
      const slug = blogPostMatch[1]
      const result = await getBlogPostBySlug(slug)
      
      if (!result) {
        res.statusCode = 404
        res.setHeader('Content-Type', 'application/json')
        res.end(JSON.stringify({ error: 'Post not found' }))
        return
      }

      res.statusCode = 200
      res.setHeader('Content-Type', 'application/json')
      res.end(JSON.stringify(result))
      return
    }

    // GET /api/blog/categories
    if (pathname === '/api/blog/categories' && req.method === 'GET') {
      const categories = await getBlogCategories()
      
      res.statusCode = 200
      res.setHeader('Content-Type', 'application/json')
      res.end(JSON.stringify({ categories }))
      return
    }

    // GET /api/blog/tags
    if (pathname === '/api/blog/tags' && req.method === 'GET') {
      const tags = await getBlogTags()
      
      res.statusCode = 200
      res.setHeader('Content-Type', 'application/json')
      res.end(JSON.stringify({ tags }))
      return
    }

    // GET /api/blog/recent
    if (pathname === '/api/blog/recent' && req.method === 'GET') {
      const posts = await getRecentPosts()
      
      res.statusCode = 200
      res.setHeader('Content-Type', 'application/json')
      res.end(JSON.stringify({ posts }))
      return
    }

    // GET /api/blog/popular
    if (pathname === '/api/blog/popular' && req.method === 'GET') {
      const posts = await getPopularPosts()
      
      res.statusCode = 200
      res.setHeader('Content-Type', 'application/json')
      res.end(JSON.stringify({ posts }))
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