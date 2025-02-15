import { zValidator } from '@hono/zod-validator'
import { Hono } from 'hono'
import { loginSchema, registerSchema } from '@/features/auth/schema'
import { createAdminClient } from '@/lib/appwrite'
import { ID } from 'node-appwrite'
import { setCookie, deleteCookie } from 'hono/cookie'
import { AUTH_COOKIE } from '@/features/auth/constant'
import { sessionMiddleware } from '@/lib/session-middleware'

const app = new Hono()
    .get('/current', sessionMiddleware, async (c) => {
        const user = c.get('user')
        return c.json({
            data: user,
        })
    })
    .post('/login', zValidator('json', loginSchema), async (c) => {
        const { email, password } = c.req.valid('json')
        const { account } = await createAdminClient()
        const session = await account.createEmailPasswordSession(email, password)
        setCookie(c, AUTH_COOKIE, session.secret, {
            path: '/',
            httpOnly: true,
            secure: true,
            sameSite: 'strict',
            maxAge: 60 * 60 * 24 * 30,
        })
        return c.json({
            success: true,
        })
    })
    .post('/register', zValidator('json', registerSchema), async (c) => {
        const { name, email, password } = c.req.valid('json')
        const { account } = await createAdminClient()
        const user = await account.create(ID.unique(), email, password, name)
        const session = await account.createEmailPasswordSession(email, password)
        setCookie(c, AUTH_COOKIE, session.secret, {
            path: '/',
            httpOnly: true,
            secure: true,
            sameSite: 'strict',
            maxAge: 60 * 60 * 24 * 30,
        })
        return c.json({
            data: user,
        })
    })
    .post('/logout', sessionMiddleware, async (c) => {
        const account = c.get('account')
        deleteCookie(c, AUTH_COOKIE)
        await account.deleteSession('current')
        return c.json({
            success: true,
        })
    })

export default app
