import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

function aiQaDevApi() {
  return {
    name: 'ai-qa-dev-api',
    configureServer(server) {
      server.middlewares.use('/api/ask-ai', async (req, res, next) => {
        if (req.method !== 'POST') return next()

        try {
          const chunks = []
          for await (const chunk of req) chunks.push(chunk)
          const body = JSON.parse(Buffer.concat(chunks).toString() || '{}')
          const { handleRequest } = await import('./api/ask-ai.js')
          const response = await handleRequest({ method: req.method, json: async () => body })
          res.statusCode = response.status
          response.headers.forEach((value, key) => res.setHeader(key, value))
          res.end(await response.text())
        } catch (error) {
          next(error)
        }
      })
    },
  }
}

export default defineConfig({
  plugins: [react(), tailwindcss(), aiQaDevApi()],
})
