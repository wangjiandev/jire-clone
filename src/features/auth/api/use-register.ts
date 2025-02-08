import { client } from '@/lib/rpc'
import { InferResponseType, InferRequestType } from 'hono/client'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

type ResponseType = InferResponseType<(typeof client.api.auth.register)['$post']>
type RequestType = InferRequestType<(typeof client.api.auth.register)['$post']>['json']

export const useRegister = () => {
  const router = useRouter()
  const queryClint = useQueryClient()

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async (json) => {
      const response = await client.api.auth.register.$post({
        json,
      })

      if (!response.ok) {
        throw new Error('Failed to register')
      }

      return await response.json()
    },
    onSuccess: () => {
      toast.success('Register Success')
      router.refresh()
      queryClint.invalidateQueries({ queryKey: ['current'] })
    },
    onError: () => {
      toast.error('Register Failed')
    },
  })
  return mutation
}
