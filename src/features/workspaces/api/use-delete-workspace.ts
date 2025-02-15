import { client } from '@/lib/rpc'
import { InferResponseType, InferRequestType } from 'hono/client'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

type ResponseType = InferResponseType<(typeof client.api.workspaces)[':workspaceId']['$delete'], 200>
type RequestType = InferRequestType<(typeof client.api.workspaces)[':workspaceId']['$delete']>

export const useDeleteWorkspace = () => {
    const queryClint = useQueryClient()

    const mutation = useMutation<ResponseType, Error, RequestType>({
        mutationFn: async ({ param }) => {
            const response = await client.api.workspaces[':workspaceId'].$delete({
                param,
            })

            if (!response.ok) {
                throw new Error('Failed to delete workspace')
            }

            return await response.json()
        },
        onSuccess: ({ data }) => {
            toast.success('Workspace Deleted')
            queryClint.invalidateQueries({ queryKey: ['workspaces'] })
            queryClint.invalidateQueries({ queryKey: ['workspace', data.$id] })
        },
        onError: () => {
            toast.error('Failed to delete workspace')
        },
    })
    return mutation
}
