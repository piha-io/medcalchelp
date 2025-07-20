import { build } from 'esbuild'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __dirname = dirname(fileURLToPath(import.meta.url))

async function buildServer() {
  try {
    await build({
      entryPoints: [
        join(__dirname, 'app/server/api-handler.ts'),
        join(__dirname, 'app/server/functions/auth.ts'),
        join(__dirname, 'app/server/functions/questions.ts'),
        join(__dirname, 'app/server/functions/scores.ts'),
      ],
      bundle: true,
      outdir: 'dist/server',
      platform: 'node',
      target: 'node20',
      format: 'esm',
      sourcemap: true,
      external: [
        '@prisma/client',
        'bcryptjs',
        'jsonwebtoken',
      ],
      define: {
        'process.env.NODE_ENV': '"production"',
      },
    })
    console.log('Server build completed successfully')
  } catch (error) {
    console.error('Server build failed:', error)
    process.exit(1)
  }
}

buildServer()