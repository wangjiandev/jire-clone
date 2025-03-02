import { z } from 'zod'
import { Hono } from 'hono'
import { zValidator } from '@hono/zod-validator'
import { createWorkspaceSchema, updateWorkspaceSchema } from '@/features/workspaces/schema'
import { sessionMiddleware } from '@/lib/session-middleware'
import { DATABASE_ID, IMAGE_BUCKET_ID, MEMBERS_ID, TASKS_ID, WORKSPACE_ID } from '@/config'
import { ID, Query } from 'node-appwrite'
import { MemberRole } from '@/features/members/types'
import { generateInviteCode } from '@/lib/utils'
import { getMember } from '@/features/members/utils'
import { Workspace } from '../types'
import { subMonths } from 'date-fns'
import { endOfMonth } from 'date-fns'
import { startOfMonth } from 'date-fns'
import { TaskStatus } from '@/features/tasks/types'

const app = new Hono()
  .get('/', sessionMiddleware, async (c) => {
    const databases = c.get('databases')
    const user = c.get('user')
    const members = await databases.listDocuments(DATABASE_ID, MEMBERS_ID, [Query.equal('userId', user.$id)])
    if (members.total === 0) {
      return c.json({ error: 'You are not a member of any workspace' }, 401)
    }
    const workspaceIds = members.documents.map((member) => member.workspaceId)
    const worksapces = await databases.listDocuments(DATABASE_ID, WORKSPACE_ID, [
      Query.orderDesc('$createdAt'),
      Query.contains('$id', workspaceIds),
    ])
    return c.json({ data: worksapces })
  })
  .get('/:workspaceId', sessionMiddleware, async (c) => {
    const databases = c.get('databases')
    const user = c.get('user')
    const { workspaceId } = c.req.param()

    const member = await getMember({
      databases,
      workspaceId,
      userId: user.$id,
    })

    if (!member) {
      return c.json({ error: 'You are not a member of this workspace' }, 401)
    }
    const workspace = await databases.getDocument<Workspace>(DATABASE_ID, WORKSPACE_ID, workspaceId)
    return c.json({ data: workspace })
  })
  .get('/:workspaceId/info', sessionMiddleware, async (c) => {
    const databases = c.get('databases')
    const { workspaceId } = c.req.param()
    const workspace = await databases.getDocument<Workspace>(DATABASE_ID, WORKSPACE_ID, workspaceId)
    return c.json({
      data: {
        $id: workspace.$id,
        name: workspace.name,
        imageUrl: workspace.imageUrl,
      },
    })
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
      inviteCode: generateInviteCode(6),
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
  .patch('/:workspaceId', zValidator('form', updateWorkspaceSchema), sessionMiddleware, async (c) => {
    const databases = c.get('databases')
    const user = c.get('user')
    const storage = c.get('storage')
    const { workspaceId } = c.req.param()
    const { name, image } = c.req.valid('form')
    const member = await getMember({
      databases,
      workspaceId,
      userId: user.$id,
    })
    if (!member || member.role !== MemberRole.ADMIN) {
      return c.json(
        {
          error: 'You are not authorized to update this workspace',
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
    const workspace = await databases.updateDocument(DATABASE_ID, WORKSPACE_ID, workspaceId, {
      name,
      imageUrl: uploadedImageUrl,
    })
    return c.json({
      data: workspace,
    })
  })
  .delete('/:workspaceId', sessionMiddleware, async (c) => {
    const databases = c.get('databases')
    const user = c.get('user')
    const { workspaceId } = c.req.param()
    const member = await getMember({
      databases,
      workspaceId,
      userId: user.$id,
    })
    if (!member || member.role !== MemberRole.ADMIN) {
      return c.json({ error: 'You are not authorized to delete this workspace' }, 401)
    }
    await databases.deleteDocument(DATABASE_ID, WORKSPACE_ID, workspaceId)
    return c.json({
      data: {
        $id: workspaceId,
      },
    })
  })
  .post('/:workspaceId/reset-invite-code', sessionMiddleware, async (c) => {
    const databases = c.get('databases')
    const user = c.get('user')
    const { workspaceId } = c.req.param()
    const member = await getMember({
      databases,
      workspaceId,
      userId: user.$id,
    })
    if (!member || member.role !== MemberRole.ADMIN) {
      return c.json({ error: 'You are not authorized to delete this workspace' }, 401)
    }
    const workspace = await databases.updateDocument(DATABASE_ID, WORKSPACE_ID, workspaceId, {
      inviteCode: generateInviteCode(6),
    })
    return c.json({
      data: workspace,
    })
  })
  .post('/:workspaceId/join', sessionMiddleware, zValidator('json', z.object({ code: z.string() })), async (c) => {
    const { workspaceId } = c.req.param()
    const { code } = c.req.valid('json')

    const databases = c.get('databases')
    const user = c.get('user')

    const member = await getMember({
      databases,
      workspaceId,
      userId: user.$id,
    })

    if (member) {
      return c.json({ error: 'You are already a member of this workspace' }, 400)
    }

    const workspace = await databases.getDocument<Workspace>(DATABASE_ID, WORKSPACE_ID, workspaceId)
    if (workspace.inviteCode !== code) {
      return c.json({ error: 'Invalid invite code' }, 400)
    }

    await databases.createDocument(DATABASE_ID, MEMBERS_ID, ID.unique(), {
      userId: user.$id,
      workspaceId,
      role: MemberRole.MEMBER,
    })

    return c.json({
      data: workspace,
    })
  })
  .get('/:workspaceId/analytics', sessionMiddleware, async (c) => {
    const user = c.get('user')
    const databases = c.get('databases')
    const { workspaceId } = c.req.param()

    const member = await getMember({
      databases,
      workspaceId,
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
      Query.equal('workspaceId', workspaceId),
      Query.greaterThanEqual('$createdAt', thisMonthStart.toISOString()),
      Query.lessThanEqual('$createdAt', thisMonthEnd.toISOString()),
    ])

    const lastMonthTasks = await databases.listDocuments(DATABASE_ID, TASKS_ID, [
      Query.equal('workspaceId', workspaceId),
      Query.greaterThanEqual('$createdAt', lastMonthStart.toISOString()),
      Query.lessThanEqual('$createdAt', lastMonthEnd.toISOString()),
    ])

    const taskCount = thisMonthTasks.total
    const diff = taskCount - lastMonthTasks.total

    const thisMonthAssignedTasks = await databases.listDocuments(DATABASE_ID, TASKS_ID, [
      Query.equal('workspaceId', workspaceId),
      Query.equal('assigneeId', member.$id),
      Query.greaterThanEqual('$createdAt', thisMonthStart.toISOString()),
      Query.lessThanEqual('$createdAt', thisMonthEnd.toISOString()),
    ])

    const lastMonthAssignedTasks = await databases.listDocuments(DATABASE_ID, TASKS_ID, [
      Query.equal('workspaceId', workspaceId),
      Query.equal('assigneeId', member.$id),
      Query.greaterThanEqual('$createdAt', lastMonthStart.toISOString()),
      Query.lessThanEqual('$createdAt', lastMonthEnd.toISOString()),
    ])

    const assignedTaskCount = thisMonthAssignedTasks.total
    const assignedDiff = assignedTaskCount - lastMonthAssignedTasks.total

    const thisMonthIncompletedTasks = await databases.listDocuments(DATABASE_ID, TASKS_ID, [
      Query.equal('workspaceId', workspaceId),
      Query.notEqual('status', TaskStatus.DONE),
      Query.greaterThanEqual('$createdAt', thisMonthStart.toISOString()),
      Query.lessThanEqual('$createdAt', thisMonthEnd.toISOString()),
    ])

    const lastMonthIncompletedTasks = await databases.listDocuments(DATABASE_ID, TASKS_ID, [
      Query.equal('workspaceId', workspaceId),
      Query.notEqual('status', TaskStatus.DONE),
      Query.greaterThanEqual('$createdAt', lastMonthStart.toISOString()),
      Query.lessThanEqual('$createdAt', lastMonthEnd.toISOString()),
    ])

    const incompletedTaskCount = thisMonthIncompletedTasks.total
    const incompletedDiff = incompletedTaskCount - lastMonthIncompletedTasks.total

    const thisMonthCompletedTasks = await databases.listDocuments(DATABASE_ID, TASKS_ID, [
      Query.equal('workspaceId', workspaceId),
      Query.equal('status', TaskStatus.DONE),
      Query.greaterThanEqual('$createdAt', thisMonthStart.toISOString()),
      Query.lessThanEqual('$createdAt', thisMonthEnd.toISOString()),
    ])

    const lastMonthCompletedTasks = await databases.listDocuments(DATABASE_ID, TASKS_ID, [
      Query.equal('workspaceId', workspaceId),
      Query.equal('status', TaskStatus.DONE),
      Query.greaterThanEqual('$createdAt', lastMonthStart.toISOString()),
      Query.lessThanEqual('$createdAt', lastMonthEnd.toISOString()),
    ])

    const completedTaskCount = thisMonthCompletedTasks.total
    const completedDiff = completedTaskCount - lastMonthCompletedTasks.total

    const thisMonthOverdueTasks = await databases.listDocuments(DATABASE_ID, TASKS_ID, [
      Query.equal('workspaceId', workspaceId),
      Query.notEqual('status', TaskStatus.DONE),
      Query.lessThan('dueDate', now.toISOString()),
      Query.greaterThanEqual('$createdAt', thisMonthStart.toISOString()),
      Query.lessThanEqual('$createdAt', thisMonthEnd.toISOString()),
    ])

    const lastMonthOverdueTasks = await databases.listDocuments(DATABASE_ID, TASKS_ID, [
      Query.equal('workspaceId', workspaceId),
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
