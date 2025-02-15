import { DATABASE_ID, PROJECT_ID } from '@/config'
import { getMember } from '@/features/members/utils'
import { createSessionClient } from '@/lib/appwrite'
import { Project } from './types'

interface GetProjectOptions {
    projectId: string
}

export const getProject = async ({ projectId }: GetProjectOptions) => {
    const { databases, account } = await createSessionClient()
    const user = await account.get()
    const project = await databases.getDocument<Project>(DATABASE_ID, PROJECT_ID, projectId)
    const member = await getMember({
        databases,
        workspaceId: project.workspaceId,
        userId: user.$id,
    })
    if (!member) throw new Error('Unauthorized')
    return project
}
