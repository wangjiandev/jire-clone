import { zValidator } from '@hono/zod-validator'
import { Hono } from 'hono'
import { loginSchema, registerSchema } from '@/features/auth/schema'
import { createAdminClient } from '@/lib/appwrite'
import { setCookie, deleteCookie } from 'hono/cookie'
import { AUTH_COOKIE } from '@/features/auth/constant'
import { sessionMiddleware } from '@/lib/session-middleware'
import { db } from '@/db'
import { users } from '@/db/schema'
import { eq, or } from 'drizzle-orm'

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
    const { name, email, password, phone } = c.req.valid('json')

    const findUser = await db.query.users.findFirst({
      where: or(eq(users.email, email), eq(users.phone, phone)),
    })

    console.log('=> findUser:', findUser)
    if (findUser) {
      return c.json(
        {
          success: false,
          message: '当前邮箱或手机号已注册',
          data: null,
        },
        401,
      )
    }
    try {
      await db.insert(users).values({
        name,
        email,
        password,
        phone,
        isActive: true,
      })
    } catch (error) {
      return c.json(
        {
          success: false,
          message: '注册失败',
          data: null,
        },
        500,
      )
    }

    return c.json({
      success: true,
      message: '注册成功',
      data: null,
    })

    // const { account } = await createAdminClient()
    // const user = await account.create(ID.unique(), email, password, name)
    // const session = await account.createEmailPasswordSession(email, password)
    // setCookie(c, AUTH_COOKIE, session.secret, {
    //   path: '/',
    //   httpOnly: true,
    //   secure: true,
    //   sameSite: 'strict',
    //   maxAge: 60 * 60 * 24 * 30,
    // })
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
