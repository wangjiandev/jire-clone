import { z } from 'zod'
import { Hono } from 'hono'
import { zValidator } from '@hono/zod-validator'
import { sessionMiddleware } from '@/lib/session-middleware'
import { getMember } from '@/features/members/utils'
import { DATABASE_ID, PROJECT_ID } from '@/config'
import { Query } from 'node-appwrite'

const app = new Hono().get(
  '/',
  sessionMiddleware,
  zValidator(
    'query',
    z.object({
      workspaceId: z.string(),
    }),
  ),
  async (c) => {
    const user = c.get('user')
    const databases = c.get('databases')

    const { workspaceId } = c.req.valid('query')

    if (!workspaceId) {
      return c.json({ error: 'Workspace ID is required' }, 400)
    }

    const member = await getMember({
      databases,
      workspaceId,
      userId: user.$id,
    })

    if (!member) {
      return c.json({ error: 'You are not a member of this workspace' }, 401)
    }

    const projects = await databases.listDocuments(DATABASE_ID, PROJECT_ID, [
      Query.equal('workspaceId', workspaceId),
      Query.orderDesc('$createdAt'),
    ])

    return c.json({ data: projects })
  },
)

export default app
