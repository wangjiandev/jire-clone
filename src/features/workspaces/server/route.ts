import { Hono } from 'hono'
import { zValidator } from '@hono/zod-validator'
import { createWorkspaceSchema } from '@/features/workspaces/schema'
import { sessionMiddleware } from '@/lib/session-middleware'
import { DATABASE_ID, IMAGE_BUCKET_ID, MEMBERS_ID, WORKSPACE_ID } from '@/config'
import { ID, Query } from 'node-appwrite'
import { MemberRole } from '@/features/members/types'

const app = new Hono()
  .get('/', sessionMiddleware, async (c) => {
    const databases = c.get('databases')
    const user = c.get('user')
    const members = await databases.listDocuments(DATABASE_ID, MEMBERS_ID, [Query.equal('userId', user.$id)])
    if (members.total === 0) {
      return c.json({ data: { documents: [], total: 0 } })
    }
    const workspaceIds = members.documents.map((member) => member.workspaceId)
    const worksapces = await databases.listDocuments(DATABASE_ID, WORKSPACE_ID, [
      Query.orderDesc('$createdAt'),
      Query.contains('$id', workspaceIds),
    ])
    return c.json({ data: worksapces })
  })
  .post('/', zValidator('form', createWorkspaceSchema), sessionMiddleware, async (c) => {
    const databases = c.get('databases')
    const user = c.get('user')
    const storage = c.get('storage')

    const { name, image } = c.req.valid('form')

    let uploadedImageUrl: string | undefined

    if (image instanceof File) {
      const file = await storage.createFile(IMAGE_BUCKET_ID, ID.unique(), image)
      const arrayBuffer = await storage.getFilePreview(IMAGE_BUCKET_ID, file.$id)
      uploadedImageUrl = `data:image/png;base64,${Buffer.from(arrayBuffer).toString('base64')}`
    }

    const workspace = await databases.createDocument(DATABASE_ID, WORKSPACE_ID, ID.unique(), {
      name,
      userId: user.$id,
      imageUrl: uploadedImageUrl,
    })

    await databases.createDocument(DATABASE_ID, MEMBERS_ID, ID.unique(), {
      userId: user.$id,
      workspaceId: workspace.$id,
      role: MemberRole.ADMIN,
    })

    return c.json({
      data: workspace,
    })
  })

export default app
