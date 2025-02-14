import { client } from '@/lib/rpc'
import { InferResponseType, InferRequestType } from 'hono/client'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

type ResponseType = InferResponseType<(typeof client.api.members)[':memberId']['$patch'], 200>
type RequestType = InferRequestType<(typeof client.api.members)[':memberId']['$patch']>

export const useUpdateMember = () => {
  const queryClint = useQueryClient()

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ param, json }) => {
      const response = await client.api.members[':memberId'].$patch({
        param,
        json,
      })

      if (!response.ok) {
        throw new Error('Failed to update member')
      }

      return await response.json()
    },
    onSuccess: () => {
      toast.success('Member Updated')
      queryClint.invalidateQueries({ queryKey: ['members'] })
    },
    onError: () => {
      toast.error('Failed to update member')
    },
  })
  return mutation
}
