import { client } from '@/lib/rpc'
import { InferResponseType, InferRequestType } from 'hono/client'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'

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
      return await response.json()
    },
    onSuccess: () => {
      router.refresh()
      queryClint.invalidateQueries({ queryKey: ['current'] })
    },
  })
  return mutation
}
