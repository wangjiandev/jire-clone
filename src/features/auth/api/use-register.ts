import { client } from '@/lib/rpc'
import { InferResponseType, InferRequestType } from 'hono/client'
import { useMutation } from '@tanstack/react-query'

type ResponseType = InferResponseType<(typeof client.api.auth.register)['$post']>
type RequestType = InferRequestType<(typeof client.api.auth.register)['$post']>['json']

export const useRegister = () => {
  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async (json) => {
      const response = await client.api.auth.register.$post({
        json,
      })
      return await response.json()
    },
  })
  return mutation
}
