import { client } from '@/lib/rpc'
import { InferResponseType, InferRequestType } from 'hono/client'
import { useMutation, useQueryClient } from '@tanstack/react-query'

type ResponseType = InferResponseType<(typeof client.api.workspaces)['$post']>
type RequestType = InferRequestType<(typeof client.api.workspaces)['$post']>

export const useCreateWorkspace = () => {
  const queryClint = useQueryClient()

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ json }) => {
      const response = await client.api.workspaces.$post({
        json,
      })
      return await response.json()
    },
    onSuccess: () => {
      queryClint.invalidateQueries({ queryKey: ['workspace'] })
    },
  })
  return mutation
}
