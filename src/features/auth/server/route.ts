import { Hono } from 'hono'
import { zValidator } from '@hono/zod-validator'
import { loginSchema } from '@/features/auth/schemas'

const app = new Hono().post('/login', zValidator('json', loginSchema), (c) => {
  const { email, password } = c.req.valid('json')
  console.log('post:/login', { email, password })
  return c.json({ email, password })
})

export default app
