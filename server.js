import { createServer } from 'http'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import fs from 'fs/promises'

const __dirname = dirname(fileURLToPath(import.meta.url))
const port = process.env.PORT || 3000

async function startServer() {
  // Dynamic import to handle CommonJS modules
  const { handleApiRequest } = await import('./dist/server/api-handler.js')
  
  const server = createServer(async (req, res) => {
    const url = new URL(req.url, `http://${req.headers.host}`)
    
    // Handle API routes
    if (url.pathname.startsWith('/api/')) {
      return handleApiRequest(req, res)
    }
    
    // Serve static files
    try {
      let filePath = join(__dirname, 'dist/client', url.pathname)
      
      // Default to index.html for directory requests
      if (url.pathname.endsWith('/')) {
        filePath = join(filePath, 'index.html')
      }
      
      // Check if file exists
      try {
        await fs.access(filePath)
      } catch {
        // SPA fallback - serve index.html for client-side routing
        filePath = join(__dirname, 'dist/client/index.html')
      }
      
      // Determine content type
      const ext = filePath.split('.').pop()
      const contentTypeMap = {
        'html': 'text/html',
        'js': 'application/javascript',
        'css': 'text/css',
        'json': 'application/json',
        'png': 'image/png',
        'jpg': 'image/jpeg',
        'svg': 'image/svg+xml',
        'ico': 'image/x-icon'
      }
      
      const contentType = contentTypeMap[ext] || 'application/octet-stream'
      const content = await fs.readFile(filePath)
      
      res.writeHead(200, { 'Content-Type': contentType })
      res.end(content)
    } catch (error) {
      console.error('Error serving file:', error)
      res.writeHead(500, { 'Content-Type': 'text/plain' })
      res.end('Internal Server Error')
    }
  })
  
  server.listen(port, () => {
    console.log(`🚀 MedCalcHelp server running at http://localhost:${port}`)
    console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`)
  })
}

startServer().catch(console.error)