import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import viteTsConfigPaths from 'vite-tsconfig-paths'
import type { Plugin } from 'vite'

// Custom plugin to handle API routes in development
function apiPlugin(): Plugin {
  return {
    name: 'api-plugin',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (req.url?.startsWith('/api/')) {
          // Dynamically import the auth module to handle API requests
          try {
            const { handleApiRequest } = await import('./app/server/api-handler.js')
            await handleApiRequest(req, res)
          } catch (error) {
            console.error('API Error:', error)
            res.statusCode = 500
            res.end(JSON.stringify({ error: 'Internal server error' }))
          }
        } else {
          next()
        }
      })
    },
  }
}

export default defineConfig({
  plugins: [
    react(),
    viteTsConfigPaths({
      projects: ['./tsconfig.json'],
    }),
    apiPlugin(),
  ],
  server: {
    port: 3000,
  },
})