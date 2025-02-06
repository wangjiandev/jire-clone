import { zValidator } from '@hono/zod-validator'
import { Hono } from 'hono'
import { loginSchema } from '@/features/auth/schema'

const app = new Hono().post('/login', zValidator('json', loginSchema), (c) => {
  return c.json({
    success: 'ok',
  })
})

export default app
