import { client } from '@/lib/rpc'
import { InferResponseType, InferRequestType } from 'hono/client'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

type ResponseType = InferResponseType<(typeof client.api.workspaces)[':workspaceId']['$patch'], 200>
type RequestType = InferRequestType<(typeof client.api.workspaces)[':workspaceId']['$patch']>

export const useUpdateWorkspace = () => {
    const queryClint = useQueryClient()

    const mutation = useMutation<ResponseType, Error, RequestType>({
        mutationFn: async ({ form, param }) => {
            const response = await client.api.workspaces[':workspaceId'].$patch({
                form,
                param,
            })

            if (!response.ok) {
                throw new Error('Failed to update workspace')
            }

            return await response.json()
        },
        onSuccess: ({ data }) => {
            toast.success('Workspace Updated')
            queryClint.invalidateQueries({ queryKey: ['workspaces'] })
            queryClint.invalidateQueries({ queryKey: ['workspace', data.$id] })
        },
        onError: () => {
            toast.error('Failed to update workspace')
        },
    })
    return mutation
}
