import { client } from '@/lib/rpc'
import { InferResponseType, InferRequestType } from 'hono/client'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

type ResponseType = InferResponseType<(typeof client.api.projects)['$post'], 200>
type RequestType = InferRequestType<(typeof client.api.projects)['$post']>

export const useCreateProject = () => {
    const queryClint = useQueryClient()

    const mutation = useMutation<ResponseType, Error, RequestType>({
        mutationFn: async ({ form }) => {
            const response = await client.api.projects.$post({
                form,
            })

            if (!response.ok) {
                throw new Error('Failed to create project')
            }

            return await response.json()
        },
        onSuccess: () => {
            toast.success('Project Created')
            queryClint.invalidateQueries({ queryKey: ['projects'] })
        },
        onError: () => {
            toast.error('Failed to create project')
        },
    })
    return mutation
}
