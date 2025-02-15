import { z } from 'zod'
import { Hono } from 'hono'
import { zValidator } from '@hono/zod-validator'
import { sessionMiddleware } from '@/lib/session-middleware'
import { getMember } from '@/features/members/utils'
import { DATABASE_ID, IMAGE_BUCKET_ID, MEMBERS_ID, PROJECT_ID } from '@/config'
import { ID, Query } from 'node-appwrite'
import { createProjectSchema, updateProjectSchema } from '../schema'
import { Project } from '../types'

const app = new Hono()
    .get(
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
    .post('/', sessionMiddleware, zValidator('form', createProjectSchema), async (c) => {
        const databases = c.get('databases')
        const user = c.get('user')
        const storage = c.get('storage')
        const { name, image, workspaceId } = c.req.valid('form')

        const member = await getMember({
            databases,
            workspaceId,
            userId: user.$id,
        })

        if (!member) {
            return c.json({ error: 'You are not a member of this workspace' }, 401)
        }

        let uploadedImageUrl: string | undefined
        if (image instanceof File) {
            const file = await storage.createFile(IMAGE_BUCKET_ID, ID.unique(), image)
            const arrayBuffer = await storage.getFilePreview(IMAGE_BUCKET_ID, file.$id)
            uploadedImageUrl = `data:image/png;base64,${Buffer.from(arrayBuffer).toString('base64')}`
        }
        const project = await databases.createDocument(DATABASE_ID, PROJECT_ID, ID.unique(), {
            name,
            imageUrl: uploadedImageUrl,
            workspaceId,
        })
        return c.json({
            data: project,
        })
    })
    .patch('/:projectId', zValidator('form', updateProjectSchema), sessionMiddleware, async (c) => {
        const databases = c.get('databases')
        const user = c.get('user')
        const storage = c.get('storage')
        const { projectId } = c.req.param()
        const { name, image } = c.req.valid('form')

        const existingProject = await databases.getDocument<Project>(DATABASE_ID, PROJECT_ID, projectId)

        const member = await getMember({
            databases,
            workspaceId: existingProject.workspaceId,
            userId: user.$id,
        })
        if (!member) {
            return c.json(
                {
                    error: 'Unauthorized',
                },
                401,
            )
        }
        let uploadedImageUrl: string | undefined
        if (image instanceof File) {
            const file = await storage.createFile(IMAGE_BUCKET_ID, ID.unique(), image)
            const arrayBuffer = await storage.getFilePreview(IMAGE_BUCKET_ID, file.$id)
            uploadedImageUrl = `data:image/png;base64,${Buffer.from(arrayBuffer).toString('base64')}`
        } else {
            uploadedImageUrl = image
        }
        const project = await databases.updateDocument(DATABASE_ID, PROJECT_ID, projectId, {
            name,
            imageUrl: uploadedImageUrl,
        })
        return c.json({
            data: project,
        })
    })

export default app
