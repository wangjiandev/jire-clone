import { client } from '@/lib/rpc'
import { InferResponseType, InferRequestType } from 'hono/client'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

type ResponseType = InferResponseType<(typeof client.api.projects)[':projectId']['$delete'], 200>
type RequestType = InferRequestType<(typeof client.api.projects)[':projectId']['$delete']>

export const useDeleteProject = () => {
    const queryClint = useQueryClient()

    const mutation = useMutation<ResponseType, Error, RequestType>({
        mutationFn: async ({ param }) => {
            const response = await client.api.projects[':projectId'].$delete({
                param,
            })

            if (!response.ok) {
                throw new Error('Failed to delete project')
            }

            return await response.json()
        },
        onSuccess: ({ data }) => {
            toast.success('Project Deleted')
            queryClint.invalidateQueries({ queryKey: ['projects'] })
            queryClint.invalidateQueries({ queryKey: ['project', data.$id] })
        },
        onError: () => {
            toast.error('Failed to delete project')
        },
    })
    return mutation
}
