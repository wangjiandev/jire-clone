import { client } from '@/lib/rpc'
import { InferResponseType, InferRequestType } from 'hono/client'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

type ResponseType = InferResponseType<(typeof client.api.auth.login)['$post']>
type RequestType = InferRequestType<(typeof client.api.auth.login)['$post']>['json']

export const useLogin = () => {
    const router = useRouter()
    const queryClint = useQueryClient()
    const mutation = useMutation<ResponseType, Error, RequestType>({
        mutationFn: async (json) => {
            const response = await client.api.auth.login.$post({
                json,
            })

            if (!response.ok) {
                throw new Error('Failed to Login')
            }

            return await response.json()
        },
        onSuccess: () => {
            toast.success('Login Success')
            router.refresh()
            queryClint.invalidateQueries({ queryKey: ['current'] })
        },
        onError: () => {
            toast.error('Login Failed')
        },
    })
    return mutation
}
