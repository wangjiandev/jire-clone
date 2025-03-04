import { date } from 'drizzle-orm/pg-core'
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
      const data = await response.json()
      console.log('data:', JSON.stringify(data))
      if (!data.success) {
        throw new Error(data.message ?? '注册失败，请联系管理员后重试')
      }
      return data
    },
    onSuccess: () => {
      toast.success('注册成功')
      // router.refresh()
      // queryClint.invalidateQueries({ queryKey: ['current'] })
    },
    onError: (error) => {
      toast.error(error.message, { position: 'top-center' })
    },
  })
  return mutation
}
