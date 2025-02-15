import { client } from '@/lib/rpc'
import { InferResponseType, InferRequestType } from 'hono/client'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

type ResponseType = InferResponseType<(typeof client.api.workspaces)[':workspaceId']['reset-invite-code']['$post'], 200>
type RequestType = InferRequestType<(typeof client.api.workspaces)[':workspaceId']['reset-invite-code']['$post']>

export const useResetInviteCode = () => {
    const queryClint = useQueryClient()

    const mutation = useMutation<ResponseType, Error, RequestType>({
        mutationFn: async ({ param }) => {
            const response = await client.api.workspaces[':workspaceId']['reset-invite-code'].$post({
                param,
            })

            if (!response.ok) {
                throw new Error('Failed to reset invite code')
            }

            return await response.json()
        },
        onSuccess: ({ data }) => {
            toast.success('Invite code reset')
            queryClint.invalidateQueries({ queryKey: ['workspaces'] })
            queryClint.invalidateQueries({ queryKey: ['workspace', data.$id] })
        },
        onError: () => {
            toast.error('Failed to reset invite code')
        },
    })
    return mutation
}
