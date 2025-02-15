import { client } from '@/lib/rpc'
import { InferResponseType, InferRequestType } from 'hono/client'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

type ResponseType = InferResponseType<(typeof client.api.auth.logout)['$post']>

export const useLogout = () => {
    const router = useRouter()
    const queryClint = useQueryClient()
    const mutation = useMutation<ResponseType, Error>({
        mutationFn: async () => {
            const response = await client.api.auth.logout.$post()
            if (!response.ok) {
                throw new Error('Failed to logout')
            }
            return await response.json()
        },
        onSuccess: () => {
            router.refresh()
            toast.success('User Logout')
            queryClint.invalidateQueries({ queryKey: ['current'] })
            queryClint.invalidateQueries({ queryKey: ['workspaces'] })
        },
        onError: () => {
            toast.error('Logout Failed')
        },
    })
    return mutation
}
