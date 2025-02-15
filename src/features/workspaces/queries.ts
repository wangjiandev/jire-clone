'use server'

import { Query } from 'node-appwrite'
import { DATABASE_ID, MEMBERS_ID, WORKSPACE_ID } from '@/config'
import { getMember } from '../members/utils'
import { Workspace } from './types'
import { createSessionClient } from '@/lib/appwrite'

export const getWorkspaces = async () => {
    try {
        const { databases, account } = await createSessionClient()
        const user = await account.get()
        const members = await databases.listDocuments(DATABASE_ID, MEMBERS_ID, [Query.equal('userId', user.$id)])
        if (members.total === 0) {
            return { documents: [], total: 0 }
        }
        const workspaceIds = members.documents.map((member) => member.workspaceId)
        const worksapces = await databases.listDocuments(DATABASE_ID, WORKSPACE_ID, [
            Query.orderDesc('$createdAt'),
            Query.contains('$id', workspaceIds),
        ])
        return worksapces
    } catch (error) {
        console.error(error)
        return { documents: [], total: 0 }
    }
}

interface GetWorkspaceOptions {
    workspaceId: string
}

export const getWorkspace = async ({ workspaceId }: GetWorkspaceOptions) => {
    try {
        const { databases, account } = await createSessionClient()
        const user = await account.get()
        const member = await getMember({
            databases,
            workspaceId,
            userId: user.$id,
        })
        if (!member) return null
        return await databases.getDocument<Workspace>(DATABASE_ID, WORKSPACE_ID, workspaceId)
    } catch (error) {
        console.error(error)
        return null
    }
}

interface GetWorkspaceInfoOptions {
    workspaceId: string
}

export const getWorkspaceInfo = async ({ workspaceId }: GetWorkspaceInfoOptions) => {
    try {
        const { databases } = await createSessionClient()
        const workspace = await databases.getDocument<Workspace>(DATABASE_ID, WORKSPACE_ID, workspaceId)
        return {
            name: workspace.name,
        }
    } catch (error) {
        console.error(error)
        return null
    }
}
