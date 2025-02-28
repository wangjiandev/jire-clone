import { z } from 'zod'
import { Hono } from 'hono'
import { zValidator } from '@hono/zod-validator'
import { sessionMiddleware } from '@/lib/session-middleware'
import { getMember } from '@/features/members/utils'
import { DATABASE_ID, IMAGE_BUCKET_ID, PROJECT_ID, TASKS_ID } from '@/config'
import { ID, Query } from 'node-appwrite'
import { createProjectSchema, updateProjectSchema } from '../schema'
import { Project } from '../types'
import { endOfMonth, startOfMonth, subMonths } from 'date-fns'
import { TaskStatus } from '@/features/tasks/types'

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
  .delete('/:projectId', sessionMiddleware, async (c) => {
    const databases = c.get('databases')
    const user = c.get('user')
    const { projectId } = c.req.param()
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
    await databases.deleteDocument(DATABASE_ID, PROJECT_ID, projectId)
    return c.json({
      data: {
        $id: projectId,
      },
    })
  })
  .get('/:projectId', sessionMiddleware, async (c) => {
    const user = c.get('user')
    const databases = c.get('databases')
    const { projectId } = c.req.param()
    const project = await databases.getDocument<Project>(DATABASE_ID, PROJECT_ID, projectId)

    const member = await getMember({
      databases,
      workspaceId: project.workspaceId,
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
    return c.json({ data: project })
  })
  .get('/:projectId/analytics', sessionMiddleware, async (c) => {
    const user = c.get('user')
    const databases = c.get('databases')
    const { projectId } = c.req.param()

    const project = await databases.getDocument<Project>(DATABASE_ID, PROJECT_ID, projectId)

    const member = await getMember({
      databases,
      workspaceId: project.workspaceId,
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

    const now = new Date()
    const thisMonthStart = startOfMonth(now)
    const thisMonthEnd = endOfMonth(now)
    const lastMonthStart = startOfMonth(subMonths(now, 1))
    const lastMonthEnd = endOfMonth(subMonths(now, 1))

    const thisMonthTasks = await databases.listDocuments(DATABASE_ID, TASKS_ID, [
      Query.equal('projectId', projectId),
      Query.greaterThanEqual('$createdAt', thisMonthStart.toISOString()),
      Query.lessThanEqual('$createdAt', thisMonthEnd.toISOString()),
    ])

    const lastMonthTasks = await databases.listDocuments(DATABASE_ID, TASKS_ID, [
      Query.equal('projectId', projectId),
      Query.greaterThanEqual('$createdAt', lastMonthStart.toISOString()),
      Query.lessThanEqual('$createdAt', lastMonthEnd.toISOString()),
    ])

    const taskCount = thisMonthTasks.total
    const diff = taskCount - lastMonthTasks.total

    const thisMonthAssignedTasks = await databases.listDocuments(DATABASE_ID, TASKS_ID, [
      Query.equal('projectId', projectId),
      Query.equal('assigneeId', member.$id),
      Query.greaterThanEqual('$createdAt', thisMonthStart.toISOString()),
      Query.lessThanEqual('$createdAt', thisMonthEnd.toISOString()),
    ])

    const lastMonthAssignedTasks = await databases.listDocuments(DATABASE_ID, TASKS_ID, [
      Query.equal('projectId', projectId),
      Query.equal('assigneeId', member.$id),
      Query.greaterThanEqual('$createdAt', lastMonthStart.toISOString()),
      Query.lessThanEqual('$createdAt', lastMonthEnd.toISOString()),
    ])

    const assignedTaskCount = thisMonthAssignedTasks.total
    const assignedDiff = assignedTaskCount - lastMonthAssignedTasks.total

    const thisMonthIncompletedTasks = await databases.listDocuments(DATABASE_ID, TASKS_ID, [
      Query.equal('projectId', projectId),
      Query.notEqual('status', TaskStatus.DONE),
      Query.greaterThanEqual('$createdAt', thisMonthStart.toISOString()),
      Query.lessThanEqual('$createdAt', thisMonthEnd.toISOString()),
    ])

    const lastMonthIncompletedTasks = await databases.listDocuments(DATABASE_ID, TASKS_ID, [
      Query.equal('projectId', projectId),
      Query.notEqual('status', TaskStatus.DONE),
      Query.greaterThanEqual('$createdAt', lastMonthStart.toISOString()),
      Query.lessThanEqual('$createdAt', lastMonthEnd.toISOString()),
    ])

    const incompletedTaskCount = thisMonthIncompletedTasks.total
    const incompletedDiff = incompletedTaskCount - lastMonthIncompletedTasks.total

    const thisMonthCompletedTasks = await databases.listDocuments(DATABASE_ID, TASKS_ID, [
      Query.equal('projectId', projectId),
      Query.equal('status', TaskStatus.DONE),
      Query.greaterThanEqual('$createdAt', thisMonthStart.toISOString()),
      Query.lessThanEqual('$createdAt', thisMonthEnd.toISOString()),
    ])

    const lastMonthCompletedTasks = await databases.listDocuments(DATABASE_ID, TASKS_ID, [
      Query.equal('projectId', projectId),
      Query.equal('status', TaskStatus.DONE),
      Query.greaterThanEqual('$createdAt', lastMonthStart.toISOString()),
      Query.lessThanEqual('$createdAt', lastMonthEnd.toISOString()),
    ])

    const completedTaskCount = thisMonthCompletedTasks.total
    const completedDiff = completedTaskCount - lastMonthCompletedTasks.total

    const thisMonthOverdueTasks = await databases.listDocuments(DATABASE_ID, TASKS_ID, [
      Query.equal('projectId', projectId),
      Query.notEqual('status', TaskStatus.DONE),
      Query.lessThan('dueDate', now.toISOString()),
      Query.greaterThanEqual('$createdAt', thisMonthStart.toISOString()),
      Query.lessThanEqual('$createdAt', thisMonthEnd.toISOString()),
    ])

    const lastMonthOverdueTasks = await databases.listDocuments(DATABASE_ID, TASKS_ID, [
      Query.equal('projectId', projectId),
      Query.notEqual('status', TaskStatus.DONE),
      Query.lessThan('dueDate', now.toISOString()),
      Query.greaterThanEqual('$createdAt', lastMonthStart.toISOString()),
      Query.lessThanEqual('$createdAt', lastMonthEnd.toISOString()),
    ])

    const overdueTaskCount = thisMonthOverdueTasks.total
    const overdueDiff = overdueTaskCount - lastMonthOverdueTasks.total

    return c.json({
      data: {
        taskCount,
        diff,
        assignedTaskCount,
        assignedDiff,
        incompletedTaskCount,
        incompletedDiff,
        completedTaskCount,
        completedDiff,
        overdueTaskCount,
        overdueDiff,
      },
    })
  })
export default app
